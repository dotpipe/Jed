import * as THREE from './three.module.js';
import { Character } from './character.js';
import HumanInterfaceDevice from './humaninterfacedevice.js';
import Segment from './segment.js';
import Wall from './wall.js';
import { OrbitControls } from './orbitcontrols.js';
import Protonic from './protonic.js';
// import { Room } from './room.js';

class GameMap {

  constructor(canvasId) {
    // Initialize canvas and WebGL context
    this.canvas = document.getElementById('canvas');
    // this.gl = this.canvas.getContext('webgl');
    this.layers = [];
    this.xAxis = 0; // X axis
    this.yAxis = 0; // Y axis
    this.zAxis = -25; // Z axis
    this.position = [x => this.xAxis, y => this.yAxis, z => this.zAxis];
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, highperformance: true }); // Initialize the renderer
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
    this.segmentObject = new Segment(0, 10, wallMaterial, this.scene, 0, 0.3);
    this.segments = this.segmentObject.createWalls();
    // Initialize HumanInterfaceDevice
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.cameraRotationX = 0;
    this.cameraRotationY = 0;
    this.cameraRotationZ = 0;
    this.hid = new HumanInterfaceDevice(this.camera, this.canvas);
    this.protonic = new Protonic(10, 0.5, 0.1, 0xff0000, 'linear', 0.05);
    this.protonic.setTransformedPosition(this.position.x, this.position.y, this.position.z);
    // this.room = new Room();
    this.animate();
  }

  checkCollision(camera) {
    // const cameraPosition = camera.position;
    const distanceThreshold = 0.3;

    let closestWall = null;
    let closestDistanceX = Infinity;
    let closestDistanceY = Infinity;
    let closestDistanceZ = Infinity;

    // Iterate over all walls and find the closest one
    for (const wall of this.segments) {
      const wallPosition = wall.position;
      const cameraPosition = camera.position;
      const distanceX = Math.abs(cameraPosition.x - wallPosition.x);
      const distanceY = Math.abs(cameraPosition.y - wallPosition.y);
      const distanceZ = Math.abs(cameraPosition.z - wallPosition.z);
      const movementDirection = camera.getWorldDirection(new THREE.Vector3());
      // Check if any of the axes are infringed upon
      if (distanceX < distanceThreshold || distanceY < distanceThreshold || distanceZ < distanceThreshold) {
        // Calculate the movement direction vector
        const movementDirection = camera.getWorldDirection(new THREE.Vector3());

        // Calculate the correction vector to move the camera away from the wall
        const correctionX = movementDirection.x * Math.max(distanceThreshold - distanceX, 0);
        const correctionY = movementDirection.y * Math.max(distanceThreshold - distanceY, 0);
        const correctionZ = movementDirection.z * Math.max(distanceThreshold - distanceZ, 0);

        // Move the camera away from the wall
        camera.position.add(new THREE.Vector3(correctionX, 0, correctionZ));

        // Disable movement in the direction of the closest wall
        if (movementDirection.x > 0 && distanceX < distanceY && distanceX < distanceZ) {
          camera.moveLeft = false;
          camera.position.add(new THREE.Vector3(correctionX, 0, correctionZ));
        } else if (movementDirection.x < 0 && distanceX < distanceY && distanceX < distanceZ) {
          camera.moveRight = false;

          camera.position.add(new THREE.Vector3(correctionX, 0, correctionZ));
        }

        if (movementDirection.y > 0 && distanceY < distanceX && distanceY < distanceZ) {
          camera.moveDown = false;

          camera.position.add(new THREE.Vector3(correctionX, 0, correctionZ));
        } else if (movementDirection.y < 0 && distanceY < distanceX && distanceY < distanceZ) {
          camera.moveUp = false;

          camera.position.add(new THREE.Vector3(correctionX, 0, correctionZ));
        }

        if (movementDirection.z > 0 && distanceZ < distanceX && distanceZ < distanceY) {
          camera.moveBackward = false;

          camera.position.add(new THREE.Vector3(correctionX, 0, correctionZ));
        } else if (movementDirection.z < 0 && distanceZ < distanceX && distanceZ < distanceY) {
          camera.moveForward = false;

          camera.position.add(new THREE.Vector3(correctionX, 0, correctionZ));
        }
        // Camera is encroaching the wall, prevent movement further
        return;
      }

      // Update the closest distance for each axis
      closestDistanceX = Math.min(closestDistanceX, distanceX);
      closestDistanceY = Math.min(closestDistanceY, distanceY);
      closestDistanceZ = Math.min(closestDistanceZ, distanceZ);

      if (distanceX < closestDistanceX || distanceY < closestDistanceY || distanceZ < closestDistanceZ) {
        closestWall = wall;
        closestDistanceX = distanceX;
        closestDistanceY = distanceY;
        closestDistanceZ = distanceZ;
      }
      if (
        (distanceX < distanceThreshold || distanceY < distanceThreshold || distanceZ < distanceThreshold) &&
        (cameraPosition.x >= wallPosition.x && cameraPosition.x <= wallPosition.x + wall.width) &&
        (cameraPosition.y >= wallPosition.y && cameraPosition.y <= wallPosition.y + wall.height) &&
        (cameraPosition.z >= wallPosition.z && cameraPosition.z <= wallPosition.z + wall.depth)
      ) {
        // if (movementDirection.z > 0 && distanceZ < distanceX && distanceZ < distanceY) {
        camera.moveBackward = false;
      } else if (movementDirection.z < 0 && distanceZ < distanceX && distanceZ < distanceY) {
        camera.moveForward = false;
      }
      // Camera is encroaching the wall, prevent movement further
      return;
    }

    // Update the closest distance for each axis
    closestDistanceX = Math.min(closestDistanceX, distanceX);
    closestDistanceY = Math.min(closestDistanceY, distanceY);
    closestDistanceZ = Math.min(closestDistanceZ, distanceZ);

    if (distanceX < closestDistanceX || distanceY < closestDistanceY || distanceZ < closestDistanceZ) {
      closestWall = wall;
      closestDistanceX = distanceX;
      closestDistanceY = distanceY;
      closestDistanceZ = distanceZ;
    }
    // Handle mouse movements for camera look
    const mouseMovementX = camera.rotation.x; /* get mouse movement in X direction */
    const mouseMovementY = camera.rotation.y;/* get mouse movement in Y direction */
    const mouseMovementZ = camera.rotation.z;/* get mouse movement in Y direction */

    // Adjust camera rotation based on mouse movements
    camera.rotation.z -= mouseMovementZ * 0.02; // Adjust the rotation speed as needed
    camera.rotation.y -= mouseMovementY * 0.02; // Adjust the rotation speed as needed
    camera.rotation.x -= mouseMovementX * 0.02; // Adjust the rotation speed as needed
  }

  handleKeyDown(event) {
    switch (event.code) {
      case 'KeyW': // Move forward
        moveForward = true;
        break;
      case 'KeyS': // Move backward
        moveBackward = true;
        break;
      case 'KeyA': // Move left
        moveLeft = true;
        break;
      case 'KeyD': // Move right
        moveRight = true;
        break;
      case 'Space': // Spacebar
        this.protonic = new Protonic(6, 0.5, 0.1, 0xff0000, 'bouncing', 0.05);
        this.protonic.draw(this.scene);
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.code) {
      case 'KeyW': // Stop moving forward
        moveForward = false;
        break;
      case 'KeyS': // Stop moving backward
        moveBackward = false;
        break;
      case 'KeyA': // Stop moving left
        moveLeft = false;
        break;
      case 'KeyD': // Stop moving right
        moveRight = false;
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
    this.hid = new HumanInterfaceDevice(this.camera, this.renderer.domElement);
    // Set up camera position and controls
    this.camera.position.set(0, 0, 10);
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

    // Create the room geometry
    const roomWidth = 100;
    const roomHeight = 100;
    const roomDepth = 100;

    // Create the walls
    const wallGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, 0.1);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const walls = [
      new THREE.Mesh(wallGeometry, wallMaterial),
      new THREE.Mesh(wallGeometry, wallMaterial),
      new THREE.Mesh(wallGeometry, wallMaterial),
      new THREE.Mesh(wallGeometry, wallMaterial),
    ];

    walls[0].position.set(0, roomHeight / 2, -roomDepth / 2);
    walls[1].position.set(0, roomHeight / 2, roomDepth / 2);
    walls[2].position.set(-roomWidth / 2, roomHeight / 2, 0);
    walls[3].position.set(roomWidth / 2, roomHeight / 2, 0);

    // Create the floor
    const floorGeometry = new THREE.BoxGeometry(roomWidth, 0.1, roomDepth);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, -roomHeight / 2, 0);

    // Create the ceiling
    const ceilingGeometry = new THREE.BoxGeometry(roomWidth, 0.1, roomDepth);
    const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.set(0, roomHeight, 0);

    // Add the walls, floor, and ceiling to the scene
    walls.forEach(wall => this.scene.add(wall));
    this.scene.add(floor);
    this.scene.add(ceiling);

    // Set up renderer
    this.renderer.setSize(this.canvas.width, this.canvas.height);

    // this.render();

    // Render the scene and update it in a loop
    this.animate();
    document.addEventListener('mousemove', (event) => {
      const mouseSpeed = 0.00002;
      this.cameraRotationY -= event.movementY * mouseSpeed;
      this.cameraRotationX -= event.movementX * mouseSpeed;
      this.cameraRotationZ -= event.movementZ * mouseSpeed;
      this.camera.position.set(this.cameraRotationX, this.cameraRotationY, this.cameraRotationZ);
      // this.controls = new PointerLockControls(this.camera, this.canvas);
      this.scene.add(this.controls.getObject());
    });
  }

  // Create Segments with Segment.js

  animate() {
    // Get the current position of the player
    // Assuming character is a global object or it's defined in this class
    const playerPosition = this.character.position;

    const moveSpeed = 0.1;

    // Use the controls instance from the HumanInterfaceDevice class
    if (this.hid.moveForward) {
      this.hid.controls.moveForward(moveSpeed);
    }
    if (this.hid.moveBackward) {
      this.hid.controls.moveForward(-moveSpeed);
    }
    if (this.hid.moveLeft) {
      this.hid.controls.moveRight(-moveSpeed);
    }
    if (this.hid.moveRight) {
      this.hid.controls.moveRight(moveSpeed);
    }

    // Update camera rotation based on mouse movement
    this.camera.rotation.x = this.cameraRotationX * 0.2;
    this.camera.rotation.y = this.cameraRotationY * 0.2;
    this.camera.rotation.z = this.cameraRotationZ * 0.2;
    this.controls.target = new THREE.Vector3(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z);
    this.controls.update(); // Update the controls

    this.protonic.setTransformedPosition(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    this.checkCollision(this.camera);
    const delta = this.hid.clock.getDelta();
    this.hid.update(delta);
    this.segmentObject.draw(this.scene);
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