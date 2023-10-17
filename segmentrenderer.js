class SegmentRenderer {
    constructor() {
        // Initialize any necessary variables or settings for rendering
    }

    render(segment, scene) {
        // Create a group to hold all the walls
        const wallsGroup = new THREE.Group();

        // Draw the walls
        segment.walls.forEach(wall => {
            wallsGroup.add(wall.mesh);
        });

        // Draw the ceiling
        if (segment.ceiling) {
            wallsGroup.add(segment.ceiling.mesh);
        }

        // Draw the floor
        if (segment.floor) {
            wallsGroup.add(segment.floor.mesh);
        }

        // Add the walls group to the scene
        scene.add(wallsGroup);
    }
}