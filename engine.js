import * as THREE from "three";
import { getRandomNumber, randomVector, mapRange } from "./functions/functions";

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
              if (!this.playersData.serveTap) ballClass.ballMark.position.set(0, 0, 0);
              this.playersData.serveTap = true;
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
            // ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
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
            if (this.playersData.serveTap == true) this.playersData.serveTap = false;
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

    this.ballClass.ballMark.position.y = 0.1;

    if (this.ballClass.ballBody.linvel().y != 0 && !this.gameClass.gameSuspended && !this.gameClass.serve) {
      this.ballClass.ballMarkOnGround.material.opacity = 0.8;
    }
    else {
      this.ballClass.ballMarkOnGround.material.opacity = 0;
    }

    if (this.ballClass.ballTouch.material.opacity > 0) this.ballClass.ballTouch.material.opacity -= 0.003;


    if (this.playersData.serveTap == true && this.playersData.servePowerLine < 100) {
      console.log(document.querySelectorAll('.serve_player_in').length)
      this.playersData.servePowerLine += 1;
      if (document.querySelectorAll('.serve_player_in').length > 1) {
        document.querySelectorAll('.serve_player_in')[this.playersData.activePlayerNum].style.width = this.playersData.servePowerLine + 'px';
      }
      else {
        document.querySelectorAll('.serve_player_in')[0].style.width = this.playersData.servePowerLine + 'px';
      }

    }
    else if (this.playersData.serveTap == true && this.playersData.servePowerLine > 99) {
      this.playersData.serveTap = false;
    }
    if (this.playersData.servePowerLine > 0 && !this.playersData.serveTap) {
      this.serve(this.playersData.servePowerLine);
      document.querySelectorAll('.serve_player_in')[0].style.width = 0 + 'px';
      if (document.querySelectorAll('.serve_player_in').length > 1) {
        document.querySelectorAll('.serve_player_in')[1].style.width = 0 + 'px';
      }
      this.playersData.servePowerLine = 0;
    }

    this.playersData.playerTop.scale.x = mapRange(this.playersData.players[this.playersData.activePlayerNum].skill, 50, 100, 1, 2);
    this.playersData.playerTop.scale.z = mapRange(this.playersData.players[this.playersData.activePlayerNum].skill, 50, 100, 1, 2);
    this.playersData.opponentTop.scale.x = mapRange(this.playersData.opponents[this.playersData.activeOpponentNum].skill, 50, 100, 1, 2);
    this.playersData.opponentTop.scale.z = mapRange(this.playersData.opponents[this.playersData.activeOpponentNum].skill, 50, 100, 1, 2);


    if (this.gameClass.serve && this.playersData.playerServe) {
      this.playersData.players[this.playersData.activePlayerNum].serveBlock.visible = true;
      this.playersData.players[1 - this.playersData.activePlayerNum].serveBlock.visible = false;
      this.ballClass.ballBody.setTranslation({
        x: this.playersData.players[this.playersData.activePlayerNum].player.position.x,
        y: this.playersData.players[this.playersData.activePlayerNum].player.position.y + this.playersData.players[this.playersData.activePlayerNum].playerHeight / 4.5,
        z: this.playersData.players[this.playersData.activePlayerNum].player.position.z - 0.7,
      }, true)

    }
    else if (this.gameClass.serve && !this.playersData.playerServe) {
      this.ballClass.ballBody.setTranslation({
        x: this.playersData.opponents[this.playersData.activeOpponentNum].opponent.position.x,
        y: this.playersData.opponents[this.playersData.activeOpponentNum].opponent.position.y + this.playersData.opponents[this.playersData.activeOpponentNum].opponentHeight / 4.5,
        z: this.playersData.opponents[this.playersData.activeOpponentNum].opponent.position.z + 0.7,
      }, true)

    }


  }

  serve(power = 10) {
    this.playersData.players[this.playersData.activePlayerNum].serveBlock.visible = false;
    this.playersData.players[this.playersData.activePlayerNum].playerActiveServe = false;
    this.playersData.opponents[this.playersData.activeOpponentNum].opponentActiveServe = false;
    if (this.playersData.playerServe) this.playersData.players[this.playersData.activePlayerNum].animActive('serve_hit');
    else this.playersData.opponents[this.playersData.activeOpponentNum].animActive('serve_hit');

    let landingPoint;
    this.ballClass.ballBody.setGravityScale(1.0)
    if (this.playersData.playerServe) {
      landingPoint = randomVector(this.ballClass.ballMark.position, mapRange(this.playersData.players[this.playersData.activePlayerNum].playerAccuracy, 50, 100, 90, 100));

      power = getRandomNumber(power - (100 - this.playersData.players[this.playersData.activePlayerNum].serve), power);

      if (this.playersData.opponents[0].opponent.position.distanceTo(landingPoint) < this.playersData.opponents[1].opponent.position.distanceTo(landingPoint)) {
        this.playersData.activeOpponentNum = 0;
      }
      else {
        this.playersData.activeOpponentNum = 1;
      }
      this.playersData.playerLastTouch = true;
    }
    else {

      landingPoint = randomVector(this.worldClass.centerPlayerField, mapRange(this.playersData.opponents[this.playersData.activeOpponentNum].opponentAccuracy, 50, 100, 90, 100));
      //landingPoint = new THREE.Vector3(-3.8, 0, 2);

      power = getRandomNumber(this.playersData.opponents[this.playersData.activeOpponentNum].serve / 2, this.playersData.opponents[this.playersData.activeOpponentNum].serve)

      if (this.playersData.players[0].player.position.distanceTo(landingPoint) < this.playersData.players[1].player.position.distanceTo(landingPoint)) {

        this.playersData.activePlayerNum = 0;
      }
      else {
        this.playersData.activePlayerNum = 1;
      }

      this.playersData.playerLastTouch = false;

    }



    const powerServe = mapRange(power, 1, 100, 6, 1);

    if (this.playersData.playerServe) {
      this.passEngine(powerServe, 0.55, this.playersData.players[this.playersData.activePlayerNum].spin, landingPoint)
    }
    else {
      this.passEngine(powerServe, 0.55, this.playersData.opponents[this.playersData.activeOpponentNum].spin, landingPoint)
    }
    this.reLandPosition(this.ballClass.ballBody.linvel(), this.ballClass.ballBody.translation())
    this.gameClass.serve = false;
  }

  goal(goal, who) {
    if (!this.gameClass.gameSuspended && !this.gameClass.serve) {
      console.log('ГОООЛ');


      if (goal == 'goal') {
        if (this.ballClass.ballTouch.position.x > -this.worldClass.widthPlane / 2 && this.ballClass.ballTouch.position.x < this.worldClass.widthPlane / 2 && this.ballClass.ballTouch.position.z > -this.worldClass.heightPlane / 2 && this.ballClass.ballTouch.position.z < this.worldClass.heightPlane / 2) {
          this.ballClass.inPlane = true;
        }
        else {
          this.ballClass.inPlane = false;
        }


        if (this.ballClass.ballSideMe && this.ballClass.inPlane) {
          this.gameClass.oppScore++;
          this.playersData.playerActiveServe = 1 - this.playersData.playerActiveServe;
          this.playersData.playerServe = false;
        }
        else if (!this.ballClass.ballSideMe && this.ballClass.inPlane) {
          this.gameClass.meScore++;
          this.playersData.opponentActiveServe = 1 - this.playersData.opponentActiveServe;
          this.playersData.playerServe = true;
        }
        else if (!this.ballClass.inPlane && this.playersData.playerLastTouch) {
          this.gameClass.oppScore++;
          this.playersData.playerActiveServe = 1 - this.playersData.playerActiveServe;
          this.playersData.playerServe = false;
        }
        else if (!this.ballClass.inPlane && !this.playersData.playerLastTouch) {
          this.gameClass.meScore++;
          this.playersData.opponentActiveServe = 1 - this.playersData.opponentActiveServe;
          this.playersData.playerServe = true;
        }


      }
      else if (goal == 'iters') {
        if (who == 'player') {
          this.gameClass.oppScore++;
          this.playersData.playerActiveServe = 1 - this.playersData.playerActiveServe;
          this.playersData.playerServe = false;
        }
        else if (who == 'opponent') {
          this.gameClass.meScore++;
          this.playersData.opponentActiveServe = 1 - this.playersData.opponentActiveServe;
          this.playersData.playerServe = true;
        }
      }

      this.gameClass.scoreUpdating = true;
      this.gameClass.scoreUpdate();
      this.gameClass.gameSuspended = true;
      setTimeout(() => {
        if (this.gameClass.meScore < this.gameClass.endScore && this.gameClass.oppScore < this.gameClass.endScore) {
          this.resetInGame();
          this.gameClass.gameSuspended = false;
          this.gameClass.serve = true;
          this.ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
          this.playersData.playerCanPas = false;
        }
        else {
          this.gameClass.startGame = false;
          this.gameClass.endGame = true;

        }

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
    this.playersData.opponentsIter = 0;
    this.playersData.opponents[0].opponentTouchNum = 0;
    this.playersData.opponents[1].opponentTouchNum = 0;

    this.reLandPosition(this.ballClass.ballBody.linvel(), this.ballClass.ballBody.translation())

    this.playersData.opponents[0].pos = randomVector(this.playersData.players[0].player.position, mapRange(this.playersData.opponents[0].opponentAccuracy, 50, 100, 90, 100))
    if (this.playersData.opponents[0].pos.x > this.worldClass.widthPlane / 2) {
      this.playersData.opponents[0].pos.x = this.worldClass.widthPlane / 2
    }
    else if (this.playersData.opponents[0].pos.x < -this.worldClass.widthPlane / 2) {
      this.playersData.opponents[0].pos.x = -this.worldClass.widthPlane / 2
    }
    if (this.playersData.opponents[0].pos.z < 1) {
      this.playersData.opponents[0].pos.z = 1
    }
    else if (this.playersData.opponents[0].pos.z > this.worldClass.heightPlane / 2) {
      this.playersData.opponents[0].pos.z = this.worldClass.heightPlane / 2
    }


    this.playersData.opponents[1].pos = randomVector(this.playersData.players[1].player.position, mapRange(this.playersData.opponents[1].opponentAccuracy, 50, 100, 90, 100))
    if (this.playersData.opponents[1].pos.x > this.worldClass.widthPlane / 2) {
      this.playersData.opponents[1].pos.x = this.worldClass.widthPlane / 2
    }
    else if (this.playersData.opponents[1].pos.x < -this.worldClass.widthPlane / 2) {
      this.playersData.opponents[1].pos.x = -this.worldClass.widthPlane / 2
    }
    if (this.playersData.opponents[1].pos.z < 1) {
      this.playersData.opponents[1].pos.z = 1
    }
    else if (this.playersData.opponents[1].pos.z > this.worldClass.heightPlane / 2) {
      this.playersData.opponents[1].pos.z = this.worldClass.heightPlane / 2
    }





  }

  opponentTouching(opponent) {
    this.playersData.playerLastTouch = false;
    opponent.opponentTouchNum++;

    if (opponent == this.playersData.opponents[this.playersData.activeOpponentNum]) {
      this.playersData.opponents[1 - this.playersData.activeOpponentNum].opponentTouchNum = 0
    }
    else {
      this.playersData.opponents[this.playersData.activeOpponentNum].opponentTouchNum = 0
    }



    this.playersData.opponentsIter++;
    if (this.playersData.opponentsIter > 3 || this.playersData.opponents[this.playersData.activeOpponentNum].opponentTouchNum > 1) {
      this.goal('iters', 'opponent');
    }
    this.playersData.playersIter = 0;
    this.playersData.players[0].playerTouchNum = 0;
    this.playersData.players[1].playerTouchNum = 0;

    this.reLandPosition(this.ballClass.ballBody.linvel(), this.ballClass.ballBody.translation())


  }

  resetInGame() {
    this.ballClass.ballBody.setGravityScale(0.0)
    this.playersData.opponentsIter = 0;
    this.playersData.opponents[0].opponentTouchNum = 0;
    this.playersData.opponents[1].opponentTouchNum = 0;

    this.playersData.opponentsPas = false;
    this.playersData.opponentsShoot = false;
    this.playersData.opponentCanPas = false;
    this.playersData.opponentFly = false;
    this.playersData.opponentTapShoot = false;
    this.playersData.opponentJumping = false;
    this.playersData.opponentHiting = false;

    this.playersData.servePowerLine = 0;

    let newPos1 = randomVector(this.playersData.opponents[0].startPosition, mapRange(this.playersData.opponents[0].opponentAccuracy, 50, 100, 90, 100))
    let newPos2 = randomVector(this.playersData.opponents[1].startPosition, mapRange(this.playersData.opponents[1].opponentAccuracy, 50, 100, 90, 100))

    this.playersData.opponentBodies[0].setTranslation({ x: newPos1.x, y: newPos1.y, z: newPos1.z });
    this.playersData.opponentBodies[1].setTranslation({ x: newPos2.x, y: newPos2.y, z: newPos2.z });

    this.playersData.opponents[0].animActive('idle');
    this.playersData.opponents[1].animActive('idle');

    this.playersData.opponents[0].opponentActiveServe = false;
    this.playersData.opponents[1].opponentActiveServe = false;


    this.playersData.playersIter = 0;
    this.playersData.players[0].playerTouchNum = 0;
    this.playersData.players[1].playerTouchNum = 0;

    this.playersData.players[0].playerOnGround = true;
    this.playersData.players[1].playerOnGround = true;

    this.playersData.players[0].playerTapPas = false;
    this.playersData.players[1].playerTapPas = false;
    this.playersData.players[0].playerNowPas = false;
    this.playersData.players[1].playerNowPas = false;
    this.playersData.playerCanPas = true;

    let newPosPlayer1 = randomVector(this.playersData.players[0].startPosition, mapRange(this.playersData.players[0].playerAccuracy, 50, 100, 90, 100))
    let newPosPlayer2 = randomVector(this.playersData.players[1].startPosition, mapRange(this.playersData.players[1].playerAccuracy, 50, 100, 90, 100))

    this.playersData.playerBodies[0].setTranslation({ x: newPosPlayer1.x, y: newPosPlayer1.y, z: newPosPlayer1.z });
    this.playersData.playerBodies[1].setTranslation({ x: newPosPlayer2.x, y: newPosPlayer2.y, z: newPosPlayer2.z });


    this.playersData.players[0].playerTapShoot = false;
    this.playersData.players[1].playerTapShoot = false;
    this.playersData.playerCanShoot = true;
    this.playersData.playerFly = false;
    this.playersData.playerJump = false;

    this.playersData.opponentsPas = false;
    this.playersData.opponentsShoot = false;

    this.playersData.players[0].playerActiveServe = false;
    this.playersData.players[1].playerActiveServe = false;



    this.playersData.opponentFly = false;

    this.playersData.opponentCanPas = false;

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

    if (ballClass.ball.position.z > -0.1 && ballClass.ball.position.z < 0.1) {
      ballClass.ballCenterField = true;
      playersData.playerCanPas = true;
      playersData.opponentCanPas = true;
    }
    else {
      ballClass.ballCenterField = false;
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




      if (!this.playersData.playerFly & !this.playersData.players[index].playerTapPas && !this.playersData.players[index].playerNowPas) {
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

    if (this.gameClass.serve && this.playersData.playerServe && !this.playersData.serveTap) {
      this.playersData.activePlayerNum = this.playersData.playerActiveServe;
      this.playersData.playerBodies[this.playersData.activePlayerNum].setTranslation({ x: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().x + this.xx, y: this.playersData.playerBodies[this.playersData.activePlayerNum].translation().y, z: worldClass.heightPlane / 2 + 0.2 })
      this.playersData.players[this.playersData.activePlayerNum].playerActiveServe = true;
      if (this.xx == 0) this.playersData.players[this.playersData.activePlayerNum].animActive('serve');
    }
    else if (this.playersData.serveTap) {
      this.playersData.players[this.playersData.activePlayerNum].animActive('serve');
    }


    if (this.forward) {
      if (!this.playersData.players[this.playersData.activePlayerNum].playerTapPas && !this.playersData.players[this.playersData.activePlayerNum].playerTapShoot && !this.playersData.serveTap) {
        this.zz = -mapRange(this.playersData.players[this.playersData.activePlayerNum].playerSpeed, 50, 100, 0.05, 0.08);
      }
      else {
        this.ballClass.ballMark.position.z -= this.playersData.players[this.playersData.activePlayerNum].playerThinkSpeed;
      }
    }
    else if (this.backward) {
      if (!this.playersData.players[this.playersData.activePlayerNum].playerTapPas && !this.playersData.players[this.playersData.activePlayerNum].playerTapShoot && !this.playersData.serveTap) {
        this.zz = mapRange(this.playersData.players[this.playersData.activePlayerNum].playerSpeed, 50, 100, 0.05, 0.08);
      }
      else {
        this.ballClass.ballMark.position.z += this.playersData.players[this.playersData.activePlayerNum].playerThinkSpeed;
      }
    }
    else {
      this.zz = 0
    }
    if (this.left) {
      if (!this.playersData.players[this.playersData.activePlayerNum].playerTapPas && !this.playersData.players[this.playersData.activePlayerNum].playerTapShoot && !this.playersData.serveTap) {
        this.xx = -mapRange(this.playersData.players[this.playersData.activePlayerNum].playerSpeed, 50, 100, 0.05, 0.08);
      }
      else {
        this.ballClass.ballMark.position.x -= this.playersData.players[this.playersData.activePlayerNum].playerThinkSpeed;
      }
    }
    else if (this.right) {
      if (!this.playersData.players[this.playersData.activePlayerNum].playerTapPas && !this.playersData.players[this.playersData.activePlayerNum].playerTapShoot && !this.playersData.serveTap) {
        this.xx = mapRange(this.playersData.players[this.playersData.activePlayerNum].playerSpeed, 50, 100, 0.05, 0.08);
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
      if (handle1 == ballClass.ballBody.handle && handle2 == '4e-323') {
        this.reLandPosition(this.ballClass.ballBody.linvel(), this.ballClass.ballBody.translation())
      }
      if (handle2 == ballClass.ballBody.handle && handle1 == 0 && started) {
        this.ballClass.ballSpeed = Math.abs(ballClass.ballBody.linvel().z);
        this.ballClass.ballSpin = Math.abs(ballClass.ballBody.angvel().z);
        playersData.ballPlayerCollision = true;
      }
      if (handle2 == ballClass.ballBody.handle && handle1 == '1.5e-323' && started) {
        this.ballClass.ballSpeed = Math.abs(ballClass.ballBody.linvel().z);
        this.ballClass.ballSpin = Math.abs(ballClass.ballBody.angvel().z);
        playersData.ballOpponentCollision = true;
      }
      if (handle2 == ballClass.ballBody.handle && handle1 == playersData.playerBodies[1 - playersData.activePlayerNum].handle && started) {
        playersData.activePlayerNum = 1 - playersData.activePlayerNum;
        playerTouching(playersData.players[1 - playersData.activePlayerNum]);
      }
      if (handle2 == ballClass.ballBody.handle && handle1 == playersData.opponentBodies[1 - playersData.activeOpponentNum].handle && started) {
        playersData.activeOpponentNum = 1 - playersData.activeOpponentNum;
        opponentTouching(playersData.opponents[1 - playersData.activeOpponentNum]);
      }




      if (handle1 == ballClass.ballBody.handle && handle2 == '3.5e-323' && !this.gameClass.gameSuspended && started) {

        ballClass.ballTouch.position.x = ballClass.ball.position.x;
        ballClass.ballTouch.position.y = ballClass.ballTouch.position.y;
        ballClass.ballTouch.position.z = ballClass.ball.position.z;

        ballClass.ballTouch.material.opacity = 0.4;

        this.goal('goal');
      }

    })

    if (ballClass.ballBody.translation().y < -10) {
      this.goal('goal');
    }


    if (playersData.playerCanPas && playersData.ballPlayerCollision && playersData.playerBodies[playersData.activePlayerNum].translation().y < 1 && !this.gameClass.serve) {
      //пас
      this.playerTouching(this.playersData.players[this.playersData.activePlayerNum]);

      if (this.playersData.playersIter == 2) {
        this.playersData.playerMistakeNow = mapRange(this.ballClass.ballSpeed, 3, 20, 1, 3) + mapRange(this.ballClass.ballSpin, 3, 20, 1, 3);
      }
      else {
        this.playersData.playerMistakeNow = mapRange(this.ballClass.ballSpeed, 3, 20, 3, 10) + mapRange(this.ballClass.ballSpin, 3, 20, 3, 20);
      }


      if (this.xx != 0 || this.zz != 0) {
        this.playersData.playerMistakeNow += 100 - mapRange(this.playersData.players[this.playersData.activePlayerNum].agility, 50, 100, 70, 100);
      }

      let landingPoint;
      if (!this.playersData.players[this.playersData.activePlayerNum].playerNowPas) {
        if (this.playersData.playersIter == 2) {
          landingPoint = randomVector(this.playersData.players[1 - this.playersData.activePlayerNum].player.position, mapRange(this.playersData.players[this.playersData.activePlayerNum].playerAccuracy, 50, 100, 100, 100) - this.playersData.playerMistakeNow);
        }
        else {
          landingPoint = randomVector(this.playersData.players[1 - this.playersData.activePlayerNum].player.position, mapRange(this.playersData.players[this.playersData.activePlayerNum].playerAccuracy, 50, 100, 90, 100) - this.playersData.playerMistakeNow);
        }
        if (playersData.playerTop.position.y > this.playersData.players[this.playersData.activePlayerNum].playerHeight) {
          this.playersData.players[this.playersData.activePlayerNum].animActive('pass_hit', 1, 0.4);
        }
        else {
          this.playersData.players[this.playersData.activePlayerNum].animActive('pass_bottom_hit', 1, 0.2);
        }
      }
      else {
        if (this.playersData.playersIter == 2) {
          landingPoint = randomVector(ballClass.ballMark.position, mapRange(this.playersData.players[this.playersData.activePlayerNum].playerAccuracy, 50, 100, 100, 100) - this.playersData.playerMistakeNow);
        }
        else {
          landingPoint = randomVector(ballClass.ballMark.position, mapRange(this.playersData.players[this.playersData.activePlayerNum].playerAccuracy, 50, 100, 90, 100) - this.playersData.playerMistakeNow);
        }
        if (playersData.playerTop.position.y > this.playersData.players[this.playersData.activePlayerNum].playerHeight) {
          this.playersData.players[this.playersData.activePlayerNum].animActive('pass_hit', 1, 0.4);
        }
        else {
          this.playersData.players[this.playersData.activePlayerNum].animActive('pass_bottom_hit', 1, 0.2);
        }
      }
      let passHeight;
      let passSpeedNow;
      if (this.playersData.playersIter == 3) {
        passHeight = this.playersData.playerPasHeightShot
        passSpeedNow = 0.35;
      }
      else if (this.playersData.playersIter == 2) {
        passHeight = this.playersData.playerPasVeryHeight
        passSpeedNow = 0.45;
      }
      else {
        passHeight = this.playersData.playerPasHeight
        passSpeedNow = 0.45;
      }
      this.passEngine(passHeight, passSpeedNow, this.playersData.players[this.playersData.activePlayerNum].spin, landingPoint)
      this.reLandPosition(this.ballClass.ballBody.linvel(), this.ballClass.ballBody.translation())
      if (playersData.opponents[0].opponent.position.distanceTo(ballClass.ballMarkOnGround.position) < playersData.opponents[1].opponent.position.distanceTo(ballClass.ballMarkOnGround.position)) {
        playersData.activeOpponentNum = 0;
      }
      else {
        playersData.activeOpponentNum = 1;
      }

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
    //прыжок плеер

    if (ballClass.ball.position.distanceTo(playersData.playerShootMark.position) < 2 && ballClass.ballMarkOnGround.position.z > -0.5 && this.playersData.players[this.playersData.activePlayerNum].playerTapShoot && !playersData.playerFly && this.playersData.players[this.playersData.activePlayerNum].playerOnGround) {

      const newJump = mapRange(playersData.players[playersData.activePlayerNum].jump, 50, 100, 40, 50)

      playersData.playerBodies[playersData.activePlayerNum].applyImpulse({ x: 0, y: newJump, z: 0 }, true)

      this.playersData.players[this.playersData.activePlayerNum].playerOnGround = false;
    }
    else if (ballClass.ball.position.distanceTo(playersData.playerShootMark.position) > 2) {
      this.playersData.players[this.playersData.activePlayerNum].playerJumpHit = false;
      this.playersData.players[this.playersData.activePlayerNum].playerOnGround = true;
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
      const landingPoint = randomVector(ballClass.ballMark.position, mapRange(this.playersData.players[this.playersData.activePlayerNum].playerAccuracy, 50, 100, 90, 100));
      //this.shootEngine(0.02, 0.08, landingPoint)
      this.shotEngine(mapRange(playersData.players[playersData.activePlayerNum].shotSpeed, 50, 100, 7, 12), playersData.players[playersData.activePlayerNum].spin, landingPoint)


      this.playerTouching(this.playersData.players[this.playersData.activePlayerNum]);

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

    if (this.playersData.players[this.playersData.activePlayerNum].playerTapPas || this.playersData.players[this.playersData.activePlayerNum].playerTapShoot || this.playersData.serveTap) {
      this.ballClass.ballMark.material.opacity = 1;
    }
    else {
      this.ballClass.ballMark.material.opacity = 0;
    }



    // //движение не активного игрока
    if (this.playersData.players[this.playersData.activePlayerNum].playerTapPas && ballClass.ballMark.position.z > 0) {

      const playerNotActiveBody = playersData.playerBodies[1 - playersData.activePlayerNum];
      const playerNotActive = playersData.players[1 - playersData.activePlayerNum].player;

      const direction = new THREE.Vector3();
      direction.subVectors(new THREE.Vector3(ballClass.ballMark.position.x, playerNotActive.position.y, ballClass.ballMark.position.z), playerNotActive.position).normalize();

      const distance = Math.sqrt(
        Math.pow(playerNotActive.position.x - ballClass.ballMark.position.x, 2) +
        Math.pow(playerNotActive.position.z - ballClass.ballMark.position.z, 2)
      );
      if (distance > 1.0) {
        const movementVector = direction.clone().multiplyScalar(mapRange(playersData.players[1 - playersData.activePlayerNum].playerSpeed, 50, 100, 0.05, 0.08));
        if (playerNotActive.position.z > ballClass.ballMark.position.z)
          playerNotActiveBody.setTranslation({ x: playerNotActive.position.x + movementVector.x, y: playerNotActive.position.y, z: playerNotActive.position.z + movementVector.z }, true)
      }
    }

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


        if (value.opponent.position.x - value.previousPosition.x == 0 & value.opponent.position.z - value.previousPosition.z == 0 & !value.opponentActiveServe) {
          this.playersData.opponents[index].animActive('idle');
        }
      }

      value.previousPosition.copy(value.opponent.position);

    })

    if (this.gameClass.serve && !this.playersData.playerServe) {
      this.playersData.activeOpponentNum = this.playersData.opponentActiveServe;
      this.playersData.opponentBodies[this.playersData.activeOpponentNum].setTranslation({ x: this.playersData.opponents[this.playersData.activeOpponentNum].startPosition.x, y: this.playersData.opponentBodies[this.playersData.activeOpponentNum].translation().y, z: -worldClass.heightPlane / 2 - 0.2 })
      this.playersData.opponents[this.playersData.activeOpponentNum].opponentActiveServe = true;
      this.playersData.opponents[this.playersData.activeOpponentNum].animActive('serve');
      setTimeout(() => {
        if (this.gameClass.serve) {
          this.serve();
        }
      }, 1500)

    }


    playersData.opponentShootMark.position.x = playersData.opponents[playersData.activeOpponentNum].opponent.position.x;
    playersData.opponentShootMark.position.z = playersData.opponents[playersData.activeOpponentNum].opponent.position.z;

    let topPosY = playersData.opponents[playersData.activeOpponentNum].opponent.position.y + 1.3;
    if (ballClass.ball.position.y < topPosY) topPosY = ballClass.ball.position.y;

    this.playersData.opponentTopBody.setNextKinematicTranslation({ x: playersData.opponents[playersData.activeOpponentNum].opponent.position.x, y: topPosY - 0.3, z: playersData.opponents[playersData.activeOpponentNum].opponent.position.z }, true)

    if (ballClass.ballMarkOnGround.position.z < 0 || ballClass.ball.position.z < 0) {

      // const direction = new THREE.Vector3();
      // direction.subVectors(new THREE.Vector3(ballClass.ballMarkOnGround.position.x, playersData.opponents[playersData.activeOpponentNum].opponent.position.y, ballClass.ballMarkOnGround.position.z + 0.2), playersData.opponents[playersData.activeOpponentNum].opponent.position).normalize();

      const directionToBall = new THREE.Vector3().subVectors(new THREE.Vector3(ballClass.ball.position.x, playersData.opponents[playersData.activeOpponentNum].opponent.position.y, ballClass.ball.position.z), new THREE.Vector3(ballClass.ballMarkOnGround.position.x, playersData.opponents[playersData.activeOpponentNum].opponent.position.y, ballClass.ballMarkOnGround.position.z + 0.2)).normalize();

      const adjustedTarget = new THREE.Vector3(ballClass.ballMarkOnGround.position.x, playersData.opponents[playersData.activeOpponentNum].opponent.position.y, ballClass.ballMarkOnGround.position.z + 0.2).clone().add(directionToBall.multiplyScalar(mapRange(playersData.opponents[playersData.activeOpponentNum].opponentSpeed, 50, 100, 0.1, 0.5))); // правильное расположение оппонента, чуть ближе к мячу

      const direction = new THREE.Vector3().subVectors(adjustedTarget, playersData.opponents[playersData.activeOpponentNum].opponent.position).normalize();

      // const distance = Math.sqrt(
      //   Math.pow(playersData.opponents[playersData.activeOpponentNum].opponent.position.x - ballClass.ballMarkOnGround.position.x, 2) +
      //   Math.pow(playersData.opponents[playersData.activeOpponentNum].opponent.position.z - ballClass.ballMarkOnGround.position.z, 2)
      // );

      const distance = playersData.opponents[playersData.activeOpponentNum].opponent.position.distanceTo(adjustedTarget);

      if (distance > 0.4 && !this.gameClass.serve) {

        const opponentBody = playersData.opponentBodies[playersData.activeOpponentNum];


        let movementVector
        if ((ballClass.ballMarkOnGround.position.z > -worldClass.heightPlane / 2 && ballClass.ballMarkOnGround.position.x > -worldClass.widthPlane / 2 && ballClass.ballMarkOnGround.position.x < worldClass.widthPlane / 2) || !playersData.playerLastTouch) {
          movementVector = direction.clone().multiplyScalar(mapRange(playersData.opponents[playersData.activeOpponentNum].opponentSpeed, 50, 100, 0.05, 0.08));
        }
        else {
          movementVector = direction.clone().multiplyScalar(mapRange(playersData.opponents[playersData.activeOpponentNum].opponentSpeed, 50, 100, 0.05, 0.08) / mapRange(playersData.opponents[playersData.activeOpponentNum].mind, 50, 100, 1, 2));
        }


        opponentBody.setTranslation({ x: opponentBody.translation().x + movementVector.x, y: opponentBody.translation().y, z: opponentBody.translation().z + movementVector.z }, true)

        playersData.opponents[playersData.activeOpponentNum].opponentTapPas = false;

      }
      else if (!this.gameClass.serve) {
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
    else if (ballClass.ballMarkOnGround.position.z > 0 && ballClass.ball.position.z > 0) {
      const direction1 = new THREE.Vector3();
      let pos1 = playersData.opponents[0].pos;

      direction1.subVectors(new THREE.Vector3(pos1.x, playersData.opponents[0].opponent.position.y, -pos1.z), playersData.opponents[0].opponent.position).normalize();

      const distance1 = Math.sqrt(
        Math.pow(playersData.opponents[0].opponent.position.x - pos1.x, 2) +
        Math.pow(playersData.opponents[0].opponent.position.z - (pos1.z * -1), 2)
      );
      if (distance1 > 0.5) {
        const opponentBody = playersData.opponentBodies[0];
        const movementVector = direction1.clone().multiplyScalar(mapRange(playersData.opponents[0].opponentSpeed, 50, 100, 0.05, 0.08) / 1.5);
        opponentBody.setTranslation({ x: opponentBody.translation().x + movementVector.x, y: opponentBody.translation().y, z: opponentBody.translation().z + movementVector.z }, true)
      }

      const direction2 = new THREE.Vector3();
      let pos2 = playersData.opponents[1].pos;


      direction2.subVectors(new THREE.Vector3(pos2.x, playersData.opponents[1].opponent.position.y, -pos2.z), playersData.opponents[1].opponent.position).normalize();
      const distance2 = Math.sqrt(
        Math.pow(playersData.opponents[1].opponent.position.x - pos2.x, 2) +
        Math.pow(playersData.opponents[1].opponent.position.z - (pos2.z * -1), 2)
      );
      if (distance2 > 0.5) {
        const opponentBody = playersData.opponentBodies[1];
        const movementVector = direction2.clone().multiplyScalar(mapRange(playersData.opponents[1].opponentSpeed, 50, 100, 0.05, 0.08) / 1.5);
        opponentBody.setTranslation({ x: opponentBody.translation().x + movementVector.x, y: opponentBody.translation().y, z: opponentBody.translation().z + movementVector.z }, true)
      }
    }
    /*//////////////////////////////////////////////////////////////////////////*/



    if (playersData.ballOpponentCollision && !playersData.opponentFly && playersData.opponentCanPas) {

      //пас

      this.opponentTouching(this.playersData.opponents[this.playersData.activeOpponentNum])

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

      this.playersData.opponentMistakeNow = mapRange(this.ballClass.ballSpeed, 3, 20, 10, 20) + mapRange(this.ballClass.ballSpin, 3, 20, 3, 20);

      if (playersData.opponentTopBody.linvel().x != 0 || playersData.opponentTopBody.linvel().z != 0) {
        this.playersData.opponentMistakeNow += 100 - mapRange(this.playersData.opponents[this.playersData.activeOpponentNum].agility, 50, 100, 70, 100);

      }



      setTimeout(() => {
        this.playersData.opponentMistakeNow = 0;
      }, 100);

      if (playersData.opponentsIter < 3) {
        //landingPoint = new THREE.Vector3(getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2), 0, getRandomNumber(-worldClass.heightPlane / 2, 0));
        const zz = getRandomNumber(this.playersData.opponents[this.playersData.activeOpponentNum].opponent.position.z, -0.1)
        const xx = getRandomNumber(this.playersData.opponents[1 - this.playersData.activeOpponentNum].opponent.position.x - 2 - this.playersData.opponentMistakeNow / 20, this.playersData.opponents[1 - this.playersData.activeOpponentNum].opponent.position.x + 2 + this.playersData.opponentMistakeNow / 20)
        const yy = 0;
        const newLandPos = new THREE.Vector3(xx, yy, zz);

        landingPoint = randomVector(newLandPos, mapRange(this.playersData.opponents[this.playersData.activeOpponentNum].opponentAccuracy, 50, 100, 90, 100) - this.playersData.opponentMistakeNow);
      }
      else {
        landingPoint = new THREE.Vector3(getRandomNumber(-worldClass.widthPlane / 2, worldClass.widthPlane / 2), 0, getRandomNumber(4, worldClass.heightPlane / 2));

      }

      let passHeight;
      let passSpeed;
      if (this.playersData.opponentsIter == 3) {
        passHeight = this.playersData.opponentPasHeightShot
        passSpeed = 0.35;
      }
      else if (this.playersData.opponentsIter == 2) {
        passHeight = this.playersData.opponentPasVeryHeight
        passSpeed = 0.35;
      }
      else {
        passHeight = this.playersData.opponentPasHeight
        passSpeed = 0.45;
      }

      if (!playersData.opponentTapShoot) this.passEngine(passHeight, passSpeed, this.playersData.opponents[this.playersData.activeOpponentNum].spin, landingPoint)
      this.reLandPosition(this.ballClass.ballBody.linvel(), this.ballClass.ballBody.translation())

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


      playersData.opponentsPas = true;


    }
    else if (playersData.opponentTop.position.distanceTo(ballClass.ball.position) > 1.1) {
      playersData.opponentsPas = false;
    }

    if (/*this.playersData.opponentsIter == 2 &&*/ playersData.opponents[playersData.activeOpponentNum].opponent.position.z > -1.0 && ballClass.ball.position.y > 2 && playersData.opponents[playersData.activeOpponentNum].opponent.position.distanceTo(ballClass.ball.position) < 3) {
      playersData.opponentTapShoot = true;
    }
    else {
      playersData.opponentTapShoot = false;
    }
    //прыжок
    if (ballClass.ball.position.distanceTo(playersData.opponentShootMark.position) < 2.5 && playersData.opponentTapShoot && !playersData.opponentFly && !playersData.opponentJumping) {

      const newJump = mapRange(playersData.opponents[playersData.activeOpponentNum].jump, 50, 100, 40, 50)


      playersData.opponentBodies[playersData.activeOpponentNum].applyImpulse({ x: 0, y: newJump, z: 0 }, true)
      setTimeout(() => {
        playersData.opponentJumping = false;
      }, 500)
      playersData.opponentJumping = true;
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
      this.shotEngine(mapRange(playersData.opponents[playersData.activeOpponentNum].shotSpeed, 50, 100, 7, 12), this.playersData.opponents[this.playersData.activeOpponentNum].spin, landingPoint)

      this.opponentTouching(this.playersData.opponents[this.playersData.activeOpponentNum]);

      playersData.opponentTapShoot = false;

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

  passEngine(heightFactor, speedFactor, spin, landingPoint) {
    let ballClass = this.ballClass;
    let playersData = this.playersData;
    let worldClass = this.worldClass;

    const ballPosition = ballClass.ballBody.translation();


    ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);

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
    let angvel = mapRange(spin, 50, 100, 1, 2)
    if (!this.gameClass.serve) angvel = 1

    ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ballClass.ballBody.setAngvel({ x: horizontalVelocityX * angvel, y: 0.0, z: horizontalVelocityZ * angvel }, true);
    ballClass.ballBody.applyImpulse(impulse, true);

  }

  shotEngine(speed, spin, landingPoint) {

    let ballClass = this.ballClass;
    let worldClass = this.worldClass;

    const currentBallPosition = ballClass.ballBody.translation();

    const gravity = worldClass.gravity;

    ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    // ballClass.ballBody.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);

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

    const angvel = mapRange(spin, 50, 100, 1, 2)

    ballClass.ballBody.setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
    ballClass.ballBody.setAngvel({ x: impulse.x * angvel, y: 0.0, z: impulse.z * angvel }, true);
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