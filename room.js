class Room {
    constructor() {
        this.segments = [];
        this.segmentRenderer = new SegmentRenderer();
    }

    addSegment(segment) {
        this.segments.push(segment);
    }

    draw(scene) {
        this.segments.forEach(segment => {
            segment.draw(scene);
        });
    }

    createRoomGeometry() {
        const roomGeometry = new THREE.Group();

        // Create the walls
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const wallGeometry = new THREE.BoxGeometry(10, 5, 0.1);
        const walls = new THREE.Mesh(wallGeometry, wallMaterial);
        roomGeometry.add(walls);

        // Create the ceiling
        const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const ceilingGeometry = new THREE.BoxGeometry(10, 0.1, 10);
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.position.y = 5;
        roomGeometry.add(ceiling);

        // Create the floor
        const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const floorGeometry = new THREE.BoxGeometry(10, 0.1, 10);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -5;
        roomGeometry.add(floor);

        // Set up lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(0, 3, 0);
        scene.add(pointLight);

        return roomGeometry;
    }

    setupCameraControls(camera, renderer) {
        this.controls = new THREE.OrbitControls(camera, renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 10;

        // Add event listener for keyboard input
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    createRoomGeometry() {
        const roomGeometry = new THREE.Group();

        // Create walls
        const wallGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const walls = new THREE.Mesh(wallGeometry, wallMaterial);
        roomGeometry.add(walls);

        // Create floor
        const floorGeometry = new THREE.BoxGeometry(this.width, 0.1, this.depth);
        const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -this.height / 2;
        roomGeometry.add(floor);

        // Create ceiling
        const ceilingGeometry = new THREE.BoxGeometry(this.width, 0.1, this.depth);
        const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.position.y = this.height / 2;
        roomGeometry.add(ceiling);

        return roomGeometry;
    }

    createScene() {
        this.scene = new THREE.Scene();

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        this.scene.add(directionalLight);

        // Add point light
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);
    }

    updateCameraControls() {
        if (this.controls) {
            this.controls.update();
        }
    }

    handleKeyDown(event) {
        const moveDistance = 0.1; // Adjust as needed

        switch (event.code) {
            case 'KeyW':
                this.controls.pan(0, 0, -moveDistance);
                break;
            case 'KeyS':
                this.controls.pan(0, 0, moveDistance);
                break;
            case 'KeyA':
                this.controls.pan(-moveDistance, 0, 0);
                break;
            case 'KeyD':
                this.controls.pan(moveDistance, 0, 0);
                break;
            // Add more cases for other movement keys if needed
        }
    }
    setupCameraControls(camera, renderer) {
        this.controls = new THREE.OrbitControls(camera, renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 10;

        // Add event listener for keyboard input
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update camera controls
        this.updateCameraControls();

        // Render the scene
        renderer.render(scene, camera);
    }
}