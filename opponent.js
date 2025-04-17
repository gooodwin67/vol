import * as THREE from "three";

export class Opponent {
  constructor(scene, ballClass, worldClass) {
    this.scene = scene;
    this.ballClass = ballClass;
    this.worldClass = worldClass;

    this.opponentHeight = 1.4;
    this.opponentGeometry = new THREE.BoxGeometry(0.5, this.opponentHeight, 0.5);
    this.opponentMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00 });
    this.opponent = new THREE.Mesh(this.opponentGeometry, this.opponentMaterial);
    this.opponent.position.set(0, 0.5, -5);
    this.opponent.castShadow = true;

  }



}