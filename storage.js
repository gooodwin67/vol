import * as THREE from "three";

export class StorageClass {
 constructor() {

  this.data = {
   career: false,
   team: {
    name: '...',
   },
  }

  this.storageLoaded = false;

  if (localStorage.getItem('data') !== null) this.readStorage();

 }

 setStorage() {
  localStorage.setItem('data', JSON.stringify(this.data));
 }
 readStorage() {
  this.data = JSON.parse(localStorage.getItem('data'));
 }





}