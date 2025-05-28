import * as THREE from "three";
import { getRandomNumber, mapRange, randomVector } from "./functions/functions";

export class EngineTraining {
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
      if (this.gameClass.startGame) {
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
            if (this.gameClass.serve && !this.gameClass.gameSuspended && this.playersData.playerServe) {
              // playersData.serveTap = true;
              // this.playersData.servePowerLine += 1;
              // document.querySelector('.power_block').style.width = this.playersData.servePowerLine + 'px';
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
      }
    });
    addEventListener("keyup", (event) => {
      if (this.gameClass.startGame) {
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
      }
    });

  }

  game() {

    this.playersData.playerTop.scale.x = this.playersData.players[this.playersData.activePlayerNum].skill;
    this.playersData.playerTop.scale.z = this.playersData.players[this.playersData.activePlayerNum].skill;



    if (this.gameClass.serve && this.playersData.playerServe) {
      this.ballClass.ballBody.setTranslation({
        x: this.playersData.players[this.playersData.activePlayerNum].player.position.x,
        y: this.playersData.players[this.playersData.activePlayerNum].player.position.y + this.playersData.players[this.playersData.activePlayerNum].playerHeight / 4.5,
        z: this.playersData.players[this.playersData.activePlayerNum].player.position.z - 0.7,
      }, true)

    }

  }

  serve() {
    this.playersData.players[this.playersData.activePlayerNum].playerActiveServe = false;

    if (this.playersData.playerServe) this.playersData.players[this.playersData.activePlayerNum].animActive('serve_hit');


    let landingPoint = randomVector(this.worldClass.centerOpponentField, this.playersData.players[this.playersData.activePlayerNum].playerAccuracy);
    this.ballClass.ballBody.setGravityScale(1.0)









    this.passEngine(4, 0.55, landingPoint)
    this.reLandPosition(this.ballClass.ballBody.linvel(), this.ballClass.ballBody.translation())
    this.gameClass.serve = false;
  }

  goal(goal, who) {
    if (!this.gameClass.gameSuspended && !this.gameClass.serve) {
      console.log('ГОООЛ');


      if (goal == 'goal') {
        // if (this.ballClass.ballSideMe && this.ballClass.inPlane) {
        //   this.gameClass.oppScore++;
        //   this.playersData.playerActiveServe = 1 - this.playersData.playerActiveServe;
        //   this.playersData.playerServe = false;
        // }
        // else if (!this.ballClass.ballSideMe && this.ballClass.inPlane) {
        //   this.gameClass.meScore++;
        //   this.playersData.opponentActiveServe = 1 - this.playersData.opponentActiveServe;
        //   this.playersData.playerServe = true;
        // }
        // else if (!this.ballClass.inPlane && this.playersData.playerLastTouch) {
        //   this.gameClass.oppScore++;
        //   this.playersData.playerActiveServe = 1 - this.playersData.playerActiveServe;
        //   this.playersData.playerServe = false;
        // }
        // else if (!this.ballClass.inPlane && !this.playersData.playerLastTouch) {
        //   this.gameClass.meScore++;
        //   this.playersData.opponentActiveServe = 1 - this.playersData.opponentActiveServe;
        //   this.playersData.playerServe = true;
        // }


      }
      else if (goal == 'iters') {
        // if (who == 'player') {
        //   this.gameClass.oppScore++;
        //   this.playersData.playerActiveServe = 1 - this.playersData.playerActiveServe;
        //   this.playersData.playerServe = false;
        // }
        // else if (who == 'opponent') {
        //   this.gameClass.meScore++;
        //   this.playersData.opponentActiveServe = 1 - this.playersData.opponentActiveServe;
        //   this.playersData.playerServe = true;
        // }
      }

      this.gameClass.scoreUpdating = true;
      this.gameClass.scoreUpdate();
      this.gameClass.gameSuspended = true;
      setTimeout(() => {
        this.resetInGame();

        this.gameClass.gameSuspended = false;
        this.gameClass.serve = true;
        this.playersData.playerCanPas = false;
      }, 1000)
    }
  }


  playerTouching(player) {

    this.playersData.playerLastTouch = true;
    player.playerTouchNum++;
    if (player == this.playersData.players[this.playersData.activePlayerNum]) {
      this.playersData.players[1 - this.playersData.activePlayerNum].playerTouchNum = 0;
    }
    else {
      this.playersData.players[this.playersData.activePlayerNum].playerTouchNum = 0;
    }

    this.playersData.playersIter++;
    if (this.playersData.playersIter > 3 || this.playersData.players[this.playersData.activePlayerNum].playerTouchNum > 1) {
      this.goal('iters', 'player');
    }


    this.reLandPosition(this.ballClass.ballBody.linvel(), this.ballClass.ballBody.translation())






  }


  resetInGame() {
    this.ballClass.ballBody.setGravityScale(0.0)



    this.playersData.playersIter = 0;
    this.playersData.players[0].playerTouchNum = 0;
    this.playersData.players[1].playerTouchNum = 0;

    this.playersData.players[0].playerTapPas = false;
    this.playersData.players[1].playerTapPas = false;
    this.playersData.players[0].playerNowPas = false;
    this.playersData.players[1].playerNowPas = false;
    this.playersData.playerCanPas = true;

    let newPosPlayer1 = randomVector(this.playersData.players[0].startPosition, this.playersData.players[0].playerAccuracy)
    let newPosPlayer2 = randomVector(this.playersData.players[1].startPosition, this.playersData.players[1].playerAccuracy)

    this.playersData.playerBodies[0].setTranslation({ x: newPosPlayer1.x, y: newPosPlayer1.y, z: newPosPlayer1.z });
    this.playersData.playerBodies[1].setTranslation({ x: newPosPlayer2.x, y: newPosPlayer2.y, z: newPosPlayer2.z });


    this.playersData.players[0].playerTapShoot = false;
    this.playersData.players[1].playerTapShoot = false;
    this.playersData.playerCanShoot = true;
    this.playersData.playerFly = false;
    this.playersData.playerJump = false;

    this.playersData.players[0].playerActiveServe = false;
    this.playersData.players[1].playerActiveServe = false;

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

    if (ballClass.ball.position.z > -0.1 && ballClass.ball.position.z < 0.1) {
      ballClass.ballCenterField = true;
      playersData.playerCanPas = true;
    }
    else {
      ballClass.ballCenterField = false;
    }

    if (ballClass.ball.position.x > -worldClass.widthPlane / 2 && ballClass.ball.position.x < worldClass.widthPlane / 2 && ballClass.ball.position.z > -worldClass.heightPlane / 2 && ballClass.ball.position.z < worldClass.heightPlane / 2) {
      ballClass.inPlane = true;
    }
    else {
      ballClass.inPlane = false;
    }






    let topPosY = this.playersData.players[this.playersData.activePlayerNum].player.position.y + 1.3;
    if (this.ballClass.ball.position.y < topPosY && !this.playersData.players[this.playersData.activePlayerNum].playerTapShoot) topPosY = this.ballClass.ball.position.y - 0.3;

    this.playersData.playerTopBody.setNextKinematicTranslation({ x: this.playersData.players[this.playersData.activePlayerNum].player.position.x, y: topPosY, z: this.playersData.players[this.playersData.activePlayerNum].player.position.z - 0.0 }, true)

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


        if (value.player.position.x - value.previousPosition.x == 0 & value.player.position.z - value.previousPosition.z == 0 & !value.playerActiveServe) {
          this.playersData.players[index].animActive('idle');
          value.playerModel.rotation.y = Math.PI
        }

        value.previousPosition.copy(value.player.position);
      }




    })



    if ((!this.gameClass.serve || (this.gameClass.serve && !this.playersData.playerServe)) && !this.playersData.players[this.playersData.activePlayerNum].playerTapShoot) this.playersData.playerBodies[this.playersData.activePlayerNum].setTranslation({ x: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().x + this.xx, y: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().y, z: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().z + this.zz }, true)

    if (this.gameClass.serve && this.playersData.playerServe) {
      this.playersData.activePlayerNum = this.playersData.playerActiveServe;
      this.playersData.playerBodies[this.playersData.activePlayerNum].setTranslation({ x: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().x + this.xx, y: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().y, z: worldClass.heightPlane / 2 + 0.2 })
      this.playersData.players[this.playersData.activePlayerNum].playerActiveServe = true;
      if (this.xx == 0) this.playersData.players[this.playersData.activePlayerNum].animActive('serve');
    }


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

    worldClass.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (handle1 == ballClass.ballBody.handle && handle2 == '4e-323') {
        this.reLandPosition(this.ballClass.ballBody.linvel(), this.ballClass.ballBody.translation())
      }
      if (handle2 == ballClass.ballBody.handle && handle1 == 0 && started) {
        playersData.ballPlayerCollision = true;
      }

      if (handle2 == ballClass.ballBody.handle && handle1 == playersData.playerBodies[1 - playersData.activePlayerNum].handle && started) {
        playersData.activePlayerNum = 1 - playersData.activePlayerNum;
        playerTouching(playersData.players[1 - playersData.activePlayerNum]);
      }





      if (handle1 == ballClass.ballBody.handle && handle2 == '3.5e-323' && !this.gameClass.gameSuspended && started) {
        this.goal('goal');

        ballClass.ballTouch.position.x = ballClass.ball.position.x;
        ballClass.ballTouch.position.z = ballClass.ball.position.z;

      }

    })


    if (playersData.playerCanPas && playersData.ballPlayerCollision && playersData.playerBodies[playersData.activePlayerNum].translation().y < 1 && !this.gameClass.serve) {
      //пас
      this.playerTouching(this.playersData.players[this.playersData.activePlayerNum]);

      if (this.xx != 0 || this.zz != 0) {
        this.playersData.playerMistakeNow = 100 - mapRange(this.playersData.players[this.playersData.activePlayerNum].agility, 50, 100, 80, 100);
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
      let passHeight;
      if (this.playersData.playersIter == 3) {
        passHeight = this.playersData.playerPasHeightShot
      }
      else if (this.playersData.playersIter == 2) {
        passHeight = this.playersData.playerPasVeryHeight
      }
      else {
        passHeight = this.playersData.playerPasHeight
      }
      this.passEngine(passHeight, 0.45, landingPoint)
      this.reLandPosition(this.ballClass.ballBody.linvel(), this.ballClass.ballBody.translation())


      // if (playersData.players[0].player.position.distanceTo(ballClass.ball.position) > playersData.players[1].player.position.distanceTo(ballClass.ball.position)) {
      //   this.playersData.players[this.playersData.activePlayerNum].playerTapPas = false;
      //   playersData.activePlayerNum = 0;
      // }
      // else {
      //   this.playersData.players[this.playersData.activePlayerNum].playerTapPas = false;
      //   playersData.activePlayerNum = 1;
      // }
      this.playersData.players[this.playersData.activePlayerNum].playerTapPas = false;
      playersData.activePlayerNum = 1 - playersData.activePlayerNum


      playersData.playerCanPas = false;



      setTimeout(() => {
        playersData.playerCanPas = true;
        this.playersData.playerMistakeNow = 0;
        this.playersData.players[0].playerNowPas = false;
        this.playersData.players[1].playerNowPas = false;
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


      this.playerTouching(this.playersData.players[this.playersData.activePlayerNum]);

      this.playersData.players[this.playersData.activePlayerNum].animActive('jump_hit', 3, 0.1);
      this.playersData.players[this.playersData.activePlayerNum].playerJumpHit = true;




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
    //   console.log(direction)

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






    /************************************************************************************************/






  }

  reLandPosition(impulse, currentBallPosition) {

    const ballMass = 1.0; // масса мяча в килограммах

    const g = -this.worldClass.gravity; // ускорение свободного падения в м/с²

    const initialVelocity = {
      x: impulse.x / ballMass, // скорость в направлении x
      y: impulse.y / ballMass, // скорость в направлении y
      z: impulse.z / ballMass  // скорость в направлении z
    };

    // Учитываем высоту, с которой мы начинаем (предположим, это y-координата текущей позиции):
    const startHeight = currentBallPosition.y;

    // Расчет времени полета до момента падения на землю
    // Уравнение движения в вертикальном направлении: h = h0 + v0*t - (1/2)*g*t^2
    // В нашем случае h = 0 (земля), h0 = startHeight, v0 = initialVelocity.y
    // Упростим уравнение: 0 = startHeight + initialVelocity.y * t - (1/2) * g * t^2

    // Это квадратное уравнение относительно t:
    const aCoeff = -0.5 * g;
    const bCoeff = initialVelocity.y;
    const cCoeff = startHeight;

    const discriminant = bCoeff * bCoeff - 4 * aCoeff * cCoeff;


    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-bCoeff + sqrtDiscriminant) / (2 * aCoeff);
    const t2 = (-bCoeff - sqrtDiscriminant) / (2 * aCoeff);

    // Нам нужно только положительное время
    const timeToFall = Math.max(t1, t2);

    // Находим координаты, когда мяч упадет на землю
    const finalPosition = {
      x: currentBallPosition.x + initialVelocity.x * timeToFall,
      y: 0, // потому что мяч упадет на уровень земли
      z: currentBallPosition.z + initialVelocity.z * timeToFall
    };

    // console.log('Позиция падения мяча:', finalPosition);
    this.ballClass.ballMarkOnGround.position.copy(finalPosition);
    this.ballClass.ballMarkOnGround.position.y = 0.1;



  }

  // shotEngine(speed, landingPoint) {
  //   const ballClass = this.ballClass;
  //   const worldClass = this.worldClass;

  //   const currentBallPosition = ballClass.ballBody.translation();
  //   const gravity = worldClass.gravity;

  //   // Сброс скоростей
  //   ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
  //   ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);

  //   // Вычисление вектора направления
  //   const direction = landingPoint.clone().sub(currentBallPosition);
  //   const horizontalDistance = Math.sqrt(direction.x * direction.x + direction.z * direction.z);
  //   const verticalDistance = direction.y;

  //   // Увеличиваем скорость для больших расстояний
  //   const distanceFactor = Math.max(1, horizontalDistance / 10); // Настройте коэффициент по необходимости
  //   const adjustedSpeed = speed * distanceFactor;

  //   // Расчет времени полета
  //   if (adjustedSpeed <= 0) {
  //     console.error("Speed must be greater than zero.");
  //     return;
  //   }
  //   const timeOfFlight = horizontalDistance / adjustedSpeed;

  //   // Учет гравитации
  //   const totalHeight = (0.5 * (-gravity) * timeOfFlight * timeOfFlight);
  //   const adjustedVerticalSpeed = (verticalDistance + totalHeight) / timeOfFlight;

  //   // Итоговый вектор скорости
  //   const finalVelocity = new THREE.Vector3(direction.x, adjustedVerticalSpeed, direction.z).normalize().multiplyScalar(adjustedSpeed);

  //   // Расчет импульса
  //   const mass = 1; // или получите массу из ballBody
  //   const impulse = finalVelocity.multiplyScalar(mass);

  //   // Обновление позиции метки
  //   ballClass.ballMarkOnGround.position.copy(landingPoint);
  //   ballClass.ballMarkOnGround.position.y = 0.2;

  //   // Применение импульса
  //   ballClass.ballBody.applyImpulse(impulse, true);
  // }

}