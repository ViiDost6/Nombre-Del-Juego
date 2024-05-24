let instructionsState = {
    preload: preloadInstructions,
    create: createInstructions,
    shutdown: shutdownInstructions
};

function preloadInstructions ()
{
    game.load.image( 'instruction1' , 'assets/imgs/instruction1.png' );
    game.load.image( 'instruction2' , 'assets/imgs/instruction2.png' );
    game.load.image( 'instruction3' , 'assets/imgs/instruction3.png' );
    game.load.image( 'nextButton' , 'assets/imgs/nextButton.png' );
    game.load.image( 'skipButton' , 'assets/imgs/skipButton.png' );
}

let instructionIndex = 0 , instructions = [ 'instruction1' , 'instruction2' , 'instruction3' ] , instructionSprite , nextButton , skipButton;

function createInstructions ()
{
    instructionSprite = game.add.sprite( 0 , 0 , instructions[ instructionIndex ] ); // DISPLAY FIRST INSTRUCTION

    nextButton = game.add.button( 550 , 525 , 'nextButton' , nextSound , this ); // DISPLAY NEXT BUTTON
    skipButton = game.add.button( 675 , 525 , 'skipButton' , skipSound2 , this ); // DISPLAY SKIP BUTTON

    game.time.events.loop( Phaser.Timer.SECOND * 10 , nextInstruction , this ); // AUTO-CHANGE INSTRUCTION EVERY 10 SECONDS
}

function nextInstruction() {
    instructionIndex++;

    if ( instructionIndex >= instructions.length ) {
        skipInstructions();
        instructionIndex = 0;
        return;
    }

    instructionSprite.loadTexture( instructions[ instructionIndex ] );
}

function skipInstructions() {
    game.state.start( 'init' );
}

function shutdownInstructions() {
    instructionSprite.destroy();
    nextButton.destroy();
    skipButton.destroy();
}

function nextSound()
{
    buttonsnd.play();
    nextInstruction();
}

function skipSound2()
{
    buttonsnd.play();
    skipInstructions();
}