


class Bug extends WorldObject{

    constructor(options = {}){
        super(options)
        this.spawnlineY = 20;
        this.lastSpawn = -1;
    }

    static spawnBug(){
        let bugs = new Bug({
            color: 'red',
            box: vec(6,6),
            pos: vec(Math.random()*(canvasWidth-30)+player.pos.x,rnd(20,50)),
            gravityScale: 0

        })
    }

    update(){
        
    }

    
}