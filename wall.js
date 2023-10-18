// import * as THREE from './three.module.js';
// import { PointerLockControls } from './node_modules/three/examples/jsm/controls/PointerLockControls.js';
// import { Character } from './character.js';
import HumanInterfaceDevice from './humaninterfacedevice.js';
import Segment from './Segment.js';

class Wall {

  constructor(startPoint = 0, endPoint = 100, height = 100, width = 100, color = 0x0f0f0f0a, texturepath = "", damage = -1, permeation = 1, curvature = 0) {
    this.scene = new THREE.Scene(); // Create a new scene for each segment
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.height = height;
    this.color = color;
    this.damage = damage;
    this.entrances = [];
    this.dimensions = { height, height };
    this.columns = [];
    this.permeation = permeation;
    this.curvature = curvature;
    this.loader = new THREE.TextureLoader();
    this.texture = this.loader.load(texturepath) || null;
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshLambertMaterial({ color: this.color });
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(this.startPoint.x, this.startPoint.y, this.startPoint.z),
      new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z)
    ]);
    const points = curve.getPoints(50);
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.mesh = new THREE.Line(this.geometry, this.material);
  }

  makeFloor() {
    const floorStartPoint = new THREE.Vector3(0, 0, 0);
    const floorEndPoint = new THREE.Vector3(10, 0, 10);
    const floorHeight = 0;
    const floorWidth = 10;
    const floorColor = 0x00ff00; // Green
    const floorTexturePath = ""; // Add texture path if needed

    const floor = new Wall(floorStartPoint, floorEndPoint, floorHeight, floorWidth, floorColor, floorTexturePath);
    floor.mesh.rotation.x = Math.PI / 2; // Rotate the floor 90 degrees around the x-axis
  }
  
  makeCeiling() {
    const ceilingStartPoint = new THREE.Vector3(0, 10, 0);
    const ceilingEndPoint = new THREE.Vector3(10, 10, 10);
    const ceilingHeight = 0;
    const ceilingWidth = 10;
    const ceilingColor = 0x0000ff; // Blue
    const ceilingTexturePath = ""; // Add texture path if needed

    const ceiling = new Wall(ceilingStartPoint, ceilingEndPoint, ceilingHeight, ceilingWidth, ceilingColor, ceilingTexturePath);
    ceiling.mesh.rotation.x = -Math.PI / 2; // Rotate the ceiling -90 degrees around the x-axis
  }

  createScene() {
    this.scene = new THREE.Scene(); // Create a new scene for each segment

    // Add the mesh to the scene
    this.scene.add(this.mesh);

    // Add lighting to the scene
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    this.scene.add(light);
  }

  addEntrance(entrance) {
    this.entrances.push(entrance);
  }

  createGeometry() {
    const points = this.createCurve();
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);
  }

  createCurve() {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(this.startPoint.x, this.startPoint.y, this.startPoint.z),
      new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z)
    ]);
    const points = curve.getPoints(50); // Adjust the number of points as needed
    return points;
  }

  createMesh() {
    const points = this.createCurve();
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // Set the position and scale of the mesh based on the wall's start and end points
    this.mesh.position.set(this.startPoint.x, this.startPoint.y, this.startPoint.z);
    this.mesh.scale.set(
      Math.abs(this.endPoint.x - this.startPoint.x),
      Math.abs(this.endPoint.y - this.startPoint.y),
      Math.abs(this.endPoint.z - this.startPoint.z)
    );
  }

  toJSON() {
    return {
      entrances: this.entrances.map((entrance) => entrance.toJSON()),
    };
  }

  static fromJSON(json) {
    const wall = new Wall();
    wall.entrances = json.entrances.map((entranceJson) => Entrance.fromJSON(entranceJson));
    return wall;
  }

  addColumn(column) {
    this.columns.push(column);
  }

  draw(scene) {
    // Apply curvature to the wall
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(this.startPoint.x, this.startPoint.y, this.startPoint.z),
      new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z)
    ]);
    const points = curve.getPoints(50);
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // Set the position and scale of the mesh based on the wall's start and end points
    this.mesh.position.set(this.startPoint.x, this.startPoint.y, this.startPoint.z);
    this.mesh.scale.set(
      Math.abs(this.endPoint.x - this.startPoint.x),
      Math.abs(this.endPoint.y - this.startPoint.y),
      Math.abs(this.endPoint.z - this.startPoint.z)
    );

    // Add the mesh to the scene
    scene.add(this.mesh);

    // Add lighting to the scene
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);
  }

}

export default Wall;