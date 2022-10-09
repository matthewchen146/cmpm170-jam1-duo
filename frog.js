

class Frog extends WorldObject {

    static states = {
        FALLING: 0,
        FIRING: 1,
        SWINGING: 2,
        RELOADING: 3,
        DYING: 4
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
        this.tongueLength = 0;
    }

    update() {
        
        if (this.pos.y > 50) {
            end();
            return;
        }

        // create frog collider
        color('transparent');
        let bodyCollision = box(getCanvasPos(this.pos), vec(6,6));
        color('black');
        if (bodyCollision.isColliding.rect.blue) {
            play('explosion');
            end();
            return;
        }


        switch (this.state) {
            case Frog.states.FIRING:
                if (input.isPressed) {

                    // set tongue tip position
                    this.tongueTipPos.add(vec(1,-1).normalize().mul(5));

                    // create tongue tip collider
                    color('transparent');
                    let collision = box(getCanvasPos(this.tongueTipPos), vec(3,3));
                    color('black');

                    // check if tongue tip colliding ceiling
                    if (collision.isColliding.rect.blue) {
                        this.state = Frog.states.SWINGING;

                        this.relSwingPos = vec(this.pos).sub(this.tongueTipPos);
                        this.swingAngle = 0;
                        // calculate angular velocity = velocity / radius
                        let tangent = vec(this.relSwingPos.y, -this.relSwingPos.x).normalize();
                        // let diff = vec(this.velocity).normalize().sub(tangent);
                        // tangent.x *= 1 - diff.x;
                        // tangent.y *= 1 - diff.y;
                        tangent.mul(this.velocity.length);

                        this.tongueLength = vec(this.tongueTipPos).sub(this.pos).length; 
                        this.angularVelocity = tangent.length / this.tongueLength;
                    }
                } else {
                    this.tongueTipPos.set(this.pos);
                    // this.tongueTipPos.sub(vec(this.tongueTipPos).sub(this.pos).normalize().mul(5));
                    if (this.tongueTipPos.distanceTo(this.pos) < 5) {
                        this.state = Frog.states.FALLING;
                        this.isTongueTipVisible = false;
                    }
                }
                break;
            case Frog.states.SWINGING:
                if (input.isPressed) {

                    let radius = this.tongueLength;

                    // calculate pendulum acceleration
                    let diff = vec(this.pos).sub(this.tongueTipPos);
                    let pendulumAngle = Math.atan(diff.x / diff.y);
                    let angularForce = -gravity.y * (Math.sin(pendulumAngle) / radius) * this.gravityScale;
                    this.angularVelocity += angularForce;

                    // change swing angle
                    this.swingAngle -= this.angularVelocity;

                    // calculate rotated position
                    this.rotatedPos.set(vec(
                        this.relSwingPos.x * Math.cos(this.swingAngle) - this.relSwingPos.y * Math.sin(this.swingAngle),
                        this.relSwingPos.y * Math.cos(this.swingAngle) + this.relSwingPos.x * Math.sin(this.swingAngle)
                    ));


                    // calculate tangent for velocity
                    let tangent = vec(this.rotatedPos.y, -this.rotatedPos.x).normalize();
                    let magnitude = this.angularVelocity * this.tongueLength;
                    tangent.mul(magnitude);

                    // apply velocity
                    this.velocity.set(tangent);
                    
                } else {
                    // same as above
                    let tangent = vec(this.rotatedPos.y, -this.rotatedPos.x).normalize();
                    let magnitude = this.angularVelocity * this.tongueLength;
                    tangent.mul(magnitude);
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