import * as THREE from "three";

export class Player {
  constructor(scene, ballClass, worldClass, playersData, playerSpeed, playerThinkSpeed) {
    this.scene = scene;
    this.ballClass = ballClass;
    this.worldClass = worldClass;
    this.playersData = playersData;
    this.playerSpeed = playerSpeed;
    this.playerThinkSpeed = playerThinkSpeed;

    this.playerHeight = 1.4;
    this.playerGeometry = new THREE.BoxGeometry(0.5, this.playerHeight, 0.5);
    this.playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00 });
    this.player = new THREE.Mesh(this.playerGeometry, this.playerMaterial);
    this.player.position.set(0, 0.5, 5);
    this.player.castShadow = true;


  }


}