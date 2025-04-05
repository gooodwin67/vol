// npx vite --host
// npm install vite-plugin-top-level-await --save-dev

// npm run build 
// npm run deploy 

////////////phys/////////


import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import RAPIER from '@dimforge/rapier3d-compat';


import { detectCollisionCubes } from "./functions/functions";

import { Player } from "./player";
import { World } from "./world";
import { Ball } from "./ball";

console.clear();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdceef6);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 6, 6);

let stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

/*//////////////////////////////////////////////////////////////////////////////////////////*/

let ambientLight;
let dirLight;

let worldClass;
let playerClass;
let ballClass;

function initClases() {
  worldClass = new World();
  ballClass = new Ball(scene);
  playerClass = new Player(scene, ballClass.ball);
}

function initScenes() {
  scene.add(worldClass.ambientLight);
  scene.add(worldClass.dirLight);

  scene.add(worldClass.plane);
  scene.add(ballClass.ball);
  scene.add(playerClass.player);
}

initClases();
initScenes();


function animate() {
  playerClass.movePlayer(playerClass.player);


  stats.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

/*///////////////////////////////////////////////////////////////////*/
