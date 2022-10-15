

class Frog extends WorldObject {

    static states = {
        FALLING: 0,
        FIRING: 1,
        SWINGING: 2,
        RELOADING: 3,
        DYING: 4
    }

    constructor(options = {}) {
        options.drawLayer = 1;
        super(options);
        this.state = Frog.states.FALLING

        this.targetMargin = 15;
        this.targetSuction = 3;
        this.tongueSpeed = 5;
        this.tongueRetractSpeed = .1;

        this.tongueTipPos = vec(this.pos);
        this.isTongueTipVisible = false;

        this.hasSwung = false;
        this.relSwingPos = vec(0,0);
        this.swingAngle = 0;
        this.angularVelocity = 0;
        this.rotatedPos = vec(0,0);
        this.tongueLength = 0;
        this.furthestX = 0;

        this.charRotation = 0;

        this.caughtBug;

        this.life = 100;

        this.nextDistTarget = 200;
    }

    update() {
        

        // kill frog if too low
        if (this.pos.y > waterLevel) {
            play('explosion');
            end();
            return;
        }

        // create frog collider
        // kill frog if hit ceiling
        if (this.state !== Frog.states.DYING) {
            color('transparent');
            let bodyCollision = box(getCanvasPos(this.pos), vec(6,6));
            color('black');
            if (bodyCollision.isColliding.rect.blue || this.life <= 0 || this.pos.y < ceilingLevel) {
                play('explosion');
                if (this.pos.y < ceilingLevel) {
                    this.pos.y = ceilingLevel;
                    this.velocity.y = 0;
                }
                cameraShakeFactor = 5;
                this.state = Frog.states.DYING;
                this.isTongueTipVisible = false;
                return;
            }
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
                    let isCollidingBug = false;

                    // get closest bug to tongue tip
                    let closestBug;
                    let closestDistance = 0;
                    for (let bug of Bug.objects) {
                        // ignore non idle bugs
                        if (bug.state !== Bug.states.IDLE) {
                            continue;
                        }
                        let distance = bug.pos.distanceTo(this.tongueTipPos);
                        if (!closestBug || distance < closestDistance) {
                            closestBug = bug;
                            closestDistance = distance;
                        }
                    }

                    if (!this.caughtBug && closestBug) {
                        if (closestDistance < 6) {
                            isCollidingBug = true;
                            this.tongueTipPos.set(closestBug.pos);

                            // attached to bug
                            this.caughtBug = closestBug;
                            this.caughtBug.onCaught();

                        } else if (closestDistance < this.targetMargin) {

                            // if bug distance is close enough but not touching, move tip toward bug
                            let diff = vec(this.tongueTipPos).sub(closestBug.pos);
                            this.tongueTipPos.sub(diff.normalize().mul(this.targetSuction));
                        }
                    }                    

                    // check if tongue tip colliding ceiling or bug
                    if (collision.isColliding.rect.blue || isCollidingBug) {
                        this.state = Frog.states.SWINGING;

                        this.hasSwung = false;
                        this.relSwingPos.set(this.pos)
                        this.relSwingPos.sub(this.tongueTipPos);

                        let distDiff = this.relSwingPos.length - 6;
                        if (distDiff < 0) {
                            this.pos.add(vec(this.relSwingPos).normalize().mul(-distDiff))
                            this.relSwingPos.set(this.pos).sub(this.tongueTipPos);
                        }
                        
                        this.swingAngle = 0;

                        // calculate angular velocity = velocity / radius
                        let tangent = vec(this.relSwingPos.y, -this.relSwingPos.x).normalize();
                        tangent.mul(this.velocity.length);

                        this.tongueLength = this.relSwingPos.length; 
                        // if (isCollidingBug) console.log('tongueLEngth on latch bug', this.tongueLength);
                        this.angularVelocity = tangent.length / this.tongueLength;
                    }
                } else {
                    this.state = Frog.states.FALLING;
                    this.isTongueTipVisible = false;
                    this.tongueTipPos.set(this.pos);
                }
                break;
            case Frog.states.SWINGING:
                if (!this.hasSwung || input.isPressed) {
                    this.hasSwung = true;
                    if (this.caughtBug) {
                        this.tongueTipPos.set(this.caughtBug.pos);
                        this.pos.add(this.caughtBug.velocity);
                        this.relSwingPos = vec(this.pos).sub(this.tongueTipPos);
                    }

                    // calculate pendulum acceleration
                    let diff = vec(this.pos).sub(this.tongueTipPos);
                    this.tongueLength = diff.length;
                    let radius = Math.max(this.tongueLength, 6);
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
                    // keep tonguelength around 12
                    if (this.tongueLength > 12) {
                        tangent.sub(this.rotatedPos.normalize().mul(this.tongueRetractSpeed));
                    } else {
                        tangent.add(this.rotatedPos.normalize().mul(this.tongueRetractSpeed));
                    }
                    

                    // apply velocity
                    this.velocity.set(tangent);
                    
                } else {
                    play('click');
                    // same as above
                    let tangent = vec(this.rotatedPos.y, -this.rotatedPos.x).normalize();
                    let magnitude = this.angularVelocity * this.tongueLength;
                    tangent.mul(magnitude);
                    this.velocity.set(tangent);

                    // eat bug if bug. score is added in bug class
                    if (this.caughtBug) {
                        this.caughtBug.onConsume();
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
                    play('select');
                }
                break;
            case Frog.states.DYING:
                this.charRotation += .2;
                if (this.pos.y < ceilingLevel - 4) {
                    this.pos.y = ceilingLevel;
                    this.velocity.y = 0;
                }
                break;
            default:
                break;
        }

        // drains
        this.life -= .04 * difficulty;


        // set stats
        if (this.pos.x > this.furthestX) {
            this.furthestX = this.pos.x;
        }

        // add dist points
        if (this.pos.x > this.nextDistTarget) {
            this.nextDistTarget += 200;
            addScore(5, getCanvasPos(this.pos));
            play('synth', {freq: 400 + this.nextDistTarget / 20, volume: .4})
        }
    }

    draw(canvasPos) {
        let charOptions = {
            rotation: Math.floor(this.charRotation)
        }
        // draw frog
        if (Math.abs(this.velocity.x) < .5) {
            char('f', canvasPos, charOptions);
            char('h', canvasPos.x, canvasPos.y + 5, charOptions);
        } else if (this.velocity.x > 0) {
            char('g', canvasPos.x - 1, canvasPos.y, charOptions);
            if (this.velocity.x > 1.4) {
                char('j', canvasPos.x - 5, canvasPos.y + 5, charOptions);
                char('j', canvasPos.x - 1, canvasPos.y + 5, charOptions);
            } else {
                char('i', canvasPos.x - 2, canvasPos.y + 5, charOptions);
            }
            
        } else {
            charOptions.mirror = {x: -1, y: 1};
            char('g', canvasPos.x + 1, canvasPos.y, charOptions);
            if (this.velocity.x < -1.4) {
                char('j', canvasPos.x + 5, canvasPos.y + 5, charOptions);
                char('j', canvasPos.x + 1, canvasPos.y + 5, charOptions);
            } else {
                char('i', canvasPos.x + 2, canvasPos.y + 5, charOptions);
            }
        }
            


        // drog tongue
        if (this.isTongueTipVisible) {
            let tongueCanvasPos = getCanvasPos(this.tongueTipPos);
            color('light_red');
            line(canvasPos, tongueCanvasPos, 2);
            char('b', tongueCanvasPos);
            // box(tongueCanvasPos, vec(3,3));
            color('black');
        }

        // super.draw(canvasPos);
    }
}