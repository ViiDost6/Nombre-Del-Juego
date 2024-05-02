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

    buttons.forEach((button, index) =>
    {
        let btn;

        // Define the final positions for the buttons
        let positions = {
            'btnEasy': {x: 50, y: 100},
            'btnMedium': {x: 300, y: 100},
            'btnHard': {x: 550, y: 100},
            'btnInstructions': {x: 100, y: 250},
            'btnA': {x: 200, y: 400},
            'btnB': {x: 450, y: 400}
        };

        // Create the button at the final x position and a negative y position
        if ( button === 'btnInstructions' )
        {
            btn = game.add.button(positions[button].x, -100, button, startInstructions, this);
        }
        else if ( button === 'btnB' )
        {
            btn = game.add.button(positions[button].x, -100, button, null , this);
        }
        else
        {
            btn = game.add.button(positions[button].x, -100, button, startPlay, this);
        }

        btn.anchor.setTo(0);

        // Create a tween to animate the button to the final y position
        game.add.tween(btn).to({y: positions[button].y}, 1000, Phaser.Easing.Bounce.Out, true, index * 200);
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
