import * as THREE from "three";

export class Player {
  constructor(scene, ballClass, worldClass, playersData) {
    this.scene = scene;
    this.ballClass = ballClass;
    this.worldClass = worldClass;
    this.playersData = playersData;

    this.playerHeight = 1.4;
    this.playerGeometry = new THREE.BoxGeometry(0.5, this.playerHeight, 0.5);
    this.playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00 });
    this.player = new THREE.Mesh(this.playerGeometry, this.playerMaterial);
    this.player.position.set(0, 0.5, 5);
    this.player.castShadow = true;

    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    this.playerSpeed = 0.06;


    this.playerActive = true;

    this.playerTapPas = false;
    this.playerCanPas = true;
    this.playerNowPas = false;

    this.playerTapShoot = false;
    this.playerFly = false;

    this.activePlayer = this.player;
    this.activePlayerNum = 0;
    this.players = [];



    this.playerBodies = [];

    this.xx = 0;
    this.zz = 0;


  }

  // movePlayer() {


  //   let topPosY = this.playersData.players[this.playersData.activePlayerNum].player.position.y + 1.3;
  //   if (this.ballClass.ball.position.y < topPosY && !this.playersData.playerTapShoot) topPosY = this.ballClass.ball.position.y;

  //   this.playersData.playerTopBody.setNextKinematicTranslation({ x: this.playersData.players[this.playersData.activePlayerNum].player.position.x, y: topPosY, z: this.playersData.players[this.playersData.activePlayerNum].player.position.z }, true)

  //   if (!this.playersData.playerTapShoot) this.playersData.playerBodies[this.playersData.activePlayerNum].setTranslation({ x: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().x + this.xx, y: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().y, z: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().z + this.zz }, true)


  //   if (this.forward) {
  //     if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
  //       this.zz = -this.playersSpeed[this.playersData.activePlayerNum];
  //     }
  //     else {
  //       this.ballClass.ballMark.position.z -= this.playerThinkSpeed;
  //     }
  //   }
  //   else if (this.backward) {
  //     if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
  //       this.zz = this.playersSpeed[this.playersData.activePlayerNum];
  //     }
  //     else {
  //       this.ballClass.ballMark.position.z += this.playerThinkSpeed;
  //     }
  //   }
  //   else {
  //     this.zz = 0
  //   }
  //   if (this.left) {
  //     if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
  //       this.xx = -this.playersSpeed[this.playersData.activePlayerNum];
  //     }
  //     else {
  //       this.ballClass.ballMark.position.x -= this.playerThinkSpeed;
  //     }
  //   }
  //   else if (this.right) {
  //     if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
  //       this.xx = this.playersSpeed[this.playersData.activePlayerNum];
  //     }
  //     else {
  //       this.ballClass.ballMark.position.x += this.playerThinkSpeed;
  //     }
  //   }
  //   else {
  //     this.xx = 0;
  //   }

  // }

}