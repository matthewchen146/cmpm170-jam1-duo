

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
                }
                break;
            case Frog.states.FIRING:
                this.isTongueTipVisible = true;
                if (input.isPressed) {

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
            box(getCanvasPos(this.tongueTipPos), vec(3,3));
        }

        super.draw(canvasPos);
    }
}