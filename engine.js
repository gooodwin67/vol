import * as THREE from "three";
import { getRandomNumber, randomVector } from "./functions/functions";

export class Engine {
  constructor(scene, ballClass, worldClass, playersData, gameClass) {
    this.scene = scene;
    this.ballClass = ballClass;
    this.worldClass = worldClass;
    this.playersData = playersData;
    this.gameClass = gameClass;

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
          if (this.gameClass.serve && !this.gameClass.gameSuspended) {
            this.serve();
          }
          else {
            if (!this.playersData.players[this.playersData.activePlayerNum].playerTapPas) ballClass.ballMark.position.copy(this.playersData.players[this.playersData.activePlayerNum].player.position);
            this.playersData.players[this.playersData.activePlayerNum].playerTapPas = true;
            this.xx = 0;
            this.zz = 0;
          }

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
          this.playersData.players[this.playersData.activePlayerNum].playerTapShoot = true;
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
          this.playersData.players[this.playersData.activePlayerNum].playerTapPas = false;
          break;
        case "в":
        case "d":
          this.playersData.players[this.playersData.activePlayerNum].playerTapShoot = false;
          break;
      }
    });
  }

  game() {
    if (this.gameClass.serve) {
      this.ballClass.ballBody.setTranslation({
        x: this.playersData.players[this.playersData.activePlayerNum].player.position.x,
        y: this.playersData.players[this.playersData.activePlayerNum].player.position.y + this.playersData.players[this.playersData.activePlayerNum].playerHeight / 2.4,
        z: this.playersData.players[this.playersData.activePlayerNum].player.position.z,
      }, true)

    }
  }

  serve() {
    const landingPoint = randomVector(this.worldClass.centerOpponentField, this.playersData.players[this.playersData.activePlayerNum].playerAccuracy);
    this.passEngine(3, 0.45, landingPoint)
    this.gameClass.serve = false;
  }

  goal(goal, who) {
    if (!this.gameClass.gameSuspended && !this.gameClass.serve) {
      console.log('ГОООЛ');
      document.querySelector('.power_wrap').style.backgroundColor = 'red';

      if (goal == 'goal') {
        if (this.ballClass.ballSideMe && this.ballClass.inPlane) {
          this.gameClass.oppScore++;
        }
        else if (!this.ballClass.ballSideMe && this.ballClass.inPlane) {
          this.gameClass.meScore++;
        }
        else if (!this.ballClass.inPlane && this.playersData.playerLastTouch) {
          this.gameClass.oppScore++;
        }
        else if (!this.ballClass.inPlane && !this.playersData.playerLastTouch) {
          this.gameClass.meScore++;
        }


      }
      else if (goal == 'iters') {
        if (who == 'player') {
          this.gameClass.oppScore++;
        }
        else if (who == 'opponent') {
          this.gameClass.meScore++;
        }
      }

      this.gameClass.scoreUpdating = true;
      this.gameClass.scoreUpdate();
      this.gameClass.gameSuspended = true;
      setTimeout(() => {
        this.resetInGame();
        document.querySelector('.power_wrap').style.backgroundColor = 'white';
        this.gameClass.gameSuspended = false;
        this.gameClass.serve = true;
      }, 200)
    }
  }


  playerTouching() {
    this.playersData.playerLastTouch = true;
    this.playersData.players[this.playersData.activePlayerNum].playerTouchNum++
    this.playersData.players[1 - this.playersData.activePlayerNum].playerTouchNum = 0;
    this.playersData.playersIter++;
    if (this.playersData.playersIter > 3 || this.playersData.players[this.playersData.activePlayerNum].playerTouchNum > 1) {
      //this.goal('iters', 'player');
    }
    this.playersData.opponentsIter = 0;
    this.playersData.opponents[0].opponentTouchNum = 0;
    this.playersData.opponents[1].opponentTouchNum = 0;
  }

  opponentTouching() {
    this.playersData.playerLastTouch = false;
    this.playersData.opponents[this.playersData.activeOpponentNum].opponentTouchNum++
    this.playersData.opponents[1 - this.playersData.activeOpponentNum].opponentTouchNum = 0

    this.playersData.opponentsIter++;
    if (this.playersData.opponentsIter > 3 || this.playersData.opponents[this.playersData.activeOpponentNum].opponentTouchNum > 1) {
      this.goal('iters', 'opponent');
    }
    this.playersData.playersIter = 0;
    this.playersData.players[0].playerTouchNum = 0;
    this.playersData.players[1].playerTouchNum = 0;
  }

  resetInGame() {
    this.playersData.opponentsIter = 0;
    this.playersData.opponents[0].opponentTouchNum = 0;
    this.playersData.opponents[1].opponentTouchNum = 0;

    this.playersData.playersIter = 0;
    this.playersData.players[0].playerTouchNum = 0;
    this.playersData.players[1].playerTouchNum = 0;

    this.playersData.playerTapPas = false;
    this.playersData.playerCanPas = true;
    this.playersData.playerNowPas = false;

    this.playersData.playerTapShoot = false;
    this.playersData.playerCanShoot = true;
    this.playersData.playerFly = false;
    this.playersData.playerJump = false;

    this.playersData.opponentsPas = false;
    this.playersData.opponentsShoot = false;



    this.playersData.opponentFly = false;

    this.playersData.opponentTapShoot = false;

    this.playersData.opponentHiting = false;
  }

  movePlayer() {

    let ballClass = this.ballClass;
    let playersData = this.playersData;
    let worldClass = this.worldClass;

    if (ballClass.ball.position.z > 0) {
      ballClass.ballSideMe = true;
    }
    else {
      ballClass.ballSideMe = false;
      this.playersData.players[0].playerNowPas = false;
      this.playersData.players[1].playerNowPas = false;
    }

    if (ballClass.ball.position.x > -worldClass.widthPlane / 2 && ballClass.ball.position.x < worldClass.widthPlane / 2 && ballClass.ball.position.z > -worldClass.heightPlane / 2 && ballClass.ball.position.z < worldClass.heightPlane / 2) {
      ballClass.inPlane = true;
    }
    else {
      ballClass.inPlane = false;
    }



    let topPosY = this.playersData.players[this.playersData.activePlayerNum].player.position.y + 1.3;
    if (this.ballClass.ball.position.y < topPosY && !this.playersData.playerTapShoot) topPosY = this.ballClass.ball.position.y - 0.3;

    this.playersData.playerTopBody.setNextKinematicTranslation({ x: this.playersData.players[this.playersData.activePlayerNum].player.position.x, y: topPosY, z: this.playersData.players[this.playersData.activePlayerNum].player.position.z - 0.5 }, true)

    if (this.playersData.players[this.playersData.activePlayerNum].playerNowPas & playersData.playerTop.position.distanceTo(ballClass.ball.position) < 1.9) {
      if (playersData.playerTop.position.y > this.playersData.players[this.playersData.activePlayerNum].playerHeight * 1.2) {
        this.playersData.players[this.playersData.activePlayerNum].animActive('pass_hit', 1, 0.4);
      }
      else {
        this.playersData.players[this.playersData.activePlayerNum].animActive('pass_bottom_hit', 2, 0.2);
      }
    }
    else if (this.playersData.players[this.playersData.activePlayerNum].playerTapPas && !this.playersData.players[this.playersData.activePlayerNum].playerNowPas) {
      if (playersData.playerTop.position.y > this.playersData.players[this.playersData.activePlayerNum].playerHeight) {
        this.playersData.players[this.playersData.activePlayerNum].animActive('pass', 1, 0.4);
      }
      else {
        this.playersData.players[this.playersData.activePlayerNum].animActive('pass_bottom', 1, 0.2);
      }
      this.playersData.players[this.playersData.activePlayerNum].playerNowPas = true;
    }




    this.playersData.players.forEach((value, index, array) => {
      value.playerModel.position.copy(new THREE.Vector3(value.player.position.x, value.player.position.y - 0.7, value.player.position.z));
      value.playerModel.userData.mixer.update(value.clock.getDelta());

      //console.log(playersData.playerTop.position.distanceTo(ballClass.ball.position))




      if (!this.playersData.playerFly & !this.playersData.players[this.playersData.activePlayerNum].playerTapPas && !this.playersData.players[this.playersData.activePlayerNum].playerNowPas) {
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




    })



    if (!this.playersData.players[this.playersData.activePlayerNum].playerTapShoot) this.playersData.playerBodies[this.playersData.activePlayerNum].setTranslation({ x: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().x + this.xx, y: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().y, z: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().z + this.zz }, true)


    if (this.forward) {
      if (!this.playersData.players[this.playersData.activePlayerNum].playerTapPas && !this.playersData.players[this.playersData.activePlayerNum].playerTapShoot) {
        this.zz = -this.playersData.players[this.playersData.activePlayerNum].playerSpeed;
      }
      else {
        this.ballClass.ballMark.position.z -= this.playersData.players[this.playersData.activePlayerNum].playerThinkSpeed;
      }
    }
    else if (this.backward) {
      if (!this.playersData.players[this.playersData.activePlayerNum].playerTapPas && !this.playersData.players[this.playersData.activePlayerNum].playerTapShoot) {
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
      if (!this.playersData.players[this.playersData.activePlayerNum].playerTapPas && !this.playersData.players[this.playersData.activePlayerNum].playerTapShoot) {
        this.xx = -this.playersData.players[this.playersData.activePlayerNum].playerSpeed;
      }
      else {
        this.ballClass.ballMark.position.x -= this.playersData.players[this.playersData.activePlayerNum].playerThinkSpeed;
      }
    }
    else if (this.right) {
      if (!this.playersData.players[this.playersData.activePlayerNum].playerTapPas && !this.playersData.players[this.playersData.activePlayerNum].playerTapShoot) {
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
      if (handle2 == ballClass.ballBody.handle && handle1 == 0 && started) {
        playersData.ballPlayerCollision = true;
      }
      if (handle2 == ballClass.ballBody.handle && handle1 == '1.5e-323' && started) {
        playersData.ballOpponentCollision = true;
      }
      if (handle2 == ballClass.ballBody.handle && handle1 == playersData.playerBodies[1 - playersData.activePlayerNum].handle && started) {
        playersData.activePlayerNum = 1 - playersData.activePlayerNum;
        playerTouching();
      }


      if (handle1 == ballClass.ballBody.handle && handle2 == '3.5e-323' && !this.gameClass.gameSuspended && started) {
        this.goal('goal');
        ballClass.ballTouch.position.x = ballClass.ball.position.x;
        ballClass.ballTouch.position.z = ballClass.ball.position.z;

      }

    })





    if (playersData.playerCanPas && playersData.ballPlayerCollision && playersData.playerBodies[playersData.activePlayerNum].translation().y < 1) {
      //пас
      this.playerTouching();

      if (this.xx != 0 || this.zz != 0) {
        this.playersData.playerMistakeNow = 100 - this.playersData.players[this.playersData.activePlayerNum].agility;
      }

      let landingPoint;
      if (!this.playersData.players[this.playersData.activePlayerNum].playerNowPas) {
        landingPoint = randomVector(this.playersData.players[1 - this.playersData.activePlayerNum].player.position, this.playersData.players[this.playersData.activePlayerNum].playerAccuracy - this.playersData.playerMistakeNow);
        if (playersData.playerTop.position.y > this.playersData.players[this.playersData.activePlayerNum].playerHeight) {
          this.playersData.players[this.playersData.activePlayerNum].animActive('pass_hit', 1, 0.4);
        }
        else {
          this.playersData.players[this.playersData.activePlayerNum].animActive('pass_bottom_hit', 1, 0.2);
        }
      }
      else {
        landingPoint = randomVector(ballClass.ballMark.position, this.playersData.players[this.playersData.activePlayerNum].playerAccuracy - this.playersData.playerMistakeNow);
        if (playersData.playerTop.position.y > this.playersData.players[this.playersData.activePlayerNum].playerHeight) {
          this.playersData.players[this.playersData.activePlayerNum].animActive('pass_hit', 1, 0.4);
        }
        else {
          this.playersData.players[this.playersData.activePlayerNum].animActive('pass_bottom_hit', 1, 0.2);
        }
      }
      this.passEngine(3, 0.45, landingPoint)
      if (playersData.opponents[0].opponent.position.distanceTo(ballClass.ballMarkOnGround.position) < playersData.opponents[1].opponent.position.distanceTo(ballClass.ballMarkOnGround.position)) {
        playersData.activeOpponentNum = 0;
      }
      else {
        playersData.activeOpponentNum = 1;
      }

      if (playersData.players[0].player.position.distanceTo(ballClass.ball.position) > playersData.players[1].player.position.distanceTo(ballClass.ball.position)) {
        this.playersData.players[this.playersData.activePlayerNum].playerTapPas = false;
        playersData.activePlayerNum = 0;
      }
      else {
        this.playersData.players[this.playersData.activePlayerNum].playerTapPas = false;
        playersData.activePlayerNum = 1;
      }
      playersData.playerCanPas = false;
      this.playersData.players[this.playersData.activePlayerNum].playerNowPas = false;

      setTimeout(() => {
        playersData.playerCanPas = true;
        this.playersData.playerMistakeNow = 0;
      }, 100);

    }


    /****************************************************************************************************************************/
    //прыжок

    if (ballClass.ball.position.distanceTo(playersData.playerShootMark.position) < 2 && this.playersData.players[this.playersData.activePlayerNum].playerTapShoot && !playersData.playerFly) {
      playersData.playerBodies[playersData.activePlayerNum].applyImpulse({ x: 0, y: 8.2, z: 0 }, true)
    }
    else if (ballClass.ball.position.distanceTo(playersData.playerShootMark.position) > 2) {
      this.playersData.players[this.playersData.activePlayerNum].playerJumpHit = false;
    }
    if (playersData.playerBodies[playersData.activePlayerNum].translation().y >= playersData.playerHeight / 1.5) {
      playersData.playerFly = true;
      if (!this.playersData.players[this.playersData.activePlayerNum].playerJumpHit) this.playersData.players[this.playersData.activePlayerNum].animActive('jump', 1, 0.1);
    }
    if (playersData.playerBodies[playersData.activePlayerNum].translation().y < playersData.playerHeight / 1.5) {
      playersData.playerFly = false;
    }

    if (playersData.ballPlayerCollision && playersData.playerBodies[playersData.activePlayerNum].translation().y > 1 && playersData.playerCanShoot) {


      //удар
      const landingPoint = randomVector(ballClass.ballMark.position, this.playersData.players[this.playersData.activePlayerNum].playerAccuracy);
      //this.shootEngine(0.02, 0.08, landingPoint)
      this.shotEngine(playersData.players[playersData.activePlayerNum].shotSpeed, landingPoint)


      this.playerTouching();

      this.playersData.players[this.playersData.activePlayerNum].animActive('jump_hit', 3, 0.1);
      this.playersData.players[this.playersData.activePlayerNum].playerJumpHit = true;



      if (playersData.opponents[0].opponent.position.distanceTo(ballClass.ballMarkOnGround.position) < playersData.opponents[1].opponent.position.distanceTo(ballClass.ballMarkOnGround.position)) {
        playersData.activeOpponentNum = 0;
      }
      else {
        playersData.activeOpponentNum = 1;
      }

      playersData.playerCanShoot = false;

      setTimeout(() => {
        playersData.playerCanShoot = true;
      }, 10)

    }

    if (this.playersData.players[this.playersData.activePlayerNum].playerTapPas || this.playersData.players[this.playersData.activePlayerNum].playerTapShoot) {
      this.ballClass.ballMark.material.opacity = 0.6;
    }
    else {
      this.ballClass.ballMark.material.opacity = 0;
    }



    // //движение не активного игрока
    // if (this.playersData.players[1 - this.playersData.activePlayerNum].playerTapPas && ballClass.ballMark.position.z > 0) {

    //   const playerNotActiveBody = playersData.playerBodies[1 - playersData.activePlayerNum];
    //   const playerNotActive = playersData.players[1 - playersData.activePlayerNum].player;

    //   const direction = new THREE.Vector3();
    //   direction.subVectors(new THREE.Vector3(ballClass.ballMark.position.x, playerNotActive.position.y, ballClass.ballMark.position.z), playerNotActive.position).normalize();

    //   const distance = Math.sqrt(
    //     Math.pow(playerNotActive.position.x - ballClass.ballMark.position.x, 2) +
    //     Math.pow(playerNotActive.position.z - ballClass.ballMark.position.z, 2)
    //   );
    //   if (distance > 0.5) {
    //     const movementVector = direction.clone().multiplyScalar(playersData.players[1 - playersData.activePlayerNum].playerSpeed / 2.5);
    //     if (playerNotActive.position.z > ballClass.ballMark.position.z)
    //       playerNotActiveBody.setTranslation({ x: playerNotActive.position.x + movementVector.x, y: playerNotActive.position.y, z: playerNotActive.position.z + movementVector.z }, true)
    //   }
    // }

  }

  moveOpponent() {

    let ballClass = this.ballClass;
    let playersData = this.playersData;
    let worldClass = this.worldClass;

    this.playersData.opponents.forEach((value, index, array) => {
      value.opponentModel.position.copy(new THREE.Vector3(value.opponent.position.x, value.opponent.position.y - 0.7, value.opponent.position.z));
      value.opponentModel.userData.mixer.update(value.clock.getDelta());

      if (!playersData.opponentFly & !value.opponentTapPas) {
        if (value.opponent.position.z - value.previousPosition.z > 0 && value.opponent.position.z - value.previousPosition.z > Math.abs(value.opponent.position.x - value.previousPosition.x)) {
          this.playersData.opponents[index].animActive('run');
        }
        else if (value.opponent.position.z - value.previousPosition.z < 0 && value.opponent.position.z - value.previousPosition.z < Math.abs(value.opponent.position.x - value.previousPosition.x)) {
          this.playersData.opponents[index].animActive('runBack');
        }
        else if (value.opponent.position.x - value.previousPosition.x < 0 && value.opponent.position.x - value.previousPosition.x < Math.abs(value.opponent.position.z - value.previousPosition.z)) {
          this.playersData.opponents[index].animActive('runRight');
        }
        else if (value.opponent.position.x - value.previousPosition.x > 0 && value.opponent.position.x - value.previousPosition.x > Math.abs(value.opponent.position.z - value.previousPosition.z)) {
          this.playersData.opponents[index].animActive('runLeft');
        }


        if (value.opponent.position.x - value.previousPosition.x == 0 & value.opponent.position.z - value.previousPosition.z == 0) {
          this.playersData.opponents[index].animActive('idle');
        }
      }

      value.previousPosition.copy(value.opponent.position);

    })


    playersData.opponentShootMark.position.x = playersData.opponents[playersData.activeOpponentNum].opponent.position.x;
    playersData.opponentShootMark.position.z = playersData.opponents[playersData.activeOpponentNum].opponent.position.z;

    let topPosY = playersData.opponents[playersData.activeOpponentNum].opponent.position.y + 1.3;
    if (ballClass.ball.position.y < topPosY) topPosY = ballClass.ball.position.y;

    this.playersData.opponentTopBody.setNextKinematicTranslation({ x: playersData.opponents[playersData.activeOpponentNum].opponent.position.x, y: topPosY - 0.3, z: playersData.opponents[playersData.activeOpponentNum].opponent.position.z }, true)

    if (ballClass.ballMarkOnGround.position.z < 0) {

      const direction = new THREE.Vector3();
      direction.subVectors(new THREE.Vector3(ballClass.ballMarkOnGround.position.x, playersData.opponents[playersData.activeOpponentNum].opponent.position.y, ballClass.ballMarkOnGround.position.z + 0.2), playersData.opponents[playersData.activeOpponentNum].opponent.position).normalize();

      const distance = Math.sqrt(
        Math.pow(playersData.opponents[playersData.activeOpponentNum].opponent.position.x - ballClass.ballMarkOnGround.position.x, 2) +
        Math.pow(playersData.opponents[playersData.activeOpponentNum].opponent.position.z - ballClass.ballMarkOnGround.position.z, 2)
      );

      if (distance > 0.5) {

        const opponentBody = playersData.opponentBodies[playersData.activeOpponentNum];
        const movementVector = direction.clone().multiplyScalar(playersData.opponents[playersData.activeOpponentNum].opponentSpeed);
        opponentBody.setTranslation({ x: opponentBody.translation().x + movementVector.x, y: opponentBody.translation().y, z: opponentBody.translation().z + movementVector.z }, true)

        playersData.opponents[playersData.activeOpponentNum].opponentTapPas = false;

      }
      else {
        if (!playersData.opponentFly) {
          if (playersData.opponentTop.position.y > this.playersData.opponents[playersData.activeOpponentNum].opponentHeight) {
            this.playersData.opponents[playersData.activeOpponentNum].animActive('pass');
          }
          else {
            this.playersData.opponents[playersData.activeOpponentNum].animActive('pass_bottom');
          }
          playersData.opponents[playersData.activeOpponentNum].opponentTapPas = true;
        }

      }


    }
    /*//////////////////////////////////////////////////////////////////////////*/



    if (playersData.ballOpponentCollision && !playersData.opponentsPas && !playersData.opponentTapShoot) {
      //пас

      this.opponentTouching()

      let landingPoint;
      if (!playersData.opponentFly) {
        if (playersData.opponentTop.position.y > this.playersData.opponents[playersData.activeOpponentNum].opponentHeight) {
          this.playersData.opponents[playersData.activeOpponentNum].animActive('pass_hit');
        }
        else {
          this.playersData.opponents[playersData.activeOpponentNum].animActive('pass_bottom_hit');
        }
      }
      playersData.opponents[playersData.activeOpponentNum].opponentTapPas = false;



      if (playersData.opponentTopBody.linvel().x != 0 || playersData.opponentTopBody.linvel().z != 0) {
        this.playersData.opponentMistakeNow = 100 - this.playersData.opponents[this.playersData.activePlayerNum].agility;
      }


      setTimeout(() => {
        this.playersData.opponentMistakeNow = 0;
      }, 100);

      if (playersData.opponentsIter < 3) {
        //landingPoint = new THREE.Vector3(getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2), 0, getRandomNumber(-worldClass.heightPlane / 2, 0));
        const zz = getRandomNumber(this.playersData.opponents[this.playersData.activeOpponentNum].opponent.position.z, 0)
        const xx = getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2)
        const yy = 0;
        const newLandPos = new THREE.Vector3(xx, yy, zz);

        landingPoint = randomVector(newLandPos, this.playersData.opponents[this.playersData.activeOpponentNum].opponentAccuracy - this.playersData.opponentMistakeNow);
      }
      else {
        landingPoint = new THREE.Vector3(getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2), 0, getRandomNumber(4, worldClass.heightPlane / 2));

      }

      if (!playersData.opponentTapShoot) this.passEngine(3, 0.45, landingPoint)

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
      playersData.opponentBodies[playersData.activeOpponentNum].applyImpulse({ x: 0, y: 8.2, z: 0 }, true)
    }
    if (playersData.opponentBodies[playersData.activeOpponentNum].translation().y >= playersData.playerHeight / 1.5) {
      playersData.opponentFly = true;
      if (!playersData.opponentHiting) this.playersData.opponents[playersData.activeOpponentNum].animActive('jump');
    }
    if (playersData.opponentBodies[playersData.activeOpponentNum].translation().y < playersData.playerHeight / 1.5) {
      playersData.opponentFly = false;
      playersData.opponentHiting = false;
    }


    if (playersData.ballOpponentCollision && playersData.opponentFly) {
      //удар
      const landingPoint = new THREE.Vector3(getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2), 0, getRandomNumber(4, worldClass.heightPlane / 2));
      this.playersData.opponents[playersData.activeOpponentNum].animActive('jump_hit');
      playersData.opponents[playersData.activeOpponentNum].opponentTapPas = false;
      playersData.opponentHiting = true;
      //this.passEngine(0.02, 0.07, landingPoint)
      this.shotEngine(playersData.opponents[playersData.activeOpponentNum].shotSpeed, landingPoint)

      this.opponentTouching();

      ////////////////////////////
      if (ballClass.ballMarkOnGround.position.z > 0) {

        this.playersData.players[0].playerTapPas = false
        this.playersData.players[0].playerTapShoot = false
        this.playersData.players[1].playerTapPas = false
        this.playersData.players[1].playerTapShoot = false

        if (playersData.players[0].player.position.distanceTo(ballClass.ballMarkOnGround.position) < playersData.players[1].player.position.distanceTo(ballClass.ballMarkOnGround.position)) {
          playersData.activePlayerNum = 0;
        }
        else {
          playersData.activePlayerNum = 1;
        }
      }

      ballClass.ballMark.position.copy(this.playersData.players[this.playersData.activePlayerNum].player.position)


    }

  }

  passEngine(heightFactor, speedFactor, landingPoint) {

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

  shotEngine(speed, landingPoint) {

    let ballClass = this.ballClass;
    let worldClass = this.worldClass;

    const currentBallPosition = ballClass.ballBody.translation();

    const gravity = worldClass.gravity;

    ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);

    // Шаг 1: вычисляем вектор направления
    const direction = landingPoint.clone().sub(currentBallPosition); // вектор от мяча к точке приземления
    const horizontalDistance = Math.sqrt(direction.x * direction.x + direction.z * direction.z); // горизонтальное расстояние
    const verticalDistance = direction.y; // вертикальное расстояние

    // Шаг 2: вычисляем время полета
    // Используем уравнение движения для свободного падения
    const timeOfFlight = (horizontalDistance / speed); // базовое время полета без учета гравитации, задаем горизонтальную скорость

    // Учитываем гравитацию
    const totalHeight = (0.5 * (-gravity) * timeOfFlight * timeOfFlight);
    const adjustedVerticalSpeed = (verticalDistance + totalHeight) / timeOfFlight; // корректируем вертикальную скорость

    // Шаг 3: создаем итоговый вектор скорости
    const finalVelocity = new THREE.Vector3(direction.x, adjustedVerticalSpeed, direction.z).normalize().multiplyScalar(speed);

    // Шаг 4: вычисляем импульс (импульс = скорость * масса)
    const mass = 1; // масса мяча
    const impulse = finalVelocity.multiplyScalar(mass);


    ballClass.ballMarkOnGround.position.copy(landingPoint);
    ballClass.ballMarkOnGround.position.y = 0.2;

    ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ballClass.ballBody.applyImpulse(impulse, true);
  }

}