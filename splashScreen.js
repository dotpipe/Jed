// SplashScreen class
class SplashScreen {
  constructor(failAttribute) {
    this.failAttribute = failAttribute;
  }

  displayGameOver() {
    const splashScreen = document.createElement('div');
    splashScreen.classList.add('splash-screen');
    splashScreen.innerText = 'Game Over';

    const failElement = document.querySelector(`[${this.failAttribute}]`);
    failElement.appendChild(splashScreen);
  }
}

export {
  SplashScreen
};
