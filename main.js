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

let dataLoaded = false;

let world;
let dynamicBodies = [];

let worldClass;
let playerClass;
let ballClass;

let ball;

let playerTop;
let eventQueue;

let powerBlock = document.querySelector('.power_block');
let powerWrap = document.querySelector('.power_wrap');



function initClases() {
  worldClass = new World();
  ballClass = new Ball(scene);
  playerClass = new Player(scene, ballClass.ball);
}



function initScenes() {
  scene.add(worldClass.ambientLight);
  scene.add(worldClass.dirLight);
  //scene.add(worldClass.hemiLight);

  scene.add(worldClass.plane);
  scene.add(worldClass.plane2);
  scene.add(ballClass.ball);
  scene.add(ballClass.ballMark);
  scene.add(playerClass.player);
  scene.add(playerClass.playerTop);
}



async function loadWorld() {
  await RAPIER.init();
  world = new RAPIER.World(new RAPIER.Vector3(0, -9.81, 0));
  eventQueue = new RAPIER.EventQueue(true);

  addPhysicsToObject(playerClass.playerTop, 'player');
  addPhysicsToObject(ballClass.ball, 'ball');
  addPhysicsToObject(worldClass.plane, 'plane');
  addPhysicsToObject(worldClass.plane2, 'plane2');
  addPhysicsToObject(worldClass.plane3, 'plane3');
  addPhysicsToObject(worldClass.plane4, 'plane4');
  addPhysicsToObject(worldClass.plane5, 'plane5');
}



async function init() {
  initClases();
  initScenes();
  await loadWorld();

  dataLoaded = true;
}

init();


function playerTapPas() {

  

  // if (playerClass.left) {
  //   // playerTop.setNextKinematicRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 })
  //   //playerTop.setNextKinematicRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.3 })
  //   //ball.applyImpulse({ x: -0.2, y: 1.0, z: 0.0 }, true);
  //   //playerClass.player.position.y += 0.1;
  //   ball.applyImpulse({ x: -0.2, y: 1.0, z: 0.0 }, true);
  // }
  // else {
  //   playerClass.player.position.y = 0.5;
  //   playerTop.setNextKinematicRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 })
  // }


  // if (worldClass.powerBlockWidth < powerWrap.offsetWidth) {
  //   worldClass.powerBlockWidth += 4;
  //   powerBlock.style.width = worldClass.powerBlockWidth + '%'
  // }
  // else {
  //   playerClass.playerTapPass = false;
  //   playerClass.playerNowPas = true;
  // }
}


function animate() {
  //playerClass.movePlayer(playerClass.player);

  if (dataLoaded) {

    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (handle1 == ball.handle) {
      }
  
    })

    

    // if (playerClass.playerTapPas) {
    //   playerTapPas();
    // }
    // else {
    //   powerBlock.style.width = 0;
    //   worldClass.powerBlockWidth = 0;
    // }

    // console.log(playerClass.playerNowPas);

    // if (playerClass.playerNowPas) {
    //   playerClass.playerNowPas = false;
    // }

    //console.log(ball.linvel());

    if (playerClass.playerTop.position.distanceTo(ballClass.ball.position) < 0.6) {

      if (playerClass.playerTapPas && (playerClass.left || playerClass.right || playerClass.forward || playerClass.backward)) {
        ball.applyImpulse({ x: 0.0, y: 0.9, z: 0.0 }, true);


        const ballPosition = ball.translation();
        const ballVelocity = ball.linvel(); // Предполагаем, что у вас есть метод для получения скорости мяча

        const gravity = -9.81; // Ускорение свободного падения
        const timeOfFlight = (2.5 * ballVelocity.y) / -gravity; // Время полета до приземления

        const landingPoint = {
          x: ballPosition.x + ballVelocity.x * timeOfFlight,
          y: 0.1, // Предполагаем, что земля на уровне Y = 0
          z: ballPosition.z + ballVelocity.z * timeOfFlight
        };

        //if (ball.linvel().y > -0.9) 
        ballClass.ballMark.position.set(landingPoint.x, landingPoint.y, landingPoint.z);


      }
      else {
        ball.setTranslation({ x: playerClass.player.position.x, y: playerClass.player.position.y+0.8, z: playerClass.player.position.z }, true);
        ball.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
        ball.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);

      }
      
      if (playerClass.left && playerClass.playerTapPas) {
        ball.applyImpulse({ x: -0.4, y: 0.0, z: 0.0 }, true);
      }
      if (playerClass.right && playerClass.playerTapPas) {
        ball.applyImpulse({ x: 0.4, y: 0.0, z: 0.0 }, true);
      }
      if (playerClass.forward && playerClass.playerTapPas) {
        ball.applyImpulse({ x: 0.0, y: 0.0, z: -0.4 }, true);
      }
      if (playerClass.backward && playerClass.playerTapPas) {
        ball.applyImpulse({ x: 0.0, y: 0.0, z: 0.4 }, true);
      }
      
    };

    playerTop.setNextKinematicTranslation({ x: playerClass.player.position.x, y: playerClass.player.position.y + 0.7, z: playerClass.player.position.z }, true)

    playerClass.movePlayer(playerClass.player);

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
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.x / 2, size.x / 2).setMass(1).setRestitution(0.5).setFriction(0);
    shape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    playerTop = body;

    let playerTopCollider = world.createCollider(shape, body)

    dynamicBodies.push([obj, body, obj.id])
  }

  else if (body == 'ball') {
    const bodyBall = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(2.0));
    const shapeBall = RAPIER.ColliderDesc.ball(size.z / 2).setMass(1).setRestitution(1).setFriction(0);
    shapeBall.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    ball = bodyBall;
    world.createCollider(shapeBall, bodyBall)

    dynamicBodies.push([obj, bodyBall, obj.id])
  }

  else if (body.includes('plane') ) {
    
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(2.0));
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(1).setRestitution(1).setFriction(0);

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