import * as THREE from "three";

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

    this.eventQueue;

    this.geometryPlane = new THREE.BoxGeometry(this.widthPlane, 0.2, this.heightPlane);
    this.materialPlane = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    this.plane = new THREE.Mesh(this.geometryPlane, this.materialPlane);
    this.plane.receiveShadow = true;
    this.plane.position.set(0, 0, 0);


    this.net = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, this.widthPlane), new THREE.MeshLambertMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 }));
    this.net.position.set(0, 1.0, 0);
    this.net.rotation.x = Math.PI / 2;
    this.net.rotation.y = Math.PI / 2;


    this.gravity = -6.81; //9.81

    this.powerBlockWidth = 0;
  }
}
