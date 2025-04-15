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

    this.opponentActive = true;


    this.activeopponent = this.opponent;
    this.activeOpponentNum = 0;
    this.opponents = [];

    this.opponentsSpeed = [0.05, 0.05];
  }

  moveOpponent(opponentTopBody) {

    let topPosY = this.activeopponent.position.y + 1.3;
    if (this.ballClass.ball.position.y < topPosY) topPosY = this.ballClass.ball.position.y;

    opponentTopBody.setNextKinematicTranslation({ x: this.activeopponent.position.x, y: topPosY, z: this.activeopponent.position.z }, true)
    this.activeopponent = this.opponents[this.activeOpponentNum];

    if (this.ballClass.ballMarkOnGround.position.z < 0) {

      const direction = new THREE.Vector3();
      direction.subVectors(new THREE.Vector3(this.ballClass.ballMarkOnGround.position.x, this.activeopponent.position.y, this.ballClass.ballMarkOnGround.position.z + 0.4), this.activeopponent.position).normalize();

      const distance = Math.sqrt(
        Math.pow(this.activeopponent.position.x - this.ballClass.ballMarkOnGround.position.x, 2) +
        Math.pow(this.activeopponent.position.z - this.ballClass.ballMarkOnGround.position.z, 2)
      );

      if (distance > 0.5) {
        this.activeopponent.position.add(direction.multiplyScalar(this.opponentsSpeed[this.activeOpponentNum]));
      }


    }
  }

}