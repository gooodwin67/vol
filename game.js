import * as THREE from "three";

export class GameClass {
 constructor(scene, playersData) {
  this.scene = scene;
  this.playersData = playersData;

  this.serve = true;

  this.gameSuspended = false;

  this.scoreUpdating = false;
  this.endScore = 15;

  this.meScore = 0;
  this.oppScore = 0;

  this.startGame = false;
  this.endGame = false;
  this.fullMatch = false;
  this.trainingMatch = false;

 }

 scoreUpdate() {
  if (this.scoreUpdating) {
   document.querySelector('.score_block_player').textContent = this.meScore;
   document.querySelector('.score_block_opponent').textContent = this.oppScore;
   this.scoreUpdating = false;
  }
 }

 resetAllData() {

  while (this.scene.children.length > 0) {
   let object = this.scene.children[0];
   if (object.geometry) {
    object.geometry.dispose(); // Освобождаем геометрию
   }
   if (object.material) {
    if (Array.isArray(object.material)) {
     object.material.forEach(material => material.dispose()); // Освобождаем материалы, если их несколько
    } else {
     object.material.dispose(); // Освобождаем материал, если он один
    }
   }
   this.scene.remove(object); // Удаляем объект со сцены
  }


  this.playersData.players = [];

  this.playersData.activePlayerNum = 0;
  this.playersData.playerBodies = [];
  this.playersData.playerTapPas = false;
  this.playersData.playerCanPas = false;
  this.playersData.playerNowPas = false;
  this.playersData.playerTapShoot = false;
  this.playersData.playerCanShoot = true;
  this.playersData.playerFly = false;
  this.playersData.playerJump = false;
  this.playersData.playersIter = 0;
  this.playersData.playerTopBody = 0;
  this.playersData.playerLastTouch = true;
  this.playersData.ballPlayerCollision = false;
  this.playersData.playerMistakeNow = 0;
  this.playersData.playerPasHeight = 3;
  this.playersData.playerPasHeightShot = 1;
  this.playersData.playerPasVeryHeight = 3.4;
  this.playersData.playerActiveServe = 0;
  this.playersData.playerServe = true;
  this.playersData.serveTap = false;
  this.playersData.servePowerLine = 0;


  this.playersData.opponentTopBody = 0;
  this.playersData.opponentSpeed = 0.06;
  this.playersData.opponentThinkSpeed = 0.1;
  this.playersData.opponentActive = true;
  this.playersData.activeOpponentNum = 0;
  this.playersData.opponents = [];
  this.playersData.opponentBodies = [];
  this.playersData.opponentsPas = false;
  this.playersData.opponentsShoot = false;
  this.playersData.opponentCanPas = false;
  this.playersData.opponentFly = false;
  this.playersData.opponentTapShoot = false;
  this.playersData.opponentJumping = false;
  this.playersData.opponentHiting = false;
  this.playersData.opponentsIter = 0;
  this.playersData.ballOpponentCollision = false;
  this.playersData.opponentMistakeNow = 0;
  this.playersData.opponentPasHeight = 3;
  this.playersData.opponentPasHeightShot = 1;
  this.playersData.opponentPasVeryHeight = 3.4;
  this.playersData.opponentActiveServe = 0;


  this.serve = true;

  this.gameSuspended = false;

  this.scoreUpdating = false;

  this.meScore = 0;
  this.oppScore = 0;

  this.startGame = false;
  this.endGame = false;
  this.fullMatch = false;
  this.trainingMatch = false;

 }




}