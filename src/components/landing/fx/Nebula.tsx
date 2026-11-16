"use client";

import { useEffect, useRef, useState } from "react";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

/* Slow domain-warped fbm in the Exylia violets, a few twinkling stars and film
   grain. Everything is relative to the short side so it looks the same on a
   phone and on a 4K screen. */
const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*r)/min(r.x,r.y);
  float T=t*.035;
  vec2 q=vec2(fbm(uv*1.4+T),fbm(uv*1.4-T+5.2));
  vec2 w=uv+.55*q+m*.06;
  float f=fbm(w*1.8+vec2(T*1.6,-T));
  vec3 ink=vec3(.024,.024,.031);
  vec3 deep=vec3(.20,.09,.36);
  vec3 vio=vec3(.54,.32,.77);
  vec3 lil=vec3(.71,.56,.85);
  float glow=smoothstep(1.25,.0,length(uv-vec2(.0,.42)));
  vec3 c=mix(ink,deep,smoothstep(.25,.85,f)*glow*1.1);
  c=mix(c,vio,smoothstep(.55,1.,f)*glow*.55);
  c+=lil*pow(smoothstep(.6,1.,q.x*f*1.6),3.)*glow*.35;
  vec2 g=gl_FragCoord.xy/1.5;float s=h(floor(g));
  float tw=step(.9985,s)*(.5+.5*sin(t*1.5+s*80.));
  c+=vec3(.9,.85,1.)*tw*.55*(1.-glow*.6);
  c*=1.-.35*length(uv*vec2(.7,1.));
  c+=(h(gl_FragCoord.xy+fract(t))-.5)*.025;
  gl_FragColor=vec4(c,1.);
}`;

/**
 * The hero's nebula: a WebGL fragment shader at half resolution, paused when it
 * is off screen or the tab is hidden, and a single still frame under reduced
 * motion. The CSS gradient behind it is the poster: what shows before the
 * first frame and on anything without WebGL.
 */
export function Nebula({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    const gl = el?.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!el || !gl) return;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = 0.5;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let visible = true;
    const start = performance.now() - 40_000 * Math.random();

    const resize = () => {
      el.width = Math.max(1, Math.round(el.clientWidth * scale));
      el.height = Math.max(1, Math.round(el.clientHeight * scale));
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uR, el.width, el.height);
    };
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.03;
      mouse.y += (mouse.ty - mouse.y) * 0.03;
      gl.uniform1f(uT, (now - start) / 1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      draw(now);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => {
      if (!still && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / innerWidth - 0.5;
      mouse.ty = 0.5 - e.clientY / innerHeight;
    };

    resize();
    draw(performance.now());
    setReady(true);
    wake();

    const ro = new ResizeObserver(() => {
      resize();
      if (still) draw(performance.now());
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", wake);
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", wake);
      removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div aria-hidden className={`nebula-poster pointer-events-none absolute inset-0 ${className}`}>
      <canvas
        ref={canvas}
        className={`h-full w-full transition-opacity duration-[1600ms] ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
