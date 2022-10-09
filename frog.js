

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
    }

    update() {
        
        switch (this.state) {
            case Frog.states.FALLING:
                if (input.isPressed) {
                    this.state = Frog.states.FIRING;
                    this.isTongueTipVisible = true;
                    this.tongueTipPos.set(this.pos);
                }
                break;
            case Frog.states.FIRING:
                if (input.isPressed) {
                    this.tongueTipPos.add(vec(1,-1).normalize().mul(3));
                }
                break;
            case Frog.states.SWINGING:
            
                break;
            case Frog.states.RELOADING:
            
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