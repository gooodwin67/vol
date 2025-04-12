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
    this.opponent.position.set(2, 0.5, -3);
    this.opponent.castShadow = true;

    this.opponentTopGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    this.opponentTopMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaa00 });
    this.opponentTop = new THREE.Mesh(this.opponentTopGeometry, this.opponentTopMaterial);
    this.opponentTop.position.set(0, 0.0, 0);

    // this.playerMarkGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    // this.playerMarkMaterial = new THREE.MeshLambertMaterial({ color: 0xaa0000 });
    // this.playerMark = new THREE.Mesh(this.playerMarkGeometry, this.playerMarkMaterial);
    // this.playerMark.position.set(0, 0.8, 0);

    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    this.opponentSpeed = 0.06;
    this.opponentThinkSpeed = 0.1;

    // this.playerActive = true;

    // this.playerTapPas = false;
    // this.playerCanPas = true;
    // this.playerNowPas = false;

    // this.activePlayer = this.player;
    // this.activePlayerNum = 0;
    // this.players = [];
  }

  moveOpponent(opponentTopBody) {
    opponentTopBody.setNextKinematicTranslation({ x: this.opponent.position.x, y: this.opponent.position.y + 1.3, z: this.opponent.position.z }, true)
    if (this.ballClass.ballSideMe == false && this.ballClass.ballMarkOnGround.position.z < 0) {
      this.opponent.position.copy(new THREE.Vector3(this.ballClass.ballMarkOnGround.position.x, this.ballClass.ballMarkOnGround.position.y, this.ballClass.ballMarkOnGround.position.z + 0.4))
    }
  }

}