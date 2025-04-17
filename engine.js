import * as THREE from "three";
import { getRandomNumber } from "./functions/functions";

export class Engine {
  constructor(scene, ballClass, worldClass, playersData) {
    this.scene = scene;
    this.ballClass = ballClass;
    this.worldClass = worldClass;
    this.playersData = playersData;

    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    this.xx = 0;
    this.zz = 0;

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
          this.playersData.playerTapPas = true;
          this.xx = 0;
          this.zz = 0;
          break;
        case "r":
          ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
          ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
          ballClass.ballBody.setTranslation({ x: 0.0, y: 0.4, z: 4.0 }, true);
          //ballClass.ballBody.applyImpulse({ x: -0.5, y: -worldClass.gravity, z: -worldClass.gravity / 2.5 }, true);
          ballClass.ballBody.applyImpulse({ x: 0, y: 3, z: 0 }, true);
          break;
        case "й":
        case "q":
          this.playersData.activePlayerNum == 0 ? this.playersData.activePlayerNum = 1 : this.playersData.activePlayerNum = 0;
          break;
        case "в":
        case "d":
          this.xx = 0;
          this.zz = 0;
          this.playersData.playerTapShoot = true;
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
          this.playersData.playerTapPas = false;
          break;
        case "в":
        case "d":
          this.playersData.playerTapShoot = false;
          break;
      }
    });
  }

  movePlayer() {


    let topPosY = this.playersData.players[this.playersData.activePlayerNum].player.position.y + 1.3;
    if (this.ballClass.ball.position.y < topPosY && !this.playersData.playerTapShoot) topPosY = this.ballClass.ball.position.y;

    this.playersData.playerTopBody.setNextKinematicTranslation({ x: this.playersData.players[this.playersData.activePlayerNum].player.position.x, y: topPosY, z: this.playersData.players[this.playersData.activePlayerNum].player.position.z }, true)

    if (!this.playersData.playerTapShoot) this.playersData.playerBodies[this.playersData.activePlayerNum].setTranslation({ x: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().x + this.xx, y: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().y, z: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().z + this.zz }, true)


    if (this.forward) {
      if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
        this.zz = -this.playersData.players[this.playersData.activePlayerNum].playerSpeed;
      }
      else {
        this.ballClass.ballMark.position.z -= this.playersData.players[this.playersData.activePlayerNum].playerThinkSpeed;
      }
    }
    else if (this.backward) {
      if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
        this.zz = this.playersData.players[this.playersData.activePlayerNum].playerSpeed;
      }
      else {
        this.ballClass.ballMark.position.z += this.playersData.players[this.playersData.activePlayerNum].playerThinkSpeed;
      }
    }
    else {
      this.zz = 0
    }
    if (this.left) {
      if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
        this.xx = -this.playersData.players[this.playersData.activePlayerNum].playerSpeed;
      }
      else {
        this.ballClass.ballMark.position.x -= this.playersData.players[this.playersData.activePlayerNum].playerThinkSpeed;
      }
    }
    else if (this.right) {
      if (!this.playersData.playerTapPas && !this.playersData.playerTapShoot) {
        this.xx = this.playersData.players[this.playersData.activePlayerNum].playerSpeed;
      }
      else {
        this.ballClass.ballMark.position.x += this.playersData.players[this.playersData.activePlayerNum].playerThinkSpeed;
      }
    }
    else {
      this.xx = 0;
    }

    /*////////////////////////////////////////////////////////////////////////////////*/

    let ballClass = this.ballClass;
    let playersData = this.playersData;
    let worldClass = this.worldClass;

    if (ballClass.ball.position.z > 0) {
      ballClass.ballSideMe = true;
    }
    else ballClass.ballSideMe = false;

    playersData.playerMark.position.x = playersData.players[playersData.activePlayerNum].player.position.x;
    playersData.playerMark.position.z = playersData.players[playersData.activePlayerNum].player.position.z;

    playersData.playerShootMark.position.x = playersData.players[playersData.activePlayerNum].player.position.x;
    playersData.playerShootMark.position.z = playersData.players[playersData.activePlayerNum].player.position.z;



    let ballPlayerCollision = false;
    worldClass.eventQueue.drainCollisionEvents((handle1, handle2, started) => {

      if (handle2 == ballClass.ballBody.handle && handle1 == 0) {

        ballPlayerCollision = true;
      }
    })



    if (playersData.playerTop.position.distanceTo(ballClass.ball.position) > 1) {
      playersData.playerCanPas = true;
    }


    if (playersData.playerCanPas && ballPlayerCollision && playersData.playerBodies[playersData.activePlayerNum].translation().y < 1) {
      ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
      ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);



      const ballPosition = ballClass.ballBody.translation();
      const landingPoint = ballClass.ballMark.position;

      const deltaX = landingPoint.x - ballPosition.x;
      const deltaZ = landingPoint.z - ballPosition.z;

      // Константа, управляющая высотой полёта
      const heightFactor = 3; // Меняйте это значение, чтобы регулировать высоту
      // Время полёта (зависит от высоты)
      const timeOfFlight = Math.sqrt((2 * heightFactor) / Math.abs(worldClass.gravity));


      const speedFactor = 0.45; // уменьшите скорость на 20%
      const horizontalVelocityX = (deltaX / timeOfFlight) * speedFactor;
      const horizontalVelocityZ = (deltaZ / timeOfFlight) * speedFactor;

      // Вертикальная скорость (зависит от высоты)
      const verticalVelocityY = Math.sqrt(2 * Math.abs(worldClass.gravity) * heightFactor);

      // Импульс
      const impulse = {
        x: horizontalVelocityX,
        y: verticalVelocityY,
        z: horizontalVelocityZ
      };


      ballClass.ballMarkOnGround.position.copy(new THREE.Vector3(ballClass.ballMark.position.x, ballClass.ballMark.position.y, ballClass.ballMark.position.z + 0.4))
      ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
      ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
      ballClass.ballBody.applyImpulse(impulse, true);

      if (playersData.opponents[0].opponent.position.distanceTo(ballClass.ballMarkOnGround.position) < playersData.opponents[1].opponent.position.distanceTo(ballClass.ballMarkOnGround.position)) {
        playersData.activeOpponentNum = 0;
      }
      else {
        playersData.activeOpponentNum = 1;
      }


      if (playersData.players[0].player.position.distanceTo(ballClass.ball.position) > playersData.players[1].player.position.distanceTo(ballClass.ball.position)) {
        playersData.activePlayerNum = 0;
      }
      else {
        playersData.activePlayerNum = 1;
      }

      playersData.playerCanPas = false;

    }

    if (ballClass.ball.position.distanceTo(playersData.playerShootMark.position) < 2 && playersData.playerTapShoot && !playersData.playerFly) {
      playersData.playerBodies[playersData.activePlayerNum].applyImpulse({ x: 0, y: 5.2, z: 0 }, true)
    }
    if (playersData.playerBodies[playersData.activePlayerNum].translation().y >= playersData.playerHeight / 1.5) {
      playersData.playerFly = true;
    }
    if (playersData.playerBodies[playersData.activePlayerNum].translation().y < playersData.playerHeight / 1.5) {
      playersData.playerFly = false;
    }






    if (ballPlayerCollision && playersData.playerBodies[playersData.activePlayerNum].translation().y > 1) {
      ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
      ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);

      const ballPosition = ballClass.ballBody.translation();
      const landingPoint = ballClass.ballMark.position;

      const deltaX = landingPoint.x - ballPosition.x;
      const deltaZ = landingPoint.z - ballPosition.z;
      const deltaY = landingPoint.y - ballPosition.y;

      // Константа, управляющая высотой полёта
      const heightFactor = 0.5 // Меняйте это значение, чтобы регулировать высоту
      // Время полёта (зависит от высоты)
      const timeOfFlight = Math.sqrt((2 * heightFactor) / Math.abs(worldClass.gravity));


      const speedFactor = 0.6; // уменьшите скорость на 20%
      const horizontalVelocityX = (deltaX / timeOfFlight) * speedFactor;
      const horizontalVelocityZ = (deltaZ / timeOfFlight) * speedFactor;
      const verticalVelocityY = (deltaY / timeOfFlight) * speedFactor;

      // Вертикальная скорость (зависит от высоты)
      //const verticalVelocityY = Math.sqrt(2 * Math.abs(worldClass.gravity) * heightFactor);

      // Импульс
      const impulse = {
        x: horizontalVelocityX,
        y: verticalVelocityY,
        z: horizontalVelocityZ
      };


      ballClass.ballMarkOnGround.position.copy(new THREE.Vector3(ballClass.ballMark.position.x, ballClass.ballMark.position.y, ballClass.ballMark.position.z + 0.4))
      ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
      ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
      ballClass.ballBody.applyImpulse(impulse, true);

      if (playersData.opponents[0].opponent.position.distanceTo(ballClass.ballMarkOnGround.position) < playersData.opponents[1].opponent.position.distanceTo(ballClass.ballMarkOnGround.position)) {
        playersData.activeOpponentNum = 0;
      }
      else {
        playersData.activeOpponentNum = 1;
      }

    }

    // if (this.playersData.playerTapPas) {

    //   const playerNotActiveBody = playersData.playerBodies[1 - playersData.activePlayerNum];
    //   const playerNotActive = playersData.players[1 - playersData.activePlayerNum].player;


    //   const direction = new THREE.Vector3();
    //   direction.subVectors(new THREE.Vector3(ballClass.ballMark.position.x, playerNotActive.position.y, ballClass.ballMark.position.z), playerNotActive.position).normalize();

    //   const distance = Math.sqrt(
    //     Math.pow(playerNotActive.position.x - ballClass.ballMark.position.x, 2) +
    //     Math.pow(playerNotActive.position.z - ballClass.ballMark.position.z, 2)
    //   );



    //   const movementVector = direction.clone().multiplyScalar(playersData.players[1 - playersData.activePlayerNum].playerSpeed / 1.5);
    //   console.log(playerNotActiveBody)
    //   playerNotActiveBody.setTranslation({ x: playerNotActive.position.x + movementVector.x, y: playerNotActive.position.y, z: playerNotActive.position.z + movementVector.z }, true)
    // }

  }

  moveOpponent() {

    let ballClass = this.ballClass;
    let playersData = this.playersData;
    let worldClass = this.worldClass;

    let topPosY = playersData.opponents[playersData.activeOpponentNum].opponent.position.y + 1.3;
    if (ballClass.ball.position.y < topPosY) topPosY = ballClass.ball.position.y;

    this.playersData.opponentTopBody.setNextKinematicTranslation({ x: playersData.opponents[playersData.activeOpponentNum].opponent.position.x, y: topPosY, z: playersData.opponents[playersData.activeOpponentNum].opponent.position.z }, true)

    if (ballClass.ballMarkOnGround.position.z < 0) {

      const direction = new THREE.Vector3();
      direction.subVectors(new THREE.Vector3(ballClass.ballMarkOnGround.position.x, playersData.opponents[playersData.activeOpponentNum].opponent.position.y, ballClass.ballMarkOnGround.position.z + 0.4), playersData.opponents[playersData.activeOpponentNum].opponent.position).normalize();

      const distance = Math.sqrt(
        Math.pow(playersData.opponents[playersData.activeOpponentNum].opponent.position.x - ballClass.ballMarkOnGround.position.x, 2) +
        Math.pow(playersData.opponents[playersData.activeOpponentNum].opponent.position.z - ballClass.ballMarkOnGround.position.z, 2)
      );

      if (distance > 0.5) {

        const opponentBody = playersData.opponentBodies[playersData.activeOpponentNum];
        const movementVector = direction.clone().multiplyScalar(playersData.opponentsSpeed[playersData.activeOpponentNum]);
        opponentBody.setTranslation({ x: opponentBody.translation().x + movementVector.x, y: opponentBody.translation().y, z: opponentBody.translation().z + movementVector.z }, true)

      }


    }
    /*//////////////////////////////////////////////////////////////////////////*/

    if (playersData.opponentTop.position.distanceTo(ballClass.ball.position) < 0.9) {
      ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
      ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);


      const ballPosition = ballClass.ballBody.translation();
      const landingPoint = new THREE.Vector3(getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2), 0, getRandomNumber(4, worldClass.heightPlane / 2));

      const deltaX = landingPoint.x - ballPosition.x;
      const deltaZ = landingPoint.z - ballPosition.z;

      // Константа, управляющая высотой полёта
      const heightFactor = 3; // Меняйте это значение, чтобы регулировать высоту
      // Время полёта (зависит от высоты)
      const timeOfFlight = Math.sqrt((2 * heightFactor) / Math.abs(worldClass.gravity));


      const speedFactor = 0.45; // уменьшите скорость на 20%
      const horizontalVelocityX = (deltaX / timeOfFlight) * speedFactor;
      const horizontalVelocityZ = (deltaZ / timeOfFlight) * speedFactor;

      // Вертикальная скорость (зависит от высоты)
      const verticalVelocityY = Math.sqrt(2 * Math.abs(worldClass.gravity) * heightFactor);

      // Импульс
      const impulse = {
        x: horizontalVelocityX,
        y: verticalVelocityY,
        z: horizontalVelocityZ
      };

      ballClass.ballMarkOppOnGround.position.copy(landingPoint);
      ballClass.ballMarkOppOnGround.position.y = 0.2;
      //ballClass.ballMarkOnGround.position.y;
      ballClass.ballBody.applyImpulse(impulse, true);


      ////////////////////////////
      if (playersData.players[0].player.position.distanceTo(ballClass.ballMarkOppOnGround.position) < playersData.players[1].player.position.distanceTo(ballClass.ballMarkOppOnGround.position)) {
        playersData.activePlayerNum = 0;
      }
      else {
        playersData.activePlayerNum = 1;
      }

      ballClass.ballMark.position.copy(playersData.players[playersData.activePlayerNum].player.position)
      ballClass.ballMark.position.y = 0.1;

    }
  }

}