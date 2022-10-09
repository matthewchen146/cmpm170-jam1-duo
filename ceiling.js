


class Ceiling extends WorldObject{

    constructor(options = {}){
        super(options)
        //width: 6 height: rnd
        this.newBox = 0
        
        
    }

    static spawnInitialCeiling() {
        // let newBox = 0;
        for(let i = 0; i< 18; i++){
            // color("blue");
            // box(this.newBox,0,6,rndi(3,10));
            // this.newBox += 6;


            let ceiling = new Ceiling({
                color: 'blue',
                box: vec(6, rndi(3,10)),
                pos: vec(i * 6, -20),
                gravityScale: 0
            })

            // newBox += 6
        }

    }

    update(){
        
    }

    
}