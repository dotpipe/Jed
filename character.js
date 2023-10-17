class Character {
    constructor(name, position, health, velocity) {
        this.name = name;
        this.position = position;
        this.health = health;
        this.velocity = velocity;
        this.rotation = 0;
        this.x = 0; // X position (perpendicular to the view)
        this.y = 0; // Y position
        this.z = 0; // Z position
        this.velocity = velocity; // Number of steps the agent takes in one move
    }

    throwProtonic() {
        const newProtonic = new Protonic(/* pass any necessary parameters */);
        this.game.protonics.push(newProtonic);
    }

    turnLeft() {
        // Update the rotation by a certain degree when a left turn is made
        const degree = 45; // Specify the degree of rotation for a left turn
        this.rotation = (this.rotation - degree) % 360; // Update the rotation and ensure it stays within the range of 0 to 359 degrees
    }

    turnRight() {
        // Update the rotation by a certain degree when a right turn is made
        const degree = 45; // Specify the degree of rotation for a right turn
        this.rotation = (this.rotation + degree) % 360; // Update the rotation and ensure it stays within the range of 0 to 359 degrees
    }

    checkCollision(walls) {
        for (const wall of walls) {
            if (
                this.x < wall.endPoint.x &&
                this.x + this.width > wall.startPoint.x &&
                this.y < wall.endPoint.y &&
                this.y + this.height > wall.startPoint.y &&
                this.z < wall.height
            ) {
                if (this.y + this.height <= wall.startPoint.y) {
                    this.isFalling = false;
                    this.y = wall.startPoint.y - this.height;
                } else {
                    this.isFalling = true;
                }
            }
        }
    }

    updateDirection(staticObjects, user) {
        const closestObj = this.findClosestObject(staticObjects);
        const distance = this.calculateDistance(closestObj);

        if (distance <= 5) {
            this.direction = 'towardsUser';
        } else {
            this.direction = 'forward';
        }

        // Check for walls and stairs
        const pathClear = this.checkPathClear(staticObjects);
        if (!pathClear) {
            this.direction = 'turnAround';
        }

        // Check line of sight to user view
        const map = new Map(this.mapData);
        const startX = Math.floor(this.userView.x);
        const startY = Math.floor(this.userView.y);
        const endX = Math.floor(user.x);
        const endY = Math.floor(user.y);
        const lineOfSightClear = map.isPathClear(startX, startY, endX, endY);

        if (lineOfSightClear) {
            this.direction = 'towardsUser';
        } else {
            this.direction = 'wander';
        }

        // Assess the direction the AI is facing
        const directionIndex = this.getDirectionIndex(this.direction);
        console.log('AI is facing direction:', directionIndex);

        // Get the sprite based on the character's facing direction
        const sprite = this.getSprite(this.direction);
        // Use the sprite for further processing or rendering
        console.log('Sprite:', sprite);
    }

    isFacingUser(user) {
        // Check if the AI is facing the user
        // Implement your logic here
        // Return true if the AI is facing the user, false otherwise
        return false;
    }

    getDirectionIndex(direction) {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions.indexOf(direction);
    }

    checkPathClear(staticObjects) {
        // Check if the path is clear from walls and stairs
        for (let i = 0; i < staticObjects.length; i++) {
            const obj = staticObjects[i];
            if (obj.type === 'wall' || obj.type === 'stairs') {
                return false;
            }
        }
        return true;
    }

    moveForward() {
        const nextPosition = { ...this.position };
        nextPosition.y += this.velocity; // Move the character forward based on velocity

        // Check if there are stairs within 2 yIndex in increase of the current yIndex
        if (nextPosition.y - this.position.y > 0) {
            const stairs = this.checkStairs(nextPosition.y, 2);
            if (stairs) {
                // Allow the character to continue further
                this.position = nextPosition;
                this.yIndex += 1; // Increase the yIndex by 1
                return;
            }
        }

        // Check if there are stairs within 2 yIndex in decrease of the current yIndex
        if (nextPosition.y - this.position.y < 0) {
            const stairs = this.checkStairs(nextPosition.y, -2);
            if (stairs) {
                // Allow the character to continue further
                this.position = nextPosition;
                this.yIndex -= 1; // Decrease the yIndex by 1
                return;
            }
        }

        // If there are no stairs or the character cannot continue further, update the position without changing the yIndex
        this.position = nextPosition;
    }

    checkStairs(yPosition, yIndexDifference) {
        // Assuming you have an array of stairs objects called 'stairs'
        const stairsInRange = stairs.filter(stair => Math.abs(stair.yIndex - yPosition) <= Math.abs(yIndexDifference));
        return stairsInRange.length > 0;
    }

    findPathToUserView() {
        // Find the path to the user view
        // Implement your logic here
        // Return true if a path is found, false otherwise
        return false;
    }

    getSprite(direction) {
        // Load the JSON file containing the sprites
        const spritesData = require('./sprites.json');
        // Get the array of sprites based on the character's facing direction
        const sprites = spritesData[direction];
        // Calculate the index of the sprite based on the array size
        const index = Math.round(sprites.length / 2);
        // Return the sprite at the calculated index
        return sprites[index];
    }

    findClosestObject(staticObjects) {
        let closestObj = null;
        let closestDistance = Infinity;

        for (let i = 0; i < staticObjects.length; i++) {
            const obj = staticObjects[i];
            const distance = this.calculateDistance(obj);

            if (distance < closestDistance) {
                closestObj = obj;
                closestDistance = distance;
            }
        }

        return closestObj;
    }

    calculateDistance(obj) {
        const dx = obj.x - this.userView.x;
        const dy = obj.y - this.userView.y;
        const dz = obj.z - this.userView.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    jump() {
        // Implement logic to make the character jump
    }
}

export {
    Character
  };