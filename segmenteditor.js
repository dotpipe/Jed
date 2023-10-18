import * as THREE from "./three.module.js";
import Segment from "./Segment.js";
import Wall from "./wall.js";
import Entrance from "./entrance.js";
import Column from "./column.js";
import WallMinimode from "./wallMinimode.js";

class SegmentEditor {
    constructor() {
        this.segments = [];
        this.doors = [];
        this.activeWallIndex = -1;
        this.activeGroupIndices = [];
        this.tetherPosition = { x: 0, y: 0, z: 0 };
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene = new THREE.Scene();
        this.camera.position.z = 5;
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas') });
        this.wallMinimodeActive = false;
        this.mouseDown = false;
        this.wallMinimode = new WallMinimode(); // Initialize the wallMinimode property
        this.workers = [];
        this.canvas = null;
        this.context = null;
    }

    addAgentToSegment(segment, agent) {
        // Find the segment in the segments array
        const targetSegment = this.segments.find(seg => seg === segment);

        // If the segment is found, add the agent to it
        if (targetSegment) {
            targetSegment.addAgent(agent);
        }
    }

    calculatePOV() {
        // Calculate the user's point of view (POV) looking at the tether position
        const cameraForward = new THREE.Vector3(0, 0, -1);
        const inverseRotation = new THREE.Euler(-this.cameraRotation.x, -this.cameraRotation.y, -this.cameraRotation.z);
        const rotatedForward = cameraForward.clone().applyEuler(inverseRotation);
        const POV = new THREE.Vector3(
            this.cameraPosition.x + rotatedForward.x,
            this.cameraPosition.y + rotatedForward.y,
            this.cameraPosition.z + rotatedForward.z
        );
        return POV;
    }

    rotateVector(vector, rotation) {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(rotation);

        const rotatedVector = vector.clone();
        rotatedVector.applyQuaternion(quaternion);

        return rotatedVector;
    }

    createSegment(name) {
        const segment = new Segment(name);
        this.segments.push(segment);
        return segment;
    }

    getUpdatesFromWorkers() {
        // Implement logic to fetch updates from workers
        const updates = [];

        // Iterate over the workers and retrieve updates
        for (const worker of workers) {
            const workerUpdates = worker.getUpdates(); // Assuming the worker has a method to retrieve updates
            updates.push(...workerUpdates);
        }

        return updates;
    }

    createWall(segment, texture, width, height) {

        texture = "./lowerhalfneck.jpg";
        const wall = new Wall(texture, width, height);
        segment.addWall(wall);
        this.scene.add(wall.mesh);

        // Automatically enter the wall minimode
        this.enterWallMinimode(wall);

        return wall;
    }

    enterWallMinimode(wall) {
        this.wallMinimodeActive = true;
        this.wallMinimode.wall = wall; // Set the wall object to the wall minimode
        // Add event listeners for mouse/touch events
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    exitWallMinimode() {
        this.wallMinimodeActive = false;
        // Remove event listeners
        document.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    developWall(wall) {
        // Create a wall minimode instance
        const wallMinimode = new WallMinimode();

        // Set the wall object to the wall minimode
        wallMinimode.wall = wall;

        // Create the display for the wall minimode
        wallMinimode.createDisplay();

        // Append the display to the document body or any desired container
        document.body.appendChild(wallMinimode.display);
    }

    initCanvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        // Set up event listeners for map creation
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseDown = (event) => {
        this.mouseDown = true;
        // Get the coordinates of the mouse click or touch
        const mouseX = event.clientX || event.touches[0].clientX;
        const mouseY = event.clientY || event.touches[0].clientY;
        // Find the wall that was clicked or touched
        const clickedWallIndex = this.findClickedWall(mouseX, mouseY);
        if (clickedWallIndex !== -1) {
            this.activeWallIndex = clickedWallIndex;
        }
    };

    handleMouseMove = (event) => {
        if (this.mouseDown) {
            // Handle mouse move logic
            // ...
        }
    };

    handleMouseUp = (event) => {
        this.mouseDown = false;
        // Handle mouse up logic
        // ...
    };

    findClickedWall(mouseX, mouseY) {
        // Implement logic to find the wall that was clicked or touched
        // Return the index of the clicked wall or -1 if no wall was found
    }

    // Other methods and logic...

}

export default SegmentEditor;