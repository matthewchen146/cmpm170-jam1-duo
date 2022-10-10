
let isCutsceneFinished = false;

let cutsceneTimestamp = 0;

let cutsceneState = 'start'

function drawCutscene() {


    switch (cutsceneState) {
        case 'start':
            cutsceneTimestamp = ticks;
            cutsceneState = 'middle'
            break;
        case 'middle':
            text('This is Hungry', 15,30);
            text('Frog', 40,40);
            color("green");
            box(50,80,5,5);
            if (input.isJustPressed || ticks - cutsceneTimestamp >= 180) {
                cutsceneTimestamp = ticks;
                cutsceneState = 'middle2';
            }
            break;
        case 'middle2':
            if (ticks - cutsceneTimestamp == 5) {
                
                play('explosion');
            }
            
            color("green");
            box(50,80,5,5);
            text('This is bug', 10,30);
            color("red");
            box(65,40,3,3);
            if (input.isJustPressed || ticks - cutsceneTimestamp >= 180) {               
                cutsceneTimestamp = ticks;
                cutsceneState = 'middle3';
            }
            break;
        case 'middle3':
            if (ticks - cutsceneTimestamp == 5) {
                
                play('explosion');
            }
            
            color("green");
            box(50,80,5,5);
            
            color("red");
            box(65,40,3,3);

            text('Frog eats bug', 10,30);

            if (input.isJustPressed || ticks - cutsceneTimestamp >= 180) {
                cutsceneTimestamp = ticks;
                cutsceneState = 'middle4';
            }
            break;
        case 'middle4':
            if (ticks - cutsceneTimestamp == 5) {
                
                play('explosion');
            }
            
            color("green");
            box(50,80,5,5);
            
            color("red");
            box(65,40,3,3);

            text('Frog eats bug', 10,30);

            text('[Press & Hold]', 5, 70);

            

            if (input.isJustPressed || ticks - cutsceneTimestamp >= 120) {
                cutsceneTimestamp = ticks;
                cutsceneState = 'middle5';
            }
            break;
        case 'middle5':
                  
            color("red");
            box(65,40,3,3);

            text('Frog eats bug', 10,30);

            color('light_red');
            line(50,80,65,40,2);

            color("green");
            box(50,80,5,5);
            if (ticks - cutsceneTimestamp == 5) {
                
                play('coin');
            }

            

            if (input.isJustPressed || ticks - cutsceneTimestamp >= 120) {
                
                cutsceneTimestamp = ticks;
                cutsceneState = 'middle6';
            }
            break;
        case 'middle6':
            if (ticks - cutsceneTimestamp == 5) {
                
                play('explosion');
            }
        
            color("red");
            box(25,40,3,3);

            color("red");
            box(65,40,3,3);

            color("green")
            text('Frog must swing', 10,10);
            text('For more food!', 10,20);

            color('light_red');
            line(10,80,25,40,2);

            color("green");
            box(10,80,5,5);

            color('light_red');
            line(30,70,25,40,2);

            color("green");
            box(30,70,5,5);

            color("green");
            box(40,40,5,5);

            color('light_red');
            line(50,60,65,40,2);

            color("green");
            box(50,60,5,5);

            color('light_red');
            line(80,70,65,40,2);

            color("green");
            box(80,70,5,5);

            if (Math.floor(ticks * .2) % 2 == 0) {
                text('Press to Start', 10, canvasHeight - 10);
            }

            if (input.isJustPressed) {
                cutsceneTimestamp = ticks;
                isCutsceneFinished = true;
            }
            break;
        default:
            break;
    }

}