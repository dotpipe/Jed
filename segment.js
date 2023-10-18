import { Room } from './room.js';
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
    const wallGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);

    for (let i = this.startPoint; i < this.endPoint; i++) {
      const wall = new THREE.Mesh(wallGeometry, this.material);
      wall.position.set(i * 5 - 10, 0, 0); // Position the walls along the x-axis
      this.walls.push(wall);
    }

    // Create the ceiling
    const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0x007FFF });
    const ceilingGeometry = new THREE.BoxGeometry(100, 0.1, 10);
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = 1;
    this.walls.push(ceiling);

    // Create the floor
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x4F3727 });
    const floorGeometry = new THREE.BoxGeometry(100, 0.1, 10);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    this.walls.push(floor);
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