let btnEasy, btnMedium, btnHard, btnInstructions, btnA, btnB;

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
}

function createInit()
{
    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'initialBackground');
    let buttons = ['btnEasy', 'btnMedium', 'btnHard', 'btnInstructions', 'btnA', 'btnB'];
    let yPosition = 100;
    let xPositionA = game.world.width - 140; // Posición inicial para el botón A
    let xPositionB = game.world.width - 60; // Posición inicial para el botón B

    buttons.forEach((button, index) => {
        let xPosition = game.world.width - 100; // Posición inicial para los demás botones
        let btnYPosition = game.world.height + 100;

        if (button === 'btnA' || button === 'btnB')
        {
            xPosition = button === 'btnA' ? xPositionA : xPositionB;
        }

        let btn;

        if ( button === 'btnEasy' || button === 'btnMedium' || button === 'btnHard' || button === 'btnA')
        {
            btn = game.add.button(xPosition, btnYPosition, button, startPlay, this);
        }
        else if ( button === 'btnInstructions' )
        {
            btn = game.add.button(xPosition, btnYPosition, button, startInstructions, this);
        }

        btn.anchor.setTo(0.5);

        if (button === 'btnA' || button === 'btnB')
        {
            game.add.tween(btn).to({y: yPosition}, 1000, Phaser.Easing.Bounce.Out, true, index * 200);
        }
        else
        {
            game.add.tween(btn).to({y: yPosition}, 1000, Phaser.Easing.Bounce.Out, true, index * 200);
            yPosition += 100;
        }
    });
}

function startPlay()
{
    game.state.start('play');
}

function startInstructions()
{
    game.state.start('instructions');
}
