import * as THREE from "three";

export class Ball {
 constructor(scene) {
  this.ballGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  this.ballMaterial = new THREE.MeshBasicMaterial({ color: 0x0000aa });
  this.ball = new THREE.Mesh(this.ballGeometry, this.ballMaterial);
  this.ball.position.y = 3;

  this.ballFree = true;

  this.ballOnPlayer = false;

  this.ballGoToPoint = false;
 }
}
