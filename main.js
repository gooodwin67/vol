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


import { detectCollisionCubes, getRandomNumber } from "./functions/functions";

import { Player } from "./player";
import { World } from "./world";
import { Ball } from "./ball";
import { Opponent } from './opponent';

console.clear();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdceef6);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 9, 9);

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

let dataLoaded = false;

let world;
let dynamicBodies = [];



let worldClass;
let playerClass;
let playerClass2;

let opponentClass;

let ballClass;

let ball;

let playerTopBody;
let opponentTopBody;
let eventQueue;


let powerBlock = document.querySelector('.power_block');
let powerWrap = document.querySelector('.power_wrap');



function initClases() {
  worldClass = new World();
  ballClass = new Ball(scene);
  playerClass = new Player(scene, ballClass, worldClass);
  playerClass2 = new Player(scene, ballClass, worldClass);
  opponentClass = new Opponent(scene, ballClass, worldClass);

  playerClass2.playerActive = false;
}



function initScenes() {
  scene.add(worldClass.ambientLight);
  scene.add(worldClass.dirLight);
  //scene.add(worldClass.hemiLight);

  scene.add(worldClass.plane);
  scene.add(worldClass.plane2);
  scene.add(worldClass.plane3);
  scene.add(worldClass.plane4);
  scene.add(worldClass.plane5);
  scene.add(worldClass.net);
  scene.add(ballClass.ball);
  scene.add(ballClass.ballMark);
  scene.add(ballClass.ballMarkOnGround);
  scene.add(playerClass.player);
  scene.add(playerClass2.player);

  scene.add(playerClass.playerTop);

  scene.add(opponentClass.opponent);
  scene.add(opponentClass.opponentTop);
}



async function loadWorld() {
  await RAPIER.init();
  world = new RAPIER.World(new RAPIER.Vector3(0, worldClass.gravity, 0));
  eventQueue = new RAPIER.EventQueue(true);

  addPhysicsToObject(playerClass.playerTop, 'player');
  addPhysicsToObject(opponentClass.opponentTop, 'opponent');
  addPhysicsToObject(ballClass.ball, 'ball');
  addPhysicsToObject(worldClass.plane, 'plane');
  // addPhysicsToObject(worldClass.plane2, 'plane2');
  // addPhysicsToObject(worldClass.plane3, 'plane3');
  // addPhysicsToObject(worldClass.plane4, 'plane4');
  // addPhysicsToObject(worldClass.plane5, 'plane5');
  addPhysicsToObject(worldClass.net, 'plane6');

  playerClass.players.push(playerClass.player, playerClass2.player)

  playerClass.player.position.x -= 2
  playerClass2.player.position.x += 2

  playerClass.player.position.z += 3
  playerClass2.player.position.z += 3

}



async function init() {
  initClases();
  initScenes();
  await loadWorld();

  dataLoaded = true;
}

init();


function engine() {
  if (ballClass.ball.position.z > 0) {
    ballClass.ballSideMe = true;
  }
  else ballClass.ballSideMe = false;



  let ballPlayerCollision = false;
  eventQueue.drainCollisionEvents((handle1, handle2, started) => {
    if (handle2 == ball.handle) {
      ballPlayerCollision = true;
    }
  })



  if (playerClass.playerTop.position.distanceTo(ballClass.ball.position) > 2) {
    playerClass.playerCanPas = true;
  }


  if (playerClass.playerCanPas && playerClass.playerTop.position.distanceTo(ballClass.ball.position) < 3.5 && ballPlayerCollision) {
    ball.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ball.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);

    playerClass.activePlayerNum == 0 ? playerClass.activePlayerNum = 1 : playerClass.activePlayerNum = 0;

    const ballPosition = ball.translation();
    const landingPoint = ballClass.ballMark.position;

    const deltaX = landingPoint.x - ballPosition.x;
    const deltaZ = landingPoint.z - ballPosition.z;

    // Константа, управляющая высотой полёта
    const heightFactor = 4; // Меняйте это значение, чтобы регулировать высоту
    // Время полёта (зависит от высоты)
    const timeOfFlight = Math.sqrt((2 * heightFactor) / Math.abs(worldClass.gravity));


    const speedFactor = 0.5; // уменьшите скорость на 20%
    const horizontalVelocityX = (deltaX / timeOfFlight) * speedFactor;
    const horizontalVelocityZ = (deltaZ / timeOfFlight) * speedFactor;

  // Вертикальная скорость (зависит от высоты)
  const verticalVelocityY = Math.sqrt(2 * Math.abs(worldClass.gravity) * heightFactor);

  // Импульс
  const impulse = {
    x: horizontalVelocityX,
    y: verticalVelocityY,
    z: horizontalVelocityZ
  };


    ballClass.ballMarkOnGround.position.copy(new THREE.Vector3(ballClass.ballMark.position.x, ballClass.ballMark.position.y, ballClass.ballMark.position.z))
    //ballClass.ballMarkOnGround.position.y;
    ball.applyImpulse(impulse, true);
    playerClass.playerCanPas = false;

  }






  if (opponentClass.opponentTop.position.distanceTo(ballClass.ball.position) < 0.9) {
    ball.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ball.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ball.applyImpulse({ x: getRandomNumber(-1, 1), y: 6.9, z: 2.5 }, true);



    const ballPosition = ball.translation();
    const ballVelocity = ball.linvel(); // Предполагаем, что у вас есть метод для получения скорости мяча

    const gravity = worldClass.gravity; // Ускорение свободного падения
    //const timeOfFlight = (2.5 * ballVelocity.y) / -gravity; // Время полета до приземления
    const timeOfFlight = (2.5 * ballVelocity.y) / -gravity; // Время полета до приземления

    const landingPoint = {
      x: ballPosition.x + ballVelocity.x * timeOfFlight,
      y: 0.1, // Предполагаем, что земля на уровне Y = 0
      z: ballPosition.z + ballVelocity.z * timeOfFlight
    };

    //if (ball.linvel().y > -0.9) 
    ballClass.ballMarkOnGround.position.set(landingPoint.x, landingPoint.y, landingPoint.z - 0.7);



    if (playerClass.players[0].position.distanceTo(ballClass.ballMarkOnGround.position) < playerClass.players[1].position.distanceTo(ballClass.ballMarkOnGround.position)) {
      playerClass.activePlayerNum = 0;
    }
    else {
      playerClass.activePlayerNum = 1;
    }

    ballClass.ballMark.position.copy(playerClass.players[playerClass.activePlayerNum].position)
    ballClass.ballMark.position.y = 0.1;

  }
  else {



  }




}


function animate() {
  //playerClass.movePlayer(playerClass.player);

  if (dataLoaded) {




    engine();

    playerClass.movePlayer(playerTopBody);
    opponentClass.moveOpponent(opponentTopBody);

    for (let i = 0, n = dynamicBodies.length; i < n; i++) {
      dynamicBodies[i][0].position.copy(dynamicBodies[i][1].translation())
      dynamicBodies[i][0].quaternion.copy(dynamicBodies[i][1].rotation())
    }


    world.step(eventQueue);
    stats.update();
    renderer.render(scene, camera);
  }
}
renderer.setAnimationLoop(animate);

/*///////////////////////////////////////////////////////////////////*/


function addPhysicsToObject(obj, body) {

  const originalRotation = obj.rotation.clone();
  obj.rotation.set(0, 0, 0);
  const box = new THREE.Box3().setFromObject(obj)
  const size = box.getSize(new THREE.Vector3());
  obj.rotation.copy(originalRotation);

  if (body == 'player') {
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(2.0));
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(1).setRestitution(0.5).setFriction(0);
    shape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    playerTopBody = body;

    let playerTopCollider = world.createCollider(shape, body)

    dynamicBodies.push([obj, body, obj.id])
  }

  else if (body == 'opponent') {
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(2.0));
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(1).setRestitution(0.5).setFriction(0);
    shape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    opponentTopBody = body;

    world.createCollider(shape, body)

    dynamicBodies.push([obj, body, obj.id])
  }

  else if (body == 'ball') {
    const bodyBall = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(2.0));
    const shapeBall = RAPIER.ColliderDesc.ball(size.z / 2).setMass(1).setRestitution(1).setFriction(0);
    shapeBall.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    ball = bodyBall;
    ballClass.ballBody = bodyBall;
    world.createCollider(shapeBall, bodyBall)

    dynamicBodies.push([obj, bodyBall, obj.id])
  }

  else if (body.includes('plane')) {

    const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(2.0));
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(1).setRestitution(0).setFriction(0);

    world.createCollider(shape, body)

    dynamicBodies.push([obj, body, obj.id])

    // const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.1 });
    // const cube = new THREE.Mesh(geometry, material);
    // cube.position.set(obj.position.x, obj.position.y, obj.position.z)
    // cube.rotation.copy(originalRotation);
    // scene.add(cube);
  }
}