import { Character } from "./character";

class Worker extends Character{
    constructor(name, position, health) {
        this.name = name;
        this.position = position;
        this.health = health;
    }

    // Methods specific to agents
    updateAgent() {
        // Implement agent-specific update logic here
    }

    // Methods specific to walls
    updateWall() {
        // Implement wall-specific update logic here
    }
}

export {
    Worker
  };