import * as THREE from './three.module.js';
import { Character } from './character.js';
import HumanInterfaceDevice from './humaninterfacedevice.js';
import Segment from './segment.js';
import Walls from './walls.js';
import { OrbitControls } from './orbitcontrols.js';
import Protonic from './protonic.js';
import { collisionChecker } from './checkcollision.js';
import Column from './column.js';

class GameMap {

  constructor(canvasId) {
    // Initialize canvas and WebGL context
    this.canvas = document.getElementById(canvasId);
    // this.gl = this.canvas.getContext('webgl');
    this.layers = [];
    this.xAxis = -90; // X axis
    this.yAxis = 0; // Y axis
    this.zAxis = -25; // Z axis
    this.position = [x => this.xAxis, y => this.yAxis, z => this.zAxis];
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, highperformance: true }); // Initialize the renderer
    this.renderer.shadowMapEnabled = true
    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Add event listeners for HID control
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

    // Initialize camera target position
    this.targetX = 0;
    this.targetY = 0;
    this.targetZ = 0;
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.character = new Character("Me", [0, 0, 0], 100, 0.01);
    this.scene = new THREE.Scene();
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // this.segmentObject = new Segment(0, 10, wallMaterial, this.scene, 0, 0.3);
    // this.segments; // = this.segmentObject.createWalls();
    // Initialize HumanInterfaceDevice
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.cameraRotationX = 0;
    this.cameraRotationY = 0;
    this.cameraRotationZ = 0;
    this.hid = new HumanInterfaceDevice(this.camera, this.canvas);
    this.protonic; // = new Protonic(this.camera, this.segments, 10, 0.5, 0.1, 0xff0000, 'linear', 0.5);
    // this.protonic.setTransformedPosition(this.cameraRotationX, this.cameraRotationX, this.cameraRotation);
    // this.room = new Room();
    // this.collisionCheck = 
    const url = new THREE.TextureLoader().load('./leafwall.webp');
    this.wallOptions = [
      { size: [50, 2.5, 1], wrapS: 2, wrapT: 120, texture: url, yAxis: 0, positions: [0, -1, -5], segments: [1, 1, 1] },
      { size: [15, 2.5, 20], color: 0xdfffbf, yAxis: 0, positions: [-25, 0, 5], segments: [1, 1, 1] },
      { size: [50, 2.5, 1], color: 0xafaeec, yAxis: 0, positions: [0, -1, 5], segments: [1, 1, 1] },
      { size: [15, 2.5, 20], color: 0xafaeec, yAxis: 0, positions: [25, 0, -5], segments: [1, 1, 1] },
      { size: [100, 2, 30], color: 0x00f300, yAxis: -4, positions: [-75, -1, -5], segments: [1, 1, 1] },
      { size: [100, 2, 20], color: 0x0000af, yAxis: 3.5, positions: [-100, 2.5, -5], segments: [1, 1, 1] }
    ];
    this.segments = new Walls(this.wallOptions);
    this.animate();
  }

  handleKeyDown(event) {
    switch (event.code) {
      case 'KeyW': // Move forward
        this.moveForward = true;
        break;
      case 'KeyS': // Move backward
        this.moveBackward = true;
        break;
      case 'KeyA': // Move left
        this.moveLeft = true;
        break;
      case 'KeyD': // Move right
        this.moveRight = true;
        break;
      case 'Space': // Spacebar
        this.protonic = new Protonic(this.canvas, this.scene, this.camera, this.segments, 0.3, 0.5, 0.3, 0xff0000, 'linear', 1.25);
        this.protonic.draw(this.scene, this.camera);
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.code) {
      case 'KeyW': // Stop moving forward
        this.moveForward = false;
        break;
      case 'KeyS': // Stop moving backward
        this.moveBackward = false;
        break;
      case 'KeyA': // Stop moving left
        this.moveLeft = false;
        break;
      case 'KeyD': // Stop moving right
        this.moveRight = false;
        break;
    }
  }

  handleMouseMove(event) {
    // Assuming that the `controls` instance of the `PointerLockControls` class is stored in the `hid` property
    if (this.hid.controls.isLocked) {
      const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      this.hid.controls.moveRight(-movementX * 0.002);
      this.hid.controls.moveForward(-movementY * 0.002);
    }
  }

  handleMouseDown(event) {
    // Handle mouse down event
    // Add your code here
  }

  handleMouseUp(event) {
    // Handle mouse up event
    // Add your code here
  }

  draw() {
    this.clock = new THREE.Clock();
    // Create a THREE.js scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 0, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    // this.hid = new HumanInterfaceDevice(this.camera, this.canvas);
    // Set up camera position and controls
    this.camera.position.set(0, 0, 0);
    this.controls = new PointerLockControls(this.camera, this.canvas);
    this.scene.add(this.controls.getObject());

    // Enable pointer lock
    this.canvas.addEventListener('click', () => {
      this.canvas.requestPointerLock();
    });

    // Handle pointer lock change
    const handlePointerLockChange = () => {
      if (document.pointerLockElement === this.canvas) {
        this.controls.enabled = true;
      } else {
        this.controls.enabled = false;
      }
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);


    this.pillars = new Column(0, 10, 0xffffff, [0, 1, 1, 0, 0], 2, 0.5);
    this.pillars.forEach(element => {
      this.scene.add(element);
    });
    // Set up renderer
    this.renderer.setSize(this.canvas.width, this.canvas.height);

    // this.render();
    this.controls.autoRotate();
    // Render the scene and update it in a loop
    this.animate();
    document.addEventListener('mousemove', (event) => {
      const mouseSpeed = 0.002;
      this.cameraRotationY -= event.movementY * mouseSpeed;
      this.cameraRotationX -= event.movementX * mouseSpeed;
      this.cameraRotationZ -= event.movementZ * mouseSpeed;
      this.camera.position.set(this.cameraRotationX, this.cameraRotationY, this.cameraRotationZ);
      this.scene.add(this.controls.getObject());
    });
  }

  // Create Segments with Segment.js

  animate() {
    this.camera.rotateX(this.cameraRotationX);
    this.camera.rotateY(this.cameraRotationY);
    this.camera.rotateZ(this.cameraRotationZ);
    // this.protonic.setTransformedPosition(this.cameraRotationX, this.cameraRotationY, this.cameraRotationZ);

    const delta = this.hid.clock.getDelta();
    this.hid.update(delta);
    this.segments.forEach(f => this.scene.add(f));
    
    new collisionChecker(this.scene, this.camera, this.segments, this.hid);
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  updateCharacterPosition() {
    const speed = 0.1;

    const forward = new THREE.Vector3(0, 0, -1);
    const right = new THREE.Vector3(1, 0, 0);

    const cameraDirection = forward.clone().applyQuaternion(this.camera.quaternion);
    const cameraRight = right.clone().applyQuaternion(this.camera.quaternion);

    if (keyboardControls.ArrowUp) {
      this.character.position.add(cameraDirection.multiplyScalar(-speed));
    }
    if (keyboardControls.ArrowDown) {
      this.character.position.add(cameraDirection.multiplyScalar(speed));
    }
    if (keyboardControls.ArrowLeft) {
      this.character.position.add(cameraRight.multiplyScalar(-speed));
    }
    if (keyboardControls.ArrowRight) {
      this.character.position.add(cameraRight.multiplyScalar(speed));
    }
  }
}

export default GameMap;