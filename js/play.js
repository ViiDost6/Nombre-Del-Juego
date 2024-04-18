const characterSpeed = 300 , totalSprint = 50 , sprintCooldown = 100 , sprintSpeed = 600;

let character , xTimer , yTimer , canSprint , isSprinting , sprintLeft;

let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay ()
{
    game.load.image( 'craft' , 'assets/imgs/craft.png' );
}

function createPlay ()
{
    character = game.add.sprite( GAME_STAGE_WIDTH / 2 , GAME_STAGE_HEIGHT / 2 , 'craft' );
    character.anchor.setTo( 0.5 , 0.5 );
    game.physics.arcade.enable( character );

    xTimer = game.time.create( false );
    yTimer = game.time.create( false );

    canSprint = true;
    isSprinting = false;
    sprintLeft = totalSprint;
}

function updatePlay ()
{
    MoveCharacter();
}

function MoveCharacter ()
{
    if ( game.input.keyboard.isDown( Phaser.Keyboard.LEFT ) || game.input.keyboard.isDown( Phaser.Keyboard.A ) )
    {
        if ( canSprint && game.input.keyboard.isDown( Phaser.Keyboard.SHIFT ) )
        {
            isSprinting = true;
            character.body.velocity.x = -sprintSpeed;
            Sprint();
        }
        else
        {
            character.body.velocity.x = -characterSpeed;
        }

        xTimer.stop(); // Stop the timer if a key is pressed
    }
    else if ( game.input.keyboard.isDown( Phaser.Keyboard.RIGHT ) || game.input.keyboard.isDown( Phaser.Keyboard.D ) )
    {
        if ( canSprint && game.input.keyboard.isDown( Phaser.Keyboard.SHIFT ) )
        {
            isSprinting = true;
            character.body.velocity.x = sprintSpeed;
            Sprint();
        }
        else
        {
            character.body.velocity.x = characterSpeed;
        }

        xTimer.stop(); // Stop the timer if a key is pressed
    }
    else
    {
        // Start the coroutine to gradually decrease the velocity
        SmoothStopping( true , 1 ); // 0.5 is the time to stop in seconds
    }

    if ( game.input.keyboard.isDown( Phaser.Keyboard.UP ) || game.input.keyboard.isDown( Phaser.Keyboard.W ) )
    {
        if ( canSprint && game.input.keyboard.isDown( Phaser.Keyboard.SHIFT ) )
        {
            isSprinting = true;
            character.body.velocity.y = -sprintSpeed;
            Sprint();
        }
        else
        {
            character.body.velocity.y = -characterSpeed;
        }

        yTimer.stop(); // Stop the timer if a key is pressed
    }
    else if ( game.input.keyboard.isDown( Phaser.Keyboard.DOWN ) || game.input.keyboard.isDown( Phaser.Keyboard.S ) )
    {
        if ( canSprint && game.input.keyboard.isDown( Phaser.Keyboard.SHIFT ) )
        {
            isSprinting = true;
            character.body.velocity.y = sprintSpeed;
            Sprint();
        }
        else
        {
            character.body.velocity.y = characterSpeed;
        }

        yTimer.stop(); // Stop the timer if a key is pressed
    }
    else
    {
        // Start the coroutine to gradually decrease the velocity
        SmoothStopping( false , 1 ); // 0.5 is the time to stop in seconds
    }

    RotateTowardsMouse();
}

function SmoothStopping ( x , timeToStop )
{
    let timer = x ? xTimer : yTimer; // Choose the correct timer
    let axis = x ? 'x' : 'y'; // Choose the correct axis
    let decreaseAmount = character.body.velocity[ axis ] / ( timeToStop * 60 ); // 60 is the number of frames per second

    timer.loop( 1 / 60 * 1000 , function() { // 1/60 * 1000 to convert frames per second to milliseconds
        character.body.velocity[ axis ] -= decreaseAmount;
        if ( Math.abs( character.body.velocity[ axis ] ) < Math.abs( decreaseAmount ) )
        {
            character.body.velocity[ axis ] = 0;
            timer.stop();
        }
    } , this );

    timer.start();
}

function RotateTowardsMouse ()
{
    let angle = game.physics.arcade.angleToPointer( character );
    character.rotation = angle + Phaser.Math.degToRad( 90 );
}

function Sprint ()
{
    sprintLeft -= 1;

    if ( sprintLeft == 0 )
    {
        canSprint = false;
        sprintLeft = totalSprint;
        setTimeout( function() {
            canSprint = true;
        } , sprintCooldown );
    }
}

/*
function startHOF() {
    game.state.start('hof');
}
*/
