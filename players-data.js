import * as THREE from "three";

export class PlayersData {
  constructor() {

    this.playerHeight = 1.4;

    this.playerTopGeometry = new THREE.BoxGeometry(1.5, 0.1, 1.5);
    this.playerTopMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaa00, transparent: true, opacity: 1 });
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

    this.players = [];

    this.activePlayerNum = 0;

    this.playerBodies = [];

    this.playerTapPas = false;
    this.playerCanPas = true;
    this.playerNowPas = false;

    this.playerTapShoot = false;
    this.playerFly = false;

    this.playerTopBody = 0;




    this.opponentTopGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    this.opponentTopMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaa00 });
    this.opponentTop = new THREE.Mesh(this.opponentTopGeometry, this.opponentTopMaterial);
    this.opponentTop.position.set(0, 0.0, 0);

    this.opponentTopBody = 0;

    this.opponentSpeed = 0.06;
    this.opponentThinkSpeed = 0.1;

    this.opponentActive = true;


    this.activeopponent = this.opponent;
    this.activeOpponentNum = 0;
    this.opponents = [];

    this.opponentBodies = [];

    this.opponentsSpeed = [0.05, 0.05];

  }


}