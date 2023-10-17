// Function to check for collision between moving objects and static objects
function checkCollision(movingObjects, staticObjects, gl) {
  let collisionDetected = false;

  for (let i = 0; i < movingObjects.length; i++) {
    const movingObj = movingObjects[i];

    for (let j = 0; j < staticObjects.length; j++) {
      const staticObj = staticObjects[j];

      // Perform collision detection logic using WebGL rendering context (gl)
      // You would typically use bounding volumes or other collision detection techniques specific to your WebGL scene

      // Example: Check if moving object collides with static object based on their positions
      if (movingObj.position.x === staticObj.position.x && movingObj.position.y === staticObj.position.y && movingObj.position.z === staticObj.position.z) {
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

export {
  checkCollision
};