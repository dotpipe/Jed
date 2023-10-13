// Import necessary modules
const utils = require('./utils');
const collision = require('./collision');
const ai = require('./ai');
const map = require('./map');
const canvas = require('./canvas');
const splashScreen = require('./splashScreen');

// Define main function
function main() {
  // Load JSON data
  const jsonData = utils.loadJSONData();

  // Initialize game objects
  const objects = jsonData.objects;
  const movingObjects = objects.filter(obj => obj.type === 'moving');
  const staticObjects = objects.filter(obj => obj.type === 'static');

  // Initialize AI
  const aiPlayer = new ai.AI(jsonData.userView);

  // Initialize canvas
  const gameCanvas = new canvas.Canvas(jsonData.map);

  // Initialize splash screen
  const splash = new splashScreen.SplashScreen(gameCanvas.fail);

  // Game loop
  while (true) {
    // Update game state
    const collisionDetected = collision.checkCollision(movingObjects, staticObjects);
    if (collisionDetected) {
      movingObjects.forEach(obj => obj.speed = 0);
    }

    // Update AI direction
    aiPlayer.updateDirection(staticObjects);

    // Update JSON data
    utils.updateJSONData(jsonData);

    // Render game objects on canvas
    gameCanvas.render(objects);

    // Check for game over condition
    if (jsonData.lifeLeft <= 0) {
      break;
    }
  }

  // Display game over screen
  splash.displayGameOver();
}

// Call main function
main();
