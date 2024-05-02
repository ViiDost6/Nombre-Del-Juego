let instructionsState = {
    preload: preloadInstructions,
    create: createInstructions
};

function preloadInstructions()
{
    game.load.image('instruction1', 'assets/imgs/instruction1.png');
    game.load.image('instruction2', 'assets/imgs/instruction2.png');
    game.load.image('instruction3', 'assets/imgs/instruction3.png');
    game.load.image('nextButton', 'assets/imgs/nextButton.png');
    game.load.image('skipButton', 'assets/imgs/skipButton.png');
}

let instructionIndex = 0;
let instructions = ['instruction1', 'instruction2', 'instruction3'];
let instructionSprite;
let nextButton;
let skipButton;

function createInstructions() {
    instructionSprite = game.add.sprite(0, 0, instructions[instructionIndex]);

    nextButton = game.add.button(game.world.width - 200, game.world.height - 80, 'nextButton', nextInstruction, this);
    skipButton = game.add.button(game.world.width - 100, game.world.height - 80, 'skipButton', skipInstructions, this);

    game.time.events.loop(Phaser.Timer.SECOND * 5, nextInstruction, this);
}

function nextInstruction() {
    instructionIndex++;

    if (instructionIndex >= instructions.length) {
        skipInstructions();
        return;
    }

    instructionSprite.loadTexture(instructions[instructionIndex]);
}

function skipInstructions() {
    game.state.start('init');
}