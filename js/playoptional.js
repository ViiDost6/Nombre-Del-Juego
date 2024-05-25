/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTANTS, GLOBAL VARIABLES AND PHASES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let playOptionalState = { // GAME PHASES
    preload: PreloadPlayOptional,
    create: CreatePlayOptional,
    update: UpdatePlayOptional
};

// NORMAL CONSTANTS

const BULLET_SPRITE_X_OPTIONAL = 26 ,
BULLET_SPRITE_Y_OPTIONAL = 25 , 
WORLD_WIDTH_OPTIONAL = 2400 ,
WORLD_HEIGHT_OPTIONAL = 2400 , 
SCROLL_FACTOR_OPTIONAL = 0.7 , 
DEFAULT_CHARACTER_HEALTH_OPTIONAL = 100 , 
TIMER_BASIC_ENEMY_SPAWN_OPTIONAL = 1 * Phaser.Timer.SECOND ,
WORLD_CENTER_X_OPTIONAL = WORLD_WIDTH_OPTIONAL / 2 , 
RAE_Y_OPTIONAL = 300 , 
BULLET_KILL_DISTANCE_OPTIONAL = 300 , 
BULLET_SPEED_OPTIONAL = 700 , 
FIRE_RATE_OPTIONAL = 100 , 
BULLET_ANGLE_VARIANCE_OPTIONAL = 20 , 
TOTAL_SPRINT_OPTIONAL = 500 , 
DISTANCE_DETECTION_RAE_OPTIONAL = 150 , 
DISTANCE_DETECTION_ENEMY_OPTIONAL = 200 , 
DISTANCE_DETECTION_INKBAG_OPTIONAL = 100 , 
DASH_COOLDOWN_OPTIONAL = 1.5 ,
DASH_DURATION_OPTIONAL = 0.15 , 
DASH_MULTIPLIER_OPTIONAL = 5 , 
SPRINT_SPEED_OPTIONAL = 450 , 
CHARACTER_SPEED_OPTIONAL = 150 , 
SPRINT_COOLDOWN_OPTIONAL = 2.5;

let characterOptional , xTimerOptional , yTimerOptional , character_healthOptional , sprintEnabledOptional , 
sprintLeftOptional , canDashOptional , isDashingOptional , timeOptional , shine_raeOptional , totalBlackTintOptional , 
black_tint_counterOptional , inkBagsOptional , basicEnemiesOptional , advancedEnemiesOptional , pistolOptional ,
shotgunOptional , bowOptional , weaponSelectedOptional , canReceiveDamageOptional , inkBagsDropSwitchOptional , 
lifeTweenOptional , spawnEnemiesOptional , raeOptional , raeGroupOptional , btnInteractOptional , hudGroupOptional , 
sprintBarOptional , sprintHolderOptional , checkDashOptional , life_holderOptional , outOfAmmoTextOptional , 
sprintTweenOptional , life_barOptional , maxAdvancedEnemiesOptional , currentAdvancedEnemiesOptional , enemy1Optional ,
enemy2Optional , enemy3Optional , enemy4Optional , enemy5Optional , enemy6Optional , enemy7Optional , enemy8Optional ,
enemy9Optional , enemy10Optional , enemy11Optional , enemy12Optional , timeRemainingOptional , black_tint , timeRemainingText , 
numberOfBlackInkBags, flamethrowerOptional, grenadeOptional, mineOptional, lanceOptional , timeUntilNextWeaponOptional;

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

    console.log( currentAdvancedEnemiesOptional );
}

function UpdateSpritesOptional ()
{
    // Increase time
    timeOptional += game.time.elapsed;

    // Calculate new scale and position
    let newScale = 3 + 1.5 * Math.sin(timeOptional / 2000); // Reduced from 0.1 to 0.01

    // Apply new scale and position
    shine_raeOptional.scale.set(newScale);
}

function UpdateRotationsOptional ()
{
    basicEnemiesOptional.forEach( RotateSingleEnemyOptional , this );
}

function RotateSingleEnemyOptional ( enemy )
{
    let angle = game.physics.arcade.angleBetween( enemy , characterOptional ); // GET THE ANGLE BETWEEN THE CHARACTER AND THE MOUSE CURSOR
    enemy.rotation = angle + Phaser.Math.degToRad( FIXED_ANGLE ); // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
}

function UpdateCollisionsOptional ()
{
    game.physics.arcade.collide(characterOptional, raeOptional);

    // MAKE THE BULLETS COLLIDE WITH THE ENEMIES
    game.physics.arcade.overlap(flamethrowerOptional.core.bullets, basicEnemiesOptional, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBagOptional( enemy );
        BlastAnimationOptional( enemy );
    });

    game.physics.arcade.overlap(lanceOptional.core.bullets, basicEnemiesOptional, function(bullet, enemy) {
        enemy.kill();
        DropInkBagOptional( enemy );
        BlastAnimationOptional( enemy );
    });

    game.physics.arcade.collide(flamethrowerOptional.core.bullets, advancedEnemiesOptional, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        currentAdvancedEnemiesOptional--;
        DropInkBagOptional( enemy );
        BlastAnimationOptional( enemy );
    });

    game.physics.arcade.collide(lanceOptional.core.bullets, advancedEnemiesOptional, function(bullet, enemy) {
        enemy.kill();
        currentAdvancedEnemiesOptional--;
        DropInkBagOptional( enemy );
        BlastAnimationOptional( enemy );
    });

    mineOptional.core.bullets.forEach( function(bullet) {
        basicEnemiesOptional.forEach( function(enemy) {
            game.physics.arcade.overlap(bullet, enemy, function(bullet, enemy) {
                bullet.kill();
                enemy.kill();
                DropInkBagOptional( enemy );
                BlastAnimationOptional( enemy );

                basicEnemiesOptional.forEach( function(enemy) {
                    if ( game.physics.arcade.distanceBetween( enemy , bullet ) < 150 )
                    {
                        enemy.kill();
                        DropInkBagOptional( enemy );
                        BlastAnimationOptional( enemy );
                    }
                });

                advancedEnemiesOptional.forEach( function(enemy) {
                    if ( game.physics.arcade.distanceBetween( enemy , bullet ) < 150 )
                    {
                        enemy.kill();
                        currentAdvancedEnemiesOptional--;
                        DropInkBagOptional( enemy );
                        BlastAnimationOptional( enemy );
                    }
                });
            });
        });

        advancedEnemiesOptional.forEach( function(enemy) {
            game.physics.arcade.overlap(bullet, enemy, function(bullet, enemy) {
                bullet.kill();
                enemy.kill();
                currentAdvancedEnemiesOptional--;
                DropInkBagOptional( enemy );
                BlastAnimationOptional( enemy );

                basicEnemiesOptional.forEach( function(enemy) {
                    if ( game.physics.arcade.distanceBetween( enemy , bullet ) < 150 )
                    {
                        enemy.kill();
                        DropInkBagOptional( enemy );
                        BlastAnimationOptional( enemy );
                    }
                });

                advancedEnemiesOptional.forEach( function(enemy) {
                    if ( game.physics.arcade.distanceBetween( enemy , bullet ) < 150 )
                    {
                        enemy.kill();
                        currentAdvancedEnemiesOptional--;
                        DropInkBagOptional( enemy );
                        BlastAnimationOptional( enemy );
                    }
                });
            });
        });
    });

    grenadeOptional.core.onKill.add(GrenadeExplodes, this);

    // MAKE THE CHARACTER COLLIDE WITH THE ENEMIES
    basicEnemiesOptional.forEach( EnemyCollideWithCharacterOptional , this );
    advancedEnemiesOptional.forEach( EnemyCollideWithCharacterOptional , this );

    // MAKE THE INKBAGS COLLIDE WITH THE CHARACTER
    inkBagsOptional.forEach( InkBagCollideWithCharacterOptional , this );

    game.physics.arcade.overlap(enemy1Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy2Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy3Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy4Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy5Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy6Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy7Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy8Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy9Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy10Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy11Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });

    game.physics.arcade.overlap(enemy12Optional.enemyWeaponOptional.bullets, characterOptional, function(characterOptional,bullet) {
        bullet.kill();
        if ( canReceiveDamageOptional )
        {
            character_healthOptional -= 10;
            canReceiveDamageOptional = false;
            setTimeout( function() {
                canReceiveDamageOptional = true;
            }, 1000 );

            // Update the life bar
            if ( lifeTweenOptional )
            {
                lifeTweenOptional.stop();
            }

            let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;

            lifeTweenOptional = game.add.tween(life_barOptional.scale).to({
                y: newHealth // Assuming the full scale on y-axis represents the bar being completely filled
            }, 1000, Phaser.Easing.Linear.None, true);

            lifeTweenOptional.start();
        }
        ClackAnimationOptional( characterOptional );
    });
}

function GrenadeExplodes ( bullet )
{
    basicEnemiesOptional.forEach( function(enemy) {
        if ( game.physics.arcade.distanceBetween( enemy , bullet ) < 150 )
        {
            enemy.kill();
            DropInkBagOptional( enemy );
            BlastAnimationOptional( enemy );
        }
    });

    advancedEnemiesOptional.forEach( function(enemy) {
        if ( game.physics.arcade.distanceBetween( enemy , bullet ) < 150 )
        {
            enemy.kill();
            currentAdvancedEnemiesOptional--;
            DropInkBagOptional( enemy );
            BlastAnimationOptional( enemy );
        }
    });
}

function BlastAnimationOptional ( enemy )
{
    let blast = game.add.sprite( enemy.x , enemy.y , 'bamOptional' );
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
    let clack = game.add.sprite( characterOptional.x , characterOptional.y , 'clackOptional' );
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
        totalBlackTintOptional += 100;
        black_tint_counterOptional.text = totalBlackTintOptional;
        inkBag.kill();
        if ( ++numberOfBlackInkBags == 2 )
        {
            timeRemainingOptional++;
            numberOfBlackInkBags = 0;
        }
    });
}

function DropInkBagOptional ( enemy )
{
    let inkBag;

    inkBag = inkBagsOptional.create(enemy.x, enemy.y, 'black_tintOptional');

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
                inkBagsDropSwitchOptional ? DropInkBagOptional( enemy ) : null;
                inkBagsDropSwitchOptional = false;
            }, this);

            if ( ! isDashingOptional )
            {
                // Update the life bar
                if ( lifeTweenOptional )
                {
                    lifeTweenOptional.stop();
                }
    
                let newHealth = character_healthOptional / DEFAULT_CHARACTER_HEALTH_OPTIONAL;
        
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
    advancedEnemiesOptional = game.add.group();
    advancedEnemiesOptional.enableBody = true;
    spawnEnemiesOptional = new SpawnerBasicEnemyOptional( 'basicEnemyOptional' );

    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN_OPTIONAL , spawnEnemiesOptional.SpawnEnemies , this );
    
    let randomLocationsX = [];
    let randomLocationsY = [];

    for ( let i = 0 ; i < 12 ; i++ )
    {
        let possibleXCoordinates = WORLD_WIDTH_OPTIONAL - 50;
        let xRandomSpawnCoordinate = Math.floor( Math.random() * possibleXCoordinates );
        let xSpawnCoordinate = 50 / 2 + xRandomSpawnCoordinate;

        randomLocationsX.push( xSpawnCoordinate );
    }

    for ( let i = 0 ; i < 12 ; i++ )
    {
        let possibleYCoordinates = WORLD_HEIGHT_OPTIONAL - 70;
        let yRandomSpawnCoordinate = Math.floor( Math.random() * possibleYCoordinates );
        let ySpawnCoordinate = 70 / 2 + yRandomSpawnCoordinate;

        randomLocationsY.push( ySpawnCoordinate );
    }

    enemy1Optional = new AdvancedEnemyOptional( randomLocationsX[0] , randomLocationsY[0] , 'grapadoraOptional' , 'grapasOptional' );
    enemy1Optional.sprite.kill();
    enemy2Optional = new AdvancedEnemyOptional( randomLocationsX[1] , randomLocationsY[1] , 'grapadoraOptional' , 'grapasOptional' );
    enemy2Optional.sprite.kill();
    enemy3Optional = new AdvancedEnemyOptional( randomLocationsX[2] , randomLocationsY[2] , 'grapadoraOptional' , 'grapasOptional' );
    enemy3Optional.sprite.kill();
    enemy4Optional = new AdvancedEnemyOptional( randomLocationsX[3] , randomLocationsY[3] , 'grapadoraOptional' , 'grapasOptional' );
    enemy4Optional.sprite.kill();
    enemy5Optional = new AdvancedEnemyOptional( randomLocationsX[4] , randomLocationsY[4] , 'grapadoraOptional' , 'grapasOptional' );
    enemy5Optional.sprite.kill();
    enemy6Optional = new AdvancedEnemyOptional( randomLocationsX[5] , randomLocationsY[5] , 'grapadoraOptional' , 'grapasOptional' );
    enemy6Optional.sprite.kill();
    enemy7Optional = new AdvancedEnemyOptional( randomLocationsX[6] , randomLocationsY[6] , 'grapadoraOptional' , 'grapasOptional' );
    enemy7Optional.sprite.kill();
    enemy8Optional = new AdvancedEnemyOptional( randomLocationsX[7] , randomLocationsY[7] , 'grapadoraOptional' , 'grapasOptional' );
    enemy8Optional.sprite.kill();
    enemy9Optional = new AdvancedEnemyOptional( randomLocationsX[8] , randomLocationsY[8] , 'grapadoraOptional' , 'grapasOptional' );
    enemy9Optional.sprite.kill();
    enemy10Optional = new AdvancedEnemyOptional( randomLocationsX[9] , randomLocationsY[9] , 'grapadoraOptional' , 'grapasOptional' );
    enemy10Optional.sprite.kill();
    enemy11Optional = new AdvancedEnemyOptional( randomLocationsX[10] , randomLocationsY[10] , 'grapadoraOptional' , 'grapasOptional' );
    enemy11Optional.sprite.kill();
    enemy12Optional = new AdvancedEnemyOptional( randomLocationsX[11] , randomLocationsY[11] , 'grapadoraOptional' , 'grapasOptional' );
    enemy12Optional.sprite.kill();

    setInterval( UpdateEnemiesOptional , 1000 );

    setInterval( RespawnAdvancedEnemiesOptional , 5000 );

    inkBagsOptional = game.add.group();
    inkBagsOptional.enableBody = true;

    shine_raeOptional = game.add.sprite( WORLD_CENTER_X_OPTIONAL , RAE_Y_OPTIONAL , 'shine_raeOptional' );
    shine_raeOptional.anchor.setTo( 0.5 );
    shine_raeOptional.scale.setTo( 2 );

    raeGroupOptional = game.add.group();
    raeGroupOptional.enableBody = true;
    raeOptional = raeGroupOptional.create( WORLD_CENTER_X_OPTIONAL , RAE_Y_OPTIONAL , 'raeOptional' );
    raeOptional.anchor.setTo( 0.5 );
    raeOptional.body.immovable = true;

    timeOptional = 0;
}

function RespawnAdvancedEnemiesOptional ()
{
    if ( currentAdvancedEnemiesOptional < maxAdvancedEnemiesOptional )
    {
        let xSpawnCoordinate , ySpawnCoordinate;
        do
        {
            let possibleXCoordinate = WORLD_WIDTH_OPTIONAL - 50;
            let xRandomSpawnCoordinate = Math.floor( Math.random() * possibleXCoordinate );
            xSpawnCoordinate = 50 / 2 + xRandomSpawnCoordinate;

            let possibleYCoordinates = WORLD_HEIGHT_OPTIONAL - 70;
            let yRandomSpawnCoordinate = Math.floor( Math.random() * possibleYCoordinates );
            ySpawnCoordinate = 70 / 2 + yRandomSpawnCoordinate;
        } while ( game.physics.arcade.distanceBetween( characterOptional , { x: xSpawnCoordinate , y: ySpawnCoordinate } ) < 100 );

        let randomEnemy = Math.floor( Math.random() * 12 );

        switch ( randomEnemy )
        {
            case 0:
                enemy1Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 1:
                enemy2Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 2:
                enemy3Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 3:
                enemy4Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 4:
                enemy5Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 5:
                enemy6Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 6:
                enemy7Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 7:
                enemy8Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 8:
                enemy9Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 9:
                enemy10Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 10:
                enemy11Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            case 11:
                enemy12Optional.sprite.revive( xSpawnCoordinate , ySpawnCoordinate );
                break;
            default:
                break;
        }

        console.log( "enemy revived at: " + xSpawnCoordinate + " , " + ySpawnCoordinate);

        currentAdvancedEnemiesOptional++;
    }
}


function CreateTimersOptional ()
{
    xTimerOptional = game.time.create( false );
    yTimerOptional = game.time.create( false );
}

function CreateImagesOptional ()
{
    game.load.image( 'playerOptional' , 'assets/imgs/Base_Player.png' );
    game.load.image( 'backgroundOptional' , 'assets/imgs/Extramap.png' );
    game.load.image( 'sprintHolderOptional' , 'assets/imgs/sprint_holder.png' );
    game.load.image( 'sprintBarOptional' , 'assets/imgs/sprint_bar.png' );
    game.load.image( 'check_dashOptional' , 'assets/imgs/check_dash.png' );
    game.load.spritesheet( 'bulletsOptional' , 'assets/imgs/bullet.png' , BULLET_SPRITE_X_OPTIONAL , BULLET_SPRITE_Y_OPTIONAL );
    game.load.image( 'basicEnemyOptional' , 'assets/imgs/Base_PlayerDirty.png' );
    game.load.image( 'life_barOptional' , 'assets/imgs/life_bar.png' );
    game.load.image( 'black_tintOptional' , 'assets/imgs/BlackInk.png' );
    game.load.image( 'btnEOptional' , 'assets/imgs/btnE.png' );
    game.load.image( 'bamOptional' , 'assets/imgs/bam.png' );
    game.load.image( 'raeOptional' , 'assets/imgs/santa_rae.png' );
    game.load.image( 'shine_raeOptional' , 'assets/imgs/shine.png' );
    game.load.image( 'player_pistolOptional' , 'assets/imgs/PlayerPistol.png' );
    game.load.spritesheet( 'buckshotOptional' , 'assets/imgs/buckshot.png' , BULLET_SPRITE_X_OPTIONAL , BULLET_SPRITE_Y_OPTIONAL );
    game.load.image( 'player_shotgunOptional' , 'assets/imgs/PlayerShotgun.png' );
    game.load.image( 'arrowOptional' , 'assets/imgs/arrow.png' );
    game.load.image( 'player_bowOptional' , 'assets/imgs/PlayerBow.png' );
    game.load.image( 'grapadoraOptional' , 'assets/imgs/Grapa.png' );
    game.load.image( 'grapasOptional' , 'assets/imgs/Dora.png' );
    game.load.image( 'clackOptional' , 'assets/imgs/Clack.png' );
    game.load.image( 'lanceOptional' , 'assets/imgs/lance.png' );
    game.load.spritesheet( 'flameOptional' , 'assets/imgs/flame.png' , BULLET_SPRITE_X_OPTIONAL , BULLET_SPRITE_Y_OPTIONAL);
    game.load.image( 'player_flamethrowerOptional' , 'assets/imgs/PlayerFlamethrower.png' );
    game.load.image( 'grenadeOptional' , 'assets/imgs/grenade.png' );
    game.load.image( 'player_grenadeOptional' , 'assets/imgs/PlayerGrenade.png' );
    game.load.image( 'mineOptional' , 'assets/imgs/landmine.png' );
    game.load.image( 'player_mineOptional' , 'assets/imgs/PlayerLandmine.png' );
    game.load.image( 'player_lanceOptional' , 'assets/imgs/PlayerLance.png' );

}

function CreateBackgroundOptional ()
{
    game.world.setBounds(0, 0, WORLD_WIDTH_OPTIONAL, WORLD_HEIGHT_OPTIONAL);

    // SMOOTH SCROLLING
    let background = game.add.tileSprite( 0 , 0 , game.world.width , game.world.height , 'backgroundOptional' );
    background.scrollFactorX = SCROLL_FACTOR_OPTIONAL;
    background.scrollFactorY = SCROLL_FACTOR_OPTIONAL;
}

function CreateCharacterOptional ()
{
    characterOptional = game.add.sprite( 1200 , 1200 , 'player_pistol' );
    characterOptional.anchor.setTo( 0.5 );
    character_healthOptional = DEFAULT_CHARACTER_HEALTH * 10;
    canReceiveDamageOptional = true;
    
    game.physics.arcade.enable( characterOptional );
    sprintEnabledOptional = true;
    sprintLeftOptional = TOTAL_SPRINT;
    canDashOptional = true;
    isDashingOptional = false;

    // SET UP THE CAMERA THAT FOLLOWS THE CHARACTER
    game.camera.follow( characterOptional );

    flamethrowerOptional = new OptionalWeapons( 5 , 'flameOptional' , BULLET_KILL_DISTANCE_OPTIONAL/ 2 , BULLET_SPEED_OPTIONAL / 2 , FIRE_RATE_OPTIONAL , BULLET_ANGLE_VARIANCE_OPTIONAL - 10 , 'flamethrower' , 999 );

    grenadeOptional = new OptionalWeapons( 1 , 'grenadeOptional' , BULLET_KILL_DISTANCE_OPTIONAL , BULLET_SPEED_OPTIONAL/2 , 0 , 0 , 'grenade' , 999 );

    mineOptional = new OptionalWeapons( 7 , 'mineOptional' , BULLET_KILL_DISTANCE_OPTIONAL , BULLET_SPEED_OPTIONAL , FIRE_RATE_OPTIONAL *4 , 0 , 'mine' , 999 );

    lanceOptional = new OptionalWeapons( 1 , 'lanceOptional' , BULLET_KILL_DISTANCE_OPTIONAL *2, BULLET_SPEED_OPTIONAL , 0 , 0 , 'lance' , 999 );

    btnInteractOptional = game.add.sprite( 1200 , 1150 , 'btnEOptional' );
    btnInteractOptional.anchor.setTo( 0.5 , 0.5 );
    btnInteractOptional.visible = false;
    inkBagsDropSwitchOptional = true;

    weaponSelectedOptional = 0;

    maxAdvancedEnemiesOptional = 5;
    currentAdvancedEnemiesOptional = 0;

    isNotInSafeZone = true;

    timeRemainingOptional = 60;

    totalBlackTintOptional = 0;

    numberOfBlackInkBags = 0;

    timeUntilNextWeaponOptional = 10;
}

function CreateHUDOptional ()
{
    hudGroupOptional = game.add.group(); // GROUP FOR THE HUD
    sprintBarOptional = hudGroupOptional.create( SPRINT_BAR_X , SPRINT_BAR_Y , 'sprintBarOptional' ); // SPRINT BAR
    sprintBarOptional.anchor.setTo( HUD_ANCHOR_X , HUD_ANCHOR_Y ); // ANCHOR THE SPRINT BAR
    sprintHolderOptional = hudGroupOptional.create( SPRINT_BAR_X , SPRINT_BAR_Y , 'sprintHolderOptional' ); // SPRINT HOLDER
    sprintHolderOptional.anchor.setTo( HUD_ANCHOR_X , HUD_ANCHOR_Y ); // ANCHOR THE SPRINT HOLDER
    checkDashOptional = hudGroupOptional.create( DASH_INDICATOR_X , DASH_INDICATOR_Y , 'check_dashOptional' ); // CHECK DASH
    checkDashOptional.visible = false; // HIDE THE CHECK DASH
    checkDashOptional.anchor.setTo( HUD_ANCHOR_X , HUD_ANCHOR_Y ); // ANCHOR THE CHECK DASH
    life_barOptional = hudGroupOptional.create( 5 , 50 , 'life_barOptional' );
    life_barOptional.anchor.setTo( ANCHOR_X_LIFEBAR , ANCHOR_Y_LIFEBAR );
    life_barOptional.rotation = Phaser.Math.degToRad( FIXED_ANGLE );
    life_holderOptional = hudGroupOptional.create( 5 , 50 , 'sprintHolderOptional' );
    life_holderOptional.anchor.setTo( ANCHOR_X_LIFEBAR , ANCHOR_Y_LIFEBAR );
    life_holderOptional.rotation = Phaser.Math.degToRad( FIXED_ANGLE );
    black_tint = hudGroupOptional.create( SPRINT_BAR_X + 65 , SPRINT_BAR_Y - 25 , 'black_tintOptional' );
    black_tint.anchor.setTo( 0.5 );

    black_tint_counterOptional = game.add.text( black_tint.x + 20 , black_tint.y - 17 , totalBlackTintOptional , { font: '30px Kalam' , fill: '#000000' } );

    timeRemainingText = game.add.text( 275 , 10 , "TIME REMAINING: " + timeRemainingOptional + "s" , { font: "30px Kalam" , fill: "#000000" } );

    hudGroupOptional.add( black_tint_counterOptional );
    hudGroupOptional.add( timeRemainingText );

    hudGroupOptional.fixedToCamera = true; // FIX THE HUD TO THE CAMERA
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HUD FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function UpdateSprintBarOptional ()
{
    sprintBarOptional.scale.y = sprintLeftOptional / TOTAL_SPRINT_OPTIONAL; // SCALE THE SPRINT BAR
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MOVEMENT FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function UpdateCharacterOptional () // UPDATE THE CHARACTER FUNCTIONALITY
{
    CheckBoundsOptional(); // CHECKS IF THE CHARACTER IS WITHIN THE BOUNDS OF THE WORLD
    CheckDashOptional(); // CHECKS IF THE CHARACTER DASHES
    CheckMovementOptional(); // CHECKS IF THE CHARACTER MOVES
    RotateTowardsMouseOptional(); // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR

    switch ( weaponSelectedOptional )
    {
        case 0:
            characterOptional.loadTexture( 'player_flamethrowerOptional' , 0 );
            flamethrowerOptional.shootFlame();
            break;
        case 1:
            characterOptional.loadTexture( 'player_grenadeOptional' , 0 );
            grenadeOptional.shootGrenade();
            break;
        case 2:
            characterOptional.loadTexture( 'player_mineOptional' , 0 );
            mineOptional.shootMine();
            break;
        case 3:
            lanceOptional.lanceisback ? characterOptional.loadTexture( 'player_lanceOptional' , 0 ) : characterOptional.loadTexture( 'playerOptional' , 0 );
            lanceOptional.shootLance();
            break;
        default:
            break;
    }

    btnInteractOptional.x = characterOptional.x;
    btnInteractOptional.y = characterOptional.y - 60;

    if ( character_healthOptional <= 0 )
    {
        game.state.start('endscreen');
    }

    inkBagsOptional.forEach( InkBagFollowsCharacterOptional , this );

    if ( game.physics.arcade.distanceBetween( characterOptional , shine_raeOptional ) < DISTANCE_DETECTION_RAE_OPTIONAL )
    {
        btnInteractOptional.visible = true;

        setTimeout( function() {
            btnInteractOptional.visible = false;
        }, 1000 );

        if ( game.input.keyboard.isDown( Phaser.Keyboard.E ) )
        {
            game.state.start('win'); // game.state.start('winOptional');
        }
    }

    advancedEnemiesOptional.forEach( RotateAdvancedEnemiesOptional , this );

    timeRemainingOptional -= game.time.elapsed / 1000;
    timeUntilNextWeaponOptional -= game.time.elapsed / 1000;
    timeRemainingText.text = "TIME REMAINING: " + Math.ceil( timeRemainingOptional ) + "s";

    if ( timeRemainingOptional <= 0 )
    {
        game.state.start('endscreen');
    }

    if ( timeUntilNextWeaponOptional <= 0 )
    {
        weaponSelectedOptional = Math.floor( Math.random() * 4 );
        if ( weaponSelectedOptional == 3 )
        {
            lanceOptional.lanceisback = true;
            lanceOptional.lancedistance = 0;
            lanceOptional.lanceiscoming = false;
            lanceOptional.changed = false;
        }
        timeUntilNextWeaponOptional = 10;
    }

    if ( weaponSelectedOptional == 3 && lanceOptional.lanceiscoming )
    {
        game.physics.arcade.overlap( characterOptional , lanceOptional.core.bullets , function(characterOptional,bullet) {
            bullet.kill();
            lanceOptional.lanceisback = true;
            lanceOptional.lanceiscoming = false;
            lanceOptional.changed = false;
        });
    }
}

function RotateAdvancedEnemiesOptional (enemy)
{
    let angle = game.physics.arcade.angleBetween( enemy , characterOptional );
    enemy.rotation = angle;
}

function InkBagFollowsCharacterOptional ( inkBag )
{
    if ( game.physics.arcade.distanceBetween( characterOptional , inkBag ) < DISTANCE_DETECTION_INKBAG_OPTIONAL )
    {
        game.physics.arcade.moveToObject( inkBag , characterOptional , 200 );
    }
    else
    {
        inkBag.body.velocity.x = 0;
        inkBag.body.velocity.y = 0;
    }
}

function CheckDashOptional () // DASH FUNCTIONALITY
{
    let wantsToDash = game.input.keyboard.isDown( Phaser.Keyboard.SPACEBAR );

    if ( wantsToDash && canDashOptional )
    {
        isDashingOptional = true;
        canDashOptional = false;

        setTimeout( function() {
            isDashingOptional = false;
            setTimeout( function() {
                canDashOptional = true;
            }, DASH_COOLDOWN_OPTIONAL * 1000 ); // WE MULTIPLY BY 1000 TO GET DASH COOLDOWN IN SECONDS
        }, DASH_DURATION_OPTIONAL * 1000 ); // WE MULTIPLY BY 1000 TO GET DASH DURATION IN SECONDS
    }

    canDashOptional ? checkDashOptional.visible = true : checkDashOptional.visible = false; // SHOW THE CHECK DASH IF THE CHARACTER CAN DASH
}

function CheckSprintOptional ( direction ) // SPRINT FUNCTIONALITY
{
    let movementMultiplier = isDashingOptional ? DASH_MULTIPLIER_OPTIONAL : 1; // IF THE CHARACTER IS DASHING, MULTIPLY THE SPEED BY THE DASH MULTIPLIER
    let canSprint = sprintEnabledOptional && game.input.keyboard.isDown( Phaser.Keyboard.SHIFT );

    if ( direction == 'left' )
    {
        canSprint ? characterOptional.body.velocity.x = -SPRINT_SPEED_OPTIONAL * movementMultiplier : characterOptional.body.velocity.x = -CHARACTER_SPEED_OPTIONAL * movementMultiplier; // SPRINT LEFTWARDS
    }
    else if ( direction == 'right' )
    {
        canSprint ? characterOptional.body.velocity.x = SPRINT_SPEED_OPTIONAL * movementMultiplier : characterOptional.body.velocity.x = CHARACTER_SPEED_OPTIONAL * movementMultiplier; // SPRINT RIGHTWARDS
    }

    if ( direction == 'up' )
    {
        canSprint ? characterOptional.body.velocity.y = -SPRINT_SPEED_OPTIONAL * movementMultiplier : characterOptional.body.velocity.y = -CHARACTER_SPEED_OPTIONAL * movementMultiplier; // SPRINT UPWARDS
    }
    else if ( direction == 'down' )
    {
        canSprint ? characterOptional.body.velocity.y = SPRINT_SPEED_OPTIONAL * movementMultiplier : characterOptional.body.velocity.y = CHARACTER_SPEED_OPTIONAL * movementMultiplier; // SPRINT DOWNWARDS
    }

    if ( canSprint )
    {
        SprintOptional();
    }
}

function SmoothStoppingOptional ( x , timeToStop ) // GRADUALLY DECREASE THE SPEED OF THE CHARACTER. IT MAKES THE MOVEMENT SMOOTHER
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

function RotateTowardsMouseOptional () // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
{
    let angle = game.physics.arcade.angleToPointer( characterOptional ); // GET THE ANGLE BETWEEN THE CHARACTER AND THE MOUSE CURSOR
    characterOptional.rotation = angle + Phaser.Math.degToRad( FIXED_ANGLE ); // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
}

function SprintOptional () // SPRINT FUNCTIONALITY
{
    sprintLeftOptional--; // DECREASE THE SPRINT LEFT

    let outOfSprint = sprintLeftOptional == 0;

    if ( outOfSprint ) // IF THE SPRINT IS OUT, DISABLE IT AND START THE COOLDOWN
    {
        sprintEnabledOptional = false;
        sprintLeftOptional = TOTAL_SPRINT;
        setTimeout(function() {
            sprintEnabledOptional = true;
        }, SPRINT_COOLDOWN_OPTIONAL * 1000); // WE MULTIPLY BY 1000 TO GET SPRINT COOLDOWN IN SECONDS

        if ( sprintTweenOptional )
        {
            sprintTweenOptional.stop();
        }

        sprintTweenOptional = game.add.tween(sprintBarOptional.scale).to({
            x: 1, // Assuming the full scale on x-axis represents the bar being completely filled
            y: 1  // Assuming the full scale on y-axis represents the bar being completely filled
        }, SPRINT_COOLDOWN_OPTIONAL * 1000, Phaser.Easing.Linear.None, true);

        sprintTweenOptional.start();
    }

    UpdateSprintBarOptional();
}

function CheckBoundsOptional ()
{
    if ( characterOptional.x < 0 ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        characterOptional.x = 0;
    }
    else if ( characterOptional.x > WORLD_WIDTH_OPTIONAL ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        characterOptional.x = WORLD_WIDTH_OPTIONAL;
    }

    if ( characterOptional.y < 0 ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        characterOptional.y = 0;
    }
    else if ( characterOptional.y > WORLD_HEIGHT_OPTIONAL ) // IF THE CHARACTER IS OUT OF THE BOUNDS OF THE WORLD, SET IT TO THE BOUNDS
    {
        characterOptional.y = WORLD_HEIGHT_OPTIONAL;
    }
}

function CheckMovementOptional ()
{
    let canMoveLeftwards = game.input.keyboard.isDown( Phaser.Keyboard.LEFT ) || game.input.keyboard.isDown( Phaser.Keyboard.A );
    let canMoveRightwards = game.input.keyboard.isDown( Phaser.Keyboard.RIGHT ) || game.input.keyboard.isDown( Phaser.Keyboard.D );
    let canMoveUpwards = game.input.keyboard.isDown( Phaser.Keyboard.UP ) || game.input.keyboard.isDown( Phaser.Keyboard.W );
    let canMoveDownwards = game.input.keyboard.isDown( Phaser.Keyboard.DOWN ) || game.input.keyboard.isDown( Phaser.Keyboard.S );

    if ( canMoveLeftwards )
    {
        CheckSprintOptional( 'left' ); // CHECKS IF THE CHARACTER SPRINTS TO THE LEFT
        xTimerOptional.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else if ( canMoveRightwards )
    {
        CheckSprintOptional( 'right' ); // CHECKS IF THE CHARACTER SPRINTS TO THE RIGHT
        xTimerOptional.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else // NO HORIZONTAL MOVEMENT KEY IS PRESSED
    {
        // START THE COROUTINE TO GRADUALLY DECREASE THE SPEED
        SmoothStoppingOptional( true , TIME_TO_STOP ); // THE SECOND PARAMETER IS THE TIME TO STOP IN SECONDS
    }

    if ( canMoveUpwards  )
    {
        CheckSprintOptional( 'up' ); // CHECKS IF THE CHARACTER SPRINTS TO THE LEFT
        yTimerOptional.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else if ( canMoveDownwards )
    {
        CheckSprintOptional( 'down' ); // CHECKS IF THE CHARACTER SPRINTS TO THE LEFT
        yTimerOptional.stop(); // STOP THE TIMER IF A KEY IS PRESSED SO THE CHARACTER CAN MOVE
    }
    else
    {
        // START THE COROUTINE TO GRADUALLY DECREASE THE SPEED
        SmoothStoppingOptional( false , TIME_TO_STOP ); // THE FIRST PARAMETER IS A BOOL THAT CHECKS WHETHER IT IS A HORIZONTAL INPUT OR NOT, AND THE SECOND PARAMETER IS THE TIME TO STOP IN SECONDS
    }
}