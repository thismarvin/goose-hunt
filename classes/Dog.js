const dogW = 80;
const dogH = 150;
const moveSpeed = 1;
class Dog extends Entity {
  constructor() {
    super(0, playfieldH, dogW, dogH);
    this.geeseToPickup = [];
    this.isPickingUpGoose = false;
    this.needsToMoveDown = false;
    this.isLaughing = false;
    this.grabSprite = new Sprite(0, 0, 45 * 2, 48 * 2, getLionGrabImage());
    this.deadGooseSprite = new Sprite(0, 0, 25 * 2, 63 * 2, getDeadGeeseImage());
    this.deadGooseIndex = 0;
    this.laughSprite = new Sprite(0, 0, 42 * 2, 51 * 2, getLionLaughImage(), 2);
  }

  update() {
    this.show();
    this.pickupNextGoose();
    this.doLaugh();
  }

  show() {
    //super.show();
    if (this.isPickingUpGoose) {
      this.grabSprite.setLocation(this.x, this.y);
      this.deadGooseSprite.setLocation(this.x + 32 * 2, this.y);
      this.grabSprite.show();
      this.deadGooseSprite.show();
    }
    if (this.isLaughing) {
      this.laughSprite.update();
      this.laughSprite.setLocation(this.x,this.y);
      this.laughSprite.show();
    }
  }

  queueGoose(goose) {
    this.geeseToPickup.push(goose);
    this.deadGooseIndex = goose.gooseIndex;
    this.deadGooseSprite.sourceX = 26 * 2 * this.deadGooseIndex;
  }

  pickupNextGoose() {
    if (this.geeseToPickup.length > 0 && !this.isPickingUpGoose) {
      this.moveToNextGoose();
      this.isPickingUpGoose = true;
    } else if (this.isPickingUpGoose) {
      if (!this.moveUpAndDown()) {
        this.setLocation(0, playfieldH); // reset position
        this.killCurrentGoose();
        this.isPickingUpGoose = false;
      }
    }
  }

  initLaugh() {
    this.isLaughing = true;
  }

  doLaugh() {
    if (this.isLaughing) {
      let mid = Math.floor(playfieldW / 2 - dogW / 2);
      this.setLocation(mid, this.y);
      if (!this.moveUpAndDown()) {
        this.setLocation(0, playfieldH); // reset position
        this.isLaughing = false;
      }
    }
  }

  // returns false if completed animation, true if animation is in progress.
  moveUpAndDown() {
    if (this.y + dogH > playfieldH && !this.needsToMoveDown) {
      this.move(0, -moveSpeed);
    } else if (!this.needsToMoveDown) {
      this.needsToMoveDown = true;
      this.setLocation(this.x, playfieldH - dogH);
    } else if (this.needsToMoveDown) {
      if (this.y < playfieldH) {
        this.move(0, moveSpeed * 2);
      } else {
        this.needsToMoveDown = false;
        return false;
      }
    }
    return true;
  }

  killCurrentGoose() {
    if (this.isPickingUpGoose)
      this.geeseToPickup.shift().dead = true;
  }

  moveToNextGoose() {
    let target = this.geeseToPickup[0];
    let xPos = target.x; //+ Math.floor(target.x / 2) - Math.floor(dogW / 2);
    this.setLocation(xPos, playfieldH - 30 * 2);
  }

}
