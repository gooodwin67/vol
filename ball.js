import * as THREE from "three";

export class Ball {
 constructor(scene) {
  this.ballGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  this.ballMaterial = new THREE.MeshPhongMaterial({ color: 0x0000aa });
  this.ball = new THREE.Mesh(this.ballGeometry, this.ballMaterial);
  this.ball.position.y = 3;
  this.ball.castShadow = true;

  this.ballMarkGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.4);
  this.ballMarkMaterial = new THREE.MeshPhongMaterial({ color: 0xaa0000, transparent: true, opacity: 0.2 });
  this.ballMark = new THREE.Mesh(this.ballMarkGeometry, this.ballMarkMaterial);
  

 }
}
