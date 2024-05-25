let winStateOptional = {
    preload: preloadWinOptional ,
    create: createWinOptional
};

function preloadWinOptional()
{
    game.load.image( 'background' , 'assets/imgs/WinExtra.png' );
    game.load.image('btnHome', 'assets/imgs/skipButton.png');
}

function createWinOptional()
{
    game.add.sprite( 0 , 0 , 'background' );

    let btnHome = game.add.button(GAME_STAGE_WIDTH - 100, 550, 'btnHome', startInit, this);
    btnHome.anchor.setTo(0.5, 0.5);
}

function startInit()
{
    buttonsnd.play();
    game.state.start('init');
}