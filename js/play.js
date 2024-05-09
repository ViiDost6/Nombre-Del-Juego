/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTANTS, GLOBAL VARIABLES AND PHASES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let playState = { // GAME PHASES
    preload: PreloadPlay,
    create: CreatePlay,
    update: UpdatePlay
};

const CHARACTER_SPEED = 150 , 
TOTAL_SPRINT = 500 , 
SPRINT_COOLDOWN = 2.5 , 
SPRINT_SPEED = 450 ,
ANCHOR_X = 0.5 ,
ANCHOR_Y = 0.5 ,
TIME_TO_STOP = 1 ,
FPS = 60 ,
FIXED_ANGLE = 90 ,
DASH_DURATION = 0.15 ,
DASH_COOLDOWN = 1.5 ,
DASH_MULTIPLIER = 5 ,
WORLD_WIDTH = 2400 ,
WORLD_HEIGHT = 3200 , 
SCROLL_FACTOR = 0.7 , 
BULLET_SPRITE_X = 26 ,
BULLET_SPRITE_Y = 25 , 
WEAPON_OFFSET_X = 25 ,
WEAPON_OFFSET_Y = -25 ,
DEFAULT_NUMBER_BULLETS = 6 ,
BULLET_KILL_DISTANCE = 300 ,
BULLET_SPEED = 250 ,
FIRE_RATE = 100 , 
BULLET_ANGLE_VARIANCE = 20 , 
SPRINT_BAR_X = 5 ,
SPRINT_BAR_Y = 595 ,
HUD_ANCHOR_X = 0 ,
HUD_ANCHOR_Y = 1 ,
DASH_INDICATOR_X = 5 ,
DASH_INDICATOR_Y = 350 , 
ZONE_1_MAX_ENEMIES = 20 ,
ZONE_2_MAX_ENEMIES = 15 ,
ZONE_3_MAX_ENEMIES = 10 ,
ZONE_4_MAX_ENEMIES = 7 ,
ZONE_5_MAX_ENEMIES = 5 , 
BASIC_ENEMIES_ANCHOR_X = 0.5 ,
BASIC_ENEMIES_ANCHOR_Y = 1 , 
TIMER_BASIC_ENEMY_SPAWN = 0.1 * Phaser.Timer.SECOND , 
PROBABILITY_BASIC_ENEMY_SPAWN = 0.2 , 
ZONES_HEIGHT = 600 , 
DISTANCE_DETECTION_ENEMY = 200 , 
DEFAULT_VELOCITY_ENEMY = 100;

let character , xTimer , yTimer , sprintEnabled , sprintLeft, pistol , canDash , isDashing , 
sprintBar , hudGroup , sprintHolder , sprintTween , checkDash, basicEnemiesZone1 , basicEnemiesZone2 , 
basicEnemiesZone3 , basicEnemiesZone4 , basicEnemiesZone5 , spawn1 , spawn2 , spawn3 , spawn4 , spawn5 , 
barriers;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CLASSES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class SpawnerBasicEnemy
{
    constructor ( zoneNumber , sprite )
    {
        // IT ADDS THE ENEMY TO THE GROUP OF THE SPECIFIED ZONE

        switch ( zoneNumber )
        {
            case 1:
                basicEnemiesZone1 = game.add.group();
                basicEnemiesZone1.enableBody = true;
                basicEnemiesZone1.createMultiple( ZONE_1_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone1.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                break;
            case 2:
                basicEnemiesZone2 = game.add.group();
                basicEnemiesZone2.enableBody = true;
                basicEnemiesZone2.createMultiple( ZONE_2_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone2.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                break;
            case 3:
                basicEnemiesZone3 = game.add.group();
                basicEnemiesZone3.enableBody = true;
                basicEnemiesZone3.createMultiple( ZONE_3_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone3.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                break;
            case 4:
                basicEnemiesZone4 = game.add.group();
                basicEnemiesZone4.enableBody = true;
                basicEnemiesZone4.createMultiple( ZONE_4_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone4.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                break;
            case 5:
                basicEnemiesZone5 = game.add.group();
                basicEnemiesZone5.enableBody = true;
                basicEnemiesZone5.createMultiple( ZONE_5_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone5.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                break;
            default:
                break;
        }
    }

    NumberOfEnemies ( zoneNumber ) // GET THE NUMBER OF ENEMIES IN A SPECIFIC ZONE
    {
        if ( Enemy.enemyGroup[ zoneNumber ] )
        {
            return Enemy.enemyGroup[ zoneNumber ].countLiving();
        }
        else
        {
            return 0;
        }
    }

    MoveEnemies ( zoneNumber )
    {
        switch (zoneNumber)
        {
            case 1:
                basicEnemiesZone1.forEach( this.MoveSingleEnemy , this , zoneNumber );
                break;
            case 2:
                basicEnemiesZone2.forEach( this.MoveSingleEnemy , this , zoneNumber );
                break;
            case 3:
                basicEnemiesZone3.forEach( this.MoveSingleEnemy , this , zoneNumber );
                break;
            case 4:
                basicEnemiesZone4.forEach( this.MoveSingleEnemy , this , zoneNumber );
                break;
            case 5:
                basicEnemiesZone5.forEach( this.MoveSingleEnemy , this , zoneNumber );
                break;
            default:
                break;
        }
    }

    MoveSingleEnemy ( enemy , zoneNumber )
    {
        if ( enemy.x == character.x && enemy.y == character.y )
        {
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = 0;
        }
        else if ( game.physics.arcade.distanceBetween( character , enemy ) < DISTANCE_DETECTION_ENEMY )
        {
            enemy.x < 0 || enemy.x > WORLD_WIDTH ? enemy.body.velocity.x *= -1 : game.physics.arcade.moveToObject( enemy , character , DEFAULT_VELOCITY_ENEMY );

            enemy.y < ZONES_HEIGHT * ( zoneNumber - 1 ) || enemy.y > ZONES_HEIGHT * zoneNumber ? enemy.body.velocity.y *= -1 : game.physics.arcade.moveToObject( enemy , character , DEFAULT_VELOCITY_ENEMY );
        }
        else
        {
            let minusOrPlusX = Math.floor( Math.random() * 2 );
            let minusOrPlusY = Math.floor( Math.random() * 2 );

            minusOrPlusX = minusOrPlusX == 0 ? -1 : 1;
            minusOrPlusY = minusOrPlusY == 0 ? -1 : 1;

            let enemyVelocityX = Math.floor( Math.random() * Math.floor(Math.random() * DEFAULT_VELOCITY_ENEMY) * minusOrPlusX );
            let enemyVelocityY = Math.floor( Math.random() * Math.floor(Math.random() * DEFAULT_VELOCITY_ENEMY) * minusOrPlusY );

            enemy.x < 0 || enemy.x > WORLD_WIDTH ? enemy.body.velocity.x = -enemyVelocityX : enemy.body.velocity.x = enemyVelocityX;
            enemy.y < ZONES_HEIGHT * ( zoneNumber - 1 ) || enemy.y > ZONES_HEIGHT * zoneNumber ? enemy.body.velocity.y = -enemyVelocityY : enemy.body.velocity.y = enemyVelocityY;
        }
    }
    
    SpawnEnemies ( zoneNumber )
    {
        let canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN;

        if ( canSpawn )
        {
            let enemy;

            switch ( zoneNumber )
            {
                case 1:
                    enemy = basicEnemiesZone1.getFirstExists( false );
                    break;
                case 2:
                    enemy = basicEnemiesZone2.getFirstExists( false );
                    break;
                case 3:
                    enemy = basicEnemiesZone3.getFirstExists( false );
                    break;
                case 4:
                    enemy = basicEnemiesZone4.getFirstExists( false );
                    break;
                case 5:
                    enemy = basicEnemiesZone5.getFirstExists( false );
                    break;
                default:
                    break;
            }

            if ( enemy )
            {
                let possibleXCoordinates = WORLD_WIDTH - enemy.body.width;
                let xRandomSpawnCoordinate = Math.floor( Math.random() * possibleXCoordinates );
                let xSpawnCoordinate = enemy.body.width / 2 + xRandomSpawnCoordinate;

                let barrierAbove = ZONES_HEIGHT * ( zoneNumber - 1 );
                let barrierBelow = ZONES_HEIGHT * zoneNumber;

                let possibleYCoordinates = WORLD_HEIGHT - enemy.body.height;

                let yRandomSpawnCoordinate;

                do
                {
                    yRandomSpawnCoordinate = Math.floor( Math.random() * possibleYCoordinates );
                } while ( yRandomSpawnCoordinate < barrierAbove || yRandomSpawnCoordinate > barrierBelow);

                let ySpawnCoordinate = enemy.body.height / 2 + yRandomSpawnCoordinate;

                enemy.reset( xSpawnCoordinate , ySpawnCoordinate );
            }
        }
    }
}

class Weapon
{
    constructor ( nbullets , sprite , distance , speed , rate , variance )
    {
        this.core = game.add.weapon( nbullets , sprite ); // CREATE THE WEAPON
        this.core.trackSprite( character , WEAPON_OFFSET_X , WEAPON_OFFSET_Y , true ); // TRACK THE CHARACTER
        this.core.bulletKillType = Phaser.Weapon.KILL_DISTANCE; // KILL THE BULLET WHEN IT REACHES A CERTAIN DISTANCE
        this.core.bulletKillDistance = distance; // THE DISTANCE TO KILL THE BULLET
        this.core.bulletSpeed = speed; // THE SPEED OF THE BULLET
        this.core.fireRate = rate; // THE FIRE RATE OF THE BULLET
        this.core.bulletAngleVariance = variance; // THE VARIANCE OF THE ANGLE OF THE BULLET
        this.core.setBulletFrames( 0 , nbullets - 1 , true ); // SET THE FRAMES OF THE BULLET
        this.nbullets = nbullets; // THE NUMBER OF BULLETS
    }

    Shoot () // SHOOT. A SINGLE CLICK SHOOTS ALL BULLETS
    {
        let shotsThatHaveBeenShot = this.core.shots; // GET THE NUMBER OF BULLETS SHOT

        // TO TRACK THE REMAINING BULLETS IN A ‘MAGAZINE’ IN PHASER, YOU MUST COUNT THE SHOTS. 
        // PHASER.WEAPON LACKS A FUNCTION FOR THIS, SO WE USE PISTOL.SHOTS, WHICH COUNTS THE SHOTS SINCE THE LAST RESET.
        
        let canShoot = game.input.activePointer.leftButton.isDown && shotsThatHaveBeenShot == 0;
        let isShooting = shotsThatHaveBeenShot > 0 && shotsThatHaveBeenShot < this.nbullets;
        let needsReload = shotsThatHaveBeenShot == this.nbullets;

        // console.log( shotsThatHaveBeenShot );
        // console.log( "max = ", this.nbullets );

        if ( canShoot ) // EACH CLICK FIRES A BULLET IF NONE HAS BEEN FIRED SINCE THE LAST RESET, INCREMENTING THE COUNTER.
        {
            this.core.fireAtPointer( game.input.activePointer );  
            // console.log( 'shoot' );
        }
        else if ( isShooting )
        {
            this.core.fireAtPointer( game.input.activePointer );
            // console.log( 'shoot loop' );
        }   
        else if ( needsReload ) // ONCE ALL 6 BULLETS ARE FIRED, THE COUNTER IS RESET TO RESTART THE PROCESS.
        {
            shotsThatHaveBeenShot = this.core.resetShots();
            // console.log( 'reload' );
        }
    }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function PreloadPlay () // LOAD ASSETS FOR THE GAME
{
    CreateImages();
}

function CreatePlay () // SET UP THE GAME
{
    CreateTimers(); // SET UP TIMERS FOR SMOOTH STOPPING
    CreateBackground();
    CreateCharacter();
    CreateHUD();
    CreateEnemies();
}

function UpdatePlay () // GAME LOOP
{
    UpdateCharacter();
    UpdateCollisions();
}

function UpdateCollisions ()
{
    // MAKE THE CHARACTER AND ENEMIES COLLIDE WITH THE BARRIERS
    game.physics.arcade.collide(character, barriers);
    game.physics.arcade.collide(basicEnemiesZone1, barriers);
    game.physics.arcade.collide(basicEnemiesZone2, barriers);
    game.physics.arcade.collide(basicEnemiesZone3, barriers);
    game.physics.arcade.collide(basicEnemiesZone4, barriers);
    game.physics.arcade.collide(basicEnemiesZone5, barriers);
}

function UpdateEnemies ()
{
    spawn1.MoveEnemies(1);
    spawn2.MoveEnemies(2);
    spawn3.MoveEnemies(3);
    spawn4.MoveEnemies(4);
    spawn5.MoveEnemies(5);
}

function CreateEnemies ()
{
    spawn1 = new SpawnerBasicEnemy( 1 , 'basicEnemy' );
    spawn2 = new SpawnerBasicEnemy( 2 , 'basicEnemy' );
    spawn3 = new SpawnerBasicEnemy( 3 , 'basicEnemy' );
    spawn4 = new SpawnerBasicEnemy( 4 , 'basicEnemy' );
    spawn5 = new SpawnerBasicEnemy( 5 , 'basicEnemy' );

    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawn1.SpawnEnemies , this , 1 );
    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawn2.SpawnEnemies , this , 2 );
    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawn3.SpawnEnemies , this , 3 );
    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawn4.SpawnEnemies , this , 4 );
    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawn5.SpawnEnemies , this , 5 );

    setInterval( UpdateEnemies , 1000 );
}

function CreateTimers ()
{
    xTimer = game.time.create( false );
    yTimer = game.time.create( false );
}

function CreateImages ()
{
    game.load.image( 'bullet' , 'assets/imgs/laser.png' );
    game.load.image( 'player' , 'assets/imgs/Base_Player.png' );
    game.load.image( 'background' , 'assets/imgs/background.png' );
    game.load.image( 'sprintHolder' , 'assets/imgs/sprint_holder.png' );
    game.load.image( 'sprintBar' , 'assets/imgs/sprint_bar.png' );
    game.load.image( 'check_dash' , 'assets/imgs/check_dash.png' );
    game.load.spritesheet( 'bullets' , 'assets/imgs/bullet.png' , BULLET_SPRITE_X , BULLET_SPRITE_Y );
    game.load.image( 'basicEnemy' , 'assets/imgs/Base_Enemy.png' );
    game.load.image( 'barrier' , 'assets/imgs/barrier.png' );
}

function CreateBackground ()
{
    game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // SMOOTH SCROLLING
    let background = game.add.tileSprite( 0 , 0 , game.world.width , game.world.height , 'background' );
    background.scrollFactorX = SCROLL_FACTOR;
    background.scrollFactorY = SCROLL_FACTOR;

    // BARRIERS
    barriers = game.add.group();
    barriers.enableBody = true; // Enable physics for the barriers

    for ( let i = 1; i <= 5; i++ )
    {
        let barrier = barriers.create( 0 , ZONES_HEIGHT * i , 'barrier' );
        barrier.body.immovable = true; // Make the barrier immovable
    }
}

function CreateCharacter ()
{
    character = game.add.sprite( GAME_STAGE_WIDTH / 2 , 2900 , 'player' );
    character.anchor.setTo( ANCHOR_X , ANCHOR_Y );
    
    game.physics.arcade.enable( character );
    sprintEnabled = true;
    sprintLeft = TOTAL_SPRINT;
    canDash = true;
    isDashing = false;

    // SET UP THE CAMERA THAT FOLLOWS THE CHARACTER
    game.camera.follow( character );

    // SET UP THE WEAPON FOR THE CHARACTER
    pistol = new Weapon( DEFAULT_NUMBER_BULLETS , 'bullets' , BULLET_KILL_DISTANCE , BULLET_SPEED , FIRE_RATE , BULLET_ANGLE_VARIANCE );
}

function CreateHUD ()
{
    hudGroup = game.add.group(); // GROUP FOR THE HUD
    sprintBar = hudGroup.create( SPRINT_BAR_X , SPRINT_BAR_Y , 'sprintBar' ); // SPRINT BAR
    sprintBar.anchor.setTo( HUD_ANCHOR_X , HUD_ANCHOR_Y ); // ANCHOR THE SPRINT BAR
    sprintHolder = hudGroup.create( SPRINT_BAR_X , SPRINT_BAR_Y , 'sprintHolder' ); // SPRINT HOLDER
    sprintHolder.anchor.setTo( HUD_ANCHOR_X , HUD_ANCHOR_Y ); // ANCHOR THE SPRINT HOLDER
    checkDash = hudGroup.create( DASH_INDICATOR_X , DASH_INDICATOR_Y , 'check_dash' ); // CHECK DASH
    checkDash.visible = false; // HIDE THE CHECK DASH
    checkDash.anchor.setTo( HUD_ANCHOR_X , HUD_ANCHOR_Y ); // ANCHOR THE CHECK DASH
    hudGroup.fixedToCamera = true; // FIX THE HUD TO THE CAMERA
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HUD FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function UpdateSprintBar ()
{
    sprintBar.scale.y = sprintLeft / TOTAL_SPRINT; // SCALE THE SPRINT BAR
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MOVEMENT FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function UpdateCharacter () // UPDATE THE CHARACTER FUNCTIONALITY
{
    CheckBounds(); // CHECKS IF THE CHARACTER IS WITHIN THE BOUNDS OF THE WORLD
    CheckDash(); // CHECKS IF THE CHARACTER DASHES
    CheckMovement(); // CHECKS IF THE CHARACTER MOVES
    RotateTowardsMouse(); // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
    pistol.Shoot(); // SHOOT THE BULLET
}

function CheckDash () // DASH FUNCTIONALITY
{
    let wantsToDash = game.input.keyboard.isDown( Phaser.Keyboard.SPACEBAR );

    if ( wantsToDash && canDash )
    {
        isDashing = true;
        canDash = false;
        setTimeout( function() {
            isDashing = false;
            setTimeout( function() {
                canDash = true;
            }, DASH_COOLDOWN * 1000 ); // WE MULTIPLY BY 1000 TO GET DASH COOLDOWN IN SECONDS
        }, DASH_DURATION * 1000 ); // WE MULTIPLY BY 1000 TO GET DASH DURATION IN SECONDS
    }

    canDash ? checkDash.visible = true : checkDash.visible = false; // SHOW THE CHECK DASH IF THE CHARACTER CAN DASH
}

function CheckSprint ( direction ) // SPRINT FUNCTIONALITY
{
    let movementMultiplier = isDashing ? DASH_MULTIPLIER : 1; // IF THE CHARACTER IS DASHING, MULTIPLY THE SPEED BY THE DASH MULTIPLIER
    let canSprint = sprintEnabled && game.input.keyboard.isDown( Phaser.Keyboard.SHIFT );

    if ( direction == 'left' )
    {
        canSprint ? character.body.velocity.x = -SPRINT_SPEED * movementMultiplier : character.body.velocity.x = -CHARACTER_SPEED * movementMultiplier; // SPRINT LEFTWARDS
    }
    else if ( direction == 'right' )
    {
        canSprint ? character.body.velocity.x = SPRINT_SPEED * movementMultiplier : character.body.velocity.x = CHARACTER_SPEED * movementMultiplier; // SPRINT RIGHTWARDS
    }

    if ( direction == 'up' )
    {
        canSprint ? character.body.velocity.y = -SPRINT_SPEED * movementMultiplier : character.body.velocity.y = -CHARACTER_SPEED * movementMultiplier; // SPRINT UPWARDS
    }
    else if ( direction == 'down' )
    {
        canSprint ? character.body.velocity.y = SPRINT_SPEED * movementMultiplier : character.body.velocity.y = CHARACTER_SPEED * movementMultiplier; // SPRINT DOWNWARDS
    }

    if ( canSprint )
    {
        Sprint();
    }
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

        if ( sprintTween )
        {
            sprintTween.stop();
        }

        sprintTween = game.add.tween(sprintBar.scale).to({
            x: 1, // Assuming the full scale on x-axis represents the bar being completely filled
            y: 1  // Assuming the full scale on y-axis represents the bar being completely filled
        }, SPRINT_COOLDOWN * 1000, Phaser.Easing.Linear.None, true);

        sprintTween.start();
    }

    UpdateSprintBar();
}

function CheckBounds ()
{
    if ( character.x < 0 ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        character.x = 0;
    }
    else if ( character.x > WORLD_WIDTH ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        character.x = WORLD_WIDTH;
    }

    if ( character.y < 0 ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        character.y = 0;
    }
    else if ( character.y > WORLD_HEIGHT ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        character.y = WORLD_HEIGHT;
    }
}

function CheckMovement ()
{
    let canMoveLeftwards = game.input.keyboard.isDown( Phaser.Keyboard.LEFT ) || game.input.keyboard.isDown( Phaser.Keyboard.A );
    let canMoveRightwards = game.input.keyboard.isDown( Phaser.Keyboard.RIGHT ) || game.input.keyboard.isDown( Phaser.Keyboard.D );
    let canMoveUpwards = game.input.keyboard.isDown( Phaser.Keyboard.UP ) || game.input.keyboard.isDown( Phaser.Keyboard.W );
    let canMoveDownwards = game.input.keyboard.isDown( Phaser.Keyboard.DOWN ) || game.input.keyboard.isDown( Phaser.Keyboard.S );

    if ( canMoveLeftwards )
    {
        CheckSprint( 'left' ); // CHECKS IF THE CHARACTER SPRINTS TO THE LEFT
        xTimer.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else if ( canMoveRightwards )
    {
        CheckSprint( 'right' ); // CHECKS IF THE CHARACTER SPRINTS TO THE RIGHT
        xTimer.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else // NO HORIZONTAL MOVEMENT KEY IS PRESSED
    {
        // START THE COROUTINE TO GRADUALLY DECREASE THE SPEED
        SmoothStopping( true , TIME_TO_STOP ); // THE SECOND PARAMETER IS THE TIME TO STOP IN SECONDS
    }

    if ( canMoveUpwards  )
    {
        CheckSprint( 'up' ); // CHECKS IF THE CHARACTER SPRINTS TO THE LEFT
        yTimer.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else if ( canMoveDownwards )
    {
        CheckSprint( 'down' ); // CHECKS IF THE CHARACTER SPRINTS TO THE LEFT
        yTimer.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else
    {
        // START THE COROUTINE TO GRADUALLY DECREASE THE SPEED
        SmoothStopping( false , TIME_TO_STOP ); // THE FIRST PARAMETER IS A BOOL THAT CHECKS WHETHER IT IS A HORIZONTAL INPUT OR NOT, AND THE SECOND PARAMETER IS THE TIME TO STOP IN SECONDS
    }
}