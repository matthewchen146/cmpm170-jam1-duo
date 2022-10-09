
let isCutsceneFinished = true;

let timestamp = 0;

let cutsceneState = 'start'

function drawCutscene() {


    switch (cutsceneState) {
        case 'start':
            timestamp = ticks;
            cutsceneState = 'middle'
            break;
        case 'middle':
            text('this is a cut scene', 10,50);
            if (ticks - timestamp >= 120) {
                cutsceneState = 'end';
            }
            break;
        case 'end':

        default:
            break;
    }


}