// import Wall from "./wall.js";
import * as THREE from './three.module.js';

class Column {
  constructor(startPoint = 0, endPoint = 10, material = 0x00ff00, style = [1], width = 1, height = 1, depth = 1,radius = 1) {
    this.wallGeometry = new THREE.BoxGeometry(width, height, depth, 1, 1, 1);
    const COLUMN = 0;
    this.walls = [];
    for (let i = this.startPoint; i < this.endPoint; i++) {
      if (i > 0 && COLUMN == this.style[i % this.style.length]) {
        this.wallGeometry = new THREE.CylinderGeometry(radius, radius, height, 32);
      }
      this.wall = new THREE.Mesh(this.wallGeometry, material);
      this.wall.position.set(i * 2 - 10, 0, 0); // Position the walls along the x-axis
      this.walls.push(this.wall);
    }
    return this.walls;
  }
}

export default Column;