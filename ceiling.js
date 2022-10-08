


class Ceiling extends WorldObject{

    constructor(options = {}){
        super(options)
        //width: 6 height: rnd
        this.newBox = 0
        
        
    }

    spawnCeiling(){
        for( i = 0; i< 18; i++){
            color("blue");
            box(this.newBox,0,6,rndi(3,10));
            this.newBox += 6;
        }

    }

    update(){
        
    }

    
}