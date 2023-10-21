import * as THREE from './three.module.js';
class Protonic {
    constructor(strands, radius, kerning, color, movementType, speed) {
        this.strands = strands;
        this.radius = radius;
        this.kerning = kerning;
        this.color = color;
        this.movementType = movementType;
        this.spinAxis;
        this.speed = speed;
        this.position = 0;
        this.transformedPosition = new THREE.Vector3(0, 0, 0);
    }

    setTransformedPosition(x, y, z) {
        this.transformedPosition = new THREE.Vector3(x, y, z);
    }

    getRandomSpinAxis() {
        const spinAxis = [];
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
                row.push(Math.random() * 2 - 1); // Generate a random value between -1 and 1
            }
            spinAxis.push(row);
        }
        return spinAxis;
    }

    draw(scene, camera, material) {
        const detachThreshold = 0.5;

        for (let i = 0; i < this.strands; i++) {
            let x = i * (this.radius * 2 + this.kerning);
            let y = 0;
            let z = 0.5 * (this.radius * 2 + this.kerning); // Update the z coordinate

            const shouldDetach = Math.random() < detachThreshold;

            if (shouldDetach) {
                continue;
            }

            this.spinAxis = this.getRandomSpinAxis();
            const rotationMatrix = new THREE.Matrix3();
            rotationMatrix.set(
                this.spinAxis[0][0], 0, this.spinAxis[0][2],
                this.spinAxis[1][0], 0, this.spinAxis[1][2],
                this.spinAxis[2][0], 0, this.spinAxis[2][2]
            );

            let translationOffset = new THREE.Vector3();
            if (this.movementType === 'coiling') {
                const coilOffset = Math.sin(this.position / 10) * 20;
                translationOffset.set(coilOffset, 0 -z);
            } else if (this.movementType === 'zigzagging') {
                const zigzagOffset = Math.sin(this.position / 10) * 10;
                translationOffset.set(zigzagOffset, 0, -z);
            }
            else if (this.movementType === 'bouncing') {
                const bounceOffset = Math.abs(Math.sin(this.position / 10)) * 10;
                translationOffset.set(bounceOffset, 0, -z);
            }

            
            this.transformedPosition.applyMatrix3(rotationMatrix);

            const geometry = new THREE.CylinderGeometry(this.radius, this.radius, 0.85, 32);
            const wire = new THREE.Mesh(geometry, material);
            const animate = () => {

                for (let i = 0; i < this.strands; i++) {
                    this.transformedPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
                    this.transformedPosition.applyMatrix3(rotationMatrix);
                    wire.position.set(this.transformedPosition.x, this.transformedPosition.y, -z);
                    wire.rotateX(x);
                    wire.rotateY(y);
                    wire.rotateZ(z);
                    // Add the wire to the scene
                    scene.add(wire);

                    // Animate the wire by gradually increasing the z coordinate
                    const animationSpeed = 1.354; // Adjust this value to control the animation speed
                    z = Math.ceil(this.position + animationSpeed);

                    // Remove the wire from the scene when it goes out of view
                    const maxZ = 1; // Adjust this value based on your scene's dimensions
                    if (z > maxZ) {
                        scene.remove(wire);
                    }
                }

                // Update the position for the next frame
                this.position -= this.speed;

                // Request the next animation frame
                requestAnimationFrame(animate);
            };

            // Start the animation loop
            animate();
        }

    }
}

export default Protonic;