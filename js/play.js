/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTANTS, GLOBAL VARIABLES AND PHASES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const CHARACTER_SPEED = 150 , 
TOTAL_SPRINT = 500 , 
SPRINT_COOLDOWN = 2.5 , 
SPRINT_SPEED = 300 ,
ANCHOR_X = 0.5 ,
ANCHOR_Y = 0.5 ,
TIME_TO_STOP = 1 ,
FPS = 60
FIXED_ANGLE = 90;

let character , xTimer , yTimer , sprintEnabled , sprintLeft, pistol;

let playState = { // GAME PHASES
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function preloadPlay () // LOAD ASSETS FOR THE GAME
{
    game.load.image( 'craft' , 'assets/imgs/craft.png' );
    game.load.image( 'bullet' , 'assets/imgs/laser.png' );
    game.load.image( 'player' , 'assets/imgs/Base_Player.png' );
}

function createPlay () // SET UP THE GAME
{
    // SET UP THE CHARACTER
    character = game.add.sprite( GAME_STAGE_WIDTH / 2 , GAME_STAGE_HEIGHT / 2 , 'player' );
    character.anchor.setTo( ANCHOR_X , ANCHOR_Y );
    game.physics.arcade.enable( character );
    sprintEnabled = true;
    sprintLeft = TOTAL_SPRINT;
    createWeaponPistol();

    // INITIALIZING TIMERS FOR SMOOTH STOPPING
    xTimer = game.time.create( false );
    yTimer = game.time.create( false );
}

function updatePlay () // GAME LOOP
{
    MoveCharacter();
    shootPistol();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS FOR THE GAME
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function MoveCharacter () // MOVEMENT AND SPRINT OF THE CHARACTER
{
    let canSprint = sprintEnabled && game.input.keyboard.isDown( Phaser.Keyboard.SHIFT );
    let canMoveLeftwards = game.input.keyboard.isDown( Phaser.Keyboard.LEFT ) || game.input.keyboard.isDown( Phaser.Keyboard.A );
    let canMoveRightwards = game.input.keyboard.isDown( Phaser.Keyboard.RIGHT ) || game.input.keyboard.isDown( Phaser.Keyboard.D );
    let canMoveUpwards = game.input.keyboard.isDown( Phaser.Keyboard.UP ) || game.input.keyboard.isDown( Phaser.Keyboard.W );
    let canMoveDownwards = game.input.keyboard.isDown( Phaser.Keyboard.DOWN ) || game.input.keyboard.isDown( Phaser.Keyboard.S );

    if ( canMoveLeftwards )
    {
        if ( canSprint )
        {
            character.body.velocity.x = -SPRINT_SPEED;
            Sprint();
        }
        else
        {
            character.body.velocity.x = -CHARACTER_SPEED;
        }

        xTimer.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else if ( canMoveRightwards )
    {
        if ( canSprint )
        {
            character.body.velocity.x = SPRINT_SPEED;
            Sprint();
        }
        else
        {
            character.body.velocity.x = CHARACTER_SPEED;
        }

        xTimer.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else // NO HORIZONTAL MOVEMENT KEY IS PRESSED
    {
        // START THE COROUTINE TO GRADUALLY DECREASE THE SPEED
        SmoothStopping( true , TIME_TO_STOP ); // THE SECOND PARAMETER IS THE TIME TO STOP IN SECONDS
    }

    if ( canMoveUpwards  )
    {
        if ( canSprint )
        {
            character.body.velocity.y = -SPRINT_SPEED;
            Sprint();
        }
        else
        {
            character.body.velocity.y = -CHARACTER_SPEED;
        }

        yTimer.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else if ( canMoveDownwards )
    {
        if ( canSprint )
        {
            character.body.velocity.y = SPRINT_SPEED;
            Sprint();
        }
        else
        {
            character.body.velocity.y = CHARACTER_SPEED;
        }

        yTimer.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else
    {
        // START THE COROUTINE TO GRADUALLY DECREASE THE SPEED
        SmoothStopping( false , TIME_TO_STOP ); // THE FIRST PARAMETER IS A BOOL THAT CHECKS WHETHER IT IS A HORIZONTAL INPUT OR NOT, AND THE SECOND PARAMETER IS THE TIME TO STOP IN SECONDS
    }

    RotateTowardsMouse(); // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
}

function SmoothStopping ( x , timeToStop ) // GRADUALLY DECREASE THE SPEED OF THE CHARACTER. IT MAKES THE MOVEMENT SMOOTHER
{
    let timer = x ? xTimer : yTimer; // IT CHOOSES THE TIMER TO USE
    let axis = x ? 'x' : 'y'; // IT CHOOSES THE AXIS TO STOP
    let decreaseAmount = character.body.velocity[ axis ] / ( timeToStop * FPS );

    timer.loop( 1 / 60 * 1000 , // 1/60 * 1000 TO CONVERT SECONDS TO MILLISECONDS
        function() { 
        character.body.velocity[ axis ] -= decreaseAmount; // DECREASE THE VELOCITY ALONG THE SPECIFIED AXIS

        // CHECKS IF THE ABSOLUTE VALUE OF THE VELOCITY OF A CHARACTER ALONG A SPECIFIC AXIS IS LESS THAN THE ABSOLUTE VALUE OF A SPECIFIED DECREASE AMOUNT
        let isStopped = Math.abs( character.body.velocity[ axis ] ) < Math.abs( decreaseAmount );

        if ( isStopped )
        {
            character.body.velocity[ axis ] = 0;
            timer.stop();
        }
    } , this );

    timer.start();
}

function RotateTowardsMouse () // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
{
    let angle = game.physics.arcade.angleToPointer( character ); // GET THE ANGLE BETWEEN THE CHARACTER AND THE MOUSE CURSOR
    character.rotation = angle + Phaser.Math.degToRad( FIXED_ANGLE ); // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
}

function Sprint () // SPRINT FUNCTIONALITY
{
    sprintLeft--; // DECREASE THE SPRINT LEFT

    let outOfSprint = sprintLeft == 0;

    if ( outOfSprint ) // IF THE SPRINT IS OUT, DISABLE IT AND START THE COOLDOWN
    {
        sprintEnabled = false;
        sprintLeft = TOTAL_SPRINT;
        setTimeout(function() {
            sprintEnabled = true;
        }, SPRINT_COOLDOWN * 1000); // WE MULTIPLY BY 1000 TO GET SPRINT COOLDOWN IN SECONDS
    }
}

function createWeaponPistol () // CREATES THE PISTOL WEAPON. ANY WEAPON CAN BE CREATED HERE
{
    pistol = game.add.weapon( 6 , 'bullet' ); // 6 IS THE NUMBER OF BULLETS
    pistol.trackSprite( character , 25 , -25 , true ); // 25, -25 IS THE OFFSET OF THE BULLET RESPECT TO THE CHARACTER
    pistol.bulletKillType = Phaser.Weapon.KILL_DISTANCE; // KILL THE BULLET WHEN IT REACHES A CERTAIN DISTANCE
    pistol.bulletKillDistance = 300; // THE DISTANCE TO KILL THE BULLET
    pistol.bulletSpeed = 250; // THE SPEED OF THE BULLET
    pistol.fireRate = 100; // THE FIRE RATE OF THE BULLET
    pistol.bulletAngleVariance = 20; // THE VARIANCE OF THE ANGLE OF THE BULLET
}

function shootPistol () // SHOOT THE PISTOL. A SINGLE CLICK SHOOTS THE 6 BULLETS
{
    let nbullets = pistol.shots; // GET THE NUMBER OF BULLETS SHOT

    // TO TRACK THE REMAINING BULLETS IN A ‘MAGAZINE’ IN PHASER, YOU MUST COUNT THE SHOTS. 
    // PHASER.WEAPON LACKS A FUNCTION FOR THIS, SO WE USE PISTOL.SHOTS, WHICH COUNTS THE SHOTS SINCE THE LAST RESET.
    
    let canShoot = game.input.activePointer.leftButton.isDown && nbullets == 0;
    let isShooting = nbullets > 0 && nbullets < 6;
    let needsReload = nbullets == 6;

    if ( canShoot ) // EACH CLICK FIRES A BULLET IF NONE HAS BEEN FIRED SINCE THE LAST RESET, INCREMENTING THE COUNTER.
    {
        pistol.fireAtPointer( game.input.activePointer );  
    }
    else if ( isShooting )
    {
        pistol.fireAtPointer( game.input.activePointer );
    }
    else if ( needsReload ) // ONCE ALL 6 BULLETS ARE FIRED, THE COUNTER IS RESET TO RESTART THE PROCESS.
    {
        nbullets = pistol.resetShots();
    }
}

function fullBullets ( weapon ) // RELOAD ALL THE BULLETS OF EVERY TYPE OF WEAPON
{
    weapon.quantity = -1;
}