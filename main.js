// npx vite --host
// npm install vite-plugin-top-level-await --save-dev

// npm run build 
// npm run deploy 




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
  scene.add(playerClass.player2);
}

initClases();
initScenes();

let speed = 0.01; // Скорость движения объекта
let t = 0; // Параметр для движения по линии
const gravity = -0.002; // Ускорение свободного падения
const maxSpeed = 0.02; // Максимальная скорость
let isGoingUp = true; // Флаг для определения направления движения

function ballMoving() {
  if (
    !detectCollisionCubes(
      ballClass.ball,
      playerClass.playerMas[playerClass.currentPlayer]
    ) &&
    ballClass.ballFree
  ) {
    if (ballClass.ball.position.y > 0.5) ballClass.ball.position.y -= speed;
    ballClass.ballFree = true;
    ballClass.ballOnPlayer = false;
  } else {
    ballClass.ballFree = false;
    ballClass.ballOnPlayer = true;
  }

  if (playerClass.playerNowPas && ballClass.ballOnPlayer) {
    if (t <= 1) {
      const index = Math.floor(t * (playerClass.points.length - 1));
      const nextIndex = (index + 1) % playerClass.points.length;

      const point1 = playerClass.points[index];
      const point2 = playerClass.points[nextIndex];
      const localT = (t * (playerClass.points.length - 1)) % 1; // Нормализуем t для интерполяции между двумя точками

      ballClass.ball.position.set(
        THREE.MathUtils.lerp(point1.x, point2.x, localT),
        THREE.MathUtils.lerp(point1.y, point2.y, localT),
        THREE.MathUtils.lerp(point1.z, point2.z, localT)
      );

      t += speed;
    } else {
      playerClass.playerNowPas = false;
      ballClass.ballFree = true;
      t = 0;
    }
  }
}

function animate() {
  playerClass.movePlayer(playerClass.playerMas[playerClass.currentPlayer]);
  ballMoving();

  stats.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

/*///////////////////////////////////////////////////////////////////*/
