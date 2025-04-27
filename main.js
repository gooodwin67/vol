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

  let opponent1 = new Opponent(scene, ballClass, worldClass, playersData);
  let opponent2 = new Opponent(scene, ballClass, worldClass, playersData);

  playersData.opponents.push(opponent1, opponent2)

  let player1 = new Player(scene, ballClass, worldClass, playersData, 0.07, 0.2) //speed, thinkSpeed
  player1.player.position.x -= 2;
  
  player1.previousPosition.copy(player1.player.position);
  let player2 = new Player(scene, ballClass, worldClass, playersData, 0.07, 0.2) //speed, thinkSpeed
  player2.player.position.x = 2;
  
  player2.previousPosition.copy(player2.player.position);
  playersData.players.push(player1, player2)

  console.log(111)

  enginePlayers = new Engine(scene, ballClass, worldClass, playersData)

  await playersData.players[0].loadPlayerModel();
  await playersData.players[1].loadPlayerModel();




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

  scene.add(playersData.players[0].player);
  scene.add(playersData.players[0].playerModel);
  playersData.players[0].playerModel.userData.animMas.idle.play();
  

  scene.add(playersData.players[1].player);
  scene.add(playersData.players[1].playerModel);
  playersData.players[1].playerModel.userData.animMas.idle.play();
  

  scene.add(playersData.playerTop);

  scene.add(playersData.playerMark);
  scene.add(playersData.playerShootMark);

  scene.add(playersData.opponents[0].opponent);
  scene.add(playersData.opponents[1].opponent);

  scene.add(playersData.opponentTop);

  scene.add(playersData.opponentShootMark);
}



async function loadPhysWorld() {
  await RAPIER.init();
  world = new RAPIER.World(new RAPIER.Vector3(0, worldClass.gravity, 0));
  worldClass.eventQueue = new RAPIER.EventQueue(true);




  addPhysicsToObject(playersData.playerTop, 'player');

  playersData.players.forEach((value, index, array) => {
    addPhysicsToObject(value.player, 'playerMain');
  })

  addPhysicsToObject(playersData.opponentTop, 'opponent');

  playersData.opponents.forEach((value, index, array) => {
    addPhysicsToObject(value.opponent, 'opponentMain');
  })
  addPhysicsToObject(ballClass.ball, 'ball');
  addPhysicsToObject(worldClass.plane, 'plane');

  addPhysicsToObject(worldClass.net, 'plane6');


}



async function init() {
  await initClases();
  await initScenes();
  await loadPhysWorld();

  dataLoaded = true;
}

init();




function animate() {

  
  if (dataLoaded) {
    
    enginePlayers.movePlayer();
    enginePlayers.moveOpponent();

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
    // shape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    playersData.playerTopBody = body;

    let playerTopCollider = world.createCollider(shape, body)

    dynamicBodies.push([obj, body, obj.id])
  }

  if (body == 'playerMain') {
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(0.0));
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(10).setRestitution(0.5).setFriction(5);
    // shape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    playersData.playerBodies.push(body);
    world.createCollider(shape, body)

    dynamicBodies.push([obj, body, obj.id])
  }

  else if (body == 'opponent') {
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(2.0));
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(1).setRestitution(0.5).setFriction(0).setSensor(true);
    // shape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    playersData.opponentTopBody = body;



    world.createCollider(shape, body)

    dynamicBodies.push([obj, body, obj.id])
  }

  if (body == 'opponentMain') {
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(0.0));
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(10).setRestitution(0.5).setFriction(5);
    // shape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    playersData.opponentBodies.push(body);
    world.createCollider(shape, body)

    dynamicBodies.push([obj, body, obj.id])
  }

  else if (body == 'ball') {
    const bodyBall = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(2.0));
    const shapeBall = RAPIER.ColliderDesc.ball(size.z / 2).setMass(1).setRestitution(1).setFriction(0);
    shapeBall.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    ballClass.ballBody = bodyBall;
    world.createCollider(shapeBall, bodyBall)

    dynamicBodies.push([obj, bodyBall, obj.id])
  }

  else if (body.includes('plane')) {

    const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(2.0));
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(1).setRestitution(0).setFriction(0.1);

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