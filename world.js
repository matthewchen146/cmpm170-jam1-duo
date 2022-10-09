
let canvasWidth = 100;
let canvasHeight = 100;
let cameraPos = vec(0,0);
let gravity = vec(0,.05);

function getCanvasPos(pos) {
    return vec(pos).sub(cameraPos.x - canvasWidth * .5, cameraPos.y - canvasHeight * .5);
}

function getWorldPos(pos) {
    return vec(pos).add(cameraPos.x - canvasWidth * .5, cameraPos.y - canvasHeight * .5);
}


class WorldObject {
    static objects = [];
    static drawLayers = [];

    constructor(options = {}) {
        this.pos = options.pos || vec(0,0);
        this.velocity = vec(0,0);
        this.color = options.color || 'black';
        this.char = options.char;
        this.charOptions = options.charOptions;
        this.box = options.box; // {w, h}
        this.isDestroyed = false;

        this.gravityScale = options.gravityScale !== undefined ? options.gravityScale : 1;

        if (options.drawLayer) {
            
        }

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

                object.velocity.add(vec(gravity).mul(object.gravityScale));
                object.pos.add(object.velocity);

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
        color(this.color);
        if (this.char) {
            char(this.char, canvasPos, this.charOptions);
        }
        if (this.box) {
            box(canvasPos, this.box);
        }
        color('black');
    }

    destroy() {
        this.isDestroyed = true;
    }
}