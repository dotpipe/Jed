import * as THREE from './three.module.js';
import { Character } from './character.js';
import HumanInterfaceDevice from './humaninterfacedevice.js';
import Segment from './Segment.js';
import Wall from './wall.js';
import { OrbitControls } from './orbitcontrols.js';

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
    this.segmentObject = new Segment(0, 10, wallMaterial, this.scene);
    this.segments = this.segmentObject.createWalls();
    // Initialize HumanInterfaceDevice
    this.hid = new HumanInterfaceDevice(this.camera, this.canvas);
    this.animate();
  }

  checkCollision(camera) {
    // const cameraPosition = camera.position;
    const distanceThreshold = 0.05;

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
        camera.position.add(new THREE.Vector3(correctionX, correctionY, correctionZ));

        // Disable movement in the direction of the closest wall
        if (movementDirection.x > 0 && distanceX < distanceY && distanceX < distanceZ) {
          camera.moveLeft = false;
        } else if (movementDirection.x < 0 && distanceX < distanceY && distanceX < distanceZ) {
          camera.moveRight = false;
        }

        if (movementDirection.y > 0 && distanceY < distanceX && distanceY < distanceZ) {
          camera.moveDown = false;
        } else if (movementDirection.y < 0 && distanceY < distanceX && distanceY < distanceZ) {
          camera.moveUp = false;
        }

        if (movementDirection.z > 0 && distanceZ < distanceX && distanceZ < distanceY) {
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

    // Adjust camera rotation based on mouse movements
    camera.rotation.y -= mouseMovementX * 0.02; // Adjust the rotation speed as needed
    camera.rotation.x -= mouseMovementY * 0.02; // Adjust the rotation speed as needed
  }

  loadSegments() {
    // Get the current position of the player
    const playerPosition = character.position;

    // Iterate over the array of segments
    for (const segment of this.segments) {
      // Check if the player has crossed into the segment
      if (this.isPlayerInSegment(playerPosition, segment)) {
        // Draw the walls of the segment
        segment.draw();
      }
    }
  }

  isPlayerInSegment(playerPosition, segments) {
    // Check if the player's position is within the segment's boundaries
    const startX = segments.startPoint;
    const startY = segments.startPoint;
    const startZ = segments.startPoint;
    const endX = segments.endPoint;
    const endY = segments.endPoint;
    const endZ = segments.endPoint;

    return (
      playerPosition.x >= startX &&
      playerPosition.x <= endX &&
      playerPosition.y >= startY &&
      playerPosition.y <= endY &&
      playerPosition.z >= startZ &&
      playerPosition.z <= endZ
    );
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

  isPathClear(startX, startY, startZ, endX, endY, endZ) {
    // Implementation of path clearance check using WebGL
    const threshold = 0.1; // Adjust this value as needed

    // Calculate distances along each axis
    const distanceX = Math.abs(endX - startX);
    const distanceY = Math.abs(endY - startY);
    const distanceZ = Math.abs(endZ - startZ);

    // Check for potential collision along each axis
    if (distanceX < threshold) {
      // Stop movement along the X axis
      return false;
    }

    if (distanceY < threshold) {
      // Stop movement along the Y axis
      return false;
    }

    if (distanceZ < threshold) {
      // Stop movement along the Z axis
      return false;
    }

    // No collision detected
    return true;
  }

  addLayer(color) {
    this.layers.push({
      color,
      walls: [],
    });
  }

  addWall(layerIndex, startPoint, endPoint, height, color) {
    const wall = new Wall(startPoint, endPoint, height, color);
    this.layers[layerIndex].walls.push(wall);
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
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
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
    ceiling.position.set(0, roomHeight / 2, 0);

    // Add the walls, floor, and ceiling to the scene
    walls.forEach(wall => this.scene.add(wall));
    this.scene.add(floor);
    this.scene.add(ceiling);

    // Set up renderer
    this.renderer.setSize(this.canvas.width, this.canvas.height);

    this.render();

    // Render the scene and update it in a loop
    this.animate();
  }

  render() {
    this.renderer.clear();

    // Set the background color to red
    this.renderer.setClearColor(0xff0000);

    // Render the scene with the camera
    this.renderer.render(this.scene, this.camera);

    // Set the background color to blue
    this.renderer.setClearColor(0x0000ff);

    // Render the scene again with the camera
    this.renderer.render(this.scene, this.camera);
  }

  createSegments() {
    const segments = [];
    const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    for (let i = 0; i < 10; i++) {
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(i * 2 - 10, 0, 0); // Position the walls along the x-axis
      this.segments.push(wall);
    }
  }

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

    // Check if the player has crossed into a new segment
    // Assuming segments is defined in this class
    for (const segment of this.segments) {
      if (this.isPlayerInSegment(playerPosition, segment) && !segment.isLoaded) {
        segment.draw();
        segment.isLoaded = true;
      }
    }
    this.render();
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.update(); // Update the controls
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

    const cameraDirection = forward.clone().applyQuaternion(camera.quaternion);
    const cameraRight = right.clone().applyQuaternion(camera.quaternion);

    if (keyboardControls.ArrowUp) {
      character.position.add(cameraDirection.multiplyScalar(-speed));
    }
    if (keyboardControls.ArrowDown) {
      character.position.add(cameraDirection.multiplyScalar(speed));
    }
    if (keyboardControls.ArrowLeft) {
      character.position.add(cameraRight.multiplyScalar(-speed));
    }
    if (keyboardControls.ArrowRight) {
      character.position.add(cameraRight.multiplyScalar(speed));
    }
  }
}

export default GameMap;