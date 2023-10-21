import * as THREE from './three.module.js';
import HumanInterfaceDevice from './humaninterfacedevice.js';
class collisionChecker {

    constructor(scene, camera, segments) {
        this.scene = scene;
        this.camera = camera;
        this.segments = segments;
        this.canvas = document.getElementById('canvas');
        this.hid = new HumanInterfaceDevice(this.camera, this.canvas);
        this.check(segments);
    }

    check(elem) {
        // const cameraPosition = this.camera.position;
        const distanceThreshold = 1;
        const moveSpeed = 0.5;
        // Iterate over all walls and find the closest one
        // for (const wall of this.segments) {
        // const wallPosition = wall.position;
        this.segments.forEach(elem => {
            const pointer = (this.camera.position);
            const dir = elem.position;
            if (pointer == dir || (Math.ceil(dir.x - distanceThreshold)) == Math.abs(Math.ceil(dir.x - distanceThreshold)) 
            || Math.ceil(pointer.z) == Math.abs(Math.ceil(dir.x - distanceThreshold)) || Math.ceil(pointer.x) == Math.abs(Math.ceil(dir.x - distanceThreshold))) {
                
                if (pointer.y != dir.y) {
                    console.log(Math.ceil(pointer.x) + "x" + dir.x + " " + dir.z);
                    console.log(Math.ceil(pointer.z) + "z" + dir.x + " " + dir.z);
                    if (this.hid.moveForward)
                        this.hid.controls.moveForward(-distanceThreshold);
                    else if (this.hid.moveBackward)
                        this.hid.controls.moveForward(distanceThreshold);
                    else if (this.hid.moveRight)
                        this.hid.controls.moveRight(-distanceThreshold);
                    else if (this.hid.moveLeft)
                        this.hid.controls.moveRight(distanceThreshold);
                }
            }
            // else {
            //     var moveArray = [this.hid.moveForward, this.hid.moveBackward, this.hid.moveRight, this.hid.moveLeft];
            //     var arrayPosition = [elem.position.x, elem.position.z];
            //     moveArray.forEach(move => {
            //         arrayPosition.forEach(pos => {
            //             if ((Math.ceil(this.camera.position.z) === pos) && move) {
            //                 this.hid.controls.moveForward(-distanceThreshold);
            //             }
            //             else if ((Math.ceil(this.camera.position.x) === pos) && move) {
            //                 this.hid.controls.moveRight(-distanceThreshold);
            //             }
            //         });
            //     });
            // }
        });

    }
}

export { collisionChecker };