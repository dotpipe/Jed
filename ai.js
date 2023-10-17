// AI class
class AI {
  constructor(userView) {
    this.userView = userView;
    this.direction = 'forward';
    this.game = game;
    this.health = 100; // Initial health value
  }

  throwProtonic() {
    const newProtonic = new Protonic(/* pass any necessary parameters */);
    this.game.protonics.push(newProtonic);
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
    const map = new GameMap(this.mapData);
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
}

export {
  AI
};