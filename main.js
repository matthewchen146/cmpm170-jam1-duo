title = "";

description = `
`;

characters = [
// a - something
`
gggggg
gggggg
gggggg
gggggg
gggggg
gggggg
`,
// b - frog tongue
`
  RR  
 RRRR 
RRRRRR
RRRRRR
 RRRR 
  RR  
`,
// c - bug body
`
      
 bbbb 
bbbbbb
bbbbbb
 bbbb 
b    b
`,
// d - wing open
`
 bbbb 
b    b
b    b
b    b
b    b
 bbbb 
`,
// e - wing close
`
      
      
 bbbb 
b    b
 bbbb 
      
`,
// f - frog body middle
`
gp  pg
gggggg
gggggg
ggGGgg
gGGGGg
gGGGGg
`,
// g - frog body left
`
gp  gp
gggggg
gggggg
gggGGg
ggGGGg
ggGGGg
`,
// h - frog legs middle
`
gg  gg
gg  gg
gg  gg
 g  g 
 g  g 
      
`,
// i - frog legs left
`
 gg gg
 gg gg
 g  g  
g  g  
g  g  
      
`,
// j - frog legs very left
`
    gg
   gg 
ggg   
      
      
      
`
];

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

        // initialize bugs
        Bug.reset();

        // create player
        player = new Frog({
            pos: vec(0, -10),
            color: 'green', 
            gravityScale: 1, 
            disableUpdating: true
        });

        // set settings
        waterLevel = 70;
    }

    if (!isCutsceneFinished) {
        drawCutscene();
        return;
    }

    if (player.furthestX + canvasWidth > Bug.nextSpawnX) {
        Bug.spawnBug();
    }

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

    // draw water
    color('blue');
    let waterCanvasPos = getCanvasPos(vec(0,waterLevel));
    rect(0, waterCanvasPos.y, canvasWidth, canvasHeight);
    color('light_blue');
    // water streaks
    let streakCount = 6;
    for (let i = 0; i <= streakCount; i++) {
        let calc = i / streakCount;
        box(canvasWidth * .5, waterCanvasPos.y + (i) * 2 + 2, (1 - calc * calc) * 30, 1);
    }

    color('black');

    // update player
    player.physicsUpdate();
    player.update();

    WorldObject.draw();

    // drains
    waterLevel -= .02;
}