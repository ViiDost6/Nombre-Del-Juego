const GAME_STAGE_WIDTH = 800;
const GAME_STAGE_HEIGHT = 600;

let game = new Phaser.Game( GAME_STAGE_WIDTH , GAME_STAGE_HEIGHT , Phaser.CANVAS , 'gamestage' );

let wfConfig = {
    active: function() { startGame(); },
    google: {
        families: ['Kalam']
    }
};

WebFont.load(wfConfig);

// Entry point
//window.onload = startGame;

function startGame()
{
    game.state.add( 'init' , initState );
    game.state.add( 'play' , playState );
    game.state.add( 'instructions' , instructionsState );
    game.state.add( 'endscreen' , gameOverState );
    game.state.start( 'init' );
}
