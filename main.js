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
import { PlayersData } from './players-data';
import { Engine } from './engine';

console.clear();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdceef6);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 9, 11);

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
let playersData;

let playerClass;

let opponentClass;
let opponentClass2;

let ballClass;

let ball;

let opponentTopBody;

let enginePlayers;



let powerBlock = document.querySelector('.power_block');
let powerWrap = document.querySelector('.power_wrap');



async function initClases() {
  worldClass = new World();
  playersData = new PlayersData();
  ballClass = new Ball(scene);

  opponentClass = new Opponent(scene, ballClass, worldClass);
  opponentClass2 = new Opponent(scene, ballClass, worldClass);

  let player1 = new Player(scene, ballClass, worldClass, playersData)
  player1.player.position.x -= 2;
  let player2 = new Player(scene, ballClass, worldClass, playersData)
  player2.player.position.x = 2;
  playersData.players.push(player1, player2)

  enginePlayers = new Engine(scene, ballClass, worldClass, playersData)

}



async function initScenes() {
  scene.add(worldClass.ambientLight);
  scene.add(worldClass.dirLight);
  //scene.add(worldClass.hemiLight);

  scene.add(worldClass.plane);

  scene.add(worldClass.net);
  scene.add(ballClass.ball);
  scene.add(ballClass.ballMark);
  scene.add(ballClass.ballMarkOnGround);
  scene.add(ballClass.ballMarkOppOnGround);

  scene.add(playersData.players[0].player);
  scene.add(playersData.players[1].player);

  scene.add(playersData.playerTop);

  scene.add(playersData.playerMark);
  scene.add(playersData.playerShootMark);

  scene.add(opponentClass.opponent);
  scene.add(opponentClass2.opponent);
  scene.add(opponentClass.opponentTop);
}



async function loadWorld() {
  await RAPIER.init();
  world = new RAPIER.World(new RAPIER.Vector3(0, worldClass.gravity, 0));
  worldClass.eventQueue = new RAPIER.EventQueue(true);


  opponentClass.opponents.push(opponentClass.opponent, opponentClass2.opponent)


  opponentClass.opponent.position.x -= 2
  opponentClass2.opponent.position.x += 2

  addPhysicsToObject(playersData.playerTop, 'player');
  playersData.players.forEach((value, index, array) => {
    addPhysicsToObject(value.player, 'playerMain');
  })

  addPhysicsToObject(opponentClass.opponentTop, 'opponent');
  addPhysicsToObject(ballClass.ball, 'ball');
  addPhysicsToObject(worldClass.plane, 'plane');

  addPhysicsToObject(worldClass.net, 'plane6');


}



async function init() {
  await initClases();
  await initScenes();
  await loadWorld();

  dataLoaded = true;
}

init();


function engine() {

  if (ballClass.ball.position.z > 0) {
    ballClass.ballSideMe = true;
  }
  else ballClass.ballSideMe = false;

  playersData.playerMark.position.x = playersData.players[playersData.activePlayerNum].player.position.x;
  playersData.playerMark.position.z = playersData.players[playersData.activePlayerNum].player.position.z;

  playersData.playerShootMark.position.x = playersData.players[playersData.activePlayerNum].player.position.x;
  playersData.playerShootMark.position.z = playersData.players[playersData.activePlayerNum].player.position.z;



  let ballPlayerCollision = false;
  worldClass.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
    if (handle2 == ball.handle && handle1 == 0) {
      ballPlayerCollision = true;
    }
  })



  if (playersData.playerTop.position.distanceTo(ballClass.ball.position) > 1) {
    playersData.playerCanPas = true;
  }


  if (playersData.playerCanPas && ballPlayerCollision && playersData.playerBodies[playersData.activePlayerNum].translation().y < 1) {
    ball.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ball.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);



    const ballPosition = ball.translation();
    const landingPoint = ballClass.ballMark.position;

    const deltaX = landingPoint.x - ballPosition.x;
    const deltaZ = landingPoint.z - ballPosition.z;

    // Константа, управляющая высотой полёта
    const heightFactor = 3; // Меняйте это значение, чтобы регулировать высоту
    // Время полёта (зависит от высоты)
    const timeOfFlight = Math.sqrt((2 * heightFactor) / Math.abs(worldClass.gravity));


    const speedFactor = 0.45; // уменьшите скорость на 20%
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


    ballClass.ballMarkOnGround.position.copy(new THREE.Vector3(ballClass.ballMark.position.x, ballClass.ballMark.position.y, ballClass.ballMark.position.z + 0.4))
    ball.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ball.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ball.applyImpulse(impulse, true);

    if (opponentClass.opponents[0].position.distanceTo(ballClass.ballMarkOnGround.position) < opponentClass.opponents[1].position.distanceTo(ballClass.ballMarkOnGround.position)) {
      opponentClass.activeOpponentNum = 0;
    }
    else {
      opponentClass.activeOpponentNum = 1;
    }


    if (playersData.players[0].player.position.distanceTo(ballClass.ball.position) > playersData.players[1].player.position.distanceTo(ballClass.ball.position)) {
      playersData.activePlayerNum = 0;
    }
    else {
      playersData.activePlayerNum = 1;
    }

    playersData.playerCanPas = false;




  }

  if (ballClass.ball.position.distanceTo(playersData.playerShootMark.position) < 2 && playersData.playerTapShoot && !playersData.playerFly) {
    playersData.playerBodies[playersData.activePlayerNum].applyImpulse({ x: 0, y: 5.2, z: 0 }, true)
  }
  if (playersData.playerBodies[playersData.activePlayerNum].translation().y >= playersData.playerHeight / 1.5) {
    playersData.playerFly = true;
  }
  if (playersData.playerBodies[playersData.activePlayerNum].translation().y < playersData.playerHeight / 1.5) {
    playersData.playerFly = false;
  }






  if (ballPlayerCollision && playersData.playerBodies[playersData.activePlayerNum].translation().y > 1) {
    ball.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ball.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);

    const ballPosition = ball.translation();
    const landingPoint = ballClass.ballMark.position;

    const deltaX = landingPoint.x - ballPosition.x;
    const deltaZ = landingPoint.z - ballPosition.z;
    const deltaY = landingPoint.y - ballPosition.y;

    // Константа, управляющая высотой полёта
    const heightFactor = 0.5 // Меняйте это значение, чтобы регулировать высоту
    // Время полёта (зависит от высоты)
    const timeOfFlight = Math.sqrt((2 * heightFactor) / Math.abs(worldClass.gravity));


    const speedFactor = 0.6; // уменьшите скорость на 20%
    const horizontalVelocityX = (deltaX / timeOfFlight) * speedFactor;
    const horizontalVelocityZ = (deltaZ / timeOfFlight) * speedFactor;
    const verticalVelocityY = (deltaY / timeOfFlight) * speedFactor;

    // Вертикальная скорость (зависит от высоты)
    //const verticalVelocityY = Math.sqrt(2 * Math.abs(worldClass.gravity) * heightFactor);

    // Импульс
    const impulse = {
      x: horizontalVelocityX,
      y: verticalVelocityY,
      z: horizontalVelocityZ
    };


    ballClass.ballMarkOnGround.position.copy(new THREE.Vector3(ballClass.ballMark.position.x, ballClass.ballMark.position.y, ballClass.ballMark.position.z + 0.4))
    ball.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ball.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ball.applyImpulse(impulse, true);

    if (opponentClass.opponents[0].position.distanceTo(ballClass.ballMarkOnGround.position) < opponentClass.opponents[1].position.distanceTo(ballClass.ballMarkOnGround.position)) {
      opponentClass.activeOpponentNum = 0;
    }
    else {
      opponentClass.activeOpponentNum = 1;
    }

  }






  /*
    if (opponentClass.opponentTop.position.distanceTo(ballClass.ball.position) < 0.9) {
      ball.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
      ball.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
  
  
      const ballPosition = ball.translation();
      const landingPoint = new THREE.Vector3(getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2), 0, getRandomNumber(4, worldClass.heightPlane / 2));
  
      const deltaX = landingPoint.x - ballPosition.x;
      const deltaZ = landingPoint.z - ballPosition.z;
  
      // Константа, управляющая высотой полёта
      const heightFactor = 3; // Меняйте это значение, чтобы регулировать высоту
      // Время полёта (зависит от высоты)
      const timeOfFlight = Math.sqrt((2 * heightFactor) / Math.abs(worldClass.gravity));
  
  
      const speedFactor = 0.45; // уменьшите скорость на 20%
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
  
      ballClass.ballMarkOppOnGround.position.copy(landingPoint);
      ballClass.ballMarkOppOnGround.position.y = 0.2;
      //ballClass.ballMarkOnGround.position.y;
      ball.applyImpulse(impulse, true);
  
  
      ////////////////////////////
      if (playerClass.players[0].position.distanceTo(ballClass.ballMarkOppOnGround.position) < playerClass.players[1].position.distanceTo(ballClass.ballMarkOppOnGround.position)) {
        playerClass.activePlayerNum = 0;
      }
      else {
        playerClass.activePlayerNum = 1;
      }
  
      ballClass.ballMark.position.copy(playerClass.players[playerClass.activePlayerNum].position)
      ballClass.ballMark.position.y = 0.1;
  
    }
  */



}


function animate() {
  //playerClass.movePlayer(playerClass.player);

  if (dataLoaded) {




    engine();

    enginePlayers.movePlayer();
    opponentClass.moveOpponent(opponentTopBody);

    for (let i = 0, n = dynamicBodies.length; i < n; i++) {
      dynamicBodies[i][0].position.copy(dynamicBodies[i][1].translation())
      dynamicBodies[i][0].quaternion.copy(dynamicBodies[i][1].rotation())
    }


    world.step(worldClass.eventQueue);
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
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(1).setRestitution(0.5).setFriction(0).setSensor(true);
    shape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    playersData.playerTopBody = body;

    let playerTopCollider = world.createCollider(shape, body)

    dynamicBodies.push([obj, body, obj.id])
  }

  if (body == 'playerMain') {
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(0.0));
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(10).setRestitution(0.5).setFriction(5);
    shape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    playersData.playerBodies.push(body);
    world.createCollider(shape, body)

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