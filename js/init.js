let difficultyMultiplier = 0 , ft = false , ambient , buttonsnd;

let initState = {
    preload: preloadInit,
    create: createInit
};

function preloadInit()
{
    game.load.image('initialBackground', 'assets/imgs/initialBackground.png');
    game.load.image('btnEasy', 'assets/imgs/btnEasy.png');
    game.load.image('btnMedium', 'assets/imgs/btnMedium.png');
    game.load.image('btnHard', 'assets/imgs/btnHard.png');
    game.load.image('btnInstructions', 'assets/imgs/btnInstructions.png');
    game.load.image('btnA', 'assets/imgs/btnA.png');
    game.load.image('btnB', 'assets/imgs/btnB.png');

    game.load.audio('ambient', 'assets/snds/Ambiente.wav');
    game.load.audio('button', 'assets/snds/Button.wav');
}

function createInit()
{
    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'initialBackground');
    let btnEasy, btnMedium, btnHard, btnInstructions, btnA, btnB;

    btnEasy = game.add.button(50, -100, 'btnEasy', startPlayEasy, this, 'btnEasy');
    btnEasy.anchor.setTo(0);
    game.add.tween(btnEasy).to({y: 100}, 1000, Phaser.Easing.Bounce.Out, true);

    btnMedium = game.add.button(300, -100, 'btnMedium', startPlayMedium, this, 'btnMedium');
    btnMedium.anchor.setTo(0);
    game.add.tween(btnMedium).to({y: 100}, 1000, Phaser.Easing.Bounce.Out, true);

    btnHard = game.add.button(550, -100, 'btnHard', startPlayHard, this, 'btnHard');
    btnHard.anchor.setTo(0);
    game.add.tween(btnHard).to({y: 100}, 1000, Phaser.Easing.Bounce.Out, true);

    btnInstructions = game.add.button(100, -100, 'btnInstructions', startInstructions, this);
    btnInstructions.anchor.setTo(0);
    game.add.tween(btnInstructions).to({y: 250}, 1000, Phaser.Easing.Bounce.Out, true);

    btnA = game.add.button(200, -100, 'btnA', startPlayEasy, this, null);
    btnA.anchor.setTo(0);
    game.add.tween(btnA).to({y: 400}, 1000, Phaser.Easing.Bounce.Out, true);

    btnB = game.add.button(450, -100, 'btnB', startLoadScreen, this);
    btnB.anchor.setTo(0);
    game.add.tween(btnB).to({y: 400}, 1000, Phaser.Easing.Bounce.Out, true);

    
    if (ft == false)
    {
        ambient = game.add.audio('ambient');
        ambient.loop = true;
        ambient.volume = 0.05;
        ambient.play();
        ft = true;  
    }
    

    buttonsnd = game.add.audio('button');
}

function startLoadScreen()
{
    buttonsnd.play();
    game.state.start('loadscreen');
}

function startPlayEasy()
{
    buttonsnd.play();
    difficultyMultiplier = 1;
    game.state.start('play');
}

function startPlayMedium()
{
    buttonsnd.play();
    difficultyMultiplier = 2;
    game.state.start('play');
}

function startPlayHard()
{
    buttonsnd.play();
    difficultyMultiplier = 3;
    game.state.start('play');
}

function startInstructions()
{
    buttonsnd.play();
    game.state.start('instructions');
}
