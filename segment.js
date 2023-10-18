import * as THREE from './three.module.js';

class Segment {
  constructor(startPoint, endPoint, material, scene) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.material = material;
    this.walls = [];
    this.isLoaded = false;
    this.createWalls();
  }

  createWalls() {
    const wallGeometry = new THREE.BoxGeometry(1, 1, 1);

    for (let i = this.startPoint; i < this.endPoint; i++) {
      const wall = new THREE.Mesh(wallGeometry, this.material);
      wall.position.set(i * 2 - 10, 0, 0); // Position the walls along the x-axis
      this.walls.push(wall);
    }

    return this.walls;
  }

  draw(scene) {
    if (!this.isLoaded) {
      this.walls.forEach(wall => scene.add(wall));
      this.isLoaded = true;
    }
  }

  hide(scene) {
    if (this.isLoaded) {
      this.walls.forEach(wall => scene.remove(wall));
      this.isLoaded = false;
    }
  }
}

export default Segment;