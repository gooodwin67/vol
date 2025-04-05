import * as THREE from "three";

export class Player {
 constructor(scene, ball) {
  this.scene = scene;
  this.ball = ball;

  this.playerHeight = 1;
  this.playerGeometry = new THREE.BoxGeometry(0.5, this.playerHeight, 0.5);
  this.playerMaterial = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
  this.player = new THREE.Mesh(this.playerGeometry, this.playerMaterial);
  this.player.position.set(-2, 0.5, 0);

  this.forward = false;
  this.backward = false;
  this.left = false;
  this.right = false;

  this.playerSpeed = 0.05;


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
     break;
   }
  });
 }

 movePlayer(player) {
  if (this.forward && !this.pass) {
   player.position.z -= this.playerSpeed;
  }
  if (this.backward && !this.pass) {
   player.position.z += this.playerSpeed;
  }
  if (this.left && !this.pass) {
   player.position.x -= this.playerSpeed;
  }
  if (this.right && !this.pass) {
   player.position.x += this.playerSpeed;
  }
 }
}