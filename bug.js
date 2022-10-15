


class Bug extends WorldObject{

    static objects = [];
    static nextSpawnX = 0;
    static types = [
        {
            color: 'red',
            score: 30,
            speed: .7,
            height: 30,
            amplitude: 20
        },
        {
            color: 'purple',
            score: 20,
            speed: .5,
            height: 40,
            amplitude: 20
        },
        {
            color: 'blue',
            score: 10,
            speed: .2,
            height: 55,
            amplitude: 10
        },
    ];

    static states = {
        IDLE: 0,
        CAUGHT: 1,
        CONSUMING: 2,
        DEAD: 3
    }

    constructor(options = {}) {
        options.drawLayer = 1
        super(options)
        this.startPos = vec(this.pos);
        this.index = Bug.objects.length - 1;

        this.score = options.score || 10;

        this.state = Bug.states.IDLE;
        this.seed = options.seed || 0;
        this.speed = options.speed || this.seed * 1;
        this.color = options.color || 'blue';

        this.consumeStartPos = vec(0,0);

        this.consumeTimestamp = 0;
    }

    static reset() {
        Bug.objects = [];
        Bug.nextSpawnX = 100;
    }

    static spawnBug(){
        let seed = random(Math.floor(Bug.nextSpawnX));

        let prob = seed;
        let type;
        if (prob < .5) {
            type = Bug.types[2];
        } else if (prob < .8) {
            type = Bug.types[1];
        } else {
            type = Bug.types[0];
        }

        let bug = new Bug({
            color: type.color,
            score: type.score,
            speed: type.speed,
            pos: vec(
                Bug.nextSpawnX, 
                ceilingLevel + (waterLevel - ceilingLevel) * .5 + (seed * (waterLevel - ceilingLevel) - (waterLevel - ceilingLevel)) * .7),
            gravityScale: 0,
            seed
            // disableUpdating: true
        })
        Bug.objects.push(bug);

        Bug.nextSpawnX += random(Bug.nextSpawnX) * 100 + 10;

        return bug;
    }

    onCaught() {
        this.state = Bug.states.CAUGHT;
    }

    onConsume() {
        this.state = Bug.states.CONSUMING;
        this.consumeTimestamp = Date.now();
        this.consumeStartPos.set(this.pos);
    }

    update() {
        this.velocity.x = Math.sin((ticks + this.seed * 10) * .06 * this.seed);
        switch (this.state) {
            case Bug.states.IDLE:
                this.velocity.y = Math.sin((ticks + this.seed * 10) * .3 * this.seed);
                if (this.pos.y - ceilingLevel < 12) {
                    this.velocity.y += 2;
                }
                if (waterLevel - this.pos.y < 12) {
                    this.velocity.y -= 2;
                }
                break;
            case Bug.states.CAUGHT:
                if (this.velocity.y > -1) {
                    this.velocity.y -= .1;
                }
                break;
            case Bug.states.CONSUMING:
                let progress = (Date.now() - this.consumeTimestamp) / 200;
                if (progress > 1) {
                    progress = 1;
                    this.destroy();

                    // consumed
                    addScore(this.score, getCanvasPos(player.pos));
                    player.life = Math.min(player.life + this.score, 100);
                    play('coin');
                }
                let diff = vec(this.consumeStartPos).sub(player.pos);
                this.pos.set(vec(player.pos).add(diff.mul(1 - progress)));
                break;
            case Bug.states.DEAD:
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

    draw(canvasPos) {
        color(this.color);
        // wing flap
        let choose = (Math.round(ticks * .5)) % 2;
        let wing = (choose == 0 ? 'd' : 'e');
        char(wing, canvasPos.x + 3, canvasPos.y - 3);
        char(wing, canvasPos.x - 3, canvasPos.y - 3);
        // body
        char('c', canvasPos.x, canvasPos.y);
        color('black');
    }
    
}