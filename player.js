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

  this.playerMarkGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  this.playerMarkMaterial = new THREE.MeshLambertMaterial({
   color: 0xaaaa00,
   transparent: true,
   opacity: 0,
  });
  this.playerMark = new THREE.Mesh(
   this.playerMarkGeometry,
   this.playerMarkMaterial
  );
  this.playerMark.position.set(0, this.playerHeight / 2, 0);
  this.player.add(this.playerMark);

  this.playerGeometry2 = new THREE.BoxGeometry(0.5, this.playerHeight, 0.5);
  this.playerMaterial2 = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
  this.player2 = new THREE.Mesh(this.playerGeometry2, this.playerMaterial2);
  this.player2.position.set(2, 0.5, 0);

  this.playerMarkGeometry2 = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  this.playerMarkMaterial2 = new THREE.MeshLambertMaterial({
   color: 0xaaaa00,
   transparent: true,
   opacity: 1,
  });
  this.playerMark2 = new THREE.Mesh(
   this.playerMarkGeometry2,
   this.playerMarkMaterial2
  );
  this.playerMark2.position.set(0, this.playerHeight / 2, 0);
  this.player2.add(this.playerMark2);

  this.playerMas = [this.player, this.player2];
  this.currentPlayer = 1;

  this.targetGeometry = new THREE.BoxGeometry(0.6, 0.01, 0.6);
  this.targetMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
  this.target = new THREE.Mesh(this.targetGeometry, this.targetMaterial);
  this.targetStartPosition = new THREE.Vector3(
   0,
   -this.playerHeight / 2 + 0.1,
   0
  );

  this.targetGeometry2 = new THREE.BoxGeometry(0.6, 0.01, 0.6);
  this.targetMaterial2 = new THREE.MeshLambertMaterial({
   color: 0xff0000,
   transparent: true,
   opacity: 0.2,
  });
  this.targetBall = new THREE.Mesh(
   this.targetGeometry2,
   this.targetMaterial2
  );
  this.scene.add(this.targetBall);

  this.target.position.set(
   this.targetStartPosition.x,
   this.targetStartPosition.y,
   this.targetStartPosition.z
  );

  this.playerMas[this.currentPlayer].add(this.target);

  this.forward = false;
  this.backward = false;
  this.left = false;
  this.right = false;

  this.playerSpeed = 0.05;

  this.forwardTarget = false;
  this.backwardTarget = false;
  this.leftTarget = false;
  this.rightTarget = false;

  this.targetSpeed = 0.3;

  this.pass = false;

  this.playerNowPas = false;

  this.targetLine;
  this.pointsLine;

  addEventListener("keydown", (event) => {
   switch (event.key) {
    case "ArrowUp":
     this.forward = true;
     this.forwardTarget = true;
     break;
    case "ArrowLeft":
     this.left = true;
     this.leftTarget = true;
     break;
    case "ArrowDown":
     this.backward = true;
     this.backwardTarget = true;
     break;
    case "ArrowRight":
     this.right = true;
     this.rightTarget = true;
     break;
    case "s":
    case "ы":
     this.pass = true;
     break;
   }
  });
  addEventListener("keyup", (event) => {
   switch (event.key) {
    case "ArrowUp":
     this.forward = false;
     this.forwardTarget = false;
     break;
    case "ArrowLeft":
     this.left = false;
     this.leftTarget = false;
     break;
    case "ArrowDown":
     this.backward = false;
     this.backwardTarget = false;
     break;
    case "ArrowRight":
     this.right = false;
     this.rightTarget = false;
     break;
    case "s":
    case "ы":
     this.pass = false;
     this.passing();
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

  if (this.forwardTarget && this.pass) {
   this.target.position.z -= this.targetSpeed;
  }
  if (this.backwardTarget && this.pass) {
   this.target.position.z += this.targetSpeed;
  }
  if (this.leftTarget && this.pass) {
   this.target.position.x -= this.targetSpeed;
  }
  if (this.rightTarget && this.pass) {
   this.target.position.x += this.targetSpeed;
  }
 }

 createLineBetweenObjects(obj1, obj2) {
  if (this.targetLine) {
   this.scene.remove(this.targetLine);
  }
  const points = [];

  const obj1Pos = obj1.getWorldPosition(new THREE.Vector3()).clone();
  const obj2Pos = obj2.getWorldPosition(new THREE.Vector3()).clone();

  const steps = 100; // Количество точек для кривой

  for (let i = 0; i <= steps; i++) {
   const t = i / steps; // Нормализуем параметр t от 0 до 1
   const x = THREE.MathUtils.lerp(obj1Pos.x, obj2Pos.x, t);
   const y = Math.sin(t * Math.PI) * 2 + 1; // Используем синус для плавного подъема
   const z = THREE.MathUtils.lerp(obj1Pos.z, obj2Pos.z, t);
   points.push(new THREE.Vector3(x, y, z));
  }

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  this.targetLine = new THREE.Line(lineGeometry, lineMaterial);

  this.scene.add(this.targetLine);
  this.points = points;
 }

 passing() {
  this.targetBall.position.copy(
   this.target.getWorldPosition(new THREE.Vector3())
  );
  this.createLineBetweenObjects(this.ball, this.target);

  this.playerNowPas = true;
  if (this.currentPlayer == 0) {
   this.playerMas[this.currentPlayer].remove(this.target);
   this.playerMas[this.currentPlayer].children[0].material.opacity = 0;
   this.currentPlayer = 1;
   this.playerMas[this.currentPlayer].add(this.target);
   this.playerMas[this.currentPlayer].children[0].material.opacity = 1;
  } else {
   this.playerMas[this.currentPlayer].remove(this.target);
   this.playerMas[this.currentPlayer].children[0].material.opacity = 0;
   this.currentPlayer = 0;
   this.playerMas[this.currentPlayer].add(this.target);
   this.playerMas[this.currentPlayer].children[0].material.opacity = 1;
  }
  this.target.position.set(
   this.targetStartPosition.x,
   this.targetStartPosition.y,
   this.targetStartPosition.z
  );
 }
}
