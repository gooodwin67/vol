import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Player {
  constructor(scene, ballClass, worldClass, playersData, playerSpeed, playerThinkSpeed) {
    this.scene = scene;
    this.ballClass = ballClass;
    this.worldClass = worldClass;
    this.playersData = playersData;
    this.playerSpeed = playerSpeed;
    this.playerThinkSpeed = playerThinkSpeed;

    this.playerHeight = 1.4;
    this.playerGeometry = new THREE.BoxGeometry(0.5, this.playerHeight, 0.5);
    this.playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00, transparent: true, opacity: 0.0 });
    this.player = new THREE.Mesh(this.playerGeometry, this.playerMaterial);
    this.player.position.set(0, 0.5, 5);
    this.player.castShadow = true;

    this.playerModel;

    this.activeAction;

    this.previousPosition = new THREE.Vector3(0, 0, 0);


    this.clock = new THREE.Clock();





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

      const mixer = new THREE.AnimationMixer(this.playerModel);
      const clips = this.playerModel.animations;

      this.playerModel.userData.mixer = mixer;
      this.playerModel.userData.clips = clips;

      const idle = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'idle'));
      const run = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'run'));
      const pass = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'pass'));
      const shoot = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'shoot'));


      this.activeAction = idle;

      this.playerModel.userData.animMas = {
        'idle': idle,
        'run': run,
        'pass': pass,
        'shoot': shoot,
      };

    });
  }

  animActive(anim, weight = 1, duration = 0.2) {
    let previousAction = this.activeAction;
    this.activeAction = this.playerModel.userData.animMas[anim];

    if (previousAction !== this.activeAction) {
      previousAction.fadeOut(duration);
      this.activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(weight)
        .fadeIn(duration)
        .play();
    }

  }
}