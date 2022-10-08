
let canvasWidth = 100;
let canvasHeight = 100;
let cameraPos = vec(0,0);

function getCanvasPos(pos) {
    return vec(pos).sub(this.cameraPos.x - canvasWidth * .5, this.cameraPos.y - canvasHeight * .5);
}

function getWorldPos(pos) {
    return vec(pos).add(this.cameraPos.x - canvasWidth * .5, this.cameraPos.y - canvasHeight * .5);
}


class WorldObject {
    constructor(options = {}) {
        this.pos = options.pos || vec(0,0);
        this.char = options.char;
    }

    update() {

    }

    draw() {

    }
}