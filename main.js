title = "Grappling";

description = `Hungry Frog
`;

characters = [
// a - splash
`
   B  
   B  
  BB  
  BBB 
 BBBB 
 BBBBB
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
let splashTimestamp;
let cameraShakeFactor;

let bgm = new Howl({
    src: ['./song.wav'],
    loop: true,
    volume: .5
});

function update() {
    if (!ticks) {
  
        // initialize world
        WorldObject.reset();
        cameraPos = vec(0,0);
        cameraShakeFactor = 0;

        // initialize ceiling
        Ceiling.reset();
        Ceiling.spawnInitialCeiling();

        // initialize bugs
        Bug.reset();

        // create player
        player = new Frog({
            pos: vec(0, -5),
            color: 'green', 
            gravityScale: 1, 
            disableUpdating: true
        });
        player.velocity.set(vec(1,-1).normalize())

        splashTimestamp = 0;

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

    // set camera to frog pos
    cameraPos.x = player.pos.x + Math.sin(ticks * 1) * cameraShakeFactor;
    cameraPos.y = player.pos.y * .5 + Math.sin(ticks * 2) * cameraShakeFactor;
    if (cameraShakeFactor > 0) {
        cameraShakeFactor -= .1;
    } else {
        cameraShakeFactor = 0;
    }

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

    color('black');

    // update player
    player.physicsUpdate();
    player.update();

    WorldObject.draw();

    // draw water
    color('blue');
    let waterCanvasPos = getCanvasPos(vec(0,waterLevel));
    rect(0, waterCanvasPos.y, canvasWidth, canvasHeight);
    color('light_blue');
    // water streaks
    let streakCount = 6;
    for (let i = 0; i <= streakCount; i++) {
        let calc = i / streakCount;
        box(canvasWidth * .5, waterCanvasPos.y + (i) * 2 + 2, (1 - calc * calc) * 30 + random(Math.floor(ticks * .5)) * 5, 1);
    }
    color('black');

    // splash
    if (waterLevel - player.pos.y < 10 && Date.now() - splashTimestamp > 50) {
        let splash = new WorldObject({
            pos: vec(player.pos.x, waterLevel),
            gravityScale: 0
        })
        splash.scale = player.velocity.length;
        splash.update = function() {
            if (this.scale > 0) {
                this.scale -= .1;
            } else {
                this.destroy();
            }
        }
        splash.draw = function(canvasPos) {
            char('a', canvasPos.x, canvasPos.y - this.scale * 3 + 1, {scale: {x: this.scale, y: this.scale}});
        }
        splashTimestamp = Date.now();
    }

    // drains
    waterLevel -= .02;


    // stats

    color('yellow');
    rect(0, 0, canvasWidth, 7);
    text(`DST:${Math.round(player.pos.x)}`, 3, 10);
    

    text(`LIF`, 3, canvasHeight - 5);
    color('light_black');
    let barStart = 22;
    let barWidth = canvasWidth - barStart - 4;
    rect(barStart, canvasHeight - 6, barWidth, 3);
    if (player.life > 50) {
        color('green');
    } else if (player.life > 25) {
        color('yellow');
    } else {
        if (Math.floor(ticks * .2) % 2 === 0) {
            color('red');
        } else {    
            color('yellow');
        }   
    }
    rect(barStart, canvasHeight - 6, barWidth * (Math.max(player.life, 0) / 100), 3);

    color('black');
}