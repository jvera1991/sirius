// @polsia:user-owned — the immersive WebGL backdrop for the Sirius Cyber Security landing.
// A fixed, full-viewport "threat-intelligence globe": a node network sphere with traveling
// pulses along its connections, a soft cyan/teal atmosphere, ambient motes, and a twinkling
// starfield, composited through a bloom pass. Mirrors the production values of a cinematic
// SaaS hero (WebGL, glassmorphism content over a fixed scene, scroll-linked motion) but with a
// cybersecurity-native motif instead of a literal planet: no external 3D assets required.
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const CONFIG = {
  bgColor: '#03060d',
  nodeColor: '#39f2c4',
  lineColor: '#1c8f8f',
  pulseColor: '#eafffa',
  glowColor: '#3a5cff',
  // Was 2.6 — the glow's brightest point drifts behind body text as the page scrolls (this is a
  // fixed full-viewport background, not just a hero decoration), and at 2.6 it washed out text
  // wherever it passed underneath. Paired with the .cyber-scrim overlay below for a general fix.
  glowIntensity: 1.5,
  starColor: '#cfe4ff',
  starCount: 1300,
  moteColor: '#6ce9d6',
  moteCount: 220,
  sphereRadius: 2.05,
  arcCount: 16,
  autoRotateSpeed: 0.045,
};

/** Simplex-ish cheap noise for star twinkle timing, not spatial noise — a plain sine mix is enough. */
function twinkle(seed: number, t: number, speed: number) {
  return 0.55 + 0.45 * Math.sin(t * speed + seed * 6.283);
}

function hexToVec3(hex: string) {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

/** Dedupe the (non-indexed) vertex soup of an IcosahedronGeometry into unique anchor points. */
function uniqueVertices(geo: THREE.BufferGeometry): THREE.Vector3[] {
  const pos = geo.attributes.position;
  if (!pos) return [];
  const seen = new Map<string, THREE.Vector3>();
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    const key = `${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)}`;
    if (!seen.has(key)) seen.set(key, v);
  }
  return [...seen.values()];
}

export function CyberNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(CONFIG.bgColor);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );
    camera.position.set(0, 0, 7.4);

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(4, 6, 3);
    scene.add(dir);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // --- Node network sphere -------------------------------------------------
    const detailGeo = new THREE.IcosahedronGeometry(CONFIG.sphereRadius, 2);
    const wireGeo = new THREE.WireframeGeometry(detailGeo);
    const network = new THREE.LineSegments(
      wireGeo,
      new THREE.LineBasicMaterial({
        color: new THREE.Color(CONFIG.lineColor),
        transparent: true,
        opacity: 0.32,
      }),
    );
    worldGroup.add(network);

    const anchors = uniqueVertices(new THREE.IcosahedronGeometry(CONFIG.sphereRadius, 1));
    if (anchors.length === 0) {
      renderer.dispose();
      return;
    }
    const firstAnchor = anchors[0] as THREE.Vector3;
    const pickAnchor = () => anchors[Math.floor(Math.random() * anchors.length)] ?? firstAnchor;
    const nodePositions = new Float32Array(anchors.length * 3);
    anchors.forEach((v, i) => {
      nodePositions[i * 3] = v.x;
      nodePositions[i * 3 + 1] = v.y;
      nodePositions[i * 3 + 2] = v.z;
    });
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    const nodes = new THREE.Points(
      nodesGeo,
      new THREE.PointsMaterial({
        color: new THREE.Color(CONFIG.nodeColor),
        size: 0.075,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
      }),
    );
    worldGroup.add(nodes);

    // --- Traveling threat-detection arcs --------------------------------------
    type Arc = {
      curve: THREE.QuadraticBezierCurve3;
      phase: number;
      speed: number;
      mesh: THREE.Mesh;
    };
    const arcs: Arc[] = [];
    const pulseGeo = new THREE.SphereGeometry(0.035, 10, 10);
    const pulseMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(CONFIG.pulseColor) });
    for (let i = 0; i < CONFIG.arcCount; i++) {
      const a = pickAnchor();
      let b = pickAnchor();
      let guard = 0;
      while (a.distanceTo(b) < CONFIG.sphereRadius * 1.1 && guard < 8) {
        b = pickAnchor();
        guard++;
      }
      const mid = a
        .clone()
        .add(b)
        .normalize()
        .multiplyScalar(CONFIG.sphereRadius * 1.55);
      const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
      const points = curve.getPoints(48);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({
          color: new THREE.Color(CONFIG.nodeColor),
          transparent: true,
          opacity: 0.22,
        }),
      );
      worldGroup.add(line);
      const mesh = new THREE.Mesh(pulseGeo, pulseMat);
      worldGroup.add(mesh);
      arcs.push({ curve, phase: Math.random(), speed: 0.12 + Math.random() * 0.14, mesh });
    }

    // --- Radial glow halo (billboarded additive plane) ------------------------
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uGlow: { value: hexToVec3(CONFIG.glowColor) },
        uIntensity: { value: CONFIG.glowIntensity },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform vec3 uGlow; uniform float uIntensity; varying vec2 vUv;
        void main(){
          float d = length(vUv - 0.5) * 2.0;
          float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.2);
          gl_FragColor = vec4(uGlow * a * uIntensity, a);
        }`,
    });
    const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), glowMat);
    glowMesh.scale.setScalar(CONFIG.sphereRadius * 2.5);
    worldGroup.add(glowMesh);

    // --- Starfield -------------------------------------------------------------
    const starCount = CONFIG.starCount;
    const starPos = new Float32Array(starCount * 3);
    const starSeed = new Float32Array(starCount);
    const starBright = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const r = 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
      starSeed[i] = Math.random() * 100;
      starBright[i] = 0.3 + Math.random() * 0.7;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: new THREE.Color(CONFIG.starColor),
        size: 0.9,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.75,
      }),
    );
    scene.add(stars);

    // --- Ambient motes -----------------------------------------------------
    const moteCount = CONFIG.moteCount;
    const motePos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePos[i * 3] = (Math.random() - 0.5) * 14;
      motePos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      motePos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    const motes = new THREE.Points(
      moteGeo,
      new THREE.PointsMaterial({
        color: new THREE.Color(CONFIG.moteColor),
        size: 0.045,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(motes);

    // --- Composer (bloom) -------------------------------------------------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      // Strength 0.75 → 0.5: same reasoning as glowIntensity above — less overall bloom so text
      // stays readable wherever this fixed background happens to be brightest when it scrolls in.
      0.5,
      0.7,
      0.15,
    );
    composer.addPass(bloomPass);

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    }
    resize();
    window.addEventListener('resize', resize);

    // Respect the visitor's motion preference: render one static frame — the network,
    // glow and starfield still show — but skip autorotate, scroll-linked motion and the
    // traveling pulses.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      worldGroup.rotation.x = 0.15;
      composer.render();
      return () => {
        window.removeEventListener('resize', resize);
        composer.dispose();
        renderer.dispose();
      };
    }

    let raf = 0;
    let last = performance.now();
    let spin = 0;
    let dampedP = 0;
    const clock = { t: 0 };

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clock.t += dt;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pTarget = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
      dampedP += (pTarget - dampedP) * Math.min(1, dt * 3.2);

      spin += dt * CONFIG.autoRotateSpeed;
      worldGroup.rotation.y = spin + dampedP * Math.PI * 0.9;
      worldGroup.rotation.x = 0.15 + dampedP * 0.12;

      const targetScale = 1.08 - dampedP * 0.22;
      worldGroup.scale.setScalar(THREE.MathUtils.lerp(worldGroup.scale.x, targetScale, dt * 3));
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.4 + dampedP * 2.1, dt * 3);

      glowMesh.quaternion.copy(camera.quaternion);

      const starMat = stars.material as THREE.PointsMaterial;
      starMat.opacity = 0.6 + 0.15 * Math.sin(clock.t * 0.5);
      void twinkle; // reserved hook for future per-star twinkle if promoted to a custom shader

      for (const arc of arcs) {
        const t = (clock.t * arc.speed + arc.phase) % 1;
        const p = arc.curve.getPoint(t);
        arc.mesh.position.copy(p);
        const fade = Math.sin(t * Math.PI);
        (arc.mesh.material as THREE.MeshBasicMaterial).opacity = fade;
      }

      motes.rotation.y += dt * 0.02;

      composer.render();
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      composer.dispose();
      renderer.dispose();
      [detailGeo, wireGeo, nodesGeo, starGeo, moteGeo, pulseGeo].forEach((g) => {
        g.dispose();
      });
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => {
              m.dispose();
            });
          } else mat?.dispose();
        }
      });
    };
  }, []);

  return (
    <div aria-hidden="true">
      <canvas ref={canvasRef} className="cyber-canvas" />
      {/* Darkens the fixed scene a bit everywhere, not just behind the hero, so body text in
       * later sections stays legible as this background scrolls with the page. See
       * custom-style.css for the rule. */}
      <div className="cyber-scrim" />
    </div>
  );
}
