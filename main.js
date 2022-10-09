title = "";

description = `
`;

characters = [];

options = {};

let player;

function update() {
    if (!ticks) {
  
        // initialize world
        WorldObject.reset();
        cameraPos = vec(0,0);

        // initialize ceiling
        Ceiling.reset();
        Ceiling.spawnInitialCeiling();

        // create player
        player = new Frog({box: vec(6,6), color: 'green', gravityScale: 1, disableUpdating: true});
    }

    // Bug.spawnBug()

    WorldObject.update();


    cameraPos.x = player.pos.x;

    // draw ceiling first
    for (let ceiling of Ceiling.objects) {
        ceiling.draw(getCanvasPos(ceiling.pos));
    }

    // update player
    player.physicsUpdate();

    WorldObject.draw();
}