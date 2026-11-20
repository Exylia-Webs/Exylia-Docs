// Exylia Docs' set: a library reading room, not the Hub's gallery or Seller's warehouse. Oak floor,
// bookcases along the back wall, sun through tall window panes by day (uTheme 0), one hanging lamp
// with a cool sky-blue light by night (1). uK morphs 0 open book -> 1 a row of books, one per
// category -> 2 the open book turning its pages (one per part of every plugin's docs) ->
// 3 a card catalogue whose drawers are the site's tools -> 4 a stack of closed books.

import type { Shot } from "@exylia-webs/ui/site";

// Docs' own camera: looking down at a page from the reader's chair, then along the shelves.
export const SHOTS: Shot[] = [
  { az: 0.18, el: 0.52, dist: 10.6, ty: -0.05, sx: 0.36, sy: 0.02, mx: 0, my: 0.24 },
  { az: 0.38, el: 0.16, dist: 12.4, ty: -0.25, sx: -0.46, sy: 0, mx: 0, my: 0.24 },
  { az: -0.1, el: 0.5, dist: 10.4, ty: 0, sx: 0.4, sy: 0, mx: 0, my: 0.24 },
  { az: -0.5, el: 0.22, dist: 11.6, ty: -0.3, sx: -0.46, sy: 0, mx: 0, my: 0.24 },
  { az: -0.42, el: 0.36, dist: 9.6, ty: -0.7, sx: 0.34, sy: -0.02, mx: 0, my: 0.17 },
];

// WebGL2 so loops can start at ZERO (see Seller's shader): ANGLE on Windows would otherwise unroll
// every map() call and stall for seconds.
export const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uRes;
uniform float uTime;
uniform float uK;
uniform vec3 uCam;      // azimuth, elevation, distance
uniform vec3 uTgt;      // look-at point
uniform vec2 uShift;    // where the object sits on screen (uv units)
uniform vec2 uLight;    // key light azimuth, elevation
uniform float uSteps;
uniform float uTwist;   // progress through the structure chapter 0..1
uniform float uHB[9];   // hover weight per catalogue drawer (8 used)
uniform float uHS[10];  // hover weight per book on the row (one per category)
uniform float uTheme;   // 0 day, 1 night

#define ZERO min(int(uSteps), 0)
const float PI = 3.14159265;
const float FLOOR = -1.2;
const float WALL = -5.4;   // face of the bookcases
const float BW = 1.02;     // page width, spine to fore-edge
const float BD = 1.44;     // page height, along the spine
const vec3 SKY = vec3(.23, .62, .79);    // the docs' accent
const vec3 PAPER = vec3(.8, .76, .67);
const vec3 GOLD = vec3(.62, .46, .2);

float gHover;   // hover weight of the closest piece, for the sky glow
vec3 gAlb;      // albedo of the closest piece, printed matter included
float gSpec;    // how glossy it is
float gPix;     // world size of one pixel at the hit, so the printed lines stay smooth
float gMat;     // material of the set at the last map() call

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float sdBox(vec3 p, vec3 b, float r){
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.) - r;
}

// cloth for covers: navy, oxblood, bottle green, ochre and the docs' own sky
vec3 cloth(float h){
  h = fract(h) * 5.;
  return h < 1. ? vec3(.06, .1, .2) : h < 2. ? vec3(.3, .07, .07) : h < 3. ? vec3(.07, .19, .12) : h < 4. ? vec3(.48, .33, .11) : vec3(.12, .4, .55);
}

// printed page: paragraphs of grey lines with a ragged right edge, painted, never raised.
// s runs along a line in reading order, r down the page from the top margin.
vec3 printed(float s, float r){
  const float SP = .085;
  float row = floor(r / SP), f = fract(r / SP);
  float para = mod(row, 6.);
  float len = BW - .24 - (para > 4.5 ? .45 * h11(row + 3.) : .07 * h11(row));
  float w = gPix / SP;
  float ln = 1. - smoothstep(.17 - w, .17 + w, abs(f - .5));
  ln *= smoothstep(-gPix, gPix, s) * smoothstep(len + gPix, len - gPix, s);
  ln *= step(0., r) * step(r, BD - .3) * step(para, 4.5);
  // the title line is heavier, the next one blank
  ln *= row < .5 ? 1.3 : row < 1.5 ? 0. : 1.;
  // too small to resolve: the lines settle into the even grey of a printed page
  ln = mix(ln, .16, clamp(w * 1.6 - .4, 0., 1.));
  return mix(PAPER, vec3(.22, .21, .2), ln * .55);
}

// an open book on a reading stand: two page stacks rising out of the gutter, cloth boards under them.
// leaves > 0 also turns that many pages, one after the other with the reader's progress.
float openBook(vec3 p, int leaves){
  // the far end rises toward the reader, like a book propped on a stand
  p.yz *= rot(-.34);
  float bound = sdBox(p, vec3(2.3, .8, 1.), 0.);
  if (bound > .6) return bound;
  float side = p.x < 0. ? -1. : 1.;
  vec3 r = vec3(abs(p.x), p.y - abs(p.x) * .14, p.z);
  float h = .16 * (1. - exp(-r.x * 8.)) - .035 * r.x * r.x;
  float cover = sdBox(r - vec3(BW * .5 + .03, -.024, 0.), vec3(BW * .5 + .06, .02, BD * .5 + .05), .015);
  float spine = max(length(p.xy - vec2(0., -.05)) - .07, abs(p.z) - BD * .5 - .05);
  float boards = min(cover, spine);
  float pages = sdBox(r - vec3(BW * .5 + .02, h * .5, 0.), vec3(BW * .5, h * .5 + .002, BD * .5), min(.012, h * .5)) * .8;
  float d = min(boards, pages);
  gHover = 0.;
  if (pages < boards) {
    gSpec = .04;
    gAlb = r.y > h - .014 ? printed(side > 0. ? r.x - .13 : BW - .1 - r.x, r.z + BD * .5 - .15) : PAPER * .86;
  } else {
    gSpec = .08;
    gAlb = vec3(.06, .22, .32);
  }
  for (int i = ZERO; i < 4; i++) {
    if (i >= leaves) break;
    float s = clamp(uTwist * 4.6 - float(i) * 1.1 - .2, 0., 1.);
    s = s * s * (3. - 2. * s);
    if (s < .01 || s > .99) continue;
    // the leaf swings over the spine; its free end lags behind, so it curls
    vec3 q = p;
    q.xy *= rot(-mix(.14, PI - .14, s));
    q.y += sin(s * PI) * .3 * (q.x / BW) * (q.x / BW);
    float lf = sdBox(vec3(q.x - BW * .5 - .02, q.y - .012, q.z), vec3(BW * .5, .007, BD * .5 - .01), .005) * .7;
    if (lf < d) {
      d = lf;
      gHover = 1. - abs(s - .5) * 2.;
      gSpec = .04;
      gAlb = printed(q.y > .012 ? q.x - .13 : BW - .1 - q.x, q.z + BD * .5 - .15);
    }
  }
  return d;
}

// a closed book, spine on +z: two boards and a spine around a page block that shows on the other sides
float book(vec3 q, vec3 b, out float paper){
  const float C = .028;
  float shell = sdBox(q, b, .02);
  float slot = sdBox(q - vec3(0., 0., -C - .5), vec3(b.x - C, b.y + .1, b.z + .5), 0.);
  float boards = max(shell, -slot);
  float pages = sdBox(q - vec3(0., 0., (.02 - C) * .5), vec3(b.x - C, b.y - .03, b.z - (C + .02) * .5), .006);
  paper = step(pages, boards);
  return min(boards, pages);
}
// two gold bands across a spine, painted
float bands(float y, float hgt){ return step(abs(abs(y) - (hgt - .17)), .022); }

// 1: a row of books standing on the floor, one per category; pointing at a plugin pulls its book out
float fRow(vec3 p){
  float bound = sdBox(p - vec3(0., -.3, 0.), vec3(1.8, 1.2, .9), 0.);
  if (bound > .5) return bound;
  float d = 1e9, x = -1.52;
  for (int i = ZERO; i < 10; i++) {
    float fi = float(i);
    float w = .11 + .06 * h11(fi + 1.), hgt = .72 + .26 * h11(fi + 7.), hv = uHS[i];
    x += w;
    vec3 q = p - vec3(x, FLOOR + hgt + .002 + hv * .1, hv * .42);
    x += w + .022;
    float pa;
    float b = book(q, vec3(w, hgt, .5), pa);
    if (b < d) {
      d = b; gHover = hv;
      vec3 c = cloth(h11(fi * 3.1 + .4));
      gAlb = pa > .5 ? PAPER * .82 : mix(c, GOLD, q.z > .47 ? bands(q.y, hgt) : 0.);
      gSpec = pa > .5 ? .04 : .1;
    }
  }
  return d;
}

// 3: an oak card catalogue on short legs; each drawer is one of the site's tools and slides out when pointed at
float fCatalog(vec3 p){
  vec3 c = p - vec3(0., -.12, 0.);
  float bound = sdBox(c - vec3(0., -.3, .3), vec3(1.4, 1., .9), 0.);
  if (bound > .5) return bound;
  float carc = sdBox(c, vec3(1.27, .66, .5), .03);
  vec2 id = clamp(floor(c.xy / .6), vec2(-2., -1.), vec2(1., 0.));
  vec2 ce = (id + .5) * .6;
  carc = max(carc, -sdBox(vec3(c.xy - ce, c.z - .5), vec2(.275, .275).xyy + vec3(0., 0., .2), 0.));
  vec2 lg = vec2(abs(c.x) - 1.12, c.z - (abs(c.z) > 0. ? sign(c.z) * .36 : 0.));
  float legs = sdBox(vec3(lg.x, c.y + .66 + .21, abs(c.z) - .36), vec3(.05, .21, .05), .01);
  float d = min(carc, legs);
  gHover = 0.; gSpec = .12;
  gAlb = vec3(.36, .22, .12) * (.92 + .08 * sin(c.x * 3. + c.y * 9.));
  for (int i = ZERO; i < 8; i++) {
    float fi = float(i);
    vec2 g = vec2(mod(fi, 4.) - 1.5, .5 - floor(fi / 4.)) * .6;
    float hv = uHB[i], out_ = hv * .42;
    vec3 q = c - vec3(g, .5 + out_);
    float front = sdBox(q + vec3(0., 0., .02), vec3(.262, .262, .026), .012);
    float body = sdBox(q + vec3(0., .02, .26), vec3(.24, .22, .24), .01);
    float knob = length(q - vec3(0., -.11, .055)) - .042;
    float dr = min(min(front, body), knob);
    if (dr < d) {
      d = dr; gHover = hv;
      if (knob < min(front, body)) { gAlb = GOLD * 1.15; gSpec = .7; }
      else {
        // a brass label frame with its card, painted on the front
        vec2 l = abs(q.xy - vec2(0., .09)) - vec2(.11, .05);
        float frame = step(max(l.x, l.y), 0.), card = step(max(l.x, l.y), -.014);
        gAlb = mix(mix(vec3(.4, .25, .13), GOLD, frame), PAPER * .9, card);
        gSpec = mix(.12, .5, frame - card);
      }
    }
  }
  return d;
}

// 4: three closed books stacked on the floor, ready to be taken off to read
float fStack(vec3 p){
  float bound = sdBox(p - vec3(0., FLOOR + .4, 0.), vec3(1.3, .5, 1.1), 0.);
  if (bound > .5) return bound;
  float d = 1e9, y = FLOOR;
  for (int i = ZERO; i < 3; i++) {
    float fi = float(i);
    vec3 b = vec3(.13 - fi * .015, 1. - fi * .13, .72 - fi * .08);
    y += b.x;
    vec3 q = p - vec3(fi * .08 - .05, y + .002, fi * -.05);
    q.xz *= rot(.18 - fi * .42 + (fi > 1.5 ? .7 : 0.));
    y += b.x;
    float pa;
    // lying down: the book's thickness is the world's height
    float k = book(q.yxz, b, pa);
    if (k < d) {
      d = k; gHover = 0.;
      vec3 c = fi > 1.5 ? vec3(.12, .4, .55) : fi > .5 ? vec3(.3, .07, .07) : vec3(.06, .1, .2);
      gAlb = pa > .5 ? PAPER * .82 : mix(c, GOLD, q.z > b.z - .03 ? bands(q.x, b.y) : 0.);
      gSpec = pa > .5 ? .04 : .1;
    }
  }
  return d;
}

float form(int i, vec3 p){
  if (i == 0) return openBook(p, 0);
  if (i == 1) return fRow(p);
  if (i == 2) return openBook(p, 4);
  if (i == 3) return fCatalog(p);
  return fStack(p);
}

float sculpt(vec3 p){
  // the piece turns very slowly, always
  p.xz *= rot(sin(uTime * .06) * .16);
  // every path goes through one form() call site, so the compiler inlines the forms once
  float k = clamp(uK, 0., 4.);
  int ia = int(floor(k));
  float t = k - float(ia);
  if (ia > 3) { ia = 4; t = 0.; }
  if (t > .999) { ia += 1; t = 0.; }
  float d0 = 0., d1 = 0., h0 = 0., s0 = 0.;
  vec3 a0 = vec3(0.);
  for (int j = ZERO; j < 2; j++) {
    if (j == 1 && t < .001) break;
    float d = form(ia + j, p);
    if (j == 0) { d0 = d; h0 = gHover; a0 = gAlb; s0 = gSpec; } else d1 = d;
  }
  if (t < .001) { gHover = h0; gAlb = a0; gSpec = s0; return d0; }
  gHover = mix(h0, gHover, t);
  gAlb = mix(a0, gAlb, t);
  gSpec = mix(s0, gSpec, t);
  // a short inflate while the two forms trade places keeps the blend solid
  return mix(d0, d1, t) - sin(t * PI) * .12;
}

// bookcases along the back wall, repeated along x: oak uprights and shelves (mat 1), books (mat 2 + colour)
vec2 cases(vec3 p){
  if (p.z > WALL + 1.1) return vec2(p.z - WALL - 1., 1.);
  vec3 q = p - vec3(0., FLOOR, WALL);
  const float CELL = 2.2, LV = 1.05, SW = .16;
  float id = floor(q.x / CELL + .5);
  q.x -= id * CELL;
  float wall = q.z + .02;
  float post = sdBox(vec3(abs(q.x) - CELL * .5, q.y - 3.2, q.z - .5), vec3(.06, 3.2, .5), 0.);
  float lv = clamp(floor(q.y / LV + .5), 0., 6.);
  float board = sdBox(vec3(q.x, q.y - lv * LV, q.z - .5), vec3(CELL * .5, .035, .5), 0.);
  float m = min(min(post, board), wall);
  if (q.z > .85) return vec2(m, 1.);
  float bl = clamp(floor(q.y / LV), 0., 5.);
  float sx = clamp(floor(q.x / SW), -6., 5.);
  float lx = q.x - (sx + .5) * SW;
  float hb = h11(id * 13.1 + bl * 7.7 + sx * 3.3), hw = h11(id * 5.7 + bl * 2.9 + sx * 9.1);
  float bh = .3 + .16 * hb;
  float bk = hb > .12 ? sdBox(vec3(lx, q.y - bl * LV - .035 - bh, q.z - .44), vec3(.052 + .018 * hw, bh, .36), .012) : 1e9;
  // never step past the slot: the next book may be nearer than this one
  bk = min(bk, SW * .5 - abs(lx) + .02);
  return bk < m ? vec2(bk, 2. + hw * .9) : vec2(m, 1.);
}

// the set: oak floor (mat 0) and the bookcases
vec2 setPart(vec3 p){
  vec2 r = vec2(p.y - FLOOR, 0.);
  vec2 k = cases(p);
  return k.x < r.x ? k : r;
}

vec2 map(vec3 p){
  float s = sculpt(p);
  vec2 w = setPart(p);
  gMat = w.y;
  return s < w.x ? vec2(s, 1.) : vec2(w.x, 0.);
}

float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

vec3 lightDir(){
  return normalize(vec3(sin(uLight.x) * cos(uLight.y), sin(uLight.y), cos(uLight.x) * cos(uLight.y)));
}

// the night lamp hangs over the reading table and sways a little on its chain
vec3 lampPos(){ return vec3(sin(uTime * .37) * .35, 4.3, .5 + sin(uTime * .29) * .2); }
float lampAt(vec3 p){
  vec3 d = p - lampPos();
  float l = length(d);
  return min(smoothstep(.84, .95, -d.y / l) * 30. / (l * l), 3.);
}
// small lamps over the bookcases, so the shelves read at night
float caseAt(vec3 p){
  float x = p.x - (floor(p.x / 4.4 + .5) * 4.4);
  vec3 d = vec3(x, p.y - 4.4, p.z - (WALL + 1.3));
  return 2. / (1. + dot(d, d) * 1.4);
}
// by day the sun comes through tall window panes: soft squares of light with the mullions between
float panes(vec3 p, vec3 L){
  vec2 w = p.xz + L.xz / max(L.y, .2) * (7. - p.y);
  vec2 g = abs(fract(w * vec2(.42, .3)) - .5) * 2.;
  return .3 + .7 * smoothstep(.93, .8, g.x) * smoothstep(.93, .82, g.y);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - .5 * uRes) / uRes.y - uShift;
  vec3 ta = uTgt;
  vec3 ro = ta + uCam.z * vec3(sin(uCam.x) * cos(uCam.y), sin(uCam.y), cos(uCam.x) * cos(uCam.y));
  vec3 fw = normalize(ta - ro);
  vec3 rt = normalize(cross(fw, vec3(0, 1, 0)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(uv.x * rt + uv.y * up + 2.5 * fw);
  vec3 Ld = lightDir();

  // Windows compilers inline map() once per call site, at seconds each, so the frame has one: this
  // loop runs in phases, the march, four normal taps, five occlusion taps, and last one more look
  // at the hit for its materials. The shadow ray only needs the piece, so it has its own loop.
  float t = 0., hy = 0., o = 0., r = 1., ts = .03;
  vec3 n = vec3(0.), lp = lampPos();
  int ph = 0, k = 0;
  for (int i = ZERO; i < 150; i++) {
    if (ph == 0 && float(k) >= min(uSteps, 140.)) { ph = 1; k = 0; }
    vec3 p = ro + rd * t, q = p;
    vec3 e = .5773 * (2. * vec3(float(((k + 3) >> 1) & 1), float((k >> 1) & 1), float(k & 1)) - 1.);
    if (ph == 1) q += .0015 * e;
    else if (ph == 2) q += n * (.05 + .13 * float(k));
    vec2 d = map(q);
    if (ph == 0) {
      hy = d.y;
      if (d.x < .0012 * t || t > 32.) { ph = 1; k = 0; }
      else { t += d.x * .9; k++; }
    } else if (ph == 1) {
      n += e * d.x;
      if (++k == 4) { n = normalize(n); ph = 2; k = 1; }
    } else if (ph == 2) {
      o += (.05 + .13 * float(k) - d.x) * pow(.7, float(k - 1));
      // the size of a pixel at the hit, for the printed lines of that last look
      if (++k == 6) { ph = 3; gPix = t * 1.5 / (uRes.y * 2.5); }
    } else break;
  }
  vec3 p = ro + rd * t;
  float hv = gHover, spc = gSpec, mat = gMat;
  vec3 palb = gAlb;
  vec3 L = normalize(mix(Ld, normalize(lp - p), uTheme));
  for (int i = ZERO; i < 40; i++) {
    float d = sculpt(p + n * .01 + L * ts);
    r = min(r, 6. * d / ts);
    ts += clamp(d, .03, .35);
    if (r < .002 || ts > 7.) break;
  }
  o = clamp(1. - 1.6 * o, 0., 1.);
  float sh = clamp(r, 0., 1.);
  float lamp = lampAt(p);
  // what reaches a point: sun through the panes by day, the sky-blue lamp and the case lamps by night
  vec3 sun = vec3(1., .91, .78) * panes(p, L);
  vec3 night = vec3(.66, .86, 1.) * lamp * .8 + SKY * caseAt(p) * .5;
  vec3 key = mix(sun, night, uTheme);
  vec3 amb = mix(vec3(.46, .52, .58) * (.5 + .3 * n.y), vec3(.02, .035, .05) * (1. + .5 * n.y), uTheme);
  vec3 col;
  float dif = max(dot(n, L), 0.);
  vec3 H = normalize(L - rd);

  if (hy < .5) {
    float m = mat;
    vec3 alb;
    float gloss = 0.;
    if (m < .5) {
      // oak planks, waxed
      float pl = floor(p.z * 1.7);
      float c = noise(vec2(p.x * .7 + h11(pl) * 9., p.z * 3.)) * .6 + noise(p.xz * vec2(1.6, 6.)) * .4;
      alb = mix(vec3(.46, .31, .18), vec3(.09, .065, .045), uTheme) * (.82 + .14 * h11(pl + 2.)) * (.9 + .16 * c);
      alb *= .75 + .25 * smoothstep(.0, .05, abs(fract(p.z * 1.7) - .5) * 2. - .9 + .05);
      gloss = .3 + .5 * uTheme;
    } else if (m < 1.5) {
      alb = mix(vec3(.4, .27, .16), vec3(.07, .05, .035), uTheme) * (.9 + .1 * noise(p.xy * vec2(1., 5.)));
    } else {
      alb = cloth(fract(m - 2.) * 1.1) * mix(1.1, .6, uTheme);
    }
    col = alb * (key * dif * sh + amb) * o;
    col += gloss * pow(max(dot(n, H), 0.), 50.) * key * sh * .12;
    // contact darkening right below the piece
    col *= .7 + .3 * smoothstep(0., 1.7, length(p.xz));
  } else {
    // the piece: cloth, paper, oak and brass; what the reader points at warms with the docs' sky
    vec3 alb = mix(palb, palb + SKY * .25, hv * .6);
    float spec = pow(max(dot(n, H), 0.), mix(14., 60., spc)) * spc;
    // paper and cloth scatter a little light around their edges
    float wrap = max(dot(n, L) * .7 + .3, 0.);
    col = alb * (key * mix(dif, wrap, .25) * sh + amb * 1.1) * o + key * spec * sh;
    col += hv * SKY * (.14 + .3 * pow(1. - max(dot(n, -rd), 0.), 2.));
  }

  if (uTheme > .01) {
    // the lamp's cone through the dust of the reading room, and the bulb itself
    float tm = min(t, 18.), acc = 0.;
    // interleaved gradient noise: an even, still dither instead of per-frame speckle
    float j = fract(52.98 * fract(dot(gl_FragCoord.xy, vec2(.0671, .00584))));
    for (int i = ZERO; i < 14; i++) {
      vec3 q = ro + rd * ((float(i) + j) / 14. * tm);
      acc += lampAt(q) * (.45 + .9 * noise(q.xz * .9 + q.y * .4 + vec2(uTime * .05, -uTime * .03)));
    }
    col += uTheme * acc * tm / 14. * vec3(.5, .78, 1.) * .018;
    vec3 bl = lp - ro;
    float along = dot(bl, rd);
    if (along > 0. && along < t) col += uTheme * vec3(2., 3.2, 4.) * exp(-length(bl - rd * along) * 9.) * .9;
  } else {
    // day: light from the windows behind the camera hazes the far shelves
    col += (1. - uTheme) * vec3(.04, .045, .05) * smoothstep(4., 14., t);
  }
  // distance haze, tone map, vignette
  col = mix(col, mix(vec3(.7, .72, .74), vec3(.006, .01, .015), uTheme), 1. - exp(-.0011 * t * t));
  col = col * (2.51 * col + .03) / (col * (2.43 * col + .59) + .14);
  col = pow(clamp(col, 0., 1.), vec3(.4545));
  vec2 q = gl_FragCoord.xy / uRes;
  float vg = pow(16. * q.x * q.y * (1. - q.x) * (1. - q.y), .2);
  col *= mix(.86 + .14 * vg, .45 + .55 * vg, uTheme);
  fragColor = vec4(col, 1.);
}
`;
