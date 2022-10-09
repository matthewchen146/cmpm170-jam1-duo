


class Ceiling extends WorldObject{

    static objects = [];

    constructor(options = {}){
        super(options)
        //width: 6 height: rnd
        this.newBox = 0
        
        
    }

    static reset() {
        Ceiling.objects = [];
    }

    static spawnInitialCeiling() {
        for(let i = 0; i< 18; i++){

            Ceiling.spawnCeiling(i * 6, -20);

        }

    }

    static spawnCeiling(x, y) {

        let ceiling = new Ceiling({
            color: 'blue',
            box: vec(6, rndi(3,10)),
            pos: vec(x, y),
            gravityScale: 0,
            disableDrawing: true
        })

        Ceiling.objects.push(ceiling);
    }

    update() {
        if (player.pos.x - this.pos.x > canvasWidth) {
            this.destroy();
            
        }

        if (this.pos.x - player.pos.x < canvasWidth && Ceiling.objects[Ceiling.objects.length - 1] === this) {
            Ceiling.spawnCeiling(Ceiling.objects[Ceiling.objects.length - 1].pos.x + 6, -20);
        }
    }

    
}