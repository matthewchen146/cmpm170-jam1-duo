
let canvasWidth = 100;
let canvasHeight = 100;
let cameraPos = vec(0,0);

function getCanvasPos(pos) {
    return vec(pos).sub(cameraPos.x - canvasWidth * .5, cameraPos.y - canvasHeight * .5);
}

function getWorldPos(pos) {
    return vec(pos).add(cameraPos.x - canvasWidth * .5, cameraPos.y - canvasHeight * .5);
}


class WorldObject {
    static objects = [];

    constructor(options = {}) {
        this.pos = options.pos || vec(0,0);
        this.char = options.char;
        this.charOptions = options.charOptions;
        this.box = options.box; // {w, h}
        this.isDestroyed = false;

        if (!options.addToWorld) {
            WorldObject.objects.push(this);
        }
    }

    static reset() {
        WorldObject.objects = [];
    }

    static update() {
        for (let i = 0; i < WorldObject.objects.length; i++) {
            let object = WorldObject.objects[i];
            if (object.isDestroyed) {
                WorldObject.objects.splice(i, 1);
                i -= 1;
            } else {
                object.update();
            }
        }
    }

    static draw() {
        for (let object of WorldObject.objects) {
            object.draw(getCanvasPos(object.pos));
        }
    }

    update() {

    }

    draw(canvasPos) {
        if (this.char) {
            char(this.char, canvasPos, this.charOptions);
        }
        if (this.box) {
            box(canvasPos, this.box);
        }
    }

    destroy() {
        this.isDestroyed = true;
    }
}