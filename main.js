title = "";

description = `
`;

characters = [];

options = {};

let player;

function update() {
    if (!ticks) {
  
        WorldObject.reset();
        cameraPos = vec(0,0);
        // new WorldObject({
        //     box: vec(3,3),
        //     color: 'red',
        //     gravityScale: .5
        // }).update = function() {
        //     // this.pos.x = Math.sin(ticks * .1) * 20;
        // };

        Ceiling.spawnInitialCeiling();

        player = new Frog({box: vec(6,6), color: 'green', gravityScale: .5});
    }

    // Bug.spawnBug()

    WorldObject.update();



    WorldObject.draw();
}