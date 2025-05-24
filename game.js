import * as THREE from "three";

export class GameClass {
 constructor() {


  this.serve = true;

  this.gameSuspended = false;

  this.scoreUpdating = false;

  this.meScore = 0;
  this.oppScore = 0;

  this.startGame = false;
  this.fullMatch = false;
  this.trainingMatch = false;

 }

 scoreUpdate() {
  if (this.scoreUpdating) {
   document.querySelector('.score_block_player').textContent = this.meScore;
   document.querySelector('.score_block_opponent').textContent = this.oppScore;
   this.scoreUpdating = false;
  }
 }
}