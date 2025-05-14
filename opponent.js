import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Opponent {
  constructor(scene, ballClass, worldClass, opponentSpeed, opponentAccuracy, shotSpeed, agility) {

    this.scene = scene;
    this.ballClass = ballClass;
    this.worldClass = worldClass;
    this.opponentSpeed = opponentSpeed;
    this.opponentAccuracy = opponentAccuracy;
    this.shotSpeed = shotSpeed;
    this.agility = agility;

    this.opponentHeight = 1.4;
    this.opponentGeometry = new THREE.BoxGeometry(0.5, this.opponentHeight, 0.5);
    this.opponentMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00, transparent: true, opacity: 0 });
    this.opponent = new THREE.Mesh(this.opponentGeometry, this.opponentMaterial);
    this.opponent.position.set(0, 0.5, -5);
    this.opponent.castShadow = true;

    this.opponentModel;

    this.opponentsTapPas = false;

    this.clock = new THREE.Clock();
    this.previousPosition = new THREE.Vector3(0, 0, 0);

    this.activeAction;

    this.opponentTouchNum = 0;

  }



  async loadOpponentModel() {
    const gltfLoader = new GLTFLoader();
    const url = 'models/players/new/player.glb';


    await gltfLoader.loadAsync(url).then((gltf) => {
      const root = gltf.scene;
      this.opponentModel = root;
      this.opponentModel.animations = gltf.animations;

      //this.opponentModel.rotation.y = Math.PI;
      this.opponentModel.scale.x = 0.7;
      this.opponentModel.scale.y = 0.7;
      this.opponentModel.scale.z = 0.7;

      const mixer = new THREE.AnimationMixer(this.opponentModel);
      const clips = this.opponentModel.animations;

      this.opponentModel.userData.mixer = mixer;
      this.opponentModel.userData.clips = clips;

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

      this.activeAction = idle;

      this.opponentModel.userData.animMas = {
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
      };

    });
  }

  animActive(anim, weight = 1, duration = 0.2) {

    let previousAction = this.activeAction;
    this.activeAction = this.opponentModel.userData.animMas[anim];

    if (previousAction !== this.activeAction) {
      previousAction.fadeOut(duration);


      if (anim == 'pass' || anim == 'pass_hit') {
        //this.activeAction.clampWhenFinished = true
        this.activeAction
          .reset()
          //.setLoop(THREE.LoopOnce, 1)
          .setEffectiveTimeScale(1)

          .setEffectiveWeight(1)

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
