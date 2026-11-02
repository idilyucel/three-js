import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e9e5de');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3.3, 2.55, 5.8);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 9;
controls.minPolarAngle = 0.35;
controls.maxPolarAngle = Math.PI * 0.48;
controls.target.set(0.18, 0.92, 0);

// One continuous lathed surface forms the cup's outside, rim, and inside.
const cupProfile = [
  new THREE.Vector2(0, 0.06),
  new THREE.Vector2(0.34, 0.06),
  new THREE.Vector2(0.43, 0.075),
  new THREE.Vector2(0.48, 0.13),
  new THREE.Vector2(0.53, 0.35),
  new THREE.Vector2(0.59, 0.72),
  new THREE.Vector2(0.64, 1.13),
  new THREE.Vector2(0.66, 1.34),
  new THREE.Vector2(0.65, 1.39),
  new THREE.Vector2(0.62, 1.415),
  new THREE.Vector2(0.59, 1.40),
  new THREE.Vector2(0.575, 1.35),
  new THREE.Vector2(0.555, 1.12),
  new THREE.Vector2(0.505, 0.73),
  new THREE.Vector2(0.455, 0.40),
  new THREE.Vector2(0.40, 0.27),
  new THREE.Vector2(0.32, 0.22),
  new THREE.Vector2(0, 0.22)
];

const ceramic = new THREE.MeshStandardMaterial({
  color: '#d97655',
  roughness: 0.23,
  metalness: 0.02
});
const cup = new THREE.Mesh(new THREE.LatheGeometry(cupProfile, 96), ceramic);
cup.castShadow = true;
cup.receiveShadow = true;
scene.add(cup);

// A smooth ceramic loop, attached to the right side of the cup.
const handleCurve = new THREE.CubicBezierCurve3(
  new THREE.Vector3(0.57, 1.13, 0),
  new THREE.Vector3(1.32, 1.28, 0),
  new THREE.Vector3(1.42, 0.23, 0),
  new THREE.Vector3(0.49, 0.38, 0)
);
const handle = new THREE.Mesh(
  new THREE.TubeGeometry(handleCurve, 80, 0.105, 20, false),
  ceramic
);
handle.castShadow = true;
handle.receiveShadow = true;
scene.add(handle);

scene.add(new THREE.HemisphereLight(0xfff8ee, 0x9a8c80, 2.0));

const keyLight = new THREE.DirectionalLight(0xfff2df, 3.2);
keyLight.position.set(-3.5, 6, 4);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 1.15);
fillLight.position.set(4, 3, -3);
scene.add(fillLight);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function tick() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
