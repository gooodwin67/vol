import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Ball {
 constructor(scene) {
  // this.ballGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  // this.ballMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  // this.ball = new THREE.Mesh(this.ballGeometry, this.ballMaterial);
  // this.ball.position.z = 1;
  // this.ball.position.y = 1;
  // this.ball.castShadow = true;

  this.ballMarkGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.2);
  this.ballMarkMaterial = new THREE.MeshPhongMaterial({ color: 0xaa0000, transparent: true, opacity: 0.6 });
  this.ballMark = new THREE.Mesh(this.ballMarkGeometry, this.ballMarkMaterial);
  this.ballMark.position.y = 0.1;
  this.ballMark.position.z = 1;

  this.ballMark2Geometry = new THREE.BoxGeometry(0.4, 0.1, 0.4);
  this.ballMark2Material = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
  this.ballMarkOnGround = new THREE.Mesh(this.ballMark2Geometry, this.ballMark2Material);
  this.ballMarkOnGround.position.y = 0.1;
  this.ballMarkOnGround.position.z = -2;


  this.ballTouchGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  this.ballTouchMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 1 });
  this.ballTouch = new THREE.Mesh(this.ballTouchGeometry, this.ballTouchMaterial);
  this.ballTouch.position.y = 0.1;
  this.ballTouch.position.z = 0;


  this.ballBody;

  this.ballSideMe = false;
  this.ballMarkSideMe = false;

  this.ballCenterField = false;

  this.inPlane = false;


 }

 async loadBallModel() {
  const gltfLoader = new GLTFLoader();

  const url = 'models/ball/ball.glb';


  await gltfLoader.loadAsync(url).then((gltf) => {
   const root = gltf.scene;
   this.ball = root;



   // const textureLoader = new THREE.TextureLoader();
   // const texture1 = textureLoader.load('/models/arena/arena2.jpg');
   // texture1.flipY = false; // По умолчанию true, попробуйте изменить
   //this.arenaModel.children[0].children[0].children[0].children[0].children[0].material = new THREE.MeshLambertMaterial({ map: texture1 });


   this.ball.scale.x = 0.5;
   this.ball.scale.y = 0.5;
   this.ball.scale.z = 0.5;




  });
 }
}
