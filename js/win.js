let winState = {
    preload: preloadWin ,
    create: createWin
};

function preloadWin()
{
    game.load.image( 'background' , 'assets/imgs/Win.png' );
    game.load.image('btnHome', 'assets/imgs/skipButton.png');
}

function createWin()
{
    game.add.sprite( 0 , 0 , 'background' );

    let btnHome = game.add.button(GAME_STAGE_WIDTH / 2, 500, 'btnHome', startInit, this);
    btnHome.anchor.setTo(0.5, 0.5);

    let blue_tint_win = game.add.text(575, 332, totalBlueTint, { font: "25px Kalam", fill: "#000000" });
    blue_tint_win.anchor.setTo(0.5, 0.5);

    let red_tint_win = game.add.text(575, 270, totalRedTint, { font: "25px Kalam", fill: "#000000" });
    red_tint_win.anchor.setTo(0.5, 0.5);

    let total_life_remaining = game.add.text(575, 395, character_health, { font: "25px Kalam", fill: "#000000" });
    total_life_remaining.anchor.setTo(0.5, 0.5);

    let total_score = game.add.text(575, 440, globalScore, { font: "25px Kalam", fill: "#000000" });
    total_score.anchor.setTo(0.5, 0.5);
}

function startInit()
{
    game.state.start('init');
}