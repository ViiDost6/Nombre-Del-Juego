/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTANTS, GLOBAL VARIABLES AND PHASES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let playOptionalState = { // GAME PHASES
    preload: PreloadPlayOptional,
    create: CreatePlayOptional,
    update: UpdatePlayOptional
};

// NORMAL CONSTANTS

/* const CHARACTER_SPEED = 150 , 
TOTAL_SPRINT = 500 , 
SPRINT_COOLDOWN = 2.5 , 
SPRINT_SPEED = 450 ,
ANCHOR_X = 0.5 ,
ANCHOR_Y = 0.5 ,
TIME_TO_STOP = 1 ,
FPS = 60 ,
WORLD_WIDTH = 2400 ,
WORLD_HEIGHT = 3200 ,   
FIXED_ANGLE = 90 ,
DASH_DURATION = 0.15 ,
DASH_COOLDOWN = 1.5 ,
DASH_MULTIPLIER = 5 ,
SCROLL_FACTOR = 0.7 , 
BULLET_SPRITE_X = 26 ,
BULLET_SPRITE_Y = 25 , 
WEAPON_OFFSET_X = 25 ,
WEAPON_OFFSET_Y = -25 ,
DEFAULT_NUMBER_BULLETS = 6 ,
BULLET_KILL_DISTANCE = 300 ,
BULLET_SPEED = 700 ,
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
DEFAULT_VELOCITY_ENEMY = 100 , 
DEFAULT_CHARACTER_HEALTH = 100 , 
ANCHOR_X_LIFEBAR = 1 ,
ANCHOR_Y_LIFEBAR = 1 , 
DISTANCE_INTERACT = 125 , 
DISTANCE_DETECTION_INKBAG = 100 , 
DISTANCE_DETECTION_RAE = 150 , 
RELOAD_COST = 100 , 
DISTANCE_DETECTION_REC_AMMO = 100; */

// LOCALIZATION CONSTANTS

// const MAX_POS_Y_ENEMIES = 2900 , RAE_Y = 300 , WORLD_CENTER_X = WORLD_WIDTH / 2;

let characterOptional;
/* let character , xTimer , yTimer , sprintEnabled , sprintLeft, pistol , canDash , isDashing , 
sprintBar , hudGroup , sprintHolder , sprintTween , checkDash, basicEnemiesZone1 , basicEnemiesZone2 , 
basicEnemiesZone3 , basicEnemiesZone4 , basicEnemiesZone5 , spawn1 , spawn2 , spawn3 , spawn4 , spawn5 , 
barriers , character_health , canReceiveDamage , life_bar , life_holder , lifeTween , red_tint , blue_tint , totalRedTint , totalBlueTint , inkBags , 
red_tint_counter , blue_tint_counter , btnInteract , globalScore , closeToBarrier , textNoMoney , inkBagsDropSwitch , rae , shine_rae , time , barrierSafeZone , 
barrierSafeZoneGroup , raeGroup , safeZoneSecondsCounter , canEnterSafeZone , rec_life , rec_ammo_group1 , needsToReload , isBuyingReloads , black_background , shotgun , bow , weaponSelected , hasShotgun , hasBow , shopGroup , shopWeaponsGroup , shineShopGroup , canSwitchBetweenWeapons , globalScoreText , difficultyText , outOfAmmoText , costOfIt , 
advancedEnemiesGroup , enemy1 , isNotInSafeZone; */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function PreloadPlayOptional () // LOAD ASSETS FOR THE GAME
{
    CreateImagesOptional();
}

function CreatePlayOptional () // SET UP THE GAME
{
    CreateTimersOptional(); // SET UP TIMERS FOR SMOOTH STOPPING
    CreateBackgroundOptional();
    CreateCharacterOptional();
    CreateEnemiesOptional();
    CreateHUDOptional();
}

function UpdatePlayOptional () // GAME LOOP
{
    UpdateCharacterOptional();
    UpdateCollisionsOptional();
    UpdateRotationsOptional();
    UpdateSpritesOptional();
}

function UpdateSpritesOptional ()
{
    basicEnemiesZone1Optional.forEach( UpdateSpriteSingleEnemyOptional , this );
    basicEnemiesZone2Optional.forEach( UpdateSpriteSingleEnemyOptional , this );
    basicEnemiesZone3Optional.forEach( UpdateSpriteSingleEnemyOptional , this );
    basicEnemiesZone4Optional.forEach( UpdateSpriteSingleEnemyOptional , this );
    basicEnemiesZone5Optional.forEach( UpdateSpriteSingleEnemyOptional , this );

    // Increase time
    timeOptional += game.time.elapsed;

    // Calculate new scale and position
    let newScale = 3 + 1.5 * Math.sin(timeOptional / 2000); // Reduced from 0.1 to 0.01

    // Apply new scale and position
    shine_raeOptional.scale.set(newScale);
}

function UpdateSpriteSingleEnemyOptional ( enemy )
{
    game.physics.arcade.distanceBetween( characterOptional , enemy ) < DISTANCE_DETECTION_ENEMY ? enemy.loadTexture('basicEnemyDirty', 0) : enemy.loadTexture('basicEnemy', 0);
    
}

function UpdateRotationsOptional ()
{
    basicEnemiesZone1.forEach( RotateSingleEnemy , this );
    basicEnemiesZone2.forEach( RotateSingleEnemy , this );
    basicEnemiesZone3.forEach( RotateSingleEnemy , this );
    basicEnemiesZone4.forEach( RotateSingleEnemy , this );
    basicEnemiesZone5.forEach( RotateSingleEnemy , this );
}

function RotateSingleEnemy ( enemy )
{
    let angle = game.physics.arcade.angleBetween( enemy , characterOptional ); // GET THE ANGLE BETWEEN THE CHARACTER AND THE MOUSE CURSOR
    enemy.rotation = angle + Phaser.Math.degToRad( FIXED_ANGLE ); // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
}

function UpdateCollisionsOptional ()
{
    game.physics.arcade.collide(characterOptional, raeOptional);

    // MAKE THE BULLETS COLLIDE WITH THE ENEMIES
    game.physics.arcade.overlap(pistolOptional.core.bullets, basicEnemiesOptional, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBagOptional( enemy );
        BlastAnimationOptional( enemy );
    });

    game.physics.arcade.overlap(shotgunOptional.core.bullets, basicEnemiesOptional, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBagOptional( enemy );
        BlastAnimationOptional( enemy );
    });

    game.physics.arcade.overlap(bowOptional.core.bullets, basicEnemiesOptional, function(bullet, enemy) {
        enemy.kill();
        DropInkBagOptional( enemy );
        BlastAnimationOptional( enemy );
    });

    game.physics.arcade.collide(pistol.core.bullets, advancedEnemiesOptional, function(bullet, enemy) {
        BlastAnimationOptional(enemy);
        enemy.alive = false;
        enemy.kill();
        bullet.kill();
        
    });

    game.physics.arcade.collide(bow.core.bullets, advancedEnemiesOptional, function(bullet, enemy) {
        BlastAnimationOptional(enemy);
        enemy.alive = false;
        enemy.kill();
        bullet.kill();
        
    });

    game.physics.arcade.collide(shotgun.core.bullets, advancedEnemiesOptional, function(bullet, enemy) {
        BlastAnimationOptional(enemy);
        enemy.alive = false;
        enemy.kill();
        bullet.kill();
        
    });

    // MAKE THE CHARACTER COLLIDE WITH THE ENEMIES
    basicEnemiesOptional.forEach( EnemyCollideWithCharacterOptional , this );
    advancedEnemiesOptional.forEach( EnemyCollideWithCharacterOptional , this );

    // MAKE THE INKBAGS COLLIDE WITH THE CHARACTER
    inkBagsOptional.forEach( InkBagCollideWithCharacterOptional , this );

    /* game.physics.arcade.overlap(enemy1.enemyWeapon.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamage )
        {
            character_health -= 10;
            console.log( character_health );
            canReceiveDamage = false;
            setTimeout( function() {
                canReceiveDamage = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTween )
            {
                lifeTween.stop();
            }

            let newHealth = character_health / DEFAULT_CHARACTER_HEALTH;

            lifeTween = game.add.tween(life_bar.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTween.start();
        }
        ClackAnimation( characterOptional );
    }); */
}

function BlastAnimationOptional ( enemy )
{
    let blast = game.add.sprite( enemy.x , enemy.y , 'bam' );
    blast.anchor.setTo( 0.5 , 0.5 );

    // Random scale between 1 and 1.25
    let randomScale = game.rnd.realInRange(5, 5.25);
    blast.scale.setTo(randomScale, randomScale);

    // Tween to make the sprite smaller and then disappear
    let blastTween = game.add.tween(blast.scale).to({ x: 0, y: 0 }, 1000, Phaser.Easing.Linear.None, true);
    blastTween.onComplete.add(function() {
        blast.destroy();
    }, this);
}

function ClackAnimationOptional ( characterOptional )
{
    let clack = game.add.sprite( characterOptional.x , characterOptional.y , 'clack' );
    clack.anchor.setTo( 0.5 , 0.5 );

    // Random scale between 1 and 1.25
    let randomScale = game.rnd.realInRange(5, 5.25);
    clack.scale.setTo(randomScale, randomScale);

    // Tween to make the sprite smaller and then disappear
    let clackTween = game.add.tween(clack.scale).to({ x: 0, y: 0 }, 1000, Phaser.Easing.Linear.None, true);
    clackTween.onComplete.add(function() {
        clack.destroy();
    }, this);
}

function InkBagCollideWithCharacterOptional ( inkBag )
{
    game.physics.arcade.overlap(characterOptional, inkBag, function() {
        totalBlackTint += 100;
        black_tint_counter.text = totalBlackTint;

        inkBag.kill();
    });
}

function DropInkBag ( enemy )
{
    let inkBag;

    inkBag = inkBagsOptional.create(enemy.x, enemy.y, 'black_tint');

    // Add a cool tween
    game.add.tween(inkBag).to({y: inkBag.y + 10}, 500, Phaser.Easing.Bounce.Out, true);
}

function EnemyCollideWithCharacterOptional ( enemy )
{
    if ( canReceiveDamageOptional )
    {
        game.physics.arcade.overlap(characterOptional, enemy, function() {
            if ( isDashingOptional )
            {
                inkBagsDropSwitchOptional = true;
            }
            else
            {
                character_healthOptional -= 10;
                inkBagsDropSwitchOptional = false;
            }
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );
    
            // Stop the enemy
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = 0;
    
            // Create a tween to make the enemy smaller
            let shrinkTween = game.add.tween(enemy.scale).to({x: 0.01, y: 0.01}, 500, Phaser.Easing.Linear.None, true);
    
            // When the tween completes, kill the enemy
            shrinkTween.onComplete.add(function() {
                enemy.kill();
                inkBagsDropSwitchOptional ? DropInkBag( enemy ) : null;
                inkBagsDropSwitchOptional = false;
            }, this);

            if ( ! isDashingOptional )
            {
                // Update the life bar
                if ( lifeTweenOptional )
                {
                    lifeTweenOptional.stop();
                }
    
                let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH;
        
                lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                    y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
                }, 1000, Phaser.Easing.Linear.None, true);
        
                lifeTweenOptional.start();
            }
        });
    }
}

function UpdateEnemiesOptional ()
{
    spawnEnemiesOptional.MoveEnemies();
}

function CreateEnemiesOptional ()
{
    spawnEnemiesOptional = new SpawnerBasicEnemy( 1 , 'basicEnemy' );

    // enemy1 = new AdvancedEnemy( 100 , 2800 , 'grapadora' , 'grapas' );

    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawnEnemiesOptional.SpawnEnemies , this , 1 );

    setInterval( UpdateEnemiesOptional , 1000 );

    inkBagsOptional = game.add.group();
    inkBagsOptional.enableBody = true;

    shine_raeOptional = game.add.sprite( WORLD_CENTER_X , RAE_Y , 'shine_rae' );
    shine_raeOptional.anchor.setTo( 0.5 );
    shine_raeOptional.scale.setTo( 2 );

    raeGroupOptional = game.add.group();
    raeGroupOptional.enableBody = true;
    raeOptional = raeGroupOptional.create( WORLD_CENTER_X , RAE_Y , 'rae' );
    raeOptional.anchor.setTo( 0.5 );
    raeOptional.body.immovable = true;

    timeOptional = 0;
}

function CreateTimersOptional ()
{
    xTimerOptional = game.time.create( false );
    yTimerOptional = game.time.create( false );
}

function CreateImagesOptional ()
{
    game.load.image( 'playerOptional' , 'assets/imgs/Base_Player.png' );
    game.load.image( 'backgroundOptional' , 'assets/imgs/background.png' );
    game.load.image( 'sprintHolderOptional' , 'assets/imgs/sprint_holder.png' );
    game.load.image( 'sprintBarOptional' , 'assets/imgs/sprint_bar.png' );
    game.load.image( 'check_dashOptional' , 'assets/imgs/check_dash.png' );
    game.load.spritesheet( 'bulletsOptional' , 'assets/imgs/bullet.png' , BULLET_SPRITE_X , BULLET_SPRITE_Y );
    game.load.image( 'basicEnemyOptional' , 'assets/imgs/Base_Enemy.png' );
    game.load.image( 'life_barOptional' , 'assets/imgs/life_bar.png' );
    game.load.image( 'basicEnemyDirtyOptional' , 'assets/imgs/Base_PlayerDirty.png' );
    game.load.image( 'black_tintOptional' , 'assets/imgs/red_tint.png' );
    game.load.image( 'btnEOptional' , 'assets/imgs/btnE.png' );
    game.load.image( 'bamOptional' , 'assets/imgs/bam.png' );
    game.load.image( 'raeOptional' , 'assets/imgs/santa_rae.png' );
    game.load.image( 'shine_raeOptional' , 'assets/imgs/shine.png' );
    game.load.image( 'player_pistolOptional' , 'assets/imgs/PlayerPistol.png' );
    game.load.spritesheet( 'buckshotOptional' , 'assets/imgs/buckshot.png' , BULLET_SPRITE_X , BULLET_SPRITE_Y );
    game.load.image( 'player_shotgunOptional' , 'assets/imgs/PlayerShotgun.png' );
    game.load.image( 'arrowOptional' , 'assets/imgs/arrow.png' );
    game.load.image( 'player_bowOptional' , 'assets/imgs/PlayerBow.png' );
    game.load.image( 'grapadoraOptional' , 'assets/imgs/Grapa.png' );
    game.load.image( 'grapasOptional' , 'assets/imgs/Dora.png' );
    game.load.image( 'clackOptional' , 'assets/imgs/Clack.png' );
}

function CreateBackgroundOptional ()
{
    game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_WIDTH);

    // SMOOTH SCROLLING
    let background = game.add.tileSprite( 0 , 0 , game.world.width , game.world.height , 'background' );
    background.scrollFactorX = SCROLL_FACTOR;
    background.scrollFactorY = SCROLL_FACTOR;
}

function CreateCharacterOptional ()
{
    characterOptional = game.add.sprite( 1200 , 1200 , 'player_pistol' );
    characterOptional.anchor.setTo( ANCHOR_X , ANCHOR_Y );
    character_healthOptional = DEFAULT_CHARACTER_HEALTH;
    canReceiveDamageOptional = true;
    
    game.physics.arcade.enable( characterOptional );
    sprintEnabled = true;
    sprintLeft = TOTAL_SPRINT;
    canDash = true;
    isDashingOptional = false;

    // SET UP THE CAMERA THAT FOLLOWS THE CHARACTER
    game.camera.follow( characterOptional );

    // SET UP THE WEAPON FOR THE CHARACTER
    pistol = new Weapon( DEFAULT_NUMBER_BULLETS , 'bullets' , BULLET_KILL_DISTANCE , BULLET_SPEED , FIRE_RATE , BULLET_ANGLE_VARIANCE , 'pistol' , 10 );
    shotgun = new Weapon( 8 , 'buckshot' , BULLET_KILL_DISTANCE / 2 , BULLET_SPEED / 1.5 , 0 , 40 , 'shotgun' , 5 );
    bow = new Weapon( 3 , 'arrow' , BULLET_KILL_DISTANCE * 3 , BULLET_SPEED / 2 , FIRE_RATE / 2 , BULLET_ANGLE_VARIANCE + 10 , 'bow' , 4 );

    btnInteract = game.add.sprite( 1200 , 1150 , 'btnE' );
    btnInteract.anchor.setTo( 0.5 , 0.5 );
    btnInteract.visible = false;
    inkBagsDropSwitchOptional = true;

    weaponSelected = 0;
    hasBow = false;
    hasShotgun = false;

    canSwitchBetweenWeapons = true;

    advancedEnemiesGroup = game.add.group();
    advancedEnemiesGroup.enableBody = true;
}

function CreateHUDOptional ()
{
    hudGroup = game.add.group(); // GROUP FOR THE HUD
    sprintBar = hudGroup.create( SPRINT_BAR_X , SPRINT_BAR_Y , 'sprintBar' ); // SPRINT BAR
    sprintBar.anchor.setTo( HUD_ANCHOR_X , HUD_ANCHOR_Y ); // ANCHOR THE SPRINT BAR
    sprintHolder = hudGroup.create( SPRINT_BAR_X , SPRINT_BAR_Y , 'sprintHolder' ); // SPRINT HOLDER
    sprintHolder.anchor.setTo( HUD_ANCHOR_X , HUD_ANCHOR_Y ); // ANCHOR THE SPRINT HOLDER
    checkDash = hudGroup.create( DASH_INDICATOR_X , DASH_INDICATOR_Y , 'check_dash' ); // CHECK DASH
    checkDash.visible = false; // HIDE THE CHECK DASH
    checkDash.anchor.setTo( HUD_ANCHOR_X , HUD_ANCHOR_Y ); // ANCHOR THE CHECK DASH
    lifeTweenOptional = hudGroup.create( 5 , 50 , 'life_bar' );
    lifeTweenOptional.anchor.setTo( ANCHOR_X_LIFEBAR , ANCHOR_Y_LIFEBAR );
    lifeTweenOptional.rotation = Phaser.Math.degToRad( FIXED_ANGLE );
    life_holder = hudGroup.create( 5 , 50 , 'sprintHolder' );
    life_holder.anchor.setTo( ANCHOR_X_LIFEBAR , ANCHOR_Y_LIFEBAR );
    life_holder.rotation = Phaser.Math.degToRad( FIXED_ANGLE );

    outOfAmmoText = game.add.text( 590 , 10 , "OUT OF AMMO" , { font: "30px Kalam" , fill: "#000000" } );
    outOfAmmoText.visible = false;

    hudGroup.add(outOfAmmoText);

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

function UpdateCharacterOptional () // UPDATE THE CHARACTER FUNCTIONALITY
{
    CheckBounds(); // CHECKS IF THE CHARACTER IS WITHIN THE BOUNDS OF THE WORLD
    CheckDash(); // CHECKS IF THE CHARACTER DASHES
    CheckMovement(); // CHECKS IF THE CHARACTER MOVES
    RotateTowardsMouse(); // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR

    switch ( weaponSelected )
    {
        case 0:
            characterOptional.loadTexture( 'player_pistol' , 0 );
            pistol.Shoot();
            break;
        case 1:
            characterOptional.loadTexture( 'player_shotgun' , 0 );
            shotgun.Shoot();
            break;
        case 2:
            characterOptional.loadTexture( 'player_bow' , 0 );
            bow.Shoot();
            break;
        default:
            break;
    }

    btnInteract.x = characterOptional.x;
    btnInteract.y = characterOptional.y - 60;

    if ( character_healthOptional <= 0 )
    {
        game.state.start('endscreen');
    }

    inkBagsOptional.forEach( InkBagFollowsCharacter , this );

    if ( game.physics.arcade.distanceBetween( characterOptional , shine_raeOptional ) < DISTANCE_DETECTION_RAE )
    {
        btnInteract.visible = true;

        setTimeout( function() {
            btnInteract.visible = false;
        }, 1000 );

        if ( game.input.keyboard.isDown( Phaser.Keyboard.E ) )
        {
            game.state.start('win');
        }
    }

    if ( needsToReload )
    {
        outOfAmmoText.visible = true;
    }
    else
    {
        outOfAmmoText.visible = false;
    }

    advancedEnemiesGroup.forEach( RotateAdvancedEnemies , this );
}

function RotateAdvancedEnemies (enemy)
{
    if ( game.physics.arcade.distanceBetween( enemy , characterOptional ) < DISTANCE_DETECTION_ENEMY * 2 )
    {
        let angle = game.physics.arcade.angleBetween( enemy , characterOptional );
        enemy.rotation = angle;
    }
}

function InkBagFollowsCharacter ( inkBag )
{
    if ( game.physics.arcade.distanceBetween( characterOptional , inkBag ) < DISTANCE_DETECTION_INKBAG )
    {
        game.physics.arcade.moveToObject( inkBag , characterOptional , 200 );
    }
    else
    {
        inkBag.body.velocity.x = 0;
        inkBag.body.velocity.y = 0;
    }
}

function CheckDash () // DASH FUNCTIONALITY
{
    let wantsToDash = game.input.keyboard.isDown( Phaser.Keyboard.SPACEBAR );

    if ( wantsToDash && canDash )
    {
        isDashingOptional = true;
        canDash = false;

        setTimeout( function() {
            isDashingOptional = false;
            setTimeout( function() {
                canDash = true;
            }, DASH_COOLDOWN * 1000 ); // WE MULTIPLY BY 1000 TO GET DASH COOLDOWN IN SECONDS
        }, DASH_DURATION * 1000 ); // WE MULTIPLY BY 1000 TO GET DASH DURATION IN SECONDS
    }

    canDash ? checkDash.visible = true : checkDash.visible = false; // SHOW THE CHECK DASH IF THE CHARACTER CAN DASH
}

function CheckSprint ( direction ) // SPRINT FUNCTIONALITY
{
    let movementMultiplier = isDashingOptional ? DASH_MULTIPLIER : 1; // IF THE CHARACTER IS DASHING, MULTIPLY THE SPEED BY THE DASH MULTIPLIER
    let canSprint = sprintEnabled && game.input.keyboard.isDown( Phaser.Keyboard.SHIFT );

    if ( direction == 'left' )
    {
        canSprint ? characterOptional.body.velocity.x = -SPRINT_SPEED * movementMultiplier : characterOptional.body.velocity.x = -CHARACTER_SPEED * movementMultiplier; // SPRINT LEFTWARDS
    }
    else if ( direction == 'right' )
    {
        canSprint ? characterOptional.body.velocity.x = SPRINT_SPEED * movementMultiplier : characterOptional.body.velocity.x = CHARACTER_SPEED * movementMultiplier; // SPRINT RIGHTWARDS
    }

    if ( direction == 'up' )
    {
        canSprint ? characterOptional.body.velocity.y = -SPRINT_SPEED * movementMultiplier : characterOptional.body.velocity.y = -CHARACTER_SPEED * movementMultiplier; // SPRINT UPWARDS
    }
    else if ( direction == 'down' )
    {
        canSprint ? characterOptional.body.velocity.y = SPRINT_SPEED * movementMultiplier : characterOptional.body.velocity.y = CHARACTER_SPEED * movementMultiplier; // SPRINT DOWNWARDS
    }

    if ( canSprint )
    {
        Sprint();
    }
}

function SmoothStopping ( x , timeToStop ) // GRADUALLY DECREASE THE SPEED OF THE CHARACTER. IT MAKES THE MOVEMENT SMOOTHER
{
    let timer = x ? xTimerOptional : yTimerOptional; // IT CHOOSES THE TIMER TO USE
    let axis = x ? 'x' : 'y'; // IT CHOOSES THE AXIS TO STOP
    let decreaseAmount = characterOptional.body.velocity[ axis ] / ( timeToStop * FPS );

    timer.loop( 1 / 60 * 1000 , // 1/60 * 1000 TO CONVERT SECONDS TO MILLISECONDS
        function() { 
        characterOptional.body.velocity[ axis ] -= decreaseAmount; // DECREASE THE VELOCITY ALONG THE SPECIFIED AXIS

        // CHECKS IF THE ABSOLUTE VALUE OF THE VELOCITY OF A CHARACTER ALONG A SPECIFIC AXIS IS LESS THAN THE ABSOLUTE VALUE OF A SPECIFIED DECREASE AMOUNT
        let isStopped = Math.abs( characterOptional.body.velocity[ axis ] ) < Math.abs( decreaseAmount );

        if ( isStopped )
        {
            characterOptional.body.velocity[ axis ] = 0;
            timer.stop();
        }
    } , this );

    timer.start();
}

function RotateTowardsMouse () // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
{
    let angle = game.physics.arcade.angleToPointer( characterOptional ); // GET THE ANGLE BETWEEN THE CHARACTER AND THE MOUSE CURSOR
    characterOptional.rotation = angle + Phaser.Math.degToRad( FIXED_ANGLE ); // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
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
    if ( characterOptional.x < 0 ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        characterOptional.x = 0;
    }
    else if ( characterOptional.x > WORLD_WIDTH ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        characterOptional.x = WORLD_WIDTH;
    }

    if ( characterOptional.y < 0 ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        characterOptional.y = 0;
    }
    else if ( characterOptional.y > WORLD_HEIGHT ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        characterOptional.y = WORLD_HEIGHT;
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
        xTimerOptional.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else if ( canMoveRightwards )
    {
        CheckSprint( 'right' ); // CHECKS IF THE CHARACTER SPRINTS TO THE RIGHT
        xTimerOptional.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else // NO HORIZONTAL MOVEMENT KEY IS PRESSED
    {
        // START THE COROUTINE TO GRADUALLY DECREASE THE SPEED
        SmoothStopping( true , TIME_TO_STOP ); // THE SECOND PARAMETER IS THE TIME TO STOP IN SECONDS
    }

    if ( canMoveUpwards  )
    {
        CheckSprint( 'up' ); // CHECKS IF THE CHARACTER SPRINTS TO THE LEFT
        yTimerOptional.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else if ( canMoveDownwards )
    {
        CheckSprint( 'down' ); // CHECKS IF THE CHARACTER SPRINTS TO THE LEFT
        yTimerOptional.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else
    {
        // START THE COROUTINE TO GRADUALLY DECREASE THE SPEED
        SmoothStopping( false , TIME_TO_STOP ); // THE FIRST PARAMETER IS A BOOL THAT CHECKS WHETHER IT IS A HORIZONTAL INPUT OR NOT, AND THE SECOND PARAMETER IS THE TIME TO STOP IN SECONDS
    }
}