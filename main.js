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
import { CareerDB } from './career-db';
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
let careerDBClass;
let storageClass;

let startCalendarSimulateToggle = 0;



let powerBlock = document.querySelector('.power_block');
let powerWrap = document.querySelector('.power_wrap');

//localStorage.clear();

async function initClases() {
  worldClass = new World(scene);
  playersData = new PlayersData();
  ballClass = new Ball(scene);
  gameClass = new GameClass(scene, playersData);
  playersDBClass = new PlayersDB();
  careerDBClass = new CareerDB();
  storageClass = new StorageClass();






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

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }

  if (startCalendarSimulateToggle) {
    startCalendarSimulate();
  }
  renderer.render(scene, camera);
  stats.update();

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
  screen.css("display", "flex").hide().fadeIn(300, () => { screen.removeClass('hidden_screen') });
}
function backScreen(screen) {
  screen.fadeOut(300, () => { screen.addClass('hidden_screen') })
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

$('.input_team_name').change(function () {
  if ($(this).val().length > 0) {
    carierSetupNameDone = true;
    checkToSaveCarierSetup();
  }
  else {
    carierSetupNameDone = false;
    checkToSaveCarierSetup();
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
    careerScreenUpdate();
    storageClass.data.team.freeExp = 0;
    selectScreen($('.carier_main_screen'));
    storageClass.sumExp = storageClass.oldSumExp;
    storageClass.setStorage();
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



function changePlayerDataSetup(data, range, char) {

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

    $('.freeExp').text(freeExpTemp);

  });
}



$.each(storageClass.data.team.db, (index, value) => {
  $('.careerSetup_char_blocks').append(`
    <div class='careerSetup_char_block'>
        <label>${storageClass.data.skillDB[index]} <input type="range" class="input_team input_team_${index}" name="${index}" min="50" max="100" value="${value}"><span class='input_team_text input_team_${index}_text'>50</span></label>
        
    </div>
  `)
  changePlayerDataSetup($(`.input_team_${index}_text`), $(`.input_team_${index}`), `${index}`);
})





function checkToSaveCarierSetup() {
  if (carierSetupCharacteristicsDone && carierSetupNameDone) {
    $('.carier_screen_setup_save').removeClass('btn_disabled')
  }
  else {
    $('.carier_screen_setup_save').addClass('btn_disabled')
  }
}
careerScreenUpdate()
async function careerScreenUpdate() {
  await $('.career_teamName').text(storageClass.data.team.name);
  let day = Object.entries(careerDBClass.calendarData.calendar)[storageClass.data.team.nowDate.month][1][storageClass.data.team.nowDate.day];
  let month = Object.entries(careerDBClass.calendarData.calendar)[storageClass.data.team.nowDate.month][0];
  await $('.carier_main_screen_date').text(`${day} ${month} ${storageClass.data.team.nowDate.year}`);
  updateChars();
  storageClass.storageLoaded = true;
  toggleLoader(true);
  storageClass.setStorage();
}

function updateChars() {
  $('.carier_main_screen_chars').html('');
  $.each(storageClass.data.team.db, (index, value) => {
    $('.carier_main_screen_chars').append(`
    <div class='careerSetup_char_block'>
        <p>${storageClass.data.skillDB[index]} - ${value}</p>
    </div>
  `)
  })

  $('.carier_main_screen_freeExp').text(storageClass.data.team.freeExp);

  if (storageClass.data.team.freeExp > 0) {
    $('.carier_main_screen_reChar').removeClass('btn_disabled');
  }
  else {
    $('.carier_main_screen_reChar').addClass('btn_disabled');
  }
}






$('.carier_main_screen_reChar').click(function () {
  if (storageClass.data.team.freeExp > 0) {
    selectScreen($('.carier_screen_reChar'))
    $('.freeExp').text(storageClass.data.team.freeExp);
    $('.career_reChar_blocks').html('');
    console.log($('.careerSetup_char_blocks').html(''))

    $.each(storageClass.data.team.db, (index, value) => {
      $('.career_reChar_blocks').append(`
    <div class='careerSetup_char_block'>
        <label>${storageClass.data.skillDB[index]} <input type="range" class="input_team_career input_team_${index}" name="${index}" min="50" max="100" value="${value}"><span class='input_team_text_career input_team_${index}_text'>50</span></label>
    </div>
  `)
      changePlayerData($(`.input_team_${index}_text`), $(`.input_team_${index}`), `${index}`);
    })
  }
  storageClass.oldSumExp = 0;
  $.each(storageClass.data.team.db, (key, value) => {
    storageClass.oldSumExp += value;
  });
})

function changePlayerData(data, range, char) {

  storageClass.sumExp = 0;
  $('.freeExpReChar').text(storageClass.data.team.freeExp);

  data.text(range.val());

  range.on('input', function (e) {
    // Ваш код для расчета freeExpTemp

    data.text(range.val());
    storageClass.updateChar(char, range.val());
    storageClass.summingExp();
    let freeExpTemp = storageClass.data.team.freeExp - (storageClass.sumExp - storageClass.oldSumExp);
    $('.carier_screen_reChar_save').addClass('btn_disabled');


    // Обновление состояния кнопки и элементов ввода
    if (freeExpTemp <= 0) {
      $('.input_team_career').prop('disabled', true);
      $('.carier_screen_reChar_save').removeClass('btn_disabled');
    } else {
      $('.input_team_career').prop('disabled', false);
      $('.carier_screen_reChar_save').addClass('btn_disabled');
    }

    // Обновление текста свободного опыта
    $('.freeExpReChar').text(freeExpTemp);
  });


}

$('.carier_screen_reChar_reset').click(function () {

  storageClass.readStorage();
  $('.carier_screen_reChar_save').addClass('btn_disabled');
  $('.input_team_career').map((index, value) => {
    $('.input_team_text_career')[index].textContent = Object.values(storageClass.data.team.db)[index];
    value.disabled = false;
    value.value = Object.values(storageClass.data.team.db)[index];
    storageClass.sumExp = storageClass.oldSumExp;
    $('.freeExpReChar').text(storageClass.data.team.freeExp);
  })
})
$('.carier_screen_reChar_save').click(function () {
  if (parseInt($('.freeExpReChar').text()) == 0) {
    careerScreenUpdate();
    storageClass.data.team.freeExp = 0;
    backScreen($('.carier_screen_reChar'))
    //selectScreen($('.carier_main_screen'));
    storageClass.sumExp = storageClass.oldSumExp;
    storageClass.setStorage();
  }
})









$('.carier_main_screen_btn_next').click(function () {
  selectScreen($('.carier_screen_calendarSimulateScreen'))
  startCalendarSimulateToggle = 1;
})

$('.backFromSimulationScreen').click(function () {
  startCalendarSimulateToggle = 0;
  careerScreenUpdate();
  storageClass.setStorage();
  console.log(Object.entries(careerDBClass.calendarData.calendar)[storageClass.data.team.nowDate.month][1][storageClass.data.team.nowDate.day])
  backScreen($('.carier_screen_calendarSimulateScreen'));
})



function startCalendarSimulate() {
  startCalendarSimulateToggle++;
  if (startCalendarSimulateToggle > 40) {

    let day = Object.entries(careerDBClass.calendarData.calendar)[storageClass.data.team.nowDate.month][1][storageClass.data.team.nowDate.day];
    let month = Object.entries(careerDBClass.calendarData.calendar)[storageClass.data.team.nowDate.month][0];


    if (storageClass.data.team.nowDate.day < Object.entries(careerDBClass.calendarData.calendar)[storageClass.data.team.nowDate.month][1].length - 1) {
      storageClass.data.team.nowDate.day++
    }
    else {
      if (storageClass.data.team.nowDate.month < Object.entries(careerDBClass.calendarData.calendar).length - 1) {
        storageClass.data.team.nowDate.day = 0;
        storageClass.data.team.nowDate.month++;
      }
      else {
        storageClass.data.team.nowDate.day = 0;
        storageClass.data.team.nowDate.month = 0;
        storageClass.data.team.nowDate.year++;
      }
    }
    $('.carier_screen_calendarSimulateScreen_data').text(`${Object.entries(careerDBClass.calendarData.calendar)[storageClass.data.team.nowDate.month][1][storageClass.data.team.nowDate.day]} ${Object.entries(careerDBClass.calendarData.calendar)[storageClass.data.team.nowDate.month][0]}`);

    startCalendarSimulateToggle = 1;
  }
}



$('.carier_main_screen_btn_calendar').click(function () {
  selectScreen($('.carier_screen_calendarScreen'))
})

$('.backFromCalendarScreen').click(function () {

  careerScreenUpdate();
  storageClass.setStorage();
  backScreen($('.carier_screen_calendarScreen'));

})




function createCalendar(league = 'Russia') {
  let numOfMatch = 0;
  let teams = careerDBClass.leagues[league].teams;
  Object.entries(careerDBClass.calendarData.calendar).forEach((el, index, arr) => {
    $('.carier_screen_calendar_table').append(`
      <div class = 'carier_screen_calendar_block ${index == 0 ? '' : 'hidden_screen'}'>
      <div class = 'carier_screen_calendar_head'></div>
      <div class = 'carier_screen_calendar_wrap'></div>
      </div>
    `)







    $(`.carier_screen_calendar_head:nth(${index})`).html(`<div class = 'carier_screen_calendar_head_name'>${el[0]}</div><div class = 'carier_screen_calendar_head_btns'><span class = 'carier_screen_calendar_head_btns_left'><-- </span> <span class = 'carier_screen_calendar_head_btns_right'> --></span></div></div>`);

    el[1].forEach((value, i, array) => {

      if (value['day'] == 7 || value['day'] == 14 || value['day'] == 21) {

        if (numOfMatch < teams.length * 2) value['data']['match'] = numOfMatch < teams.length ? teams[numOfMatch]['name'] : teams[numOfMatch - teams.length]['name'];
        numOfMatch++
      }

      let match = value['data']['match'];


      $(`.carier_screen_calendar_wrap:nth(${index})`).append(
        `<div class = 'carier_screen_calendar_day ${match ? 'calendar_day_have_match' : ''}'>
          <div class = 'calendar_day_num'>${value['day']}</div>
          <div class = 'calendar_day_match'>${value['data']['match'] ? value['data']['match'] : ''}</div>
        </div>`
      );
    })


  })

}
createCalendar();
$('.carier_screen_calendar_head_btns_right').click(function () {
  if ($(this).closest('.carier_screen_calendar_block').next().length == 1) {
    $(this).closest('.carier_screen_calendar_block').fadeOut(10, () => {
      $(this).closest('.carier_screen_calendar_block').addClass('hidden_screen');
      $(this).closest('.carier_screen_calendar_block').next().fadeIn(10, () => { $(this).closest('.carier_screen_calendar_block').next().removeClass('hidden_screen'); })
    })
  }
})
$('.carier_screen_calendar_head_btns_left').click(function () {
  if ($(this).closest('.carier_screen_calendar_block').prev().length == 1) {
    $(this).closest('.carier_screen_calendar_block').fadeOut(10, () => {
      $(this).closest('.carier_screen_calendar_block').addClass('hidden_screen');
      $(this).closest('.carier_screen_calendar_block').prev().fadeIn(10, () => { $(this).closest('.carier_screen_calendar_block').prev().removeClass('hidden_screen'); })
    })
  }
})




/*///////////////////////////////////////////////////////////////////////////////////////*/
$('.carier_main_screen_btn_train').click(function () {
  storageClass.data.team.freeExp = 50;
  storageClass.setStorage();
  careerScreenUpdate();
})