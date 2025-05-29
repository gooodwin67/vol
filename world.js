import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';

export class World {
  constructor(scene) {
    this.scene = scene;
    this.ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 2);
    this.dirLight.position.set(0, 4, -2);
    this.dirLight.castShadow = true;

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 100, 0);

    this.widthPlane = 8;
    this.heightPlane = 16.3;

    this.centerPlayerField = new THREE.Vector3(0, 0, this.heightPlane / 4);
    this.centerOpponentField = new THREE.Vector3(0, 0, -this.heightPlane / 4);

    this.arenaModel;

    this.eventQueue;

    this.geometryPlane = new THREE.BoxGeometry(this.widthPlane * 4, 0.1, this.heightPlane * 3);
    this.materialPlane = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0 });
    this.plane = new THREE.Mesh(this.geometryPlane, this.materialPlane);
    this.plane.receiveShadow = true;
    this.plane.position.set(0, -0.05, 0);

    this.net = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, this.widthPlane), new THREE.MeshLambertMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.0 }));
    this.net.position.set(0, 1.0, 0);
    this.net.rotation.x = Math.PI / 2;
    this.net.rotation.y = Math.PI / 2;

    this.skybox;



    this.gravity = -9.81; //6.81

    this.powerBlockWidth = 0;
  }

  async loadAround() {
    const hdrLoader = new RGBELoader();
    const envMap = await hdrLoader.loadAsync('/textures/blouberg_sunrise_2_1k.hdr');
    envMap.mapping = THREE.EquirectangularReflectionMapping;

    const params = {
      height: 10,
      radius: 50,
      enabled: true,
    };

    this.skybox = new GroundedSkybox(envMap, params.height, params.radius);
    this.skybox.position.y = params.height - 0.01;
    this.scene.add(this.skybox);

    this.scene.environment = envMap;
  }

  async loadArenaModel() {
    const gltfLoader = new GLTFLoader();
    //const url = 'models/arena/new/arena.gltf';
    const url = 'models/arena/big/arena.glb';


    await gltfLoader.loadAsync(url).then((gltf) => {
      const root = gltf.scene;
      this.arenaModel = root;

      console.log(this.arenaModel.children[0].children[0].children[0].children[0].children[0])

      const textureLoader = new THREE.TextureLoader();
      const texture1 = textureLoader.load('/models/arena/arena2.jpg');
      texture1.flipY = false; // По умолчанию true, попробуйте изменить
      //this.arenaModel.children[0].children[0].children[0].children[0].children[0].material = new THREE.MeshLambertMaterial({ map: texture1 });

      //this.arenaModel.rotation.z = Math.PI;
      // this.arenaModel.rotation.y = Math.PI;
      this.arenaModel.scale.x = 0.885;
      this.arenaModel.scale.z = 0.893;
      this.arenaModel.scale.y = 0.86;
      // this.arenaModel.scale.y = 0.7;
      // this.arenaModel.scale.z = 0.7;

      this.arenaModel.position.x = 0.17;
      this.arenaModel.position.y = 0.01;




    });
  }
}
