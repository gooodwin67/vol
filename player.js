import * as THREE from "three";

export class Player {
  constructor(scene, ballClass, worldClass) {
    this.scene = scene;
    this.ballClass = ballClass;
    this.worldClass = worldClass;

    this.playerHeight = 1.4;
    this.playerGeometry = new THREE.BoxGeometry(0.5, this.playerHeight, 0.5);
    this.playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00 });
    this.player = new THREE.Mesh(this.playerGeometry, this.playerMaterial);
    this.player.position.set(0, 0.5, 5);
    this.player.castShadow = true;

    this.playerTopGeometry = new THREE.BoxGeometry(1.5, 0.1, 1.5);
    this.playerTopMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaa00, transparent: true, opacity: 0 });
    this.playerTop = new THREE.Mesh(this.playerTopGeometry, this.playerTopMaterial);
    this.playerTop.position.set(0, 0.0, 0);

    this.playerMarkGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.3);
    this.playerMarkMaterial = new THREE.MeshLambertMaterial({ color: 0x0055aa });
    this.playerMark = new THREE.Mesh(this.playerMarkGeometry, this.playerMarkMaterial);
    this.playerMark.position.set(0, this.playerHeight / 2 + .8, 0);

    this.playerShootMarkGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    this.playerShootMarkMaterial = new THREE.MeshLambertMaterial({ color: 0xff55aa });
    this.playerShootMark = new THREE.Mesh(this.playerShootMarkGeometry, this.playerShootMarkMaterial);
    this.playerShootMark.position.set(0, this.playerHeight * 2.4, 0);

    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    this.playerSpeed = 0.06;
    this.playerThinkSpeed = 0.2;

    this.playerActive = true;

    this.playerTapPas = false;
    this.playerCanPas = true;
    this.playerNowPas = false;

    this.playerTapShoot = false;
    this.playerFly = false;

    this.activePlayer = this.player;
    this.activePlayerNum = 0;
    this.players = [];

    this.playersSpeed = [0.07, 0.07];

    this.playerBodies = [];

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
          this.playerTapPas = true;
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
          this.activePlayerNum == 0 ? this.activePlayerNum = 1 : this.activePlayerNum = 0;
          break;
        case "в":
        case "d":
          this.xx = 0;
          this.zz = 0;
          this.playerTapShoot = true;
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
          this.playerTapPas = false;
          break;
        case "в":
        case "d":
          this.playerTapShoot = false;
          break;
      }
    });
  }

  movePlayer(playerTopBody) {

    let topPosY = this.activePlayer.position.y + 1.3;
    if (this.ballClass.ball.position.y < topPosY && !this.playerTapShoot) topPosY = this.ballClass.ball.position.y;

    playerTopBody.setNextKinematicTranslation({ x: this.activePlayer.position.x, y: topPosY, z: this.activePlayer.position.z }, true)
    this.activePlayer = this.players[this.activePlayerNum];


    if (!this.playerTapShoot) this.playerBodies[this.activePlayerNum].setTranslation({ x: this.playerBodies[this.activePlayerNum].translation().x + this.xx, y: this.playerBodies[this.activePlayerNum].translation().y, z: this.playerBodies[this.activePlayerNum].translation().z + this.zz }, true)


    if (this.forward) {
      if (!this.playerTapPas && !this.playerTapShoot) {
        this.zz = -this.playersSpeed[this.activePlayerNum];
      }
      else {
        this.ballClass.ballMark.position.z -= this.playerThinkSpeed;
      }
    }
    else if (this.backward) {
      if (!this.playerTapPas && !this.playerTapShoot) {
        this.zz = this.playersSpeed[this.activePlayerNum];
      }
      else {
        this.ballClass.ballMark.position.z += this.playerThinkSpeed;
      }
    }
    else {
      this.zz = 0
    }
    if (this.left) {
      if (!this.playerTapPas && !this.playerTapShoot) {
        this.xx = -this.playersSpeed[this.activePlayerNum];
      }
      else {
        this.ballClass.ballMark.position.x -= this.playerThinkSpeed;
      }
    }
    else if (this.right) {
      if (!this.playerTapPas && !this.playerTapShoot) {
        this.xx = this.playersSpeed[this.activePlayerNum];
      }
      else {
        this.ballClass.ballMark.position.x += this.playerThinkSpeed;
      }
    }
    else {
      this.xx = 0;
    }




  }

}