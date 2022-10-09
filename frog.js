

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

        this.targetMargin = 10;
        this.targetSuction = 3;
        this.tongueSpeed = 5;
        this.tongueRetractSpeed = .1;

        this.tongueTipPos = vec(this.pos);
        this.isTongueTipVisible = false;

        // this.reloadTimestamp = 0;
        // this.reloadDuration = 100;
        // this.reloadTongueTipPos = vec(0,0);
        this.relSwingPos = vec(0,0);
        this.swingAngle = 0;
        this.angularVelocity = 0;
        this.rotatedPos = vec(0,0);
        this.tongueLength = 0;
        this.furthestX = 0;

        this.caughtBug;
    }

    update() {
        
        // kill frog if too low
        if (this.pos.y > 50) {
            end();
            return;
        }

        // create frog collider
        // kill frog if hit ceiling
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
                    this.tongueTipPos.add(vec(1,-1).normalize().mul(this.tongueSpeed));

                    // create tongue tip collider
                    color('transparent');
                    let collision = box(getCanvasPos(this.tongueTipPos), vec(3,3));
                    color('black');

                    // check for bugs too
                    let closestBug;
                    let closestDistance = 0;
                    for (let bug of Bug.objects) {
                        let distance = bug.pos.distanceTo(this.tongueTipPos);
                        if (!closestBug || distance < closestDistance) {
                            closestBug = bug;
                            closestDistance = distance;
                        }
                    }
                    let isCollidingBug = false;
                    if (closestBug && !closestBug.isDestroyed && closestDistance < this.targetMargin) {
                        let diff = vec(this.tongueTipPos).sub(closestBug.pos);
                        this.tongueTipPos.sub(diff.normalize().mul(this.targetSuction));
                        
                        if (closestBug.pos.distanceTo(this.tongueTipPos) < 6) {
                            isCollidingBug = true;
                            this.tongueTipPos.set(closestBug.pos);

                            // attached to bug
                            this.caughtBug = closestBug;

                            // console.log(this.caughtBug.isDestroyed)
                            // addScore(10, getCanvasPos(closestBug.pos));
                        }
                    }
                    

                    // check if tongue tip colliding ceiling
                    if (collision.isColliding.rect.blue || isCollidingBug) {
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

                    // if (this.caughtBug) {
                    //     this.tongueTipPos.sub(vec(this.pos).sub(this.caughtBug.pos).normalize());
                    //     this.relSwingPos = vec(this.pos).sub(this.tongueTipPos);
                    // }

                    // calculate pendulum acceleration
                    let diff = vec(this.pos).sub(this.tongueTipPos);
                    this.tongueLength = diff.length;
                    let radius = this.tongueLength;
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
                    tangent.sub(this.rotatedPos.normalize().mul(this.tongueRetractSpeed));
                    

                    // apply velocity
                    this.velocity.set(tangent);
                    
                } else {
                    // same as above
                    let tangent = vec(this.rotatedPos.y, -this.rotatedPos.x).normalize();
                    let magnitude = this.angularVelocity * this.tongueLength;
                    tangent.mul(magnitude);
                    this.velocity.set(tangent);

                    // eat bug if bug
                    if (this.caughtBug) {
                        addScore(this.caughtBug.score, getCanvasPos(this.pos));
                        this.caughtBug.destroy();
                        this.caughtBug = undefined;
                    }
                    
                    this.state = Frog.states.FIRING;

                }
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


        // set stats
        if (this.pos.x > this.furthestX) {
            this.furthestX = this.pos.x;
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