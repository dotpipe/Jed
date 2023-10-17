// import * as THREE from './three.module.js';
// import { PointerLockControls } from './node_modules/three/examples/jsm/controls/PointerLockControls.js';

export class GameMap {

  constructor(canvasId) {
    // Initialize canvas and WebGL context
    this.canvas = document.getElementById('canvas');
    this.gl = this.canvas.getContext('webgl');
    this.layers = [];
    // this.mapData = mapData;
    this.xAxis = 0; // X axis
    this.yAxis = 0; // Y axis
    this.zAxis = 0; // Z axis

    // Add event listeners for HID control
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    // Add more event listeners for other HID controls as needed

    // Initialize camera target position
    this.targetX = 0;
    this.targetY = 0;
    this.targetZ = 0;
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
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

  isPlayerInSegment(playerPosition, segment) {
    // Check if the player's position is within the segment's boundaries
    const startX = segment.startPoint.x;
    const startY = segment.startPoint.y;
    const startZ = segment.startPoint.z;
    const endX = segment.endPoint.x;
    const endY = segment.endPoint.y;
    const endZ = segment.endPoint.z;

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
    const mouseSpeed = 0.002;
    const deltaX = event.movementX * mouseSpeed;
    const deltaY = event.movementY * mouseSpeed;

    controls.rotateY(deltaX);
    controls.rotateX(deltaY);
  }

  handleMouseDown(event) {
    // Handle mouse down event
    // Add your code here
  }

  handleMouseUp(event) {
    // Handle mouse up event
    // Add your code here
  }

  draw(user) {
    // Create a THREE.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas });

    // Set up camera position and controls
    camera.position.set(0, 0, 10);
    const controls = new PointerLockControls(camera, this.canvas);
    scene.add(controls.getObject());

    // Enable pointer lock
    this.canvas.addEventListener('click', () => {
      this.canvas.requestPointerLock();
    });

    // Handle pointer lock change
    const handlePointerLockChange = () => {
      if (document.pointerLockElement === this.canvas) {
        controls.enabled = true;
      } else {
        controls.enabled = false;
      }
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // Handle user movement
    const handleUserMovement = () => {
      if (controls.enabled) {
        // Handle user movement based on user input
        // Add your movement logic here
      }
    };
    document.addEventListener('keydown', handleUserMovement);
    document.addEventListener('keyup', handleUserMovement);

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
    walls.forEach(wall => scene.add(wall));
    scene.add(floor);
    scene.add(ceiling);

    // Set up renderer
    renderer.setSize(this.canvas.width, this.canvas.height);

    let cameraRotationX = 0;
    let cameraRotationY = 0;
    // Render the scene and update it in a loop
    function animate() {
      // Get the current position of the player
      const playerPosition = character.position;

      const moveSpeed = 0.1;

      if (moveForward) {
        controls.moveForward(moveSpeed);
      }
      if (moveBackward) {
        controls.moveForward(-moveSpeed);
      }
      if (moveLeft) {
        controls.moveRight(-moveSpeed);
      }
      if (moveRight) {
        controls.moveRight(moveSpeed);
      }
      // Check if the player has crossed into a new segment
      for (const segment of this.segments) {
        if (this.isPlayerInSegment(playerPosition, segment) && !segment.isLoaded) {
          segment.draw();
          segment.isLoaded = true;
        }
      }
      controls.update()
      // Render the scene
      renderer.render(scene, camera);

      // Call the animate() method recursively
      requestAnimationFrame(this.animate.bind(this));
    }
    animate();
    document.addEventListener('mousemove', (event) => {
      const mouseSpeed = 0.002;
      cameraRotationX -= event.movementY * mouseSpeed;
      cameraRotationY -= event.movementX * mouseSpeed;
    });
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
