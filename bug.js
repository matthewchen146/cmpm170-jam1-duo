


class Bug extends WorldObject{

    static objects = [];
    static nextSpawnX = 0;

    static states = {
        IDLE: 0
    }

    constructor(options = {}){
        super(options)
        this.startPos = vec(this.pos);
        this.index = Bug.objects.length - 1;

        this.score = options.score || 10;

        this.state = Bug.states.IDLE;
        this.seed = options.seed || 0;
    }

    static reset() {
        Bug.objects = [];
        Bug.nextSpawnX = 100;
    }

    static spawnBug(){
        let seed = random(Math.floor(Bug.nextSpawnX)); 
        let bug = new Bug({
            color: 'red',
            box: vec(6,6),
            pos: vec(Bug.nextSpawnX, seed * 10),
            gravityScale: 0,
            score: 10,
            seed
            // disableUpdating: true
        })
        Bug.objects.push(bug);

        Bug.nextSpawnX += random(Bug.nextSpawnX) * 100 + 10;

        return bug;
    }

    update() {
        switch (this.state) {
            case Bug.states.IDLE:
                this.velocity.set(vec(Math.sin((ticks + this.seed * 10) * .06 * this.seed), Math.sin((ticks + this.seed * 10) * .3 * this.seed)).mul(1))
                break;
        
            default:
                break;
        }

        if (player.pos.x - this.pos.x > 200) {
            this.destroy();
        }
    }

    destroy() {
        Bug.objects.splice(this.index, 1);
        super.destroy();
    }

    
}