import * as THREE from './three.module.js';
class Walls {
    constructor(walls) {
        this.wall = [];
        // Create the walls
        walls.forEach(wall => {
            let wallGeometry = new THREE.BoxGeometry(wall.size[0], wall.size[1], wall.size[2], wall.segments[0], wall.segments[1], wall.segments[2]);
            var wallMaterial;
            var plane;
            if (undefined !== wall.texture) {
                var material = new THREE.MeshBasicMaterial({ map: wall.texture });
                wall.texture.wrapS = THREE.RepeatWrapping;
                wall.texture.wrapT = THREE.RepeatWrapping;
                wall.texture.magFilter = THREE.NearestFilter;
                const timesToRepeatHorizontally = wall.wrapT;
                const timesToRepeatVertically = wall.wrapS;
                wall.texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically)
                // ambientLight.castShadow = true;
                plane = new THREE.Mesh(wallGeometry, material);
                plane.castShadow = true;
                plane.receiveShadow = true;
            }
            else if (undefined !== wall.color) {
                wallMaterial = new THREE.MeshBasicMaterial({ color: wall.color });
                plane = new THREE.Mesh(wallGeometry, wallMaterial);
            }
            else {
                console.log("wallMaterial is neither color nor texture");
                return 0;
            }

            if (wall.positions.length > 0 && wall.positions.length == 3)
                plane.position.set(wall.positions[0], wall.positions[1], wall.positions[2]);
            if (wall.yAxis !== undefined)
                plane.position.set(wall.positions[0], wall.yAxis, wall.positions[2]);
            this.wall.push(plane);
        });
        return this.wall;
    }

}

export default Walls;