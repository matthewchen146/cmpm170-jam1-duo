title = "";

description = `
`;

characters = [];

options = {};

function update() {
    if (!ticks) {
  
        WorldObject.reset();
        cameraPos = vec(0,0);
        new WorldObject({box: vec(3,3)}).update = function() {
            this.pos.x = Math.sin(ticks * .1) * 20;
        };
    }
    
    Bug.spawnBug()

    WorldObject.update();



    WorldObject.draw();
}