import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { FontLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js";

// ─── F1 3D Hero Scene ───────────────────────────────────────────────
// A stylized Formula 1 car built from primitive geometry, sitting on a
// reflective track. Lightweight, dependency-free (Three.js only), and
// GitHub-Pages friendly via CDN import maps.

const RACING_RED = 0xe10600;
const CARBON = 0x10131a;

const canvas = document.getElementById("hero-canvas");
const wrap = document.getElementById("hero-3d");

let renderer, scene, camera, car, logo, raf;
let pointer = { x: 0, y: 0 };
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function makeRenderer() {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  resize();
}

function makeScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070b, 0.045);

  camera = new THREE.PerspectiveCamera(38, aspect(), 0.1, 100);
  camera.position.set(5.2, 2.4, 6.4);
  camera.lookAt(0, 0.4, 0);

  // Lighting — cool ambient + warm key + red rim for drama
  scene.add(new THREE.HemisphereLight(0x9fb6ff, 0x05070b, 0.65));

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(6, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -8;
  scene.add(key);

  const rim = new THREE.PointLight(RACING_RED, 60, 22);
  rim.position.set(-5, 2.5, -4);
  scene.add(rim);

  const fill = new THREE.PointLight(0x3b82f6, 24, 20);
  fill.position.set(5, 1.5, -5);
  scene.add(fill);

  buildTrack();
  car = buildCar();
  scene.add(car);
  buildLogo(car);
}

// 3D "VT" monogram mounted on the nose of the car. Loads a typeface from
// the Three.js CDN; falls back silently if it can't load.
function buildLogo(group) {
  const loader = new FontLoader();
  loader.load(
    "https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json",
    (font) => {
      const textGeo = new TextGeometry("VT", {
        font,
        size: 0.55,
        height: 0.12,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.015,
        bevelSegments: 2,
      });
      textGeo.computeBoundingBox();
      const bb = textGeo.boundingBox;
      textGeo.translate(
        -(bb.max.x + bb.min.x) / 2,
        -(bb.max.y + bb.min.y) / 2,
        0
      );

      const logoMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.2,
        emissive: RACING_RED,
        emissiveIntensity: 0.25,
      });
      logo = new THREE.Mesh(textGeo, logoMat);
      logo.castShadow = true;

      // Backing plaque so the monogram reads against the bodywork.
      const plaque = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.85, 0.06),
        new THREE.MeshStandardMaterial({ color: CARBON, roughness: 0.4, metalness: 0.6 })
      );
      const badge = new THREE.Group();
      badge.add(plaque);
      logo.position.z = 0.05;
      badge.add(logo);

      // Stand it upright on the nose, facing forward (+Z).
      badge.position.set(0, 0.45, 2.35);
      badge.rotation.x = -0.18;
      badge.scale.setScalar(0.62);
      group.add(badge);
    },
    undefined,
    (err) => console.warn("Logo font failed to load:", err)
  );
}

function buildTrack() {
  const groundGeo = new THREE.PlaneGeometry(60, 60);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x07090d,
    roughness: 0.55,
    metalness: 0.35,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.55;
  ground.receiveShadow = true;
  scene.add(ground);

  // Center racing line + side kerb stripes
  const lineMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x222222,
    roughness: 0.4,
  });
  for (let i = -6; i <= 6; i++) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 1.1), lineMat);
    dash.position.set(0, -0.54, i * 2.4);
    scene.add(dash);
  }

  const kerbMatA = new THREE.MeshStandardMaterial({ color: RACING_RED, roughness: 0.5 });
  const kerbMatB = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.5 });
  for (const side of [-4.2, 4.2]) {
    for (let i = -8; i <= 8; i++) {
      const kerb = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.04, 0.7),
        i % 2 === 0 ? kerbMatA : kerbMatB
      );
      kerb.position.set(side, -0.53, i * 0.7);
      scene.add(kerb);
    }
  }

  // Subtle grid glow behind the car
  const grid = new THREE.GridHelper(60, 60, 0x1b2433, 0x10151d);
  grid.position.y = -0.545;
  scene.add(grid);
}

function buildCar() {
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: RACING_RED,
    roughness: 0.32,
    metalness: 0.55,
  });
  const carbonMat = new THREE.MeshStandardMaterial({
    color: CARBON,
    roughness: 0.5,
    metalness: 0.7,
  });
  const tyreMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.85 });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xcfd6e0,
    roughness: 0.25,
    metalness: 0.9,
  });

  // Main monocoque / chassis
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.42, 4.4), bodyMat);
  chassis.position.y = 0.1;
  chassis.castShadow = true;
  g.add(chassis);

  // Tapered nose
  const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.34, 1.7, 16), bodyMat);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 0.05, 2.85);
  nose.castShadow = true;
  g.add(nose);

  // Engine cover / airbox
  const airbox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 1.2), bodyMat);
  airbox.position.set(0, 0.42, -0.7);
  airbox.castShadow = true;
  g.add(airbox);

  // Cockpit + halo
  const cockpit = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.9, 16), carbonMat);
  cockpit.rotation.x = Math.PI / 2;
  cockpit.position.set(0, 0.34, 0.5);
  g.add(cockpit);

  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 12, 24, Math.PI), carbonMat);
  halo.position.set(0, 0.6, 0.55);
  halo.rotation.x = Math.PI / 2;
  g.add(halo);
  const haloStem = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.4), carbonMat);
  haloStem.position.set(0, 0.62, 1.0);
  g.add(haloStem);

  // Sidepods
  for (const x of [-0.72, 0.72]) {
    const pod = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 1.8), bodyMat);
    pod.position.set(x, 0.05, -0.2);
    pod.castShadow = true;
    g.add(pod);
  }

  // Front wing
  const frontWing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 0.7), carbonMat);
  frontWing.position.set(0, -0.18, 3.4);
  frontWing.castShadow = true;
  g.add(frontWing);
  for (const x of [-1.2, 1.2]) {
    const endplate = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.7), bodyMat);
    endplate.position.set(x, 0.0, 3.4);
    g.add(endplate);
  }

  // Rear wing
  const rearWing = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 0.18), carbonMat);
  rearWing.position.set(0, 0.62, -2.5);
  rearWing.castShadow = true;
  g.add(rearWing);
  for (const x of [-0.95, 0.95]) {
    const rp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.6), bodyMat);
    rp.position.set(x, 0.45, -2.4);
    g.add(rp);
  }
  // DRS light strip (rear)
  const tail = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.12, 0.08),
    new THREE.MeshStandardMaterial({ color: RACING_RED, emissive: RACING_RED, emissiveIntensity: 2 })
  );
  tail.position.set(0, 0.45, -2.62);
  g.add(tail);

  // Wheels
  const wheelPositions = [
    [-1.05, -0.18, 2.2],
    [1.05, -0.18, 2.2],
    [-1.05, -0.18, -1.9],
    [1.05, -0.18, -1.9],
  ];
  car_wheels.length = 0;
  for (const [x, y, z] of wheelPositions) {
    const wheel = new THREE.Group();
    const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.42, 28), tyreMat);
    tyre.rotation.z = Math.PI / 2;
    tyre.castShadow = true;
    const rimDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.44, 16), rimMat);
    rimDisc.rotation.z = Math.PI / 2;
    wheel.add(tyre, rimDisc);
    wheel.position.set(x, y, z);
    car_wheels.push(wheel);
    g.add(wheel);
  }

  g.position.y = 0.2;
  g.rotation.y = -0.5;
  return g;
}

const car_wheels = [];

function aspect() {
  return wrap.clientWidth / wrap.clientHeight;
}

function resize() {
  const w = wrap.clientWidth;
  const h = wrap.clientHeight;
  renderer.setSize(w, h, false);
  if (camera) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}

function animate() {
  raf = requestAnimationFrame(animate);
  const t = performance.now() * 0.001;

  if (car) {
    if (prefersReducedMotion) {
      car.rotation.y = -0.5;
    } else {
      car.rotation.y = -0.5 + Math.sin(t * 0.35) * 0.35 + pointer.x * 0.25;
      car.position.y = 0.2 + Math.sin(t * 1.2) * 0.02;
    }
    for (const w of car_wheels) w.rotation.x = t * 6;
  }

  // Gentle parallax of the camera toward the pointer
  const targetX = 5.2 + pointer.x * 1.2;
  const targetY = 2.4 - pointer.y * 0.8;
  camera.position.x += (targetX - camera.position.x) * 0.05;
  camera.position.y += (targetY - camera.position.y) * 0.05;
  camera.lookAt(0, 0.4, 0);

  renderer.render(scene, camera);
}

function onPointerMove(e) {
  const r = wrap.getBoundingClientRect();
  pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
}

function init() {
  if (!canvas || !wrap) return;
  try {
    makeRenderer();
    makeScene();
    window.addEventListener("resize", resize);
    wrap.addEventListener("pointermove", onPointerMove);
    animate();
    wrap.classList.add("is-ready");
  } catch (err) {
    console.error("3D scene failed to initialize:", err);
    wrap.classList.add("is-fallback");
  }
}

// Pause rendering when the hero is off-screen to save battery/GPU.
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        if (!raf) animate();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }
  },
  { threshold: 0.05 }
);

if (wrap) {
  init();
  io.observe(wrap);
}
