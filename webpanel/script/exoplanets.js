import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('exoCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./assets/textures/exoplanet_map.jpg');

const geometry = new THREE.SphereGeometry(1.5, 64, 64);
const material = new THREE.MeshStandardMaterial({ map: texture });
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-5, 5, 5).normalize();
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  planet.rotation.y += 0.002;
  controls.update();
  renderer.render(scene, camera);
}

animate();
