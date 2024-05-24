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

    let blue_tint_dead = game.add.text(250, 535, totalBlueTint, { font: "25px Kalam", fill: "#0000ff" });
    blue_tint_dead.anchor.setTo(0.5, 0.5);

    let red_tint_dead = game.add.text(595, 535, totalRedTint, { font: "25px Kalam", fill: "#FF0000" });
    red_tint_dead.anchor.setTo(0.5, 0.5);

    let total_score_dead = game.add.text(650, 150, globalScore, {font: "25px Kalam", fill: "#000000" });
    total_score_dead.anchor.setTo(0.5, 0.5);
}

function startInit()
{
    buttonsnd.play();
    game.state.start('init');
}
