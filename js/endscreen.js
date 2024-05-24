let gameOverState = {
    preload: preloadEndScreen ,
    create: createEndScreen
};

function preloadEndScreen()
{
    game.load.image('endBackground', 'assets/imgs/Dead.png');
    game.load.image('btnHome', 'assets/imgs/skipButton.png');
}

function createEndScreen()
{
    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'endBackground');

    let btnHome = game.add.button(GAME_STAGE_WIDTH / 2, 500, 'btnHome', startInit, this);
    btnHome.anchor.setTo(0.5, 0.5);
}

function startInit()
{
    buttonsnd.play();
    game.state.start('init');
}
