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
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { Player } from "./player";
import { World } from "./world";
import { Ball } from "./ball";
import { Opponent } from './opponent';
import { PlayersData } from './players-data';
import { Engine } from './engine';
import { EngineTraining } from './engine-training';
import { GameClass } from './game';
import { PlayersDB } from './players-db';
import { StorageClass } from './storage';

console.clear();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc9e1f4);
// scene.fog = new THREE.Fog(scene.background, 1, 60);

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
const camera = new THREE.PerspectiveCamera(85, document.body.offsetWidth / document.body.offsetHeight, 0.1, 310);
camera.position.set(0, 9, 11);

let stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(document.body.offsetWidth, document.body.offsetHeight);
document.body.appendChild(renderer.domElement);
let isMobile = false;
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  if (isMobile) {
    camera.aspect = document.body.offsetWidth / document.body.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }
  else {
    camera.aspect = document.body.offsetWidth / document.body.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.body.offsetWidth, document.body.offsetHeight);
  }
}

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

let labelRenderer;

labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

let controls = new OrbitControls(camera, labelRenderer.domElement);
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

let gameClass;

let playerClass;

let opponentClass;
let opponentClass2;

let ballClass;

let ball;

let opponentTopBody;

let enginePlayers;
let enginePlayersTraining;

let playersDBClass;
let storageClass;



let powerBlock = document.querySelector('.power_block');
let powerWrap = document.querySelector('.power_wrap');



async function initClases() {
  worldClass = new World(scene);
  playersData = new PlayersData();
  ballClass = new Ball(scene);
  gameClass = new GameClass(scene, playersData);
  playersDBClass = new PlayersDB();
  storageClass = new StorageClass();
  localStorage.clear()




}
initClases();




async function initEntity() {
  let opponent1 = new Opponent(scene, ballClass, worldClass, playersData, playersDBClass.playersDB[playersDBClass.opponent]); //speed, Меткость, скорость удара (7-12), ловкость (пас при движении), skill (дотягивается дальше), подача
  opponent1.opponent.position.x -= 2;
  opponent1.startPosition = opponent1.opponent.position.clone();

  let opponent2 = new Opponent(scene, ballClass, worldClass, playersData, playersDBClass.playersDB[playersDBClass.opponent]);
  opponent2.opponent.position.x = 2;
  opponent2.startPosition = opponent2.opponent.position.clone();
  $('.score_block .team_opponent .score_block_name').text(playersDBClass.playersDB[playersDBClass.opponent].name);

  playersData.opponents.push(opponent1, opponent2)

  let player1 = new Player(scene, ballClass, worldClass, playersData, playersDBClass.playersDB[playersDBClass.player])
  player1.player.position.x -= 2;
  player1.startPosition = player1.player.position.clone();
  player1.previousPosition.copy(player1.player.position);

  let player2 = new Player(scene, ballClass, worldClass, playersData, playersDBClass.playersDB[playersDBClass.player])
  player2.player.position.x = 2;
  player2.startPosition = player2.player.position.clone();
  player2.previousPosition.copy(player2.player.position);
  $('.score_block .team_player .score_block_name').text(playersDBClass.playersDB[playersDBClass.player].name);

  playersData.players.push(player1, player2)



  enginePlayers = new Engine(scene, ballClass, worldClass, playersData, gameClass)

  await playersData.players[0].loadPlayerModel();
  await playersData.players[1].loadPlayerModel();

  await playersData.opponents[0].loadOpponentModel();
  await playersData.opponents[1].loadOpponentModel();

  await worldClass.loadArenaModel();
  await ballClass.loadBallModel();
  await worldClass.loadAround(); //////////////////////////////////

}



async function initScenes() {
  // scene.add(worldClass.ambientLight);
  scene.add(worldClass.dirLight);



  const helper = new THREE.CameraHelper(worldClass.dirLight.shadow.camera);
  //scene.add(helper);
  // scene.add(worldClass.hemiLight);

  scene.add(worldClass.plane);

  scene.add(worldClass.arenaModel);

  scene.add(worldClass.net);
  scene.add(ballClass.ball);
  scene.add(ballClass.ballMark);
  scene.add(ballClass.ballMarkOnGround);

  scene.add(ballClass.ballTouch);

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
  scene.add(playersData.opponents[0].opponentModel);
  playersData.opponents[0].opponentModel.userData.animMas.idle.play();

  scene.add(playersData.opponents[1].opponent);
  scene.add(playersData.opponents[1].opponentModel);
  playersData.opponents[1].opponentModel.userData.animMas.idle.play();


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


  addPhysicsToObject(worldClass.net, 'net');


}



/***************************************************************************************************************/


async function initEntityTraining() {

  let player1 = new Player(scene, ballClass, worldClass, playersData, 0.05, 0.2, 90, 7, 90, 1.5) //speed, thinkSpeed, Меткость, скорость удара (7-12), ловкость (пас при движении)
  player1.player.position.x -= 2;
  player1.startPosition = player1.player.position.clone();

  player1.previousPosition.copy(player1.player.position);
  let player2 = new Player(scene, ballClass, worldClass, playersData, 0.05, 0.2, 90, 7, 90, 1.5) //speed, thinkSpeed, Меткость, скорость удара (7-12), ловкость (пас при движении)
  player2.player.position.x = 2;
  player2.startPosition = player2.player.position.clone();

  player2.previousPosition.copy(player2.player.position);
  playersData.players.push(player1, player2)



  enginePlayersTraining = new EngineTraining(scene, ballClass, worldClass, playersData, gameClass)

  await playersData.players[0].loadPlayerModel();
  await playersData.players[1].loadPlayerModel();

  await worldClass.loadArenaModel();
  await ballClass.loadBallModel();

}

async function initScenesTraining() {
  scene.add(worldClass.ambientLight);
  scene.add(worldClass.dirLight);
  //scene.add(worldClass.hemiLight);

  scene.add(worldClass.plane);

  scene.add(worldClass.arenaModel);

  scene.add(worldClass.net);
  scene.add(ballClass.ball);
  scene.add(ballClass.ballMark);
  scene.add(ballClass.ballMarkOnGround);

  scene.add(ballClass.ballTouch);

  scene.add(playersData.players[0].player);
  scene.add(playersData.players[0].playerModel);
  playersData.players[0].playerModel.userData.animMas.idle.play();


  scene.add(playersData.players[1].player);
  scene.add(playersData.players[1].playerModel);
  playersData.players[1].playerModel.userData.animMas.idle.play();


  scene.add(playersData.playerTop);

  scene.add(playersData.playerMark);
  scene.add(playersData.playerShootMark);


}


async function loadPhysWorldTraining() {
  await RAPIER.init();
  world = new RAPIER.World(new RAPIER.Vector3(0, worldClass.gravity, 0));
  worldClass.eventQueue = new RAPIER.EventQueue(true);

  addPhysicsToObject(playersData.playerTop, 'player');

  playersData.players.forEach((value, index, array) => {
    addPhysicsToObject(value.player, 'playerMain');
  })


  addPhysicsToObject(ballClass.ball, 'ball');
  addPhysicsToObject(worldClass.plane, 'plane');


  addPhysicsToObject(worldClass.net, 'net');


}


/***************************************************************************************************************/


async function initMatch() {
  toggleLoader();

  await initEntity();
  await initScenes();
  await loadPhysWorld();
  gameClass.trainingMatch = false;
  gameClass.fullMatch = true;
  dataLoaded = true;
  toggleLoader();
}

async function initTraining() {
  toggleLoader();

  await initEntityTraining();
  await initScenesTraining();
  await loadPhysWorldTraining();
  gameClass.fullMatch = false;
  gameClass.trainingMatch = true;
  dataLoaded = true;
  toggleLoader();
}





function animate() {


  if (dataLoaded) {

    if (gameClass.endGame) {
      toggleScreenInGame('end_quicmatch_in_game_screen');
      toggleScreensInGame('screens_in_game');
      gameClass.endGame = false;
    }

    if (gameClass.fullMatch) {
      enginePlayers.movePlayer();
      enginePlayers.moveOpponent();
      enginePlayers.game();
    }
    else if (gameClass.trainingMatch) {
      enginePlayersTraining.movePlayer();
      enginePlayersTraining.game()
    }


    for (let i = 0, n = dynamicBodies.length; i < n; i++) {
      dynamicBodies[i][0].position.copy(dynamicBodies[i][1].translation())
      dynamicBodies[i][0].quaternion.copy(dynamicBodies[i][1].rotation())
    }


    world.step(worldClass.eventQueue);
    stats.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
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
    const bodyBall = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(true, true, true).setLinearDamping(0).setAngularDamping(0.0).setGravityScale(0.0));
    const shapeBall = RAPIER.ColliderDesc.ball(size.z / 2).setMass(1).setRestitution(1).setFriction(0);
    shapeBall.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    ballClass.ballBody = bodyBall;
    world.createCollider(shapeBall, bodyBall)

    dynamicBodies.push([obj, bodyBall, obj.id])
  }

  else if (body == 'net') {

    const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(obj.position.x, obj.position.y, obj.position.z).setRotation(obj.quaternion).setCanSleep(false).enabledRotations(false, false, false).setLinearDamping(0).setAngularDamping(0.0));
    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(2).setRestitution(0).setFriction(1);


    world.createCollider(shape, body)

    dynamicBodies.push([obj, body, obj.id])

    // const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.1 });
    // const cube = new THREE.Mesh(geometry, material);
    // cube.position.set(obj.position.x, obj.position.y, obj.position.z)
    // cube.rotation.copy(originalRotation);
    // scene.add(cube);
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




document.querySelectorAll('.screens .start_screen_btn_block').forEach((child, index) => {
  child.addEventListener('click', () => {

    selectScreen($(`.${child.getAttribute('res')}`))

    if (child.getAttribute('res') == 'quicmatch_screen') {
      quickMatch_pre();
    }


  });
})

document.querySelectorAll('.screens .game_btn_back').forEach((child, index) => {
  child.addEventListener('click', () => {

    backScreen($(`.${child.closest('div').getAttribute('class').replace(/ /g, ".")}`))

  });
})

/*****************************/

document.querySelector('.start_quicmatch_btn').addEventListener('click', () => {
  hideScreens();
  initMatch();
  gameClass.fullMatch = true;
  toggleScreensInGame('screens_in_game');
  toggleScreenInGame('quicmatch_in_game_screen')
  backScreen($(`.quicmatch_screen`))
})
document.querySelector('.quicmatch_btn_in_game').addEventListener('click', () => {
  toggleScreenInGame('quicmatch_in_game_screen');

  toggleScreensInGame('screens_in_game');
  gameClass.startGame = true;
})

/*****************************/

document.querySelector('.start_training_btn').addEventListener('click', () => {
  hideScreens();
  initTraining();
  gameClass.trainingMatch = true;
  toggleScreensInGame('screens_in_game');
  toggleScreenInGame('training_in_game_screen')
})
document.querySelector('.training_btn_in_game').addEventListener('click', () => {
  toggleScreenInGame('training_in_game_screen');
  toggleScreensInGame('screens_in_game');
  gameClass.startGame = true;

})


document.querySelector('.end_quicmatch_btn_in_game').addEventListener('click', () => {
  showScreens();
  gameClass.resetAllData();
  dataLoaded = false;
  toggleScreensInGame('screens_in_game');
  toggleScreenInGame('end_quicmatch_in_game_screen');
})

/*****************************/


function selectScreen(screen) {
  screen.css("display", "flex").hide().fadeIn(300);
}
function backScreen(screen) {
  screen.fadeOut(300)
}
function hideScreens() {
  $('.screens').fadeOut(300);
}
function showScreens() {
  $('.screens').fadeIn(300);
}

function toggleLoader(loader = false) {
  if (loader == false) $('.loader').hasClass('hidden_loader') ? $('.loader').removeClass('hidden_loader') : $('.loader').addClass('hidden_loader');
  else $('.loader').addClass('hidden_loader');
}

function toggleScreensInGame(screen) {
  $(`.${screen}`).hasClass('hidden_screens_in_game') ? $(`.${screen}`).removeClass('hidden_screens_in_game') : $(`.${screen}`).addClass('hidden_screens_in_game');
}
function toggleScreenInGame(screen) {
  $(`.${screen}`).hasClass('hidden_screen_in_game') ? $(`.${screen}`).removeClass('hidden_screen_in_game') : $(`.${screen}`).addClass('hidden_screen_in_game');
}

/*******************************************************************************/


function quickMatch_pre() {
  document.querySelector('.quick_choose_players').innerHTML = '';
  document.querySelector('.quick_choose_opponents').innerHTML = '';
  playersDBClass.playersDB.forEach((child, index) => {
    document.querySelector('.quick_choose_players').innerHTML += `<div>${child.name}</div>`
    document.querySelector('.quick_choose_players>div:first-child').classList.add('quick_choose_players_active')

    document.querySelector('.quick_choose_opponents').innerHTML += `<div>${child.name}</div>`
    document.querySelector('.quick_choose_opponents>div:first-child').classList.add('quick_choose_players_active')
  })


  document.querySelectorAll('.quick_choose_players>div').forEach((child, index) => {

    child.addEventListener('click', () => {
      document.querySelectorAll('.quick_choose_players > div').forEach(el => {
        el.classList.remove('quick_choose_players_active');
      });
      child.classList.add('quick_choose_players_active');
      playersDBClass.player = index;
    })
  })

  document.querySelectorAll('.quick_choose_opponents>div').forEach((child, index) => {
    child.addEventListener('click', () => {
      document.querySelectorAll('.quick_choose_opponents>div').forEach(el => {
        el.classList.remove('quick_choose_players_active');
      });
      child.classList.add('quick_choose_players_active');
      playersDBClass.opponent = index;
    })
  })
}

/************************************************************/

let carierSetupNameDone = false;
let carierSetupCharacteristicsDone = false;

console.log($('.input_team_name'))
$('.input_team_name').change(function () {
  if ($(this).val().length > 0) {
    carierSetupNameDone = true;
    checkToSaveCarierSetup();
  }
  else {
    carierSetupNameDone = false;
  }
})


$('.pre_carier_screen_start').click(async function () {
  if (storageClass.data.career) {
    toggleLoader();
    await careerScreenUpdate();



    selectScreen($('.carier_main_screen'));

  }
  else {
    $('.freeExp').text(storageClass.data.team.freeExp);
    $('.input_team').map((index, value, array) => {
      value.max = 60;
    })
    selectScreen($('.carier_screen_setup'));
  }
})

$('.carier_screen_setup_save').click(function () {
  if (carierSetupCharacteristicsDone && carierSetupNameDone) {
    storageClass.data.career = true;
    storageClass.data.team.name = $('.input_team_name').val();
    storageClass.setStorage();
    careerScreenUpdate();
    selectScreen($('.carier_main_screen'));
  }

})

$('.carier_screen_setup_reset').click(function () {
  carierSetupCharacteristicsDone = false;
  checkToSaveCarierSetup();

  for (let el in storageClass.data.team.db) {
    storageClass.data.team.db[el] = 50;
  }

  $('.input_team').map((index, value) => {
    $('.input_team_text')[index].textContent = value.min;

    value.disabled = false;
    value.value = value.min;
    storageClass.sumExp = storageClass.oldSumExp;
    $('.freeExp').text(storageClass.data.team.freeExp);

  })




})








changePlayerData($('.input_team_speed_text'), $('.input_team_speed'), 'speed');
changePlayerData($('.input_team_accuracy_text'), $('.input_team_accuracy'), 'accuracy');
changePlayerData($('.input_team_shotSpeed_text'), $('.input_team_shotSpeed'), 'shotSpeed');


function changePlayerData(data, range, char) {

  data.text(range.val());
  range.on('input', function () {

    let freeExpTemp = storageClass.data.team.freeExp - (storageClass.sumExp - storageClass.oldSumExp);
    if (freeExpTemp > 0) {
      carierSetupCharacteristicsDone = false;
      checkToSaveCarierSetup();

      data.text(range.val());
      storageClass.updateChar(char, range.val());
      storageClass.summingExp();
      freeExpTemp = storageClass.data.team.freeExp - (storageClass.sumExp - storageClass.oldSumExp);
      if (freeExpTemp == 0) {
        $('.input_team').map((index, value, array) => {
          value.disabled = true;
          carierSetupCharacteristicsDone = true;
          checkToSaveCarierSetup();
        })
      }
    }
    else {
      $('.input_team').map((index, value, array) => {
        value.disabled = true;
        carierSetupCharacteristicsDone = true;
        checkToSaveCarierSetup();
      })
    }

    //storageClass.data.team.freeExp -= storageClass.sumExp - storageClass.oldSumExp;


    $('.freeExp').text(freeExpTemp);

  });
}

function checkToSaveCarierSetup() {
  if (carierSetupCharacteristicsDone && carierSetupNameDone) {
    $('.carier_screen_setup_save').removeClass('btn_disabled')
  }
  else {
    $('.carier_screen_setup_save').addClass('btn_disabled')
  }
}

async function careerScreenUpdate() {
  await $('.career_teamName').text(storageClass.data.team.name);
  storageClass.storageLoaded = true;
  toggleLoader(true);
}