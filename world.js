import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class World {
  constructor(scene) {
    this.ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 2);
    this.dirLight.position.set(0, 10, -2);
    this.dirLight.castShadow = true;

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 100, 0);

    this.scene = scene;

    this.widthPlane = 8;
    this.heightPlane = 16;

    this.arenaModel;

    this.eventQueue;

    this.geometryPlane = new THREE.BoxGeometry(this.widthPlane, 0.2, this.heightPlane);
    this.materialPlane = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0 });
    this.plane = new THREE.Mesh(this.geometryPlane, this.materialPlane);
    this.plane.receiveShadow = true;
    this.plane.position.set(0, 0, 0);

    this.geometryGround = new THREE.BoxGeometry(this.widthPlane * 3, 0.2, this.heightPlane * 2);
    this.materialGround = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0 });
    this.ground = new THREE.Mesh(this.geometryGround, this.materialGround);
    this.ground.receiveShadow = true;
    this.ground.position.set(0, 0, 0);


    this.net = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, this.widthPlane), new THREE.MeshLambertMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.0 }));
    this.net.position.set(0, 1.0, 0);
    this.net.rotation.x = Math.PI / 2;
    this.net.rotation.y = Math.PI / 2;


    this.gravity = -9.81; //6.81

    this.powerBlockWidth = 0;
  }

  async loadArenaModel() {
    const gltfLoader = new GLTFLoader();
    const url = 'models/arena/new/arena.gltf';


    await gltfLoader.loadAsync(url).then((gltf) => {
      const root = gltf.scene;
      this.arenaModel = root;

      // this.arenaModel.rotation.y = Math.PI;
      this.arenaModel.scale.x = 0.885;
      this.arenaModel.scale.z = 0.893;
      this.arenaModel.scale.y = 0.86;
      // this.arenaModel.scale.y = 0.7;
      // this.arenaModel.scale.z = 0.7;

      this.arenaModel.position.x = 0.17;
      this.arenaModel.position.y = 0.1;




    });
  }
}
