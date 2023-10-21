import Column from './column.js';
import { Room } from './room.js';
import * as THREE from './three.module.js';

class Segment {
  constructor(startPoint, endPoint, material, scene, style = 1, radius = 1, segments = [1, 1, 1]) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.material = material;
    this.wall;
    this.walls = [];
    this.isLoaded = false;
    this.style = style;
    this.radius = radius;
    this.wallGeometry;
    this.segments = segments;
    this.createWalls();
  }

  createWalls() {
    this.wallGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    const COLUMN = 0;
    for (let i = this.startPoint; i < this.endPoint; i++) {
      if (COLUMN == this.style) {
        this.wallGeometry = new THREE.CylinderGeometry(this.radius, this.radius, 1, 32);
      }
      this.wall = new THREE.Mesh(this.wallGeometry, this.material);
      this.wall.position.set(i * 2 - 10, 0, 0); // Position the walls along the x-axis
      this.walls.push(this.wall);
    }

    // wall 1
    this.wallGeometry = new THREE.BoxGeometry(50, 3, 1, this.segments[0], this.segments[1], this.segments[2]);
    this.wall = new THREE.Mesh(this.wallGeometry, this.material);
    this.wall.position.set(0, -1, -5); // Position the walls along the x-axis
    this.walls.push(this.wall);
    
    // wall 2
    this.wallGeometry = new THREE.BoxGeometry(15, 3, 20, this.segments[0], this.segments[1], this.segments[2]);
    this.wall = new THREE.Mesh(this.wallGeometry, this.material);
    this.wall.position.set(-25, 0, 5); // Position the walls along the x-axis
    this.walls.push(this.wall);
    
    // wall 3
    this.wallGeometry = new THREE.BoxGeometry(50, 3, 1, this.segments[0], this.segments[1], this.segments[2]);
    this.wall = new THREE.Mesh(this.wallGeometry, this.material);
    this.wall.position.set(0, -1, 5); // Position the walls along the x-axis
    this.walls.push(this.wall);
    
    // wall 4
    this.wallGeometry = new THREE.BoxGeometry(15, 3, 20, this.segments[0], this.segments[1], this.segments[2]);
    this.wall = new THREE.Mesh(this.wallGeometry, this.material);
    this.wall.position.set(25, 0, -5); // Position the walls along the x-axis
    this.walls.push(this.wall);

    // Create the ceiling
    const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0x007FFF });
    const ceilingGeometry = new THREE.BoxGeometry(50, 1, 10);
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = 1.5;
    this.walls.push(ceiling);

    // Create the floor
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x4F3727 });
    const floorGeometry = new THREE.BoxGeometry(50, 1, 10);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -2;
    this.walls.push(floor);
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