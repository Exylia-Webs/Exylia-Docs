"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CATEGORY_ORDER, plugins, type Lang } from "@/content/registry";

/**
 * The hero scene: a spiral galaxy of dust in the Exylia violets, with every
 * plugin as a brighter star. Plugins of one category sit together as a small
 * constellation joined by faint lines. Hovering a star names it, clicking
 * opens its docs, and the ids in `hot` (what the hero search matches) flare
 * up with their names. `progress` (0..1, the hero's scroll) flies the camera
 * from a three-quarter view down into the disc.
 *
 * Raw three.js, no scene graph library: one Points for the dust, one for the
 * stars, one LineSegments for the constellations.
 */
export default function Galaxy({
  lang,
  hot,
  progress,
}: {
  lang: Lang;
  hot: Set<string>;
  progress: { get(): number };
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const hotRef = useRef(hot);
  hotRef.current = hot;
  const router = useRouter();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const small = innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the CSS poster behind stays.
    }
    const dpr = Math.min(devicePixelRatio, small ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1.6s cubic-bezier(.16,1,.3,1)";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.05, 100);
    const galaxy = new THREE.Group();
    galaxy.rotation.z = 0.12;
    scene.add(galaxy);

    /* ---------- dust ---------- */
    const ARMS = 3;
    const R = 5.2;
    const COUNT = small ? 14000 : 38000;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const scale = new Float32Array(COUNT);
    const seed = new Float32Array(COUNT);
    const inner = new THREE.Color("#f3e6ff");
    const mid = new THREE.Color("#aa76de");
    const outer = new THREE.Color("#5b2f8f");
    const blue = new THREE.Color("#59a4ff");
    const c = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const r = Math.pow(Math.random(), 1.5) * R;
      const branch = ((i % ARMS) / ARMS) * Math.PI * 2;
      const spin = r * 1.05;
      const spread = Math.pow(Math.random(), 2.6) * (0.35 + r * 0.16);
      const angle = branch + spin + (Math.random() - 0.5) * spread * 2.2;
      const off = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.2 + r * 0.12);
      pos[i * 3] = Math.cos(angle) * r + off();
      pos[i * 3 + 1] = off() * 0.55 * (1.2 - r / R);
      pos[i * 3 + 2] = Math.sin(angle) * r + off();
      const k = r / R;
      c.copy(inner).lerp(mid, Math.min(1, k * 2.2)).lerp(outer, Math.max(0, k * 1.4 - 0.4));
      if (Math.random() < 0.06) c.lerp(blue, 0.55);
      col.set([c.r, c.g, c.b], i * 3);
      scale[i] = Math.random() < 0.02 ? 2.6 : 0.4 + Math.random() * 0.9;
      seed[i] = Math.random();
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    dustGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    dustGeo.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const uniforms = { uTime: { value: 0 }, uPixel: { value: dpr }, uFade: { value: 1 } };
    const dust = new THREE.Points(
      dustGeo,
      new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uTime; uniform float uPixel;
          attribute vec3 aColor; attribute float aScale; attribute float aSeed;
          varying vec3 vColor; varying float vTw;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = min(40.0, 26.0 * aScale * uPixel / -mv.z);
            vColor = aColor;
            vTw = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 60.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform float uFade;
          varying vec3 vColor; varying float vTw;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = pow(1.0 - smoothstep(0.0, 0.5, d), 2.2);
            gl_FragColor = vec4(vColor * vTw, a * 0.85 * uFade);
          }`,
      }),
    );
    galaxy.add(dust);

    /* ---------- plugin stars, one constellation per category ---------- */
    const cats = CATEGORY_ORDER as readonly string[];
    const n = plugins.length;
    const starPos = new Float32Array(n * 3);
    const starHot = new Float32Array(n);
    const starLive = new Float32Array(n);
    const byCat = new Map<number, number[]>();
    plugins.forEach((p, i) => {
      const ci = Math.max(0, cats.indexOf(p.category.en));
      const list = byCat.get(ci) ?? [];
      list.push(i);
      byCat.set(ci, list);
    });
    // Category centres walk out along the arms; members scatter around them.
    const rand = mulberry(7);
    byCat.forEach((members, ci) => {
      const r = 1.3 + (ci / cats.length) * 3.2;
      const centre = ((ci % ARMS) / ARMS) * Math.PI * 2 + r * 1.05;
      members.forEach((i, j) => {
        const a = centre + (j - (members.length - 1) / 2) * (0.55 / Math.max(1, r * 0.6)) + (rand() - 0.5) * 0.12;
        const rr = r + (rand() - 0.5) * 0.55;
        starPos.set([Math.cos(a) * rr, (rand() - 0.5) * 0.25, Math.sin(a) * rr], i * 3);
        starLive[i] = plugins[i].nav.length > 0 ? 1 : 0.35;
      });
    });
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("aHot", new THREE.BufferAttribute(starHot, 1));
    starGeo.setAttribute("aLive", new THREE.BufferAttribute(starLive, 1));
    const stars = new THREE.Points(
      starGeo,
      new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uTime; uniform float uPixel;
          attribute float aHot; attribute float aLive;
          varying float vHot; varying float vLive;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            float pulse = 1.0 + aHot * 0.18 * sin(uTime * 4.0 + position.x * 3.0);
            gl_PointSize = (90.0 + aHot * 120.0) * aLive * pulse * uPixel / -mv.z;
            vHot = aHot; vLive = aLive;
          }`,
        fragmentShader: /* glsl */ `
          uniform float uFade;
          varying float vHot; varying float vLive;
          void main() {
            vec2 p = gl_PointCoord - 0.5;
            float d = length(p);
            float core = smoothstep(0.09, 0.0, d);
            float halo = pow(1.0 - smoothstep(0.0, 0.5, d), 3.0);
            float cross = (smoothstep(0.012, 0.0, abs(p.x)) + smoothstep(0.012, 0.0, abs(p.y))) * smoothstep(0.5, 0.0, d) * (0.35 + vHot);
            vec3 tint = mix(vec3(0.70, 0.52, 0.90), vec3(0.56, 1.0, 0.76), vHot);
            vec3 col = vec3(1.0) * core + tint * (halo * 0.9 + cross * 0.6);
            gl_FragColor = vec4(col, (core + halo + cross) * vLive * uFade);
          }`,
      }),
    );
    galaxy.add(stars);

    const lineIdx: number[] = [];
    byCat.forEach((members) => {
      for (let j = 1; j < members.length; j++) lineIdx.push(members[j - 1], members[j]);
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    lineGeo.setIndex(lineIdx);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xb48fd9, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false });
    galaxy.add(new THREE.LineSegments(lineGeo, lineMat));

    /* ---------- size, pointer, visibility ---------- */
    let w = 1;
    let h = 1;
    const resize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const mouse = { x: 0, y: 0, sx: 0, sy: 0, px: -1, py: -1 };
    let hovered = -1;
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      mouse.px = e.clientX - b.left;
      mouse.py = e.clientY - b.top;
      mouse.x = (mouse.px / b.width) * 2 - 1;
      mouse.y = (mouse.py / b.height) * 2 - 1;
    };
    const onLeave = () => {
      mouse.px = mouse.py = -1;
    };
    // The hero text sits above the canvas, so pointer events are read on the window.
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    const onClick = (e: MouseEvent) => {
      if (hovered < 0 || (e.target as HTMLElement).closest("a,button,input,label")) return;
      const p = plugins[hovered];
      if (p.nav.length) router.push(`/${lang}/docs/${p.id}`);
    };
    addEventListener("click", onClick);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    /* ---------- loop ---------- */
    const v = new THREE.Vector3();
    const screen = new Float32Array(n * 2);
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let first = true;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) t += dt;
      uniforms.uTime.value = t;

      const p = Math.min(1, Math.max(0, progress.get()));
      const e = p * p * (3 - 2 * p);
      if (!reduced) {
        mouse.sx += (mouse.x - mouse.sx) * 0.04;
        mouse.sy += (mouse.y - mouse.sy) * 0.04;
      }
      galaxy.rotation.y = t * 0.025 + e * 0.9;
      const dist = (small ? 9.2 : 7.4) - e * (small ? 5.6 : 4.6);
      const elev = 0.5 + e * 0.75 - mouse.sy * 0.08;
      const az = mouse.sx * 0.22;
      camera.position.set(Math.sin(az) * Math.cos(elev) * dist, Math.sin(elev) * dist, Math.cos(az) * Math.cos(elev) * dist);
      camera.lookAt(0, (small ? 1.9 : 2.1) * (1 - e), 0);
      uniforms.uFade.value = 1 - Math.max(0, p - 0.85) / 0.15;

      // Ease each star towards its target heat.
      const hotIds = hotRef.current;
      const hotAttr = starGeo.getAttribute("aHot") as THREE.BufferAttribute;
      let nearest = -1;
      let best = coarse ? 0 : 18 * 18;
      galaxy.updateMatrixWorld();
      for (let i = 0; i < n; i++) {
        const target = hotIds.has(plugins[i].id) || i === hovered ? 1 : 0;
        starHot[i] += (target - starHot[i]) * (reduced ? 1 : 0.12);
        v.fromArray(starPos, i * 3).applyMatrix4(galaxy.matrixWorld).project(camera);
        const sx = (v.x * 0.5 + 0.5) * w;
        const sy = (-v.y * 0.5 + 0.5) * h;
        screen[i * 2] = sx;
        screen[i * 2 + 1] = sy;
        if (mouse.px >= 0 && starLive[i] === 1 && v.z < 1) {
          const d2 = (sx - mouse.px) ** 2 + (sy - mouse.py) ** 2;
          if (d2 < best) {
            best = d2;
            nearest = i;
          }
        }
      }
      hotAttr.needsUpdate = true;
      if (nearest !== hovered) {
        hovered = nearest;
        document.body.style.cursor = hovered >= 0 ? "pointer" : "";
      }
      lineMat.opacity = 0.16 + (hotIds.size ? 0.1 : 0);

      for (let i = 0; i < n; i++) {
        const label = labels.current[i];
        if (!label) continue;
        const show = starHot[i] > 0.05 && uniforms.uFade.value > 0.2;
        label.style.opacity = show ? String(Math.min(1, starHot[i] * 1.4)) : "0";
        if (show) label.style.transform = `translate3d(${screen[i * 2] + 14}px, ${screen[i * 2 + 1] - 10}px, 0)`;
      }

      renderer.render(scene, camera);
      if (first) {
        first = false;
        renderer.domElement.style.opacity = "1";
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      removeEventListener("click", onClick);
      document.body.style.cursor = "";
      dustGeo.dispose();
      starGeo.dispose();
      lineGeo.dispose();
      (dust.material as THREE.Material).dispose();
      (stars.material as THREE.Material).dispose();
      lineMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [lang, progress, router]);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <div className="pointer-events-none absolute inset-0 z-10">
        {plugins.map((p, i) => (
          <span
            key={p.id}
            ref={(node) => {
              labels.current[i] = node;
            }}
            className="galaxy-label"
            style={{ opacity: 0 }}
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8fffc1]/80">{p.category[lang]}</span>
            <span className="block text-[13px] font-medium text-white">{p.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Small seeded PRNG so the constellations sit in the same place on every visit. */
function mulberry(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
