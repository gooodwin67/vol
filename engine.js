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

    this.clock = new THREE.Clock();

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
          ballClass.ballBody.setTranslation({ x: 0.0, y: 4.4, z: 4.0 }, true);
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

    let ballClass = this.ballClass;
    let playersData = this.playersData;
    let worldClass = this.worldClass;

    if (ballClass.ball.position.z > 0) {
      ballClass.ballSideMe = true;
    }
    else ballClass.ballSideMe = false;


    let topPosY = this.playersData.players[this.playersData.activePlayerNum].player.position.y + 1.3;
    if (this.ballClass.ball.position.y < topPosY && !this.playersData.playerTapShoot) topPosY = this.ballClass.ball.position.y;

    this.playersData.playerTopBody.setNextKinematicTranslation({ x: this.playersData.players[this.playersData.activePlayerNum].player.position.x, y: topPosY, z: this.playersData.players[this.playersData.activePlayerNum].player.position.z }, true)

    if (this.playersData.playerTapPas & playersData.playerTop.position.distanceTo(ballClass.ball.position) < 0.2) {
      this.playersData.players[this.playersData.activePlayerNum].userData.animMas['pass'].play();
    }

    this.playersData.players.forEach((value, index, array) => {
      value.playerModel.position.copy(new THREE.Vector3(value.player.position.x, value.player.position.y - 0.7, value.player.position.z));
      value.playerModel.userData.mixer.update(value.clock.getDelta());

      //console.log(playersData.playerTop.position.distanceTo(ballClass.ball.position))


      if (!this.playersData.playerFly) {
        if (value.player.position.z - value.previousPosition.z < 0 && value.player.position.x - value.previousPosition.x == 0) {
          this.playersData.players[index].animActive('run');

        }
        else if (value.player.position.z - value.previousPosition.z > 0 && value.player.position.x - value.previousPosition.x == 0) {
          this.playersData.players[index].animActive('runBack');

        }
        else if (value.player.position.x - value.previousPosition.x < 0 && value.player.position.z - value.previousPosition.z == 0) {
          this.playersData.players[index].animActive('runLeft');
        }
        else if (value.player.position.x - value.previousPosition.x > 0 && value.player.position.z - value.previousPosition.z == 0) {
          this.playersData.players[index].animActive('runRight');
        }

        if (value.player.position.z - value.previousPosition.z < 0 && value.player.position.x - value.previousPosition.x > 0) {

          this.playersData.players[index].animActive('run_forward_right');
        }
        if (value.player.position.z - value.previousPosition.z < 0 && value.player.position.x - value.previousPosition.x < 0) {
          this.playersData.players[index].animActive('run_forward_left');
        }

        if (value.player.position.z - value.previousPosition.z > 0 && value.player.position.x - value.previousPosition.x > 0) {
          this.playersData.players[index].animActive('runback_left');
        }
        if (value.player.position.z - value.previousPosition.z > 0 && value.player.position.x - value.previousPosition.x < 0) {
          this.playersData.players[index].animActive('runback_right');
        }


        if (value.player.position.x - value.previousPosition.x == 0 & value.player.position.z - value.previousPosition.z == 0) {
          this.playersData.players[index].animActive('idle');
          value.playerModel.rotation.y = Math.PI
        }
        value.previousPosition.copy(value.player.position);
      }


      if (this.playersData.playerFly) {

        this.playersData.players[this.playersData.activePlayerNum].animActive('shoot', 5, 0.5);

      }



    })



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

    // if (this.xx == 0 && this.zz == 0) {
    //   this.playersData.players[this.playersData.activePlayerNum].animActive('idle');
    // }
    // else {
    //   this.playersData.players[this.playersData.activePlayerNum].animActive('run');
    // }

    /*////////////////////////////////////////////////////////////////////////////////*/



    playersData.playerMark.position.x = playersData.players[playersData.activePlayerNum].player.position.x;
    playersData.playerMark.position.z = playersData.players[playersData.activePlayerNum].player.position.z;

    playersData.playerShootMark.position.x = playersData.players[playersData.activePlayerNum].player.position.x;
    playersData.playerShootMark.position.z = playersData.players[playersData.activePlayerNum].player.position.z;


    playersData.ballPlayerCollision = false;
    playersData.ballOpponentCollision = false;

    worldClass.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (handle2 == ballClass.ballBody.handle && handle1 == 0) {
        playersData.ballPlayerCollision = true;
      }
      if (handle2 == ballClass.ballBody.handle && handle1 == '1.5e-323' && started) {
        playersData.ballOpponentCollision = true;
      }

      if (handle1 == ballClass.ballBody.handle && handle2 == '3.5e-323') {
        //console.log('ГОООЛ');
      }

    })


    if (playersData.playerTop.position.distanceTo(ballClass.ball.position) > 1) {
      playersData.playerCanPas = true;
    }


    if (playersData.playerCanPas && playersData.ballPlayerCollision && playersData.playerBodies[playersData.activePlayerNum].translation().y < 1) {
      //пас
      this.playersData.players[this.playersData.activePlayerNum].animActive('pass');
      const landingPoint = ballClass.ballMark.position;
      this.shootEngine(3, 0.45, landingPoint)
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

    /****************************************************/


    if (ballClass.ball.position.distanceTo(playersData.playerShootMark.position) < 2 && playersData.playerTapShoot && !playersData.playerFly) {
      playersData.playerBodies[playersData.activePlayerNum].applyImpulse({ x: 0, y: 5.2, z: 0 }, true)
    }
    if (playersData.playerBodies[playersData.activePlayerNum].translation().y >= playersData.playerHeight / 1.5) {
      playersData.playerFly = true;
    }
    if (playersData.playerBodies[playersData.activePlayerNum].translation().y < playersData.playerHeight / 1.5) {
      playersData.playerFly = false;
    }

    if (playersData.ballPlayerCollision && playersData.playerBodies[playersData.activePlayerNum].translation().y > 1) {

      //удар
      const landingPoint = ballClass.ballMark.position;
      this.shootEngine(0.05, 0.10, landingPoint)


      if (playersData.opponents[0].opponent.position.distanceTo(ballClass.ballMarkOnGround.position) < playersData.opponents[1].opponent.position.distanceTo(ballClass.ballMarkOnGround.position)) {
        playersData.activeOpponentNum = 0;
      }
      else {
        playersData.activeOpponentNum = 1;
      }

    }

    //движение не активного игрока
    if (this.playersData.playerTapPas && ballClass.ballMark.position.z > 0) {

      const playerNotActiveBody = playersData.playerBodies[1 - playersData.activePlayerNum];
      const playerNotActive = playersData.players[1 - playersData.activePlayerNum].player;

      const direction = new THREE.Vector3();
      direction.subVectors(new THREE.Vector3(ballClass.ballMark.position.x, playerNotActive.position.y, ballClass.ballMark.position.z), playerNotActive.position).normalize();

      const distance = Math.sqrt(
        Math.pow(playerNotActive.position.x - ballClass.ballMark.position.x, 2) +
        Math.pow(playerNotActive.position.z - ballClass.ballMark.position.z, 2)
      );
      if (distance > 0.5) {
        const movementVector = direction.clone().multiplyScalar(playersData.players[1 - playersData.activePlayerNum].playerSpeed / 2.5);
        if (playerNotActive.position.z > ballClass.ballMark.position.z)
          playerNotActiveBody.setTranslation({ x: playerNotActive.position.x + movementVector.x, y: playerNotActive.position.y, z: playerNotActive.position.z + movementVector.z }, true)
      }
    }

  }

  moveOpponent() {

    let ballClass = this.ballClass;
    let playersData = this.playersData;
    let worldClass = this.worldClass;

    playersData.opponentShootMark.position.x = playersData.opponents[playersData.activeOpponentNum].opponent.position.x;
    playersData.opponentShootMark.position.z = playersData.opponents[playersData.activeOpponentNum].opponent.position.z;

    let topPosY = playersData.opponents[playersData.activeOpponentNum].opponent.position.y + 1.3;
    if (ballClass.ball.position.y < topPosY) topPosY = ballClass.ball.position.y;

    this.playersData.opponentTopBody.setNextKinematicTranslation({ x: playersData.opponents[playersData.activeOpponentNum].opponent.position.x, y: topPosY, z: playersData.opponents[playersData.activeOpponentNum].opponent.position.z }, true)

    if (ballClass.ballMarkOnGround.position.z < 0) {

      const direction = new THREE.Vector3();
      direction.subVectors(new THREE.Vector3(ballClass.ballMarkOnGround.position.x, playersData.opponents[playersData.activeOpponentNum].opponent.position.y, ballClass.ballMarkOnGround.position.z + 0.2), playersData.opponents[playersData.activeOpponentNum].opponent.position).normalize();

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


    if (playersData.ballOpponentCollision && !playersData.opponentsPas && !playersData.opponentTapShoot) {
      //пас
      let landingPoint;
      playersData.opponentsIter++;
      if (playersData.opponentsIter < 3) {
        landingPoint = new THREE.Vector3(getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2), 0, getRandomNumber(-worldClass.heightPlane / 2, 0));
      }
      else {
        landingPoint = new THREE.Vector3(getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2), 0, getRandomNumber(4, worldClass.heightPlane / 2));
        playersData.opponentsIter = 0;
      }

      if (!playersData.opponentTapShoot) this.shootEngine(3, 0.45, landingPoint)

      playersData.activeOpponentNum = 1 - playersData.activeOpponentNum;

      ////////////////////////////
      if (ballClass.ballMarkOnGround.position.z > 0) {
        if (playersData.players[0].player.position.distanceTo(ballClass.ballMarkOnGround.position) < playersData.players[1].player.position.distanceTo(ballClass.ballMarkOnGround.position)) {
          playersData.activePlayerNum = 0;
        }
        else {
          playersData.activePlayerNum = 1;
        }
      }

      ballClass.ballMark.position.copy(playersData.players[playersData.activePlayerNum].player.position)
      ballClass.ballMark.position.y = 0.1;

      playersData.opponentsPas = true;

    }
    else if (playersData.opponentTop.position.distanceTo(ballClass.ball.position) > 1.1) {
      playersData.opponentsPas = false;
    }

    if (playersData.opponents[playersData.activeOpponentNum].opponent.position.z > -2) {
      playersData.opponentTapShoot = true;
    }
    else {
      playersData.opponentTapShoot = false;
    }

    if (ballClass.ball.position.distanceTo(playersData.opponentShootMark.position) < 2 && playersData.opponentTapShoot && !playersData.opponentFly) {
      playersData.opponentBodies[playersData.activeOpponentNum].applyImpulse({ x: 0, y: 5.2, z: 0 }, true)
    }
    if (playersData.opponentBodies[playersData.activeOpponentNum].translation().y >= playersData.playerHeight / 1.5) {
      playersData.opponentFly = true;
    }
    if (playersData.opponentBodies[playersData.activeOpponentNum].translation().y < playersData.playerHeight / 1.5) {
      playersData.opponentFly = false;
    }


    if (playersData.ballOpponentCollision && playersData.opponentFly) {
      //удар
      const landingPoint = new THREE.Vector3(getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2), 0, getRandomNumber(4, worldClass.heightPlane / 2));
      this.shootEngine(0.05, 0.10, landingPoint)

      playersData.opponentsIter = 0;

      ////////////////////////////
      if (ballClass.ballMarkOnGround.position.z > 0) {
        if (playersData.players[0].player.position.distanceTo(ballClass.ballMarkOnGround.position) < playersData.players[1].player.position.distanceTo(ballClass.ballMarkOnGround.position)) {
          playersData.activePlayerNum = 0;
        }
        else {
          playersData.activePlayerNum = 1;
        }
      }

    }

  }

  shootEngine(heightFactor, speedFactor, landingPoint) {

    let ballClass = this.ballClass;
    let playersData = this.playersData;
    let worldClass = this.worldClass;

    const ballPosition = ballClass.ballBody.translation();

    ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);

    const deltaX = landingPoint.x - ballPosition.x;
    const deltaZ = landingPoint.z - ballPosition.z;

    const timeOfFlight = Math.sqrt((2 * heightFactor) / Math.abs(worldClass.gravity));

    const horizontalVelocityX = (deltaX / timeOfFlight) * speedFactor;
    const horizontalVelocityZ = (deltaZ / timeOfFlight) * speedFactor;
    const verticalVelocityY = Math.sqrt(2 * Math.abs(worldClass.gravity) * heightFactor);

    const impulse = {
      x: horizontalVelocityX,
      y: verticalVelocityY,
      z: horizontalVelocityZ
    };

    ballClass.ballMarkOnGround.position.copy(landingPoint);
    ballClass.ballMarkOnGround.position.y = 0.2;

    ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ballClass.ballBody.applyImpulse(impulse, true);
  }

}