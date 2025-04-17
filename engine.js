import * as THREE from "three";

export class Engine {
  constructor(scene, ballClass, worldClass, playersData) {
    this.scene = scene;
    this.ballClass = ballClass;
    this.worldClass = worldClass;
    this.playersData = playersData;

    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    this.xx = 0;
    this.zz = 0;

    addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowDown":
          this.backward = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "s":
        case "ы":
          this.playersData.playerTapPas = true;
          this.xx = 0;
          this.zz = 0;
          break;
        case "r":
          ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
          ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
          ballClass.ballBody.setTranslation({ x: 0.0, y: 0.4, z: 4.0 }, true);
          //ballClass.ballBody.applyImpulse({ x: -0.5, y: -worldClass.gravity, z: -worldClass.gravity / 2.5 }, true);
          ballClass.ballBody.applyImpulse({ x: 0, y: 10, z: 0 }, true);
          break;
        case "й":
        case "q":
          this.playersData.activePlayerNum == 0 ? this.playersData.activePlayerNum = 1 : this.playersData.activePlayerNum = 0;
          break;
        case "в":
        case "d":
          this.xx = 0;
          this.zz = 0;
          this.playersData.playerTapShoot = true;
          break;
      }
    });
    addEventListener("keyup", (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowDown":
          this.backward = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "s":
        case "ы":
          this.playersData.playerTapPas = false;
          break;
        case "в":
        case "d":
          this.playersData.playerTapShoot = false;
          break;
      }
    });
  }

  movePlayer() {


    let topPosY = this.playersData.players[this.playersData.activePlayerNum].player.position.y + 1.3;
    if (this.ballClass.ball.position.y < topPosY && !this.playersData.playerTapShoot) topPosY = this.ballClass.ball.position.y;

    this.playersData.playerTopBody.setNextKinematicTranslation({ x: this.playersData.players[this.playersData.activePlayerNum].player.position.x, y: topPosY, z: this.playersData.players[this.playersData.activePlayerNum].player.position.z }, true)

    if (!this.playersData.playerTapShoot) this.playersData.playerBodies[this.playersData.activePlayerNum].setTranslation({ x: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().x + this.xx, y: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().y, z: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().z + this.zz }, true)


    if (this.forward) {
      if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
        this.zz = -this.playersData.playersSpeed[this.playersData.activePlayerNum];
      }
      else {
        this.ballClass.ballMark.position.z -= this.playersData.playerThinkSpeed;
      }
    }
    else if (this.backward) {
      if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
        this.zz = this.playersData.playersSpeed[this.playersData.activePlayerNum];
      }
      else {
        this.ballClass.ballMark.position.z += this.playersData.playerThinkSpeed;
      }
    }
    else {
      this.zz = 0
    }
    if (this.left) {
      if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
        this.xx = -this.playersData.playersSpeed[this.playersData.activePlayerNum];
      }
      else {
        this.ballClass.ballMark.position.x -= this.playersData.playerThinkSpeed;
      }
    }
    else if (this.right) {
      if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
        this.xx = this.playersData.playersSpeed[this.playersData.activePlayerNum];
      }
      else {
        this.ballClass.ballMark.position.x += this.playersData.playerThinkSpeed;
      }
    }
    else {
      this.xx = 0;
    }

  }

}