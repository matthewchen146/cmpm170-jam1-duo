


class Bug extends WorldObject{

    constructor(options = {}){
        super(options)
        this.spawnlineY = 20;
        this.lastSpawn = -1;
        this.bugs = [];
        this.bug = {
            x:Math.random()*(canvas.width-30)+15,
            y:this.spawnlineY
        }
    }

    spawnBug(){
        this.bugs.push(this.bug);
    }

    update(){
        
    }

    
}