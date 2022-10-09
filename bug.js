


class Bug extends WorldObject{

    static objects = [];
    static nextSpawnX = 0;

    constructor(options = {}){
        super(options)
        this.startPos = vec(this.pos);
        this.index = Bug.objects.length - 1;

        this.score = options.score || 10;
    }

    static reset() {
        Bug.objects = [];
        Bug.nextSpawnX = 100;
    }

    static spawnBug(){
        let bug = new Bug({
            color: 'red',
            box: vec(6,6),
            pos: vec(Bug.nextSpawnX, random(Math.floor(Bug.nextSpawnX))),
            gravityScale: 0,
            score: 10,
            // disableUpdating: true
        })
        Bug.objects.push(bug);

        Bug.nextSpawnX += random(Bug.nextSpawnX) * 100 + 10;

        return bug;
    }

    update() {
        if (player.pos.x - this.pos.x > 200) {
            this.destroy();
        }
    }

    destroy() {
        Bug.objects.splice(this.index, 1);
        super.destroy();
    }

    
}