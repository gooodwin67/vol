
export class PlayersDB {
  constructor() {
    this.player = 0;
    this.opponent = 0;
    this.playersDB = [
      {
        name: '50ки',
        speed: 50, //скорость
        playerAccuracy: 50, //Меткость
        shotSpeed: 50, //скорость удара (7-12)
        agility: 50, //ловкость (пас при движении)
        skill: 50, //до куда достает рукой
        serve: 50, //подача
        jump: 50, //высота прыжка
        mind: 50, //интеллект
        spin: 50, //вращение
      },
      {
        name: '70ки',
        speed: 70, //скорость
        playerAccuracy: 70, //Меткость
        shotSpeed: 70, //скорость удара (7-12)
        agility: 70, //ловкость (пас при движении)
        skill: 70, //до куда достает рукой
        serve: 70, //подача
        jump: 70, //высота прыжка
        mind: 70, //интеллект
        spin: 70, //вращение
      },
      {
        name: '100ки',
        speed: 100, //скорость
        playerAccuracy: 100, //Меткость
        shotSpeed: 100, //скорость удара (7-12)
        agility: 100, //ловкость (пас при движении)
        skill: 100, //до куда достает рукой
        serve: 100, //подача
        jump: 100, //высота прыжка
        mind: 100, //интеллект
        spin: 100, //вращение
      },
    ]
  }
}