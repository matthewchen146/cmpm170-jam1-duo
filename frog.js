

class Frog extends WorldObject {

    static states = {
        FALLING: 0,
        FIRING: 1,
        SWINGING: 2,
        RELOADING: 3,
    }

    constructor(options = {}) {
        super(options);
        this.state = Frog.states.FALLING

        this.tongueTipPos = vec(this.pos);
        this.isTongueTipVisible = false;

        this.reloadTimestamp = 0;
        this.reloadDuration = 100;
        this.reloadTongueTipPos = vec(0,0);
        this.relSwingPos = vec(0,0);
        this.swingAngle = 0;
        this.angularVelocity = 0;
        this.rotatedPos = vec(0,0);
    }

    update() {
        // console.log(box(input.pos, 3,3).isColliding.rect);
        switch (this.state) {
            case Frog.states.FIRING:
                if (input.isPressed) {
                    this.tongueTipPos.add(vec(1,-1).normalize().mul(5));
                    color('transparent');
                    let collision = box(getCanvasPos(this.tongueTipPos), vec(3,3));
                    color('black');
                    // check if colliding ceiling
                    if (collision.isColliding.rect.blue) {
                        this.state = Frog.states.SWINGING;

                        this.relSwingPos = vec(this.pos).sub(this.tongueTipPos);
                        this.swingAngle = 0;
                        // velocity / radius
                        this.angularVelocity = this.velocity.length / vec(this.tongueTipPos).sub(this.pos).length;
                        console.log('catught')
                    }
                } else {
                    this.tongueTipPos.sub(vec(this.tongueTipPos).sub(this.pos).normalize().mul(5));
                    if (this.tongueTipPos.distanceTo(this.pos) < 5) {
                        this.state = Frog.states.FALLING;
                        this.isTongueTipVisible = false;
                    }

                    // this.state = Frog.states.RELOADING;
                    // this.reloadTimestamp = Date.now();
                    // this.reloadTongueTipPos.set(this.tongueTipPos.sub(this.pos));
                }
                break;
            case Frog.states.SWINGING:
                if (input.isPressed) {
                    this.rotatedPos.set(vec(
                        this.relSwingPos.x * Math.cos(this.swingAngle) - this.relSwingPos.y * Math.sin(this.swingAngle),
                        this.relSwingPos.y * Math.cos(this.swingAngle) + this.relSwingPos.x * Math.sin(this.swingAngle)
                    ));

                    this.swingAngle -= this.angularVelocity;
                    // console.log(rotatedPos.angle * 180 / Math.PI);
                    let swingPos = vec(this.rotatedPos).add(this.tongueTipPos);
                    this.pos.set(swingPos);
                } else {
                    let tangent = vec(this.rotatedPos.y, -this.rotatedPos.x);
                    // console.log(tangent);
                    let magnitude = this.angularVelocity * vec(this.tongueTipPos).sub(this.pos).length;
                    tangent.normalize().mul(magnitude);
                    this.velocity.set(tangent);
                    this.state = Frog.states.FIRING;

                }
                break;
            case Frog.states.RELOADING:
                this.reloadProgress = (Date.now() - this.reloadTimestamp) / this.reloadDuration;
                if (this.reloadProgress > 1) {
                    this.reloadProgress = 1;
                    this.state = Frog.states.FALLING;

                    this.isTongueTipVisible = false;
                    // register bug if bug
                }
                this.tongueTipPos.set(vec(this.pos).add(vec(this.reloadTongueTipPos).mul(1 - this.reloadProgress)));
                
                break;
            case Frog.states.FALLING:
                if (input.isPressed) {
                    this.state = Frog.states.FIRING;
                    this.isTongueTipVisible = true;
                    this.tongueTipPos.set(this.pos);
                }
                break;
            default:
                break;
        }


    }

    draw(canvasPos) {

        if (this.isTongueTipVisible) {
            let tongueCanvasPos = getCanvasPos(this.tongueTipPos);
            color('light_red');
            box(tongueCanvasPos, vec(3,3));
            line(canvasPos, tongueCanvasPos, 2);
            color('black');
        }

        super.draw(canvasPos);
    }
}