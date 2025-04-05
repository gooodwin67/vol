import * as THREE from "three";

export class World {
 constructor(scene) {
  this.ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);

  this.dirLight = new THREE.DirectionalLight(0xffffff, 2);
  this.dirLight.position.set(0, 6, 0);

  this.scene = scene;
  this.geometryPlane = new THREE.BoxGeometry(10, 0.2, 10);
  this.materialPlane = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
  this.plane = new THREE.Mesh(this.geometryPlane, this.materialPlane);
  this.plane.position.set(0, 0, 0);

  this.powerBlockWidth = 0;
 }
}
