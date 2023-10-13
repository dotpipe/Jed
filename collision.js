// Function to check for collision between moving objects and static objects
function checkCollision(movingObjects, staticObjects) {
  let collisionDetected = false;

  for (let i = 0; i < movingObjects.length; i++) {
    const movingObj = movingObjects[i];

    for (let j = 0; j < staticObjects.length; j++) {
      const staticObj = staticObjects[j];

      // Check if moving object collides with static object
      if (movingObj.x === staticObj.x && movingObj.y === staticObj.y && movingObj.z === staticObj.z) {
        collisionDetected = true;
        break;
      }
    }

    if (collisionDetected) {
      break;
    }
  }

  return collisionDetected;
}

module.exports = {
  checkCollision
};

