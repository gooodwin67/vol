import * as THREE from "three";

export function detectCollisionCubes(object1, object2) {
    object1.geometry.computeBoundingBox();
    object2.geometry.computeBoundingBox();
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();
    let box1 = object1.geometry.boundingBox.clone();
    box1.applyMatrix4(object1.matrixWorld);
    let box2 = object2.geometry.boundingBox.clone();
    box2.applyMatrix4(object2.matrixWorld);

    //if (box1.intersectsBox(box2)) $('.info').text(1);
    return box1.intersectsBox(box2);
}

export function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min
}

export function randomVector(vector, accuracy) {
    const newVector = vector.clone()
    newVector.x += getRandomNumber(-1 * (100 - accuracy) / 10, (100 - accuracy) / 10)
    newVector.z += getRandomNumber(-1 * (100 - accuracy) / 10, (100 - accuracy) / 10)
    return newVector;
}

export function mapRange(x, inputMin, inputMax, outputMin, outputMax) {
    return outputMin + ((x - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin);
}