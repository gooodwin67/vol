import * as THREE from "three";

export class Player {
  constructor(scene, ballClass) {
    this.scene = scene;
    this.ballClass = ballClass;

    this.playerHeight = 1;
    this.playerGeometry = new THREE.BoxGeometry(0.5, this.playerHeight, 0.5);
    this.playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00 });
    this.player = new THREE.Mesh(this.playerGeometry, this.playerMaterial);
    this.player.position.set(0, 0.5, 0);
    this.player.castShadow = true;

    this.playerTopGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
    this.playerTopMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaa00 });
    this.playerTop = new THREE.Mesh(this.playerTopGeometry, this.playerTopMaterial);
    this.playerTop.position.set(0, 0.0, 0);

    this.playerMarkGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    this.playerMarkMaterial = new THREE.MeshLambertMaterial({ color: 0xaa0000 });
    this.playerMark = new THREE.Mesh(this.playerMarkGeometry, this.playerMarkMaterial);
    this.playerMark.position.set(0, 0.8, 0);

    //this.player.add(this.playerMark)

    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    this.playerSpeed = 0.08;

    this.playerActive = true;

    this.playerTapPas = false;
    this.playerCanPas = true;
    this.playerNowPas = false;


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
      }
    });
  }

  movePlayer(player) {

    if (this.forward) {
      if (!this.playerTapPas) {
        player.position.z -= this.playerSpeed;
      }
      else {
        this.ballClass.ballMark.position.z -= this.playerSpeed;
      }
    }
    if (this.backward) {
      if (!this.playerTapPas) {
        player.position.z += this.playerSpeed;
      }
      else {
        this.ballClass.ballMark.position.z += this.playerSpeed;
      }
    }
    if (this.left) {
      if (!this.playerTapPas) {
        player.position.x -= this.playerSpeed;
      }
      else {
        this.ballClass.ballMark.position.x -= this.playerSpeed;
      }
    }
    if (this.right) {
      if (!this.playerTapPas) {
        player.position.x += this.playerSpeed;
      }
      else {
        this.ballClass.ballMark.position.x += this.playerSpeed;
      }
    }

  }

}