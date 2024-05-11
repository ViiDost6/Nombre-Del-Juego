let winState = {
    preload: preloadWin ,
    create: createWin
};

function preloadWin()
{
    game.load.image( 'background' , 'assets/imgs/initialBackground.png' );
}

function createWin()
{
    game.add.sprite( 0 , 0 , 'background' );
}