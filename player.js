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
    this.playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00, transparent: true, opacity: 0.5 });
    this.player = new THREE.Mesh(this.playerGeometry, this.playerMaterial);
    this.player.position.set(0, 0.5, 5);
    this.player.castShadow = true;

    this.playerModel;


    this.clock = new THREE.Clock();





  }


  async loadPlayerModel() {
    const gltfLoader = new GLTFLoader();
    const url = 'models/players/player.glb';


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

      this.playerModel.userData.animIdle = idle;
      this.playerModel.userData.animRun = run;

      this.playerModel.userData.animMas = [idle, run];

    });
  }

  animActive(num) {
    this.playerModel.userData.animMas.forEach((value, index, array) => {
      if (index != num) value.stop();
      else value.play();
    })
  }
}