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

        Bug.reset();

        // create player
        player = new Frog({box: vec(6,6), color: 'green', gravityScale: 1, disableUpdating: true});
    }

    if (!isCutsceneFinished) {
        drawCutscene();
        return;
    }

    // Bug.spawnBug()

    WorldObject.update();

    cameraPos.x = player.pos.x;
    cameraPos.y = player.pos.y * .5;

    // draw ceiling first
    for (let i = 0; i < Ceiling.objects.length; i++) {
        let ceiling = Ceiling.objects[i];
        if (ceiling.isDestroyed) {
            Ceiling.objects.splice(i, 1);
            i -= 1;
        } else {
            ceiling.update();
            ceiling.draw(getCanvasPos(ceiling.pos));
        }
    }

    // score = Ceiling.objects.length;

    // console.log(Ceiling.objects.length);

    // update player
    player.physicsUpdate();
    player.update();

    WorldObject.draw();
}