import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export class Player {
  constructor(scene, ballClass, worldClass, playersData, setting) {
    this.scene = scene;
    this.ballClass = ballClass;
    this.worldClass = worldClass;
    this.playersData = playersData;
    this.playerSpeed = setting.speed;
    this.playerAccuracy = setting.playerAccuracy;
    this.shotSpeed = setting.shotSpeed;
    this.agility = setting.agility;
    this.skill = setting.skill;
    this.serve = setting.serve;
    this.jump = setting.jump;
    this.mind = setting.mind;


    this.playerHeight = 1.4;
    this.playerGeometry = new THREE.BoxGeometry(0.5, this.playerHeight, 0.5);
    this.playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00, transparent: true, opacity: 0.0 });
    this.player = new THREE.Mesh(this.playerGeometry, this.playerMaterial);
    this.player.position.set(0, 0.5, 5);
    // this.player.castShadow = true;

    this.playerDiv = document.createElement('div');
    this.playerDiv.className = 'serve_player';
    this.playerDiv.innerHTML = '<div class = "serve_player_in"></div>';
    this.playerDiv.style.backgroundColor = '#ffffff';

    this.playerLabel = new CSS2DObject(this.playerDiv);
    this.playerLabel.name = 'serveBlock';
    this.playerLabel.visible = false;
    this.playerLabel.position.set(0.0, 1.0, -1);
    this.playerLabel.center.set(0.5, 0);
    this.playerLabel.rotation.y = Math.PI;
    this.player.add(this.playerLabel);



    this.serveBlock = this.player.children.find(e => e.name == 'serveBlock');


    this.playerModel;

    this.activeAction;

    this.playerTouchNum = 0;

    this.previousPosition = new THREE.Vector3(0, 0, 0);

    this.startPosition;

    this.playerThinkSpeed = 0.15;


    this.clock = new THREE.Clock();

    this.playerTapPas = false;
    this.playerCanPas = true;
    this.playerNowPas = false;

    this.playerTapShoot = false;

    this.playerJumpHit = false;

    this.playerOnGround = true;

    this.playerActiveServe = false;



  }


  async loadPlayerModel() {
    const gltfLoader = new GLTFLoader();
    const url = 'models/players/new/player.glb';


    await gltfLoader.loadAsync(url).then((gltf) => {
      const root = gltf.scene;
      this.playerModel = root;
      this.playerModel.animations = gltf.animations;

      this.playerModel.rotation.y = Math.PI;
      this.playerModel.scale.x = 0.7;
      this.playerModel.scale.y = 0.7;
      this.playerModel.scale.z = 0.7;

      const textureLoader = new THREE.TextureLoader();
      const texture1 = textureLoader.load('/models/players/new/textures/rus2.jpg');
      this.playerModel.children[0].children[0].material = new THREE.MeshLambertMaterial({ map: texture1 });

      const mixer = new THREE.AnimationMixer(this.playerModel);
      const clips = this.playerModel.animations;

      this.playerModel.userData.mixer = mixer;
      this.playerModel.userData.clips = clips;

      const idle = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'idle'));
      const run = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'run'));
      const runBack = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'runback'));
      const runLeft = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'runleft'));
      const runRight = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'runright'));
      const runForwardRight = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'run_forward_right'));
      const runForwardLeft = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'run_forward_left'));
      const runBackRight = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'runback_right'));
      const runBackLeft = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'runback_left'));
      const pass = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'pass'));
      const passHit = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'pass_hit'));
      const passBottom = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'pass_bottom'));
      const passBottomHit = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'pass_bottom_hit'));
      const jump = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'jump'));
      const jumpHit = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'jump_hit'));
      const serve = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'serve'));
      const serve_hit = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'serve_hit'));

      this.activeAction = idle;

      this.playerModel.userData.animMas = {
        'idle': idle,
        'run': run,
        'runBack': runBack,
        'runLeft': runLeft,
        'runRight': runRight,
        'run_forward_right': runForwardRight,
        'run_forward_left': runForwardLeft,
        'runback_right': runBackRight,
        'runback_left': runBackLeft,
        'pass': pass,
        'pass_hit': passHit,
        'pass_bottom': passBottom,
        'pass_bottom_hit': passBottomHit,
        'jump': jump,
        'jump_hit': jumpHit,
        'serve': serve,
        'serve_hit': serve_hit,
      };

    });
  }

  animActive(anim, weight = 1, duration = 0.2) {

    let previousAction = this.activeAction;
    this.activeAction = this.playerModel.userData.animMas[anim];

    if (previousAction !== this.activeAction) {
      previousAction.fadeOut(duration);


      if (anim == 'pass' || anim == 'pass_hit') {
        //this.activeAction.clampWhenFinished = true
        this.activeAction
          .reset()
          //.setLoop(THREE.LoopOnce, 1)
          .setEffectiveTimeScale(1)

          .setEffectiveWeight(5)

          // .setEffectiveTimeScale(1)
          // .setEffectiveWeight(weight)
          .fadeIn(0)
          .play();
      }
      else if (anim == 'pass_bottom' || anim == 'pass_bottom_hit') {
        //this.activeAction.clampWhenFinished = true
        this.activeAction
          .reset()
          //.setLoop(THREE.LoopOnce, 1)
          .setEffectiveTimeScale(1)
          .setEffectiveWeight(5)

          // .setEffectiveTimeScale(1)
          // .setEffectiveWeight(weight)
          .fadeIn(duration)
          .play();
      }
      else if (anim == 'jump') {
        this.activeAction.clampWhenFinished = true
        this.activeAction
          .reset()
          //.setLoop(THREE.LoopOnce, 1)
          .setEffectiveTimeScale(1)
          .fadeIn(1)
          .setEffectiveWeight(5)

          // .setEffectiveTimeScale(1)
          // .setEffectiveWeight(weight)
          .fadeIn(duration)
          .play();
      }
      else if (anim == 'serve') {
        this.activeAction.clampWhenFinished = true
        this.activeAction
          .reset()
          .setLoop(THREE.LoopPingPong)
          .setEffectiveTimeScale(0.3)
          .fadeIn(1)
          .setEffectiveWeight(1)
          .fadeIn(duration)
          .play();
      }
      else if (anim == 'serve_hit') {
        this.activeAction.clampWhenFinished = true
        this.activeAction
          .reset()
          .setLoop(THREE.LoopPingPong)
          .setEffectiveTimeScale(0.5)
          .fadeIn(1)
          .setEffectiveWeight(10)
          .fadeIn(duration)
          .play();
      }
      else {
        this.activeAction
          .reset()
          .setEffectiveTimeScale(1)
          .setEffectiveWeight(weight)
          .fadeIn(duration)
          .play();
      }
    }

  }
}