


class Bug extends WorldObject{

    static bugs = [];

    constructor(options = {}){
        super(options)
        this.spawnlineY = 20;
        this.lastSpawn = -1;
        this.bug = {
            x:Math.random()*(canvas.width-30)+15,
            y:this.spawnlineY
        }
    }

    static spawnBug(){
        this.bugs.push(this.bug);
    }

    update(){
        
    }

    
}