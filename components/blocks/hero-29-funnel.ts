import * as THREE from "three";

export type FunnelStep = { name: string; count: number; height: number };

export const FUNNEL_STEPS = [
  { name: "Visits completed", count: 1284, height: 0.46 },
  { name: "Charts closed", count: 1102, height: 0.34 },
  { name: "Claims submitted", count: 986, height: 0.23 },
  { name: "Payments posted", count: 841, height: 0.12 },
];

const COLORS: [string, string] = ["#8a8a8a", "#ffffff"];
const LEAK = "#2d4bf0";
const SAMPLES = 640;
const TABLE = 1024;
const SLOTS = 240;
const RING = SLOTS + 8;
const TOP = 1;
const DISTANCE = 3.2;
const SWELLS = 6;
const TAU = Math.PI * 2;
const WAIST = 0.14;
const FLARE = 0.8;

interface Funnel {
  focus: (index: number) => void;
  destroy: () => void;
}

interface Curve {
  points: Float32Array;
  table: Float32Array;
  corner: number;
  top: number;
  outer: number;
}

interface Camera {
  position: [number, number, number];
  up: [number, number, number];
  forward: [number, number, number];
  focal: number;
  principal: [number, number];
}

const hexToRgb = (hex: string): [number, number, number] => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const smooth = (from: number, to: number, value: number) => {
  const t = clamp((value - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
};

const wrap = (value: number, size: number) => ((value % size) + size) % size;

const toLinear = (value: number) => (value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4));

const toOklab = ([r, g, b]: [number, number, number]): [number, number, number] => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const buildCurve = (waist: number, flare: number, spread: number, swirl: number, twist: number): Curve => {
  const rW = waist;
  const rho = waist * 0.6;
  const start = 0.12 * TOP;
  const outer = Math.max(spread, rW * 1.3 + rho + 0.1);
  const profile = (h: number) =>
    rW * (1 + 0.16 * Math.exp(-Math.max(0, h - rho) / 0.07)) +
    flare * 0.55 * TOP * Math.pow(Math.max(0, (h - start) / (TOP - start)), 2.45);
  const rBase = profile(rho);
  const r: number[] = [];
  const h: number[] = [];
  const g: number[] = [];
  const groundSteps = 3000;
  for (let k = 0; k < groundSteps; k++) {
    r.push(outer + (rBase + rho - outer) * (k / groundSteps));
    h.push(0);
    g.push(0);
  }
  const filletSteps = 600;
  for (let k = 0; k < filletSteps; k++) {
    const angle = -Math.PI / 2 - (Math.PI / 2) * (k / filletSteps);
    r.push(rBase + rho + rho * Math.cos(angle));
    h.push(rho + rho * Math.sin(angle));
    g.push(k / filletSteps);
  }
  const funnelSteps = 4400;
  for (let k = 0; k <= funnelSteps; k++) {
    const height = rho + (TOP - rho) * (k / funnelSteps);
    r.push(profile(height));
    h.push(height);
    g.push(1);
  }
  const n = r.length;
  const theta = new Float64Array(n);
  const tau = new Float64Array(n);
  const arc = new Float64Array(n);
  let corner = 0;
  for (let k = 1; k < n; k++) {
    const dl = Math.hypot(r[k] - r[k - 1], h[k] - h[k - 1]);
    const radius = 0.5 * (r[k] + r[k - 1]);
    const blend = 0.5 * (g[k] + g[k - 1]);
    const hug = 1 + 2.4 * Math.exp(-Math.max(0, radius - rBase - rho) / (0.6 * rho));
    const groundTurn = ((swirl * 4 * dl) / radius) * Math.pow(rW / radius, 0.3) * hug;
    const funnelTurn = ((twist * dl) / rW) * Math.pow(rW / radius, 0.3);
    const turn = (1 - blend) * groundTurn + blend * funnelTurn;
    theta[k] = theta[k - 1] + turn;
    const pace = (1 - blend) * Math.pow(rW / radius, 0.6) + blend * 0.5;
    tau[k] = tau[k - 1] + dl / pace;
    arc[k] = arc[k - 1] + Math.hypot(dl, radius * turn);
    if (g[k] >= 0.5 && g[k - 1] < 0.5) corner = tau[k];
  }
  const total = tau[n - 1];
  const points = new Float32Array((SAMPLES + 1) * 4);
  let cursor = 1;
  for (let j = 0; j <= SAMPLES; j++) {
    const goal = (arc[n - 1] * j) / SAMPLES;
    while (cursor < n - 1 && arc[cursor] < goal) cursor++;
    const span = arc[cursor] - arc[cursor - 1];
    const f = span > 0 ? clamp((goal - arc[cursor - 1]) / span, 0, 1) : 0;
    const at = j * 4;
    points[at] = r[cursor - 1] + (r[cursor] - r[cursor - 1]) * f;
    points[at + 1] = h[cursor - 1] + (h[cursor] - h[cursor - 1]) * f;
    points[at + 2] = theta[cursor - 1] + (theta[cursor] - theta[cursor - 1]) * f;
    points[at + 3] = (tau[cursor - 1] + (tau[cursor] - tau[cursor - 1]) * f) / total;
  }
  const table = new Float32Array(TABLE * 4);
  cursor = 1;
  for (let j = 0; j < TABLE; j++) {
    const goal = (total * j) / (TABLE - 1);
    while (cursor < n - 1 && tau[cursor] < goal) cursor++;
    const span = tau[cursor] - tau[cursor - 1];
    const f = span > 0 ? clamp((goal - tau[cursor - 1]) / span, 0, 1) : 0;
    const at = j * 4;
    table[at] = r[cursor - 1] + (r[cursor] - r[cursor - 1]) * f;
    table[at + 1] = h[cursor - 1] + (h[cursor] - h[cursor - 1]) * f;
    table[at + 2] = theta[cursor - 1] + (theta[cursor] - theta[cursor - 1]) * f;
    table[at + 3] = goal / total;
  }
  return { points, table, corner: corner / total, top: TOP, outer };
};

const shared = `
uniform vec2 uResolution;
uniform vec2 uPrincipal;
uniform float uFocal;
uniform vec3 uCamPos;
uniform vec3 uCamUp;
uniform vec3 uCamFwd;
uniform float uSpinPhase;
uniform float uOuter;
uniform float uWaist;
uniform float uTop;
uniform vec3 uLabA;
uniform vec3 uLabB;
uniform vec3 uHover;
uniform vec4 uSwells[${SWELLS}];
uniform float uWaveTime;
uniform float uActive;
uniform vec4 uHeights;
uniform vec4 uFocus;
uniform vec4 uSurvive;
uniform vec3 uLeakLab;
uniform float uRadial;

vec3 labToLinear(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return max(vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  ), 0.0);
}

vec3 toView(vec3 p) {
  vec3 d = p - uCamPos;
  return vec3(d.x, dot(d, uCamUp), dot(d, uCamFwd));
}

vec2 toScreen(vec3 v) {
  return uPrincipal + uFocal * v.xy / max(v.z, 0.05);
}

vec3 disturb(vec3 p, out float agitation, out float scatter) {
  agitation = 0.0;
  scatter = 0.0;
  if (uActive < 0.5) return p;
  float h = p.y;
  float wall = smoothstep(0.02, 0.16, h);
  float g = (h - uHover.x) / uHover.z;
  float swell = uHover.y * exp(-g * g);
  float drift = swell;
  for (int k = 0; k < ${SWELLS}; k++) {
    vec4 pulse = uSwells[k];
    if (pulse.z <= 0.0) continue;
    float age = uWaveTime - pulse.y;
    if (age < 0.0 || age > 7.0) continue;
    float q = (h - pulse.x - 0.3 * age) / 0.2;
    swell += pulse.z * smoothstep(0.0, 0.45, age) * exp(-age / 1.8) * exp(-q * q);
    drift += pulse.z * smoothstep(0.0, 0.6, age) * exp(-age / 2.4) * exp(-q * q * 0.6);
  }
  agitation = swell * wall;
  scatter = drift * wall;
  return vec3(p.x * (1.0 + agitation), p.y, p.z * (1.0 + agitation));
}

float envelope(float r, float h) {
  float ground = 1.0 - smoothstep(0.0, 0.04, h);
  float reachOut = clamp((r - uWaist) / max(uOuter - uWaist, 1e-3), 0.0, 1.0);
  float rim = pow(1.0 - reachOut, 2.2) * 0.75;
  float crown = 1.0 - smoothstep(uTop * 0.9, uTop, h);
  return mix(1.0, rim, ground) * crown;
}
`;

const strandVertex = `
in vec4 aStrand;
in vec2 aSample;
uniform sampler2D uCurve;
uniform sampler2D uLight;
uniform float uPixelRatio;
uniform float uHead;
uniform float uLineWidth;
uniform float uSheath;
uniform float uDefocus;
uniform float uLimb;
uniform float uRim;
uniform float uCorner;
uniform float uBack;
uniform float uEnergy;
uniform float uInk;
${shared}
out float vDist;
out float vCore;
out float vHalo;
out vec3 vColor;
out float vGain;

vec4 curveAt(float j) {
  return texelFetch(uCurve, ivec2(int(j), 0), 0);
}

vec3 place(vec4 c) {
  float r = c.x * (1.0 + aStrand.y) * uRadial;
  float th = aStrand.x + uSpinPhase + c.z * (1.0 + aStrand.z);
  return vec3(cos(th) * r, c.y, sin(th) * r);
}

vec4 lightAt(float tau, float row) {
  float k = min(uHead - tau * ${SLOTS}.0, floor(uHead));
  float k0 = floor(k);
  float f = k - k0;
  int y = int(row + 0.5);
  vec4 a = texelFetch(uLight, ivec2(int(mod(k0, ${RING}.0)), y), 0);
  vec4 b = texelFetch(uLight, ivec2(int(mod(k0 + 1.0, ${RING}.0)), y), 0);
  return mix(a, b, f);
}

void main() {
  float j = aSample.x;
  vec4 c1 = curveAt(j);
  float agitation;
  float scatter;
  float spare;
  vec3 w1 = disturb(place(c1), agitation, scatter);
  vec3 v1 = toView(w1);
  vec2 s0 = toScreen(toView(disturb(place(curveAt(max(j - 1.0, 0.0))), spare, spare)));
  vec2 s1 = toScreen(v1);
  vec2 s2 = toScreen(toView(disturb(place(curveAt(min(j + 1.0, ${SAMPLES}.0))), spare, spare)));
  vec2 tangent = normalize(s2 - s0 + vec2(1e-5, 0.0));
  vec2 normal = vec2(-tangent.y, tangent.x);
  float radial = length(w1.xz);
  float facing = clamp(0.5 + 0.5 * w1.z / max(radial, 1e-3), 0.0, 1.0);
  float blur = 1.0 + uDefocus * 3.0 * (1.0 - facing) * (1.0 - facing);
  float core = uLineWidth * uPixelRatio * mix(0.5, 1.0, facing) * 0.5 * blur;
  float halo = uSheath * 4.0 * uPixelRatio * mix(0.6, 1.0, facing) * sqrt(blur);
  float reach = max(core * 2.4, halo * 2.2) + 1.5;
  vec2 position2 = s1 + normal * aSample.y * reach;
  float sideways = 1.0 - abs(w1.z) / max(radial, 1e-3);
  float wall = smoothstep(0.02, 0.1, c1.y);
  float limb = 1.0 + uLimb * wall * pow(sideways, 3.0);
  float collar = (c1.y - uCorner * 0.45) / (uCorner * 0.75);
  limb += uRim * exp(-collar * collar);
  vDist = aSample.y * reach;
  vCore = core;
  vHalo = halo;

  vec4 light = lightAt(1.0 - c1.w, aStrand.w);
  float amount = max(light.x, 0.0);
  float hue = clamp(light.y / max(amount, 1e-3), 0.0, 1.0);
  float heat = clamp(light.z / max(amount, 1e-3), 0.0, 1.0);
  float rise = smoothstep(0.0, uTop * 0.85, c1.y);
  float tone = clamp(rise * 0.85 + (hue - 0.5) * 0.4 + 0.08, 0.0, 1.0);
  vec3 base = labToLinear(mix(uLabA, uLabB, smoothstep(0.0, 1.0, tone)));
  vec4 gap = (vec4(c1.y) - uHeights) / 0.03;
  float ring = clamp(dot(uFocus, exp(-gap * gap)), 0.0, 1.0) * wall;
  base = mix(base, labToLinear(uLeakLab), ring);
  vec3 glowTint = mix(base, vec3(1.0, 0.96, 1.0), heat * 0.6);
  vec3 inkTint = mix(base, labToLinear(vec3(uLabA.x * 0.6, uLabA.yz * 1.15)), heat * 0.6);
  vColor = mix(mix(glowTint, labToLinear(uLeakLab), ring), mix(inkTint, labToLinear(uLeakLab), ring), uInk);
  float strain = 1.0 + 1.4 * agitation;
  vGain = (1.0 + ring * 1.6) * (0.12 + amount) * envelope(c1.x, c1.y) * mix(uBack, 1.0, facing) * limb * strain * (1.0 + uEnergy * 0.15) / blur;
  gl_Position = vec4(position2 / uResolution * 2.0 - 1.0, 0.0, 1.0);
}
`;

const strandFragment = `
precision highp float;
uniform float uCore;
uniform float uSheathGain;
in float vDist;
in float vCore;
in float vHalo;
in vec3 vColor;
in float vGain;
out vec4 fragColor;

void main() {
  float sigma = max(vCore, 0.55);
  float d = vDist / sigma;
  float core = exp(-d * d) * min(vCore / 0.55, 1.0);
  float h = vDist / max(vHalo, 0.5);
  float sheath = exp(-h * h) * uSheathGain;
  float energy = (core + sheath) * vGain * uCore;
  fragColor = vec4(vColor * energy, energy);
}
`;

const dustVertex = `
in vec4 aDust;
uniform sampler2D uTable;
uniform float uPixelRatio;
uniform float uFlow;
uniform float uTime;
uniform float uSize;
uniform float uBack;
uniform float uEnergy;
uniform float uInk;
${shared}
out vec3 vColor;
out float vGain;

void main() {
  float tau = fract(aDust.y - uFlow * (0.25 + 0.2 * aDust.z));
  float x = tau * ${TABLE - 1}.0;
  float i0 = floor(x);
  float f = x - i0;
  vec4 a = texelFetch(uTable, ivec2(int(i0), 0), 0);
  vec4 b = texelFetch(uTable, ivec2(int(min(i0 + 1.0, ${TABLE - 1}.0)), 0), 0);
  vec3 c = mix(a.xyz, b.xyz, f);
  float lift = (fract(aDust.w * 13.71) - 0.5) * 0.1;
  float u = fract(aDust.w * 3.17 + 0.13);
  float exit = -1.0;
  float marked = 0.0;
  if (u > uSurvive.y) {
    exit = uHeights.y;
    marked = uFocus.y;
  } else if (u > uSurvive.z) {
    exit = uHeights.z;
    marked = uFocus.z;
  } else if (u > uSurvive.w) {
    exit = uHeights.w;
    marked = uFocus.w;
  }
  float gone = exit < 0.0 ? 0.0 : clamp((exit - c.y) / 0.16, 0.0, 1.0);
  float r = c.x * (1.0 + lift) * (1.0 + gone * gone * 3.2) * uRadial;
  float height = c.y + (exit - c.y) * gone * 0.9 - gone * gone * (0.03 + 0.09 * fract(aDust.w * 7.9));
  float th = aDust.x + uSpinPhase + c.z;
  float agitation;
  float scatter;
  vec3 w = disturb(vec3(cos(th) * r, height + abs(lift) * 0.05, sin(th) * r), agitation, scatter);
  float drift = scatter * (0.6 + 1.6 * fract(aDust.w * 29.7));
  w.xz *= 1.0 + drift * 1.4;
  w.y += drift * 0.08 * (fract(aDust.w * 5.3) - 0.35);
  vec3 v = toView(w);
  vec2 s = toScreen(v);
  float facing = clamp(0.5 + 0.5 * w.z / max(length(w.xz), 1e-3), 0.0, 1.0);
  float twinkle = 0.3 + 0.7 * pow(0.5 + 0.5 * sin(uTime * (1.2 + 2.4 * aDust.z) + aDust.w * 71.0), 3.0);
  float fade = envelope(c.x, height) * smoothstep(0.0, 0.03, tau) * (1.0 - smoothstep(0.96, 1.0, tau)) * (1.0 - smoothstep(0.45, 1.0, gone));
  float rise = smoothstep(0.0, uTop * 0.85, height);
  float tint = exit < 0.0 ? 0.0 : marked * smoothstep(-0.04, 0.0, exit - c.y);
  vec3 base = mix(labToLinear(mix(uLabA, uLabB, rise)), labToLinear(uLeakLab), tint);
  vColor = mix(mix(base, vec3(1.0), 0.55 * (1.0 - tint)), base, uInk);
  vGain = (1.0 + tint * 1.4) * twinkle * fade * mix(uBack, 1.0, facing) * (1.0 + uEnergy * 0.2) * (1.0 + drift * 3.0);
  gl_PointSize = max(uSize * uPixelRatio * mix(0.7, 1.3, fract(aDust.w * 7.3)) * 3.0, 1.0);
  gl_Position = vec4(s / uResolution * 2.0 - 1.0, 0.0, 1.0);
}
`;

const dustFragment = `
precision highp float;
uniform float uDustGain;
in vec3 vColor;
in float vGain;
out vec4 fragColor;

void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float e = exp(-dot(q, q) * 4.5) * vGain * uDustGain;
  fragColor = vec4(vColor * e, e);
}
`;

const passVertex = `
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const downFragment = `
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 a = texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  vec4 b = texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  vec4 c = texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  vec4 d = texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = (a + b + c + d) * 0.125 + texture(uSource, vUv) * 0.5;
}
`;

const upFragment = `
precision highp float;
uniform sampler2D uSource;
uniform sampler2D uBase;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 sum = texture(uSource, vUv) * 4.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, -1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, 1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = texture(uBase, vUv) + sum / 16.0;
}
`;

const compositeFragment = `
precision highp float;
uniform sampler2D uLines;
uniform sampler2D uBloom;
uniform vec3 uBackground;
uniform float uGlow;
uniform float uExposure;
uniform float uMode;
uniform float uGrain;
in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

void main() {
  vec4 lines = texture(uLines, vUv);
  vec4 bloom = texture(uBloom, vUv);
  vec3 color;
  if (uMode < 0.5) {
    vec3 light = (lines.rgb + bloom.rgb * uGlow) * uExposure;
    vec3 exposed = 1.0 - exp(-light);
    float peak = max(exposed.r, max(exposed.g, exposed.b));
    exposed = mix(exposed, vec3(peak), smoothstep(0.75, 1.0, peak) * 0.35);
    color = uBackground + (1.0 - uBackground) * exposed;
  } else {
    float energy = lines.a + bloom.a * uGlow * 0.2;
    vec3 hue = (lines.rgb + bloom.rgb * uGlow * 0.2) / max(energy, 1e-4);
    float cover = clamp(1.0 - exp(-energy * uExposure * 1.4), 0.0, 0.94);
    color = mix(uBackground, clamp(hue * 0.8, 0.0, 1.0), cover);
  }
  float grain = hash(gl_FragCoord.xy + uGrain * 311.0) - 0.5;
  fragColor = vec4(encode(color) + grain * (1.2 / 255.0), 1.0);
}
`;

interface Bundle {
  count: number;
  phi: Float32Array;
  radius: Float32Array;
  pitch: Float32Array;
  seed: Float32Array;
  ring: Float32Array;
  texture: THREE.DataTexture;
  geometry: THREE.BufferGeometry;
}

const seeded = (start: number) => {
  let state = start;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
};

const buildBundle = (count: number): Bundle => {
  const stride = 6;
  const verts = new Float32Array(count * (SAMPLES + 1) * 2 * stride);
  const indices = new Uint32Array(count * SAMPLES * 6);
  const phi = new Float32Array(count);
  const radius = new Float32Array(count);
  const pitch = new Float32Array(count);
  const seed = new Float32Array(count);
  const random = seeded(11);
  let v = 0;
  let n = 0;
  for (let i = 0; i < count; i++) {
    phi[i] = (i / count) * TAU + (random() - 0.5) * (TAU / count) * 0.8;
    radius[i] = (random() - 0.5) * 0.06;
    pitch[i] = (random() - 0.5) * 0.08;
    seed[i] = random();
    const base = v / stride;
    for (let j = 0; j <= SAMPLES; j++) {
      verts.set([phi[i], radius[i], pitch[i], i, j, -1, phi[i], radius[i], pitch[i], i, j, 1], v);
      v += stride * 2;
    }
    for (let j = 0; j < SAMPLES; j++) {
      const a = base + j * 2;
      indices.set([a, a + 1, a + 2, a + 1, a + 3, a + 2], n);
      n += 6;
    }
  }
  const geometry = new THREE.BufferGeometry();
  const buffer = new THREE.InterleavedBuffer(verts, stride);
  geometry.setAttribute("aStrand", new THREE.InterleavedBufferAttribute(buffer, 4, 0));
  geometry.setAttribute("aSample", new THREE.InterleavedBufferAttribute(buffer, 2, 4));
  geometry.setAttribute("position", new THREE.InterleavedBufferAttribute(buffer, 3, 0));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  const ring = new Float32Array(RING * count * 4);
  const texture = new THREE.DataTexture(ring, RING, count, THREE.RGBAFormat, THREE.FloatType);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return { count, phi, radius, pitch, seed, ring, texture, geometry };
};

const buildDust = (count: number) => {
  const random = seeded(29);
  const data = new Float32Array(Math.max(count, 1) * 4);
  for (let i = 0; i < count; i++) data.set([random() * TAU, random(), random(), random()], i * 4);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("aDust", new THREE.BufferAttribute(data, 4));
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(Math.max(count, 1) * 3), 3));
  geometry.setDrawRange(0, count);
  return geometry;
};

export type FunnelHandle = Funnel;

export type FunnelQuality = "high" | "low";

function qualitySettings(quality: FunnelQuality) {
  if (quality === "low") {
    return { strands: 24, dust: 520, maxDpr: 1.15, bloomLevelsCap: 3 };
  }
  // Desktop stays rich but a bit lighter so the homepage stays responsive after the intro.
  return { strands: 40, dust: 1100, maxDpr: 1.5, bloomLevelsCap: 5 };
}

export function createFunnel(
  root: HTMLElement,
  band: HTMLElement,
  copy: HTMLElement,
  content: HTMLElement,
  rows: (HTMLElement | null)[],
  onFocus: (index: number) => void,
  quality: FunnelQuality = "high",
): Funnel | null {
  const q = qualitySettings(quality);
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;
  const canvas = doc.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;z-index:-1;width:100%;height:100%;display:block;pointer-events:none";
  root.prepend(canvas);
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: quality === "low" ? "low-power" : "high-performance",
    });
  } catch {
    canvas.remove();
    return null;
  }
  if (!renderer.capabilities.isWebGL2) {
    renderer.dispose();
    canvas.remove();
    return null;
  }
  renderer.autoClear = false;
  const texelType =
    renderer.extensions.has("EXT_color_buffer_float") || renderer.extensions.has("EXT_color_buffer_half_float")
      ? THREE.HalfFloatType
      : THREE.UnsignedByteType;

  const motionQuery = view.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motionQuery.matches;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const plane = new THREE.PlaneGeometry(2, 2);
  const shape = buildCurve(WAIST, FLARE, 1.3, 1, 1);
  const curveTexture = new THREE.DataTexture(shape.points, SAMPLES + 1, 1, THREE.RGBAFormat, THREE.FloatType);
  curveTexture.minFilter = THREE.NearestFilter;
  curveTexture.magFilter = THREE.NearestFilter;
  curveTexture.needsUpdate = true;
  const tableTexture = new THREE.DataTexture(shape.table, TABLE, 1, THREE.RGBAFormat, THREE.FloatType);
  tableTexture.minFilter = THREE.NearestFilter;
  tableTexture.magFilter = THREE.NearestFilter;
  tableTexture.needsUpdate = true;

  const swells = Array.from({ length: SWELLS }, () => new THREE.Vector4(0, -100, 0, 0));
  const focusAmount = new THREE.Vector4(0, 1, 0, 0);
  const sharedUniforms = {
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPrincipal: { value: new THREE.Vector2() },
    uFocal: { value: 1 },
    uCamPos: { value: new THREE.Vector3() },
    uCamUp: { value: new THREE.Vector3() },
    uCamFwd: { value: new THREE.Vector3() },
    uSpinPhase: { value: 0 },
    uOuter: { value: shape.outer },
    uWaist: { value: WAIST },
    uTop: { value: TOP },
    uLabA: { value: new THREE.Vector3(...toOklab(hexToRgb(COLORS[0]))) },
    uLabB: { value: new THREE.Vector3(...toOklab(hexToRgb(COLORS[1]))) },
    uHover: { value: new THREE.Vector3(0.4, 0, 0.17) },
    uSwells: { value: swells },
    uWaveTime: { value: 0 },
    uActive: { value: 0 },
    uPixelRatio: { value: 1 },
    uBack: { value: 0.4 },
    uEnergy: { value: 0 },
    uInk: { value: 0 },
    uHeights: { value: new THREE.Vector4(...FUNNEL_STEPS.map((step) => step.height)) },
    uFocus: { value: focusAmount },
    uSurvive: { value: new THREE.Vector4(...FUNNEL_STEPS.map((step) => step.count / FUNNEL_STEPS[0].count)) },
    uLeakLab: { value: new THREE.Vector3(...toOklab(hexToRgb(LEAK))) },
    uRadial: { value: 1 },
  };

  const additive = {
    depthTest: false,
    depthWrite: false,
    transparent: true,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneFactor,
  } as const;

  const bundle = buildBundle(q.strands);
  const strandMaterial = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
      ...sharedUniforms,
      uCurve: { value: curveTexture },
      uLight: { value: bundle.texture },
      uHead: { value: 0 },
      uLineWidth: { value: 1 },
      uSheath: { value: 0.25 },
      uDefocus: { value: 0.6 },
      uLimb: { value: 1.6 },
      uRim: { value: 1.4 },
      uCorner: { value: WAIST * 0.6 },
      uCore: { value: 0.55 },
      uSheathGain: { value: 0.1 },
    },
    vertexShader: strandVertex,
    fragmentShader: strandFragment,
    side: THREE.DoubleSide,
    ...additive,
  });
  const dustMaterial = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
      ...sharedUniforms,
      uTable: { value: tableTexture },
      uFlow: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 1.25 },
      uDustGain: { value: 1 },
    },
    vertexShader: dustVertex,
    fragmentShader: dustFragment,
    ...additive,
  });
  const pass = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) =>
    new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms,
      vertexShader: passVertex,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
    });
  const downMaterial = pass(downFragment, { uSource: { value: null }, uTexel: { value: new THREE.Vector2() } });
  const upMaterial = pass(upFragment, {
    uSource: { value: null },
    uBase: { value: null },
    uTexel: { value: new THREE.Vector2() },
  });
  const compositeMaterial = pass(compositeFragment, {
    uLines: { value: null },
    uBloom: { value: null },
    uBackground: { value: new THREE.Vector3() },
    uGlow: { value: 0.3 },
    uExposure: { value: 0.525 },
    uMode: { value: 0 },
    uGrain: { value: 0 },
  });

  const strandMesh = new THREE.Mesh(bundle.geometry, strandMaterial);
  strandMesh.frustumCulled = false;
  const dustGeometry = buildDust(q.dust);
  const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
  dustPoints.frustumCulled = false;
  const lightScene = new THREE.Scene();
  lightScene.add(strandMesh, dustPoints);
  const quad = new THREE.Mesh(plane, compositeMaterial);
  quad.frustumCulled = false;
  const quadScene = new THREE.Scene();
  quadScene.add(quad);

  const target = (w: number, h: number) =>
    new THREE.WebGLRenderTarget(Math.max(1, w), Math.max(1, h), {
      type: texelType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
    });
  let lineTarget: THREE.WebGLRenderTarget | null = null;
  let downTargets: THREE.WebGLRenderTarget[] = [];
  let upTargets: THREE.WebGLRenderTarget[] = [];

  const probe = doc.createElement("canvas").getContext("2d", { willReadFrequently: true });
  let ink = false;
  let colorKey = "";
  let destroyed = false;
  let raf = 0;
  let last = 0;
  let visible = false;
  let clock = 20;
  let spinPhase = 0;
  let head = 0;
  let flow = 0;
  let energy = 0;
  let boost = 0;
  let boostVelocity = 0;
  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let grain = 0;
  let wide = false;
  let focused = 1;
  let reported = 1;
  const placement = { centerX: 0.5, baseY: 0.86, scale: 1, radial: 1 };
  const pointer = { inside: false, x: 0, y: 0 };
  const hover = { height: 0.4, velocity: 0, goal: 0.4, amount: 0 };
  let waveClock = 0;
  let swellSlot = 0;
  let camera3: Camera = { position: [0, 0, 0], up: [0, 1, 0], forward: [0, 0, -1], focal: 1, principal: [0, 0] };

  const release = () => {
    lineTarget?.dispose();
    downTargets.forEach((item) => item.dispose());
    upTargets.forEach((item) => item.dispose());
    lineTarget = null;
    downTargets = [];
    upTargets = [];
  };

  const draw = (material: THREE.ShaderMaterial, output: THREE.WebGLRenderTarget | null) => {
    quad.material = material;
    renderer.setRenderTarget(output);
    renderer.render(quadScene, camera);
  };

  const flowRate = () => 0.055 * (1 + energy * 0.25 + boost);

  const emission = (time: number, index: number): [number, number] => {
    const offset = 0.5 * (0.35 * Math.sin(bundle.phi[index] * 2 + 0.4) + 0.65 * (bundle.seed[index] - 0.5));
    const phase = time * 0.35 + offset;
    const wave = reduced ? 0.6 : 0.5 + 0.5 * Math.cos(TAU * phase);
    const swell = 0.8 + 0.2 * Math.sin(time * 0.29 + bundle.seed[index] * 5);
    const amount = 0.28 + 0.95 * wave * wave * wave * swell;
    const hue = 0.5 + 0.5 * Math.sin(time * 0.35 + bundle.phi[index] * 2 + bundle.seed[index] * 0.8);
    return [amount, hue];
  };

  const writeSlot = (slot: number, time: number) => {
    for (let i = 0; i < bundle.count; i++) {
      const [amount, hue] = emission(time, i);
      const at = (i * RING + slot) * 4;
      bundle.ring[at] = amount;
      bundle.ring[at + 1] = amount * hue;
      bundle.ring[at + 2] = 0;
      bundle.ring[at + 3] = 0;
    }
  };

  const fill = () => {
    const rate = Math.max(flowRate(), 0.01) * SLOTS;
    const newest = Math.floor(head);
    for (let m = 0; m < RING; m++) writeSlot(wrap(newest - m, RING), clock - m / rate);
    bundle.texture.needsUpdate = true;
  };

  const aim = (): Camera => {
    const tilt = (3 * Math.PI) / 180;
    const w = width * pixelRatio;
    const h = height * pixelRatio;
    const lookY = TOP * 0.42;
    const position: [number, number, number] = [0, lookY + DISTANCE * Math.sin(tilt), DISTANCE * Math.cos(tilt)];
    const up: [number, number, number] = [0, Math.cos(tilt), -Math.sin(tilt)];
    const forward: [number, number, number] = [0, -Math.sin(tilt), -Math.cos(tilt)];
    const focal = placement.scale * 0.82 * h * DISTANCE;
    const dy = -position[1];
    const dz = -position[2];
    const vy = dy * up[1] + dz * up[2];
    const vz = dy * forward[1] + dz * forward[2];
    const principal: [number, number] = [placement.centerX * w, (1 - placement.baseY) * h - (focal * vy) / vz];
    return { position, up, forward, focal, principal };
  };

  const profileAt = (h: number) => {
    const rho = WAIST * 0.6;
    return (
      placement.radial *
      (WAIST * (1 + 0.16 * Math.exp(-Math.max(0, h - rho) / 0.07)) +
        FLARE * 0.55 * TOP * Math.pow(Math.max(0, (h - 0.12 * TOP) / (0.88 * TOP)), 2.45))
    );
  };

  const project = (x: number, y: number, z: number) => {
    const d = [x - camera3.position[0], y - camera3.position[1], z - camera3.position[2]];
    const vy = d[0] * camera3.up[0] + d[1] * camera3.up[1] + d[2] * camera3.up[2];
    const vz = d[0] * camera3.forward[0] + d[1] * camera3.forward[1] + d[2] * camera3.forward[2];
    const sx = camera3.principal[0] + (camera3.focal * d[0]) / Math.max(vz, 0.05);
    const sy = camera3.principal[1] + (camera3.focal * vy) / Math.max(vz, 0.05);
    return { x: sx / pixelRatio, y: height - sy / pixelRatio };
  };

  const toWorld = (clientX: number, clientY: number) => {
    const rect = root.getBoundingClientRect();
    const px = (clientX - rect.left) * pixelRatio;
    const py = (rect.height - (clientY - rect.top)) * pixelRatio;
    const vx = (px - camera3.principal[0]) / camera3.focal;
    const vy = (py - camera3.principal[1]) / camera3.focal;
    const dy = camera3.up[1] * vy + camera3.forward[1];
    const dz = camera3.up[2] * vy + camera3.forward[2];
    if (dz > -1e-4) return null;
    const t = -camera3.position[2] / dz;
    return { x: camera3.position[0] + t * vx, y: camera3.position[1] + t * dy };
  };

  const layout = () => {
    wide = width >= 1024;
    const reachTop = () => {
      for (let k = 0; k < 3; k++) {
        camera3 = aim();
        const top = project(0, 0.985, 0).y;
        const ground = placement.baseY * height;
        placement.scale *= ground / Math.max(ground - top, 1);
      }
    };
    if (wide) {
      const rootBox = root.getBoundingClientRect();
      const box = copy.getBoundingClientRect();
      const right = box.right - rootBox.left + 28;
      const upper = box.top - rootBox.top - 24;
      const bottom = box.bottom - rootBox.top + 20;
      const label = (rows[0]?.lastElementChild as HTMLElement | null)?.offsetWidth || 224;
      const rail = content.getBoundingClientRect().right - rootBox.left - label - 48;
      const clear = () => {
        camera3 = aim();
        for (let k = 0; k <= 32; k++) {
          const level = 0.1 + (0.9 * k) / 32;
          const edge = project(-profileAt(level), level, 0);
          if (edge.y > upper && edge.y < bottom && edge.x < right) return false;
        }
        return true;
      };
      const roomy = () => project(profileAt(FUNNEL_STEPS[0].height), FUNNEL_STEPS[0].height, 0).x <= rail;
      placement.baseY = 0.88;
      placement.scale = 1;
      reachTop();
      let placed = false;
      for (let radial = 1; radial > 0.4 && !placed; radial -= 0.025) {
        placement.radial = radial;
        for (let center = 0.5; center <= 0.74; center += 0.005) {
          placement.centerX = center;
          if (clear()) {
            placed = roomy();
            break;
          }
        }
      }
      if (!placed) {
        placement.radial = 0.4;
        placement.centerX = 0.5;
        while (!clear() && placement.centerX < 0.74) placement.centerX += 0.005;
      }
    } else {
      const top = band.getBoundingClientRect().top - root.getBoundingClientRect().top;
      const span = Math.max(band.offsetHeight, 160);
      placement.centerX = 0.5;
      placement.baseY = (top + span * 0.94) / height;
      placement.scale = 1;
      placement.radial = 1;
      reachTop();
    }
    camera3 = aim();
    const rootRect = root.getBoundingClientRect();
    const inset = Math.max(0, rootRect.right - content.getBoundingClientRect().right);
    rows.forEach((row, index) => {
      if (!row) return;
      if (!wide) {
        row.style.left = "";
        row.style.top = "";
        row.style.right = "";
        return;
      }
      const step = FUNNEL_STEPS[index];
      const edge = project(profileAt(step.height) * 1.04, step.height, 0);
      row.style.left = `${Math.round(edge.x + 14)}px`;
      row.style.top = `${Math.round(edge.y)}px`;
      row.style.right = `${Math.round(inset)}px`;
    });
  };

  const track = (dt: number) => {
    let goal = 0;
    if (pointer.inside && !reduced) {
      const point = toWorld(pointer.x, pointer.y);
      if (point) {
        const reach = profileAt(clamp(point.y, 0.05, TOP)) * 1.2 + 0.05;
        const near = 1 - smooth(reach, reach + 0.3, Math.abs(point.x));
        const within = smooth(-0.02, 0.1, point.y) * (1 - smooth(TOP * 0.82, TOP * 1.02, point.y));
        goal = 0.15 * near * within;
        hover.goal = clamp(point.y, 0.1, TOP * 0.95);
        if (near * within > 0.5) {
          let best = 0;
          FUNNEL_STEPS.forEach((step, index) => {
            if (Math.abs(step.height - point.y) < Math.abs(FUNNEL_STEPS[best].height - point.y)) best = index;
          });
          if (best !== reported) {
            reported = best;
            onFocus(best);
          }
        }
      }
    }
    if (hover.amount < 0.004 && goal > 0) {
      hover.height = hover.goal;
      hover.velocity = 0;
    }
    const omega = 4.5;
    hover.velocity += (omega * omega * (hover.goal - hover.height) - 2 * omega * hover.velocity) * dt;
    hover.height += hover.velocity * dt;
    hover.amount += (goal - hover.amount) * (1 - Math.exp(-dt / 0.5));
    const ease = reduced ? 1 : 1 - Math.exp(-dt / 0.28);
    focusAmount.x *= 1 - ease;
    focusAmount.y += ((focused === 1 ? 1 : 0) - focusAmount.y) * ease;
    focusAmount.z += ((focused === 2 ? 1 : 0) - focusAmount.z) * ease;
    focusAmount.w += ((focused === 3 ? 1 : 0) - focusAmount.w) * ease;
  };

  const swell = () => {
    if (reduced) return;
    boostVelocity += 2.5;
    swellSlot = (swellSlot + 1) % SWELLS;
    swells[swellSlot].set(TOP * 0.92, waveClock, 0.13, 0);
    wake();
  };

  const disturbed = () => hover.amount > 1e-3 || swells.some((item) => item.z > 0 && waveClock - item.y < 7);

  const settled = () =>
    Math.abs(focusAmount.y - (focused === 1 ? 1 : 0)) < 0.002 &&
    Math.abs(focusAmount.z - (focused === 2 ? 1 : 0)) < 0.002 &&
    Math.abs(focusAmount.w - (focused === 3 ? 1 : 0)) < 0.002;

  const syncColors = () => {
    if (!probe) return false;
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "#0a0a0a";
    probe.fillStyle = view.getComputedStyle(root).backgroundColor;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    const key = `${r},${g},${b}`;
    if (key === colorKey) return false;
    colorKey = key;
    ink = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5;
    compositeMaterial.uniforms.uBackground.value.set(toLinear(r / 255), toLinear(g / 255), toLinear(b / 255));
    return true;
  };

  const apply = () => {
    const w = width * pixelRatio;
    const h = height * pixelRatio;
    const common = sharedUniforms;
    common.uResolution.value.set(w, h);
    common.uPrincipal.value.set(camera3.principal[0], camera3.principal[1]);
    common.uFocal.value = camera3.focal;
    common.uCamPos.value.set(...camera3.position);
    common.uCamUp.value.set(...camera3.up);
    common.uCamFwd.value.set(...camera3.forward);
    common.uSpinPhase.value = spinPhase;
    common.uPixelRatio.value = pixelRatio;
    common.uRadial.value = placement.radial;
    common.uEnergy.value = energy;
    common.uInk.value = ink ? 1 : 0;
    common.uWaveTime.value = waveClock;
    common.uActive.value = disturbed() ? 1 : 0;
    common.uHover.value.set(hover.height, hover.amount, 0.17);
    strandMaterial.uniforms.uHead.value = wrap(head, RING);
    dustMaterial.uniforms.uFlow.value = flow;
    dustMaterial.uniforms.uTime.value = clock;
    const composite = compositeMaterial.uniforms;
    composite.uExposure.value = (ink ? 1.7 : 0.525) * (1 + energy * 0.1 + boost * 0.12);
    composite.uMode.value = ink ? 1 : 0;
    composite.uGrain.value = grain;
  };

  const render = () => {
    if (!lineTarget || !downTargets.length) return;
    apply();
    renderer.setRenderTarget(lineTarget);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(lightScene, camera);
    let source = lineTarget;
    for (const item of downTargets) {
      downMaterial.uniforms.uSource.value = source.texture;
      downMaterial.uniforms.uTexel.value.set(1 / source.width, 1 / source.height);
      draw(downMaterial, item);
      source = item;
    }
    let accumulated = downTargets[downTargets.length - 1];
    for (let k = downTargets.length - 2; k >= 0; k--) {
      upMaterial.uniforms.uSource.value = accumulated.texture;
      upMaterial.uniforms.uBase.value = downTargets[k].texture;
      upMaterial.uniforms.uTexel.value.set(1 / accumulated.width, 1 / accumulated.height);
      draw(upMaterial, upTargets[k]);
      accumulated = upTargets[k];
    }
    compositeMaterial.uniforms.uLines.value = lineTarget.texture;
    compositeMaterial.uniforms.uBloom.value = accumulated.texture;
    draw(compositeMaterial, null);
  };

  const step = (dt: number) => {
    energy += ((pointer.inside && !reduced ? 0.5 : 0) - energy) * (1 - Math.exp(-dt / 0.45));
    boostVelocity += (-boost * 18 - boostVelocity * 6.5) * dt;
    boost = Math.max(-0.5, boost + boostVelocity * dt);
    track(dt);
    if (reduced) return;
    waveClock += dt;
    const before = clock;
    const start = head;
    clock += dt;
    spinPhase += dt * 0.12 * (1 + boost * 0.6);
    const rate = flowRate();
    head += rate * SLOTS * dt;
    flow += rate * dt;
    for (let k = Math.floor(start) + 1; k <= Math.floor(head); k++) {
      const time = before + ((k - start) / Math.max(head - start, 1e-6)) * (clock - before);
      writeSlot(wrap(k, RING), time);
    }
    bundle.texture.needsUpdate = true;
    grain = (grain + 0.618034) % 1;
  };

  const tick = (now: number) => {
    raf = 0;
    if (destroyed) return;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    step(dt);
    render();
    const settling = Math.abs(boost) > 0.002 || !settled() || hover.amount > 0.002;
    if (visible && !doc.hidden && (!reduced || settling)) raf = view.requestAnimationFrame(tick);
  };

  function wake() {
    if (destroyed || raf || !visible) return;
    last = view.performance.now();
    raf = view.requestAnimationFrame(tick);
  }

  const resize = () => {
    const rect = root.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    pixelRatio = Math.min(view.devicePixelRatio || 1, q.maxDpr);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    const w = Math.round(width * pixelRatio);
    const h = Math.round(height * pixelRatio);
    release();
    lineTarget = target(w, h);
    const levels = clamp(Math.floor(Math.log2(Math.min(w, h) / 8)), 3, q.bloomLevelsCap);
    for (let k = 1; k <= levels; k++) {
      downTargets.push(target(Math.max(1, w >> k), Math.max(1, h >> k)));
      upTargets.push(target(Math.max(1, w >> k), Math.max(1, h >> k)));
    }
    layout();
    render();
    wake();
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (!pointer.inside) {
      pointer.inside = true;
      wake();
    }
  };

  const onLeave = () => {
    pointer.inside = false;
    wake();
  };

  const onDown = (event: PointerEvent) => {
    if (event.button !== 0 || (event.target as Element | null)?.closest?.("a,button,[data-funnel-step]"))
      return;
    swell();
  };

  const refresh = () => {
    if (syncColors() && !raf) render();
  };

  const onMotion = () => {
    reduced = motionQuery.matches;
    fill();
    wake();
  };

  const onVisibility = () => {
    if (!doc.hidden) wake();
  };

  const onLost = (event: Event) => event.preventDefault();

  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerleave", onLeave);
  root.addEventListener("pointercancel", onLeave);
  root.addEventListener("pointerdown", onDown);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  resizeObserver.observe(band);
  resizeObserver.observe(copy);
  const intersection = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) wake();
    },
    { rootMargin: "80px" },
  );
  intersection.observe(root);
  const themes = new MutationObserver(refresh);
  themes.observe(doc.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
  const scheme = view.matchMedia("(prefers-color-scheme: dark)");
  scheme.addEventListener("change", refresh);
  motionQuery.addEventListener("change", onMotion);
  doc.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onLost);
  syncColors();
  fill();
  resize();

  return {
    focus: (index: number) => {
      focused = index;
      reported = index;
      wake();
    },
    destroy: () => {
      destroyed = true;
      view.cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointercancel", onLeave);
      root.removeEventListener("pointerdown", onDown);
      scheme.removeEventListener("change", refresh);
      motionQuery.removeEventListener("change", onMotion);
      doc.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      themes.disconnect();
      resizeObserver.disconnect();
      intersection.disconnect();
      release();
      bundle.geometry.dispose();
      bundle.texture.dispose();
      dustGeometry.dispose();
      curveTexture.dispose();
      tableTexture.dispose();
      plane.dispose();
      [strandMaterial, dustMaterial, downMaterial, upMaterial, compositeMaterial].forEach((item) => item.dispose());
      renderer.dispose();
      canvas.remove();
    },
  };
}
