import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById('lunarCanvas') as HTMLCanvasElement;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/assets/textures/moon-crater.jpg');

const geometry = new THREE.SphereGeometry(1.5, 64, 64);
const material = new THREE.MeshStandardMaterial({ map: texture });
const moon = new THREE.Mesh(geometry, material);
scene.add(moon);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5).normalize();
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);

function animate(): void {
  requestAnimationFrame(animate);
  moon.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}

animate();
