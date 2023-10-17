class Map {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext('webgl');
    this.layers = [];
    this.mapData = mapData;
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
    // Handle mouse movement event
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate target position based on mouse movement
    this.targetX = (mouseX / this.canvas.width) * 2 - 1;
    this.targetY = -(mouseY / this.canvas.height) * 2 + 1;
  }

  draw(user) {
    // Load the current segment using THREE.js
    const segment = this.loadCurrentSegment();

    // Create a THREE.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, context: this.gl });

    // Add the segment to the scene
    scene.add(segment);
    // Set up camera position and controls
    camera.position.set(0, 0, 10);
    camera.lookAt(this.targetX, this.targetY, this.targetZ);

    // Render the scene using THREE.js
    renderer.render(scene, camera);
  }
}

export { Map };