
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
    static drawLayers = [[],[],[],[]];

    constructor(options = {}) {
        this.pos = options.pos || vec(0,0);
        this.velocity = vec(0,0);
        this.color = options.color || 'black';
        this.char = options.char;
        this.charOptions = options.charOptions;
        this.box = options.box; // {w, h}
        this.isDestroyed = false;

        this.gravityScale = options.gravityScale !== undefined ? options.gravityScale : 1;

        if (!options.disableDrawing) {
            this.drawLayer = options.drawLayer !== undefined && options.drawLayer < 4 ? options.drawLayer : 0;
            WorldObject.drawLayers[this.drawLayer].push(this);
        }

        if (!options.disableUpdating) {
            WorldObject.objects.push(this);
        }
    }

    static reset() {
        WorldObject.objects = [];
        for (let i = 0; i < WorldObject.drawLayers.length; i++) {
            WorldObject.drawLayers[i] = [];
        }
    }

    static update() {
        for (let i = 0; i < WorldObject.objects.length; i++) {
            let object = WorldObject.objects[i];
            if (object.isDestroyed) {
                WorldObject.objects.splice(i, 1);
                i -= 1;
            } else {

                object.physicsUpdate();
                object.update();

                
            }
        }
    }

    static draw() {
        for (let layer of WorldObject.drawLayers) {
            for (let i = 0; i < layer.length; i++) {
                let object = layer[i];
                if (object.isDestroyed) {
                    layer.splice(i, 1);
                    i -= 1;
                } else {
                    object.draw(getCanvasPos(object.pos));
                }
            }
        }
    }

    physicsUpdate() {
        this.velocity.add(vec(gravity).mul(this.gravityScale));
        this.pos.add(this.velocity);
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