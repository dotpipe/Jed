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

    draw(scene, material) {
        const detachThreshold = 0.5;

        for (let i = 0; i < this.strands; i++) {
            let x = i * (this.radius * 2 + this.kerning);
            let y = 0;
            let z = -i * (this.radius * 2 + this.kerning); // Update the z coordinate

            const shouldDetach = Math.random() < detachThreshold;

            if (shouldDetach) {
                continue;
            }

            this.spinAxis = this.getRandomSpinAxis();
            const rotationMatrix = new THREE.Matrix3();
            rotationMatrix.set(
                this.spinAxis[0][0], this.spinAxis[0][1], this.spinAxis[0][2],
                this.spinAxis[1][0], this.spinAxis[1][1], this.spinAxis[1][2],
                this.spinAxis[2][0], this.spinAxis[2][1], this.spinAxis[2][2]
            );

            let translationOffset = new THREE.Vector2();
            if (this.movementType === 'coiling') {
                const coilOffset = Math.sin(this.position / 10) * 20;
                translationOffset.set(0, coilOffset);
            } else if (this.movementType === 'zigzagging') {
                const zigzagOffset = Math.sin(this.position / 10) * 10;
                translationOffset.set(0, zigzagOffset);
            }
            else if (this.movementType === 'bouncing') {
                const bounceOffset = Math.abs(Math.sin(this.position / 10)) * 10;
                translationOffset.set(0, bounceOffset);
            }

            const transformedPosition = new THREE.Vector2(x, y);
            transformedPosition.applyMatrix3(rotationMatrix);

            const geometry = new THREE.CylinderGeometry(this.radius, this.radius, translationOffset.length(), 32);
            const wire = new THREE.Mesh(geometry, material);
            const animate = () => {
                // Clear the scene
                // scene.clear();

                for (let i = 0; i < this.strands; i++) {
                    // ...

                    // let z = -i * (this.radius * 2 + this.kerning); // Update the z coordinate

                    // ...

                    wire.position.set(transformedPosition.x, transformedPosition.y, z);

                    // Add the wire to the scene
                    scene.add(wire);

                    // Animate the wire by gradually increasing the z coordinate
                    const animationSpeed = 0.1; // Adjust this value to control the animation speed
                    z -= this.position * animationSpeed;

                    // Remove the wire from the scene when it goes out of view
                    const maxZ = 1000; // Adjust this value based on your scene's dimensions
                    if (z < -maxZ) {
                        scene.remove(wire);
                    }
                }

                // Update the position for the next frame
                this.position += this.speed;


                // Request the next animation frame
                requestAnimationFrame(animate);
            };

            // Start the animation loop
            animate();
        }

        // Update the position for the next frame
        this.position += this.speed;
    }
}

export default Protonic;