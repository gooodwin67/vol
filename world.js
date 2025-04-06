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
  this.geometryPlane = new THREE.BoxGeometry(10, 0.2, 10);
  this.materialPlane = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  this.plane = new THREE.Mesh(this.geometryPlane, this.materialPlane);
  this.plane.receiveShadow = true;
  this.plane.position.set(0, 0, 0);

  this.plane2 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 10), new THREE.MeshLambertMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5 }));
  this.plane2.position.set(-5, 2.5, 0);
  this.plane2.rotation.z = Math.PI/2;

  this.plane3 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 10), new THREE.MeshLambertMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5 }));
  this.plane3.position.set(5, 2.5, 0);
  this.plane3.rotation.z = Math.PI/2;

  this.plane4 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 10), new THREE.MeshLambertMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.1 }));
  this.plane4.position.set(0, 2.5, -5);
  this.plane4.rotation.x = Math.PI/2;
  this.plane4.rotation.y = Math.PI/2;

  this.plane5 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 10), new THREE.MeshLambertMaterial({ color: 0xaaaaaa, transparent: false, opacity:1 }));
  this.plane5.position.set(0, 2.5, 5);
  this.plane5.rotation.x = Math.PI/2;
  this.plane5.rotation.y = Math.PI/2;



  this.powerBlockWidth = 0;
 }
}
