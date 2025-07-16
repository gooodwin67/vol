import * as THREE from "three";

export class StorageClass {
 constructor() {

  this.data = {
   career: false,
   team: {
    name: '...',
    freeExp: 10,
    nowDate: {
     day: 0,
     month: 0,
     year: 2025,
    },
    db: {
     speed: 50, //скорость
     accuracy: 50, //Меткость
     shotSpeed: 50, //скорость удара (7-12)
     agility: 50, //ловкость (пас при движении)
     skill: 50, //до куда достает рукой
     serve: 50, //подача
     jump: 50, //высота прыжка
     mind: 50, //интеллект
     spin: 50, //вращение
    }
   },
   skillDB: {
    speed: 'Скорость',
    accuracy: 'Меткость',
    shotSpeed: 'Сила удара',
    agility: 'Ловкость',
    skill: 'Навык',
    serve: 'Подача',
    jump: 'Прыжок',
    mind: 'Интеллект',
    spin: 'Вращение',
   },
  }

  this.sumExp = 0;
  this.oldSumExp = 0;

  $.each(this.data.team.db, (key, value) => {
   this.oldSumExp += value;
  });

  this.summingExp();



  this.storageLoaded = false;



  if (localStorage.getItem('data') !== null) this.readStorage();

 }

 summingExp() {
  this.sumExp = 0;
  $.each(this.data.team.db, (key, value) => {
   this.sumExp += value;
  });
 }

 setStorage() {
  localStorage.setItem('data', JSON.stringify(this.data));
 }
 readStorage() {
  this.data = JSON.parse(localStorage.getItem('data'));
 }

 updateChar(char, range) {
  this.data.team.db[char] = parseInt(range);
 }





}