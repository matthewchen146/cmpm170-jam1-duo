


class Ceiling extends WorldObject{

    static objects = [];
    static lastX = 0;
    static firstX = 0;

    constructor(options = {}){
        super(options)
        //width: 6 height: rnd
        this.index = 0;
        
        
    }

    static reset() {
        Ceiling.objects = [];
    }

    static spawnInitialCeiling() {
        for(let i = 0; i< Math.ceil(canvasWidth / 6) + 1; i++){

            Ceiling.spawnCeiling(i * 6 - canvasWidth * .5);

        }

    }

    static spawnCeiling() {
        // console.log('spawning ceilling at ',x)
        // // let x = Ceiling.objects.length > 0 ? Ceiling.objects[Ceiling.objects.length - 1].pos.x + 6 : -Math.round(canvasWidth / 12) * 6;
        // let randomOffsetY = random(x) * 4;

        let ceiling = new Ceiling({
            color: 'blue',
            // box: vec(6, canvasHeight + randomOffsetY),
            // pos: vec(x, -30 - canvasHeight * .5 + randomOffsetY * .5),
            box: vec(6,6),
            pos: vec(0,0),
            gravityScale: 0,
            disableDrawing: true,
            disableUpdating: true
        })

        ceiling.index = Ceiling.objects.length;
        Ceiling.objects.push(ceiling);
    }

    update() {
        let x = Math.round((player.pos.x + this.index * 6 - canvasWidth * .5) / 6) * 6;
        let randomOffsetY = random(x) * 4;
        this.pos.x = x;
        this.pos.y = -30 - canvasHeight * .5 + randomOffsetY * .5;
        this.box.y = canvasHeight + randomOffsetY;
    }

    
}