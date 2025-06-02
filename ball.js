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

  this.ballMarkGeometry = new THREE.PlaneGeometry(0.3, 0.3);
  this.ballMarkMaterial = new THREE.MeshPhongMaterial({ color: 0xaa0000, transparent: true, opacity: 0.6 });
  this.ballMark = new THREE.Mesh(this.ballMarkGeometry, this.ballMarkMaterial);
  this.ballMark.position.y = 1;
  this.ballMark.position.z = 1;
  this.ballMark.rotation.x = -Math.PI / 2;

  this.ballMark2Geometry = new THREE.PlaneGeometry(0.7, 0.7);
  this.ballMark2Material = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
  this.ballMarkOnGround = new THREE.Mesh(this.ballMark2Geometry, this.ballMark2Material);
  this.ballMarkOnGround.position.y = 0.04;
  this.ballMarkOnGround.position.z = -2;
  this.ballMarkOnGround.rotation.x = -Math.PI / 2;



  this.ballTouchGeometry = new THREE.PlaneGeometry(0.2, 0.2);
  this.ballTouchMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 0.9 });
  this.ballTouch = new THREE.Mesh(this.ballTouchGeometry, this.ballTouchMaterial);
  this.ballTouch.position.y = 0.04;
  this.ballTouch.position.z = 0;

  this.ballTouch.rotation.x = -Math.PI / 2;


  this.ballBody;

  this.ballSideMe = false;
  this.ballMarkSideMe = false;

  this.ballCenterField = false;

  this.inPlane = false;

  this.ballSpeed = 0;
  this.ballSpin = 0;

 }

 async loadBallModel() {

  const loaderTexture = new THREE.TextureLoader();
  const urlTexture = 'textures/mark-ground.png';
  await loaderTexture.loadAsync(urlTexture).then((texture) => {

   const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
   this.ballMarkOnGround.material = material;

  });

  const loaderTextureTouch = new THREE.TextureLoader();
  const urlTextureTouch = 'textures/mark-touch.png';
  await loaderTextureTouch.loadAsync(urlTextureTouch).then((texture) => {

   const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.4 });
   this.ballTouch.material = material;

  });

  const loaderTextureBall = new THREE.TextureLoader();
  const urlTextureBall = 'textures/mark-ball.png';
  await loaderTextureBall.loadAsync(urlTextureBall).then((texture) => {

   const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1 });
   this.ballMark.material = material;

  });



  const gltfLoader = new GLTFLoader();
  const url = 'models/ball/ball.glb';

  await gltfLoader.loadAsync(url).then((gltf) => {
   const root = gltf.scene;
   this.ball = root;



   this.ball.children[0].children[0].castShadow = true;
   this.ball.children[0].children[1].castShadow = true;



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
