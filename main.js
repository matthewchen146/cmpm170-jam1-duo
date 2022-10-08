title = "";

description = `
`;

characters = [];

options = {};

function update() {
    if (!ticks) {
  
        WorldObject.reset();
        cameraPos = vec(0,0);
        new WorldObject({
            box: vec(3,3),
            color: 'red',
            gravityScale: .5
        }).update = function() {
            this.pos.x = Math.sin(ticks * .1) * 20;
        };
    }


    WorldObject.update();



    WorldObject.draw();
}