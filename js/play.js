/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTANTS, GLOBAL VARIABLES AND PHASES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let playState = { // GAME PHASES
    preload: PreloadPlay,
    create: CreatePlay,
    update: UpdatePlay
};

// NORMAL CONSTANTS

const CHARACTER_SPEED = 150 , 
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
DISTANCE_DETECTION_REC_AMMO = 100;

// LOCALIZATION CONSTANTS

const MAX_POS_Y_ENEMIES = 2900 , RAE_Y = 300 , WORLD_CENTER_X = WORLD_WIDTH / 2;


let character , xTimer , yTimer , sprintEnabled , sprintLeft, pistol , canDash , isDashing , 
sprintBar , hudGroup , sprintHolder , sprintTween , checkDash, basicEnemiesZone1 , basicEnemiesZone2 , 
basicEnemiesZone3 , basicEnemiesZone4 , basicEnemiesZone5 , spawn1 , spawn2 , spawn3 , spawn4 , spawn5 , 
barriers , character_health , canReceiveDamage , life_bar , life_holder , lifeTween , red_tint , blue_tint , totalRedTint , totalBlueTint , inkBags , 
red_tint_counter , blue_tint_counter , btnInteract , globalScore , closeToBarrier , textNoMoney , inkBagsDropSwitch , rae , shine_rae , time , barrierSafeZone , 
barrierSafeZoneGroup , raeGroup , safeZoneSecondsCounter , canEnterSafeZone , rec_life , rec_ammo_group1 , needsToReload , isBuyingReloads , black_background , shotgun , bow , weaponSelected , hasShotgun , hasBow , shopGroup , shopWeaponsGroup , shineShopGroup , canSwitchBetweenWeapons , globalScoreText , difficultyText , outOfAmmoText , costOfIt , 
advancedEnemiesGroup , enemy1;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CLASSES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ReloadZone
{
    static AddReloadZone ( x , y )
    {
        this.x = x;
        this.y = y;
        rec_ammo_group1 = game.add.group();
        rec_ammo_group1.enableBody = true;
        let rec_ammo = rec_ammo_group1.create( this.x , this.y , 'rec_ammo' );
        rec_ammo.anchor.setTo( 0.5 , 0.5 );
        rec_ammo.scale.setTo( 2 );
        rec_ammo.body.immovable = true;
    }

    static ReloadCharacter (weapon)
    {
        weapon.numberOfReloads = 0;
        totalBlueTint -= RELOAD_COST;
        blue_tint_counter.text = totalBlueTint;
        needsToReload = false;
    }
}

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
                basicEnemiesZone1.maxEnemies = this.getMaxEnemies(zoneNumber);
                basicEnemiesZone1.currentEnemies = 0;
                break;
            case 2:
                basicEnemiesZone2 = game.add.group();
                basicEnemiesZone2.enableBody = true;
                basicEnemiesZone2.createMultiple( ZONE_2_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone2.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                basicEnemiesZone2.maxEnemies = this.getMaxEnemies(zoneNumber);
                basicEnemiesZone2.currentEnemies = 0;
                break;
            case 3:
                basicEnemiesZone3 = game.add.group();
                basicEnemiesZone3.enableBody = true;
                basicEnemiesZone3.createMultiple( ZONE_3_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone3.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                basicEnemiesZone3.maxEnemies = this.getMaxEnemies(zoneNumber);
                basicEnemiesZone3.currentEnemies = 0;
                break;
            case 4:
                basicEnemiesZone4 = game.add.group();
                basicEnemiesZone4.enableBody = true;
                basicEnemiesZone4.createMultiple( ZONE_4_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone4.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                basicEnemiesZone4.maxEnemies = this.getMaxEnemies(zoneNumber);
                basicEnemiesZone4.currentEnemies = 0;
                break;
            case 5:
                basicEnemiesZone5 = game.add.group();
                basicEnemiesZone5.enableBody = true;
                basicEnemiesZone5.createMultiple( ZONE_5_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone5.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                basicEnemiesZone5.maxEnemies = this.getMaxEnemies(zoneNumber);
                basicEnemiesZone5.currentEnemies = 0;
                break;
            default:
                break;
        }
    }

    getMaxEnemies ( zoneNumber )
    {
        switch (zoneNumber) {
            case 1: return 20 * difficultyMultiplier;
            case 2: return 15 * difficultyMultiplier;
            case 3: return 10 * difficultyMultiplier;
            case 4: return 7 * difficultyMultiplier;
            case 5: return 5 * difficultyMultiplier;
            default: return 0;
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
        if ( ! isBuyingReloads )
        {
            if ( enemy.x == character.x && enemy.y == character.y )
            {
                enemy.body.velocity.x = 0;
                enemy.body.velocity.y = 0;
            }
            else if ( game.physics.arcade.distanceBetween( character , enemy ) < DISTANCE_DETECTION_ENEMY )
            {
                if ( enemy.y < 2850 )
                {
                    enemy.x < 0 || enemy.x > WORLD_WIDTH ? enemy.body.velocity.x *= -1 : game.physics.arcade.moveToObject( enemy , character , DEFAULT_VELOCITY_ENEMY );
    
                    enemy.y < ZONES_HEIGHT * ( zoneNumber - 1 ) || enemy.y > ZONES_HEIGHT * zoneNumber ? enemy.body.velocity.y *= -1 : game.physics.arcade.moveToObject( enemy , character , DEFAULT_VELOCITY_ENEMY );
                }
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

            if ( enemy.y >= MAX_POS_Y_ENEMIES )
            {
                enemy.kill();
            }
        }
        else
        {
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = 0;
        }
    }
    
    SpawnEnemies ( zoneNumber )
    {
        let canSpawn;

        switch ( zoneNumber )
        {
            case 1: 
                canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN && basicEnemiesZone1.currentEnemies < basicEnemiesZone1.maxEnemies;
                break;
            case 2:
                canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN && basicEnemiesZone2.currentEnemies < basicEnemiesZone2.maxEnemies;
                break;
            case 3:
                canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN && basicEnemiesZone3.currentEnemies < basicEnemiesZone3.maxEnemies;
                break;
            case 4:
                canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN && basicEnemiesZone4.currentEnemies < basicEnemiesZone4.maxEnemies;
                break;
            case 5:
                canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN && basicEnemiesZone5.currentEnemies < basicEnemiesZone5.maxEnemies;
                break;
            default:
                break;
        }

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

                let possibleYCoordinates = 2750;

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

class AdvancedEnemy
{
    constructor ( x , y , sprite , bulletSprite )
    {
        this.x = x;
        this.y = y;
        this.sprite = advancedEnemiesGroup.create( x , y , sprite )
        this.sprite.anchor.setTo( 0.5 , 0.5 );
        this.bulletSprite = bulletSprite;
        this.sprite.body.immovable = true;

        this.enemyWeapon = game.add.weapon( 1000 , this.bulletSprite );
        this.enemyWeapon.trackSprite( this.sprite , 10 , -25 , true );
        this.enemyWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.enemyWeapon.bulletSpeed = 800;
        this.enemyWeapon.fireRate = 1000;
        this.enemyWeapon.bulletAngleVariance = 5;
        

        this.triggerTimer = game.time.events.loop( 1000 , this.firefunction , this );
            
    }

    firefunction (){
        if ( this.sprite.alive )
        {
            console.log( this.sprite.alive );
            this.enemyWeapon.fire();
        }
    }


    
}

class Weapon
{
    constructor ( nbullets , sprite , distance , speed , rate , variance , weaponType , maxMagazines )
    {
        this.core = game.add.weapon( nbullets , sprite ); // CREATE THE WEAPON
        this.core.trackSprite( character , WEAPON_OFFSET_X , WEAPON_OFFSET_Y , true ); // TRACK THE CHARACTER
        this.core.bulletKillType = Phaser.Weapon.KILL_DISTANCE; // KILL THE BULLET WHEN IT REACHES A CERTAIN DISTANCE
        this.core.bulletKillDistance = distance; // THE DISTANCE TO KILL THE BULLET
        this.core.bulletSpeed = speed; // THE SPEED OF THE BULLET
        this.core.fireRate = rate; // THE FIRE RATE OF THE BULLET
        this.core.bulletAngleVariance = variance; // THE VARIANCE OF THE ANGLE OF THE BULLET
        this.nbullets = nbullets; // THE NUMBER OF BULLETS
        this.numberOfReloads = 0; // THE NUMBER OF RELOADS
        this.weaponType = weaponType; // THE TYPE OF WEAPON
        this.maxMagazines = maxMagazines; // THE MAXIMUM NUMBER OF SHOTS
        this.delayShoot = false; // THE DELAY TO SHOOT    

        if ( this.weaponType != 'bow' )
        {
            this.core.setBulletFrames( 0 , nbullets - 1 , true ); // SET THE FRAMES OF THE BULLET
        }
    }

    Shoot () // SHOOT. A SINGLE CLICK SHOOTS ALL BULLETS
    {
        let shotsThatHaveBeenShot = this.core.shots; // GET THE NUMBER OF BULLETS SHOT
        // console.log( shotsThatHaveBeenShot );
        console.log( this.numberOfReloads );

        // TO TRACK THE REMAINING BULLETS IN A ‘MAGAZINE’ IN PHASER, YOU MUST COUNT THE SHOTS. 
        // PHASER.WEAPON LACKS A FUNCTION FOR THIS, SO WE USE PISTOL.SHOTS, WHICH COUNTS THE SHOTS SINCE THE LAST RESET.
        
        let canShoot = game.input.activePointer.leftButton.isDown && shotsThatHaveBeenShot == 0;
        let isShooting = shotsThatHaveBeenShot > 0 && shotsThatHaveBeenShot < this.nbullets;
        let needsReload = shotsThatHaveBeenShot == this.nbullets;
        
        needsToReload = this.numberOfReloads >= this.maxMagazines;

        if ( this.numberOfReloads < this.maxMagazines )
        {
            if ( canShoot ) // EACH CLICK FIRES A BULLET IF NONE HAS BEEN FIRED SINCE THE LAST RESET, INCREMENTING THE COUNTER.
            {
                this.core.fireAtPointer( game.input.activePointer );  
            }
            else if ( isShooting )
            {
                this.core.fireAtPointer( game.input.activePointer );
            }   
            else if ( needsReload ) // ONCE ALL 6 BULLETS ARE FIRED, THE COUNTER IS RESET TO RESTART THE PROCESS.
            {
                if ( this.weaponType == 'pistol' )
                {
                    shotsThatHaveBeenShot = this.core.resetShots();
                    this.numberOfReloads++;
                }
                else
                {
                    if ( ! this.delayShoot )
                    {
                        this.delayShoot = true;
                        setTimeout( function() {
                            this.numberOfReloads++;
                            this.shotsThatHaveBeenShot = this.core.resetShots();
                            this.delayShoot = false;
                        }.bind(this), 1000 );   
                    }
                }
            }
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
    CreateEnemies();
    CreateHUD();
}

function UpdatePlay () // GAME LOOP
{
    if ( ! isBuyingReloads )
    {
        UpdateCharacter();
        UpdateCollisions();
        UpdateRotations();
        UpdateSprites();

        
    }
    else
    {
        character.body.velocity.x = 0;
        character.body.velocity.y = 0;
    }
}

function UpdateSprites ()
{
    basicEnemiesZone1.forEach( UpdateSpriteSingleEnemy , this );
    basicEnemiesZone2.forEach( UpdateSpriteSingleEnemy , this );
    basicEnemiesZone3.forEach( UpdateSpriteSingleEnemy , this );
    basicEnemiesZone4.forEach( UpdateSpriteSingleEnemy , this );
    basicEnemiesZone5.forEach( UpdateSpriteSingleEnemy , this );

    // Increase time
    time += game.time.elapsed;

    // Calculate new scale and position
    let newScale = 3 + 1.5 * Math.sin(time / 2000); // Reduced from 0.1 to 0.01

    // Apply new scale and position
    shine_rae.scale.set(newScale);
}

function UpdateSpriteSingleEnemy ( enemy )
{
    game.physics.arcade.distanceBetween( character , enemy ) < DISTANCE_DETECTION_ENEMY ? enemy.loadTexture('basicEnemyDirty', 0) : enemy.loadTexture('basicEnemy', 0);
    
}

function UpdateRotations ()
{
    basicEnemiesZone1.forEach( RotateSingleEnemy , this );
    basicEnemiesZone2.forEach( RotateSingleEnemy , this );
    basicEnemiesZone3.forEach( RotateSingleEnemy , this );
    basicEnemiesZone4.forEach( RotateSingleEnemy , this );
    basicEnemiesZone5.forEach( RotateSingleEnemy , this );
}

function RotateSingleEnemy ( enemy )
{
    let angle = game.physics.arcade.angleBetween( enemy , character ); // GET THE ANGLE BETWEEN THE CHARACTER AND THE MOUSE CURSOR
    enemy.rotation = angle + Phaser.Math.degToRad( FIXED_ANGLE ); // ROTATE THE CHARACTER ORIENTATION TOWARDS THE MOUSE CURSOR
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
    game.physics.arcade.collide(character, barrierSafeZone);
    game.physics.arcade.collide(character, rae);
    game.physics.arcade.collide(character, shopGroup);
    game.physics.arcade.collide(character, shopWeaponsGroup);

    // MAKE THE BULLETS COLLIDE WITH THE BARRIERS
    game.physics.arcade.collide(pistol.core.bullets, barriers, function(bullet) {
        bullet.kill();
    });

    game.physics.arcade.collide(shotgun.core.bullets, barriers, function(bullet) {
        bullet.kill();
    });

    game.physics.arcade.collide(bow.core.bullets, barriers, function(bullet) {
        bullet.kill();
    });

    game.physics.arcade.collide(pistol.core.bullets, barrierSafeZoneGroup, function(bullet) {
        bullet.kill();
    });

    game.physics.arcade.collide(shotgun.core.bullets, barrierSafeZoneGroup, function(bullet) {
        bullet.kill();
    });

    game.physics.arcade.collide(bow.core.bullets, barrierSafeZoneGroup, function(bullet) {
        bullet.kill();
    });

    // MAKE THE BULLETS COLLIDE WITH THE ENEMIES
    game.physics.arcade.overlap(pistol.core.bullets, basicEnemiesZone1, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(shotgun.core.bullets, basicEnemiesZone1, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(bow.core.bullets, basicEnemiesZone2, function(bullet, enemy) {
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(pistol.core.bullets, basicEnemiesZone2, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(shotgun.core.bullets, basicEnemiesZone2, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(bow.core.bullets, basicEnemiesZone2, function(bullet, enemy) {
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(pistol.core.bullets, basicEnemiesZone3, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(shotgun.core.bullets, basicEnemiesZone3, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(bow.core.bullets, basicEnemiesZone3, function(bullet, enemy) {
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(pistol.core.bullets, basicEnemiesZone4, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(shotgun.core.bullets, basicEnemiesZone4, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(bow.core.bullets, basicEnemiesZone4, function(bullet, enemy) {
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(pistol.core.bullets, basicEnemiesZone5, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(shotgun.core.bullets, basicEnemiesZone5, function(bullet, enemy) {
        bullet.kill();
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.overlap(bow.core.bullets, basicEnemiesZone5, function(bullet, enemy) {
        enemy.kill();
        DropInkBag( enemy );
        BlastAnimation( enemy );
    });

    game.physics.arcade.collide(enemy1.enemyWeapon.bullets, barrierSafeZoneGroup, function(bullet) {
        bullet.kill();
    });

    game.physics.arcade.collide(pistol.core.bullets, advancedEnemiesGroup, function(bullet, enemy) {
        BlastAnimation(enemy);
        enemy.alive = false;
        enemy.kill();
        bullet.kill();
        
    });

    game.physics.arcade.collide(bow.core.bullets, advancedEnemiesGroup, function(bullet, enemy) {
        BlastAnimation(enemy);
        enemy.alive = false;
        enemy.kill();
        bullet.kill();
        
    });

    game.physics.arcade.collide(shotgun.core.bullets, advancedEnemiesGroup, function(bullet, enemy) {
        BlastAnimation(enemy);
        enemy.alive = false;
        enemy.kill();
        bullet.kill();
        
    });

    


    // MAKE THE CHARACTER COLLIDE WITH THE ENEMIES
    basicEnemiesZone1.forEach( EnemyCollideWithCharacter , this );
    basicEnemiesZone2.forEach( EnemyCollideWithCharacter , this );
    basicEnemiesZone3.forEach( EnemyCollideWithCharacter , this );
    basicEnemiesZone4.forEach( EnemyCollideWithCharacter , this );
    basicEnemiesZone5.forEach( EnemyCollideWithCharacter , this );

    // MAKE THE INKBAGS COLLIDE WITH THE CHARACTER
    inkBags.forEach( InkBagCollideWithCharacter , this );

    if ( btnInteract.visible && closeToBarrier )
    {
        if ( barriers.countLiving() > 0 && character.y < 2550)
        {
            let barrier = barriers.getFirstAlive(true);

            if ( barrier )
            {
                // Lo subiremos a [6500 , 4000 , 2000 , 500]
                let costs = [ 0 , 0 , 0 , 100 ];
                let cost = costs[ barriers.countLiving() - 1 ];

                costOfIt.text = "COST: " + cost;
                costOfIt.fill = "#ff0000";
                costOfIt.visible = true;

                setTimeout( function() {
                    costOfIt.visible = false;
                }, 1000 );


                if ( totalRedTint >= cost )
                {
                    if ( game.input.keyboard.isDown( Phaser.Keyboard.E ) )
                    {
                        totalRedTint -= cost;
                        barrier.kill();
                        red_tint_counter.text = totalRedTint;
                    }
                }
                else
                {
                    textNoMoney.visible = true;
                    setTimeout( function() {
                        textNoMoney.visible = false;
                    }, 2000 );
                }
            }
        }
    }

    game.physics.arcade.overlap(enemy1.enemyWeapon.bullets, character, function(character,bullet) {
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
        ClackAnimation( character );
    });
}

function BlastAnimation ( enemy )
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

function ClackAnimation ( character )
{
    let clack = game.add.sprite( character.x , character.y , 'clack' );
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

function InkBagCollideWithCharacter ( inkBag )
{
    game.physics.arcade.overlap(character, inkBag, function() {
        if ( inkBag.key == 'red_tint' )
        {
            totalRedTint += 100;
            globalScore += 120;
            red_tint_counter.text = totalRedTint;
        }
        else
        {
            totalBlueTint += 100;
            globalScore += 80;
            blue_tint_counter.text = totalBlueTint;
        }

        globalScoreText.text = "SCORE: " + globalScore;

        inkBag.kill();
    });
}

function DropInkBag ( enemy )
{
    let randomNumber = Math.random();
    let inkBag;

    if (randomNumber < 0.6) {
        // Drop blue ink
        inkBag = inkBags.create(enemy.x, enemy.y, 'blue_tint');
    } else {
        // Drop red ink
        inkBag = inkBags.create(enemy.x, enemy.y, 'red_tint');
    }

    // Add a cool tween
    game.add.tween(inkBag).to({y: inkBag.y + 10}, 500, Phaser.Easing.Bounce.Out, true);
}

function EnemyCollideWithCharacter ( enemy )
{
    if ( canReceiveDamage )
    {
        game.physics.arcade.overlap(character, enemy, function() {
            if ( isDashing )
            {
                inkBagsDropSwitch = true;
            }
            else
            {
                character_health -= 10;
                inkBagsDropSwitch = false;
            }
            canReceiveDamage = false;
            setTimeout( function() {
                canReceiveDamage = true;
            }, 1000 );
    
            // Stop the enemy
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = 0;
    
            // Create a tween to make the enemy smaller
            let shrinkTween = game.add.tween(enemy.scale).to({x: 0.01, y: 0.01}, 500, Phaser.Easing.Linear.None, true);
    
            // When the tween completes, kill the enemy
            shrinkTween.onComplete.add(function() {
                enemy.kill();
                inkBagsDropSwitch ? DropInkBag( enemy ) : null;
                inkBagsDropSwitch = false;
            }, this);

            if ( ! isDashing )
            {
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
        });
    }
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

    enemy1 = new AdvancedEnemy( 100 , 2800 , 'grapadora' , 'grapas' );

    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawn1.SpawnEnemies , this , 1 );
    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawn2.SpawnEnemies , this , 2 );
    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawn3.SpawnEnemies , this , 3 );
    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawn4.SpawnEnemies , this , 4 );
    game.time.events.loop( TIMER_BASIC_ENEMY_SPAWN , spawn5.SpawnEnemies , this , 5 );

    

    setInterval( UpdateEnemies , 1000 );

    inkBags = game.add.group();
    inkBags.enableBody = true;

    shine_rae = game.add.sprite( WORLD_CENTER_X , RAE_Y , 'shine_rae' );
    shine_rae.anchor.setTo( 0.5 );
    shine_rae.scale.setTo( 2 );

    raeGroup = game.add.group();
    raeGroup.enableBody = true;
    rae = raeGroup.create( WORLD_CENTER_X , RAE_Y , 'rae' );
    rae.anchor.setTo( 0.5 );
    rae.body.immovable = true;

    time = 0;
}

function CreateTimers ()
{
    xTimer = game.time.create( false );
    yTimer = game.time.create( false );
}

function CreateImages ()
{
    game.load.image( 'player' , 'assets/imgs/Base_Player.png' );
    game.load.image( 'background' , 'assets/imgs/background.png' );
    game.load.image( 'sprintHolder' , 'assets/imgs/sprint_holder.png' );
    game.load.image( 'sprintBar' , 'assets/imgs/sprint_bar.png' );
    game.load.image( 'check_dash' , 'assets/imgs/check_dash.png' );
    game.load.spritesheet( 'bullets' , 'assets/imgs/bullet.png' , BULLET_SPRITE_X , BULLET_SPRITE_Y );
    game.load.image( 'basicEnemy' , 'assets/imgs/Base_Enemy.png' );
    game.load.image( 'barrier' , 'assets/imgs/barrier.png' );
    game.load.image( 'life_bar' , 'assets/imgs/life_bar.png' );
    game.load.image( 'basicEnemyDirty' , 'assets/imgs/Base_PlayerDirty.png' );
    game.load.image( 'red_tint' , 'assets/imgs/red_tint.png' );
    game.load.image( 'blue_tint' , 'assets/imgs/blue_tint.png' );
    game.load.image( 'btnE' , 'assets/imgs/btnE.png' );
    game.load.image( 'bam' , 'assets/imgs/bam.png' );
    game.load.image( 'rae' , 'assets/imgs/santa_rae.png' );
    game.load.image( 'shine_rae' , 'assets/imgs/shine.png' );
    game.load.image( 'safe_zone_closed' , 'assets/imgs/safe_barrier_close.png' );
    game.load.image( 'safe_zone_opened' , 'assets/imgs/safe_barrier_open.png' );
    game.load.image( 'safeZoneCounter10' , 'assets/imgs/countdown/count10.png' );
    game.load.image( 'safeZoneCounter9' , 'assets/imgs/countdown/count9.png' );
    game.load.image( 'safeZoneCounter8' , 'assets/imgs/countdown/count8.png' );
    game.load.image( 'safeZoneCounter7' , 'assets/imgs/countdown/count7.png' );
    game.load.image( 'safeZoneCounter6' , 'assets/imgs/countdown/count6.png' );
    game.load.image( 'safeZoneCounter5' , 'assets/imgs/countdown/count5.png' );
    game.load.image( 'safeZoneCounter4' , 'assets/imgs/countdown/count4.png' );
    game.load.image( 'safeZoneCounter3' , 'assets/imgs/countdown/count3.png' );
    game.load.image( 'safeZoneCounter2' , 'assets/imgs/countdown/count2.png' );
    game.load.image( 'safeZoneCounter1' , 'assets/imgs/countdown/count1.png' );
    game.load.image( 'rec_life' , 'assets/imgs/rec_life.png' );
    game.load.image( 'rec_ammo' , 'assets/imgs/rec_ammo.png' );
    game.load.image( 'player_pistol' , 'assets/imgs/PlayerPistol.png' );
    game.load.image( 'B' , 'assets/imgs/B.png' );
    game.load.image( 'C' , 'assets/imgs/C.png' );
    game.load.image( 'E' , 'assets/imgs/E.png' );
    game.load.image( 'H' , 'assets/imgs/H.png' );
    game.load.image( 'K' , 'assets/imgs/K.png' );
    game.load.image( 'L' , 'assets/imgs/L.png' );
    game.load.image( 'O' , 'assets/imgs/O.png' );
    game.load.image( 'S' , 'assets/imgs/S.png' );
    game.load.image( 'T' , 'assets/imgs/T.png' );
    game.load.image( 'U' , 'assets/imgs/U.png' );
    game.load.image( 'black_background' , 'assets/imgs/black_background.png' );
    game.load.spritesheet( 'buckshot' , 'assets/imgs/buckshot.png' , BULLET_SPRITE_X , BULLET_SPRITE_Y );
    game.load.image( 'player_shotgun' , 'assets/imgs/PlayerShotgun.png' );
    game.load.image( 'arrow' , 'assets/imgs/arrow.png' );
    game.load.image( 'player_bow' , 'assets/imgs/PlayerBow.png' );
    game.load.image( 'shop' , 'assets/imgs/Shop.png' );
    game.load.image( 'shotgun' , 'assets/imgs/shotgun.png' );
    game.load.image( 'bow' , 'assets/imgs/bow.png' );
    game.load.image( 'grapadora' , 'assets/imgs/Grapa.png' );
    game.load.image( 'grapas' , 'assets/imgs/Dora.png' );
    game.load.image( 'clack' , 'assets/imgs/Clack.png' );
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

    let barrierBetween4And5 = barriers.create( 0 , ZONES_HEIGHT * 4 , 'barrier' );
    barrierBetween4And5.body.immovable = true; // Make the barrier immovable

    let barrierBetween3And4 = barriers.create( 0 , ZONES_HEIGHT * 3 , 'barrier' );
    barrierBetween3And4.body.immovable = true; // Make the barrier immovable

    let barrierBetween2And3 = barriers.create( 0 , ZONES_HEIGHT * 2 , 'barrier' );
    barrierBetween2And3.body.immovable = true; // Make the barrier immovable

    let barrierBetween1And2 = barriers.create( 0 , ZONES_HEIGHT , 'barrier' );
    barrierBetween1And2.body.immovable = true; // Make the barrier immovable

    barrierSafeZoneGroup = game.add.group();
    barrierSafeZoneGroup.enableBody = true;

    barrierSafeZone = barrierSafeZoneGroup.create( 0 , 2900 , 'safe_zone_closed' );
    barrierSafeZone.body.immovable = true;

    // SAFE ZONE LIFE RECOVERY
    rec_life = game.add.group();
    rec_life.enableBody = true;

    let recLife = rec_life.create( 100 , 3075 , 'rec_life' );
    recLife.body.immovable = true;

    shopGroup = game.add.group();
    shopGroup.enableBody = true;

    let shop = shopGroup.create( 300 , 3015 , 'shop' );
    shop.body.immovable = true;

    shineShopGroup = game.add.group();
    shineShopGroup.enableBody = true;

    shopWeaponsGroup = game.add.group();
    shopWeaponsGroup.enableBody = true;

    

    let shineShotgun = shineShopGroup.create( 600 , 3050 , 'shine_rae' );
    shineShotgun.body.immovable = true;
    shineShotgun.anchor.setTo( 0.5 , 0.5);
    shineShotgun.scale.setTo( 0.75 );
    let shopShotgun = shopWeaponsGroup.create( 600 , 3050 , 'shotgun' );
    shopShotgun.body.immovable = true;
    shopShotgun.anchor.setTo( 0.5 , 0.5);
    shopShotgun.scale.setTo( 1.85 );

    let shineBow = shineShopGroup.create( 600 , 3130 , 'shine_rae' );
    shineBow.body.immovable = true;
    shineBow.anchor.setTo( 0.5 , 0.5);
    shineBow.scale.setTo( 0.75 );
    let shopBow = shopWeaponsGroup.create( 600 , 3130 , 'bow' );
    shopBow.body.immovable = true;
    shopBow.anchor.setTo( 0.5 , 0.5);
}

function CreateCharacter ()
{
    ReloadZone.AddReloadZone( WORLD_WIDTH / 2 , 2700 );

    character = game.add.sprite( WORLD_WIDTH / 2 , 2800 , 'player_pistol' );
    character.anchor.setTo( ANCHOR_X , ANCHOR_Y );
    character_health = DEFAULT_CHARACTER_HEALTH;
    canReceiveDamage = true;
    
    game.physics.arcade.enable( character );
    sprintEnabled = true;
    sprintLeft = TOTAL_SPRINT;
    canDash = true;
    isDashing = false;

    // SET UP THE CAMERA THAT FOLLOWS THE CHARACTER
    game.camera.follow( character );

    // SET UP THE WEAPON FOR THE CHARACTER
    pistol = new Weapon( DEFAULT_NUMBER_BULLETS , 'bullets' , BULLET_KILL_DISTANCE , BULLET_SPEED , FIRE_RATE , BULLET_ANGLE_VARIANCE , 'pistol' , 10 );
    shotgun = new Weapon( 8 , 'buckshot' , BULLET_KILL_DISTANCE / 2 , BULLET_SPEED / 1.5 , 0 , 40 , 'shotgun' , 5 );
    bow = new Weapon( 3 , 'arrow' , BULLET_KILL_DISTANCE * 3 , BULLET_SPEED / 2 , FIRE_RATE / 2 , BULLET_ANGLE_VARIANCE + 10 , 'bow' , 4 );

    totalRedTint = 0;
    totalBlueTint = 0;

    btnInteract = game.add.sprite( GAME_STAGE_WIDTH / 2 , GAME_STAGE_HEIGHT / 2 , 'btnE' );
    btnInteract.anchor.setTo( 0.5 , 0.5 );
    btnInteract.visible = false;

    globalScore = 0;
    inkBagsDropSwitch = true;

    safeZoneSecondsCounter = 0;
    canEnterSafeZone = true;

    weaponSelected = 0;
    hasBow = false;
    hasShotgun = false;

    canSwitchBetweenWeapons = true;

    advancedEnemiesGroup = game.add.group();
    advancedEnemiesGroup.enableBody = true;
    
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
    life_bar = hudGroup.create( 5 , 50 , 'life_bar' );
    life_bar.anchor.setTo( ANCHOR_X_LIFEBAR , ANCHOR_Y_LIFEBAR );
    life_bar.rotation = Phaser.Math.degToRad( FIXED_ANGLE );
    life_holder = hudGroup.create( 5 , 50 , 'sprintHolder' );
    life_holder.anchor.setTo( ANCHOR_X_LIFEBAR , ANCHOR_Y_LIFEBAR );
    life_holder.rotation = Phaser.Math.degToRad( FIXED_ANGLE );
    red_tint = hudGroup.create( SPRINT_BAR_X + 65 , SPRINT_BAR_Y - 65 , 'red_tint' );
    red_tint.anchor.setTo( 0.5 , 0.5 );
    blue_tint = hudGroup.create( SPRINT_BAR_X + 65 , SPRINT_BAR_Y - 25 , 'blue_tint' );
    blue_tint.anchor.setTo( 0.5 , 0.5 );
    safeZoneSecondsCounter = hudGroup.create( 795 , 50 , 'safeZoneCounter10' );
    safeZoneSecondsCounter.anchor.setTo( 1 , 0 );
    safeZoneSecondsCounter.visible = false;

    // Add text for red_tint and blue_tint counters
    red_tint_counter = game.add.text(red_tint.x + 20, red_tint.y - 17, totalRedTint, { font: "30px Kalam", fill: "#ff0000" });
    blue_tint_counter = game.add.text(blue_tint.x + 20, blue_tint.y - 17, totalBlueTint, { font: "30px Kalam", fill: "#0000ff" });

    textNoMoney = game.add.text( 175 , 570 , "You don't have enough tint, CAPITALISM WINS" , { font: "25px Kalam" , fill: "#000000" } );
    textNoMoney.visible = false;

    globalScoreText = game.add.text( 325 , 10 , "SCORE: " + globalScore , { font: "30px Kalam" , fill: "#000000" } );

    let difficulty;

    switch ( difficultyMultiplier )
    {
        case 1:
            difficulty = "EASY";
            break;
        case 2:
            difficulty = "MEDIUM";
            break;
        case 3:
            difficulty = "HARD";
            break;
        default:
            break;
    }

    difficultyText = game.add.text( life_bar.x + 15 , life_bar.y + 10 , "DIFFICULTY: " + difficulty , { font: "20px Kalam" , fill: "#000000" } );

    outOfAmmoText = game.add.text( 590 , 10 , "OUT OF AMMO" , { font: "30px Kalam" , fill: "#000000" } );
    outOfAmmoText.visible = false;

    costOfIt = game.add.text( 345 , 45 , "No cost" , { font: "25px Kalam" , fill: "#000000" } );
    costOfIt.visible = false;

    // Add the counters to the HUD group
    hudGroup.add(red_tint_counter);
    hudGroup.add(blue_tint_counter);
    hudGroup.add(textNoMoney);
    hudGroup.add(globalScoreText);
    hudGroup.add(difficultyText);
    hudGroup.add(outOfAmmoText);
    hudGroup.add(costOfIt);

    black_background = hudGroup.create( 0 , 0 , 'black_background' );
    black_background.anchor.setTo( 0 );
    black_background.visible = false;

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

    if ( game.input.keyboard.isDown( Phaser.Keyboard.Q ) )
    {
        if ( ( hasBow || hasShotgun ) && canSwitchBetweenWeapons )
        {
            if ( weaponSelected == 0 && ! hasShotgun )
            {
                weaponSelected = 2;
            }
            else if ( weaponSelected == 1 && ! hasBow )
            {
                weaponSelected = 0;
            }
            else if ( weaponSelected == 2 )
            {
                weaponSelected = 0;
            }
            else
            {
                weaponSelected++;
            }

            canSwitchBetweenWeapons = false;

            setTimeout( function() {
                canSwitchBetweenWeapons = true;
            }, 500 );
        }
    }

    switch ( weaponSelected )
    {
        case 0:
            character.loadTexture( 'player_pistol' , 0 );
            pistol.Shoot();
            break;
        case 1:
            character.loadTexture( 'player_shotgun' , 0 );
            shotgun.Shoot();
            break;
        case 2:
            character.loadTexture( 'player_bow' , 0 );
            bow.Shoot();
            break;
        default:
            break;
    }

    btnInteract.x = character.x;
    btnInteract.y = character.y - 60;

    if ( character_health <= 0 )
    {
        game.state.start('endscreen');
    }

    barriers.forEach( CheckDistanceWithBarriers , this );

    inkBags.forEach( InkBagFollowsCharacter , this );

    if ( game.physics.arcade.distanceBetween( character , shine_rae ) < DISTANCE_DETECTION_RAE )
    {
        btnInteract.visible = true;

        setTimeout( function() {
            btnInteract.visible = false;
        }, 1000 );

        costOfIt.text = "COST: " + 0;
        costOfIt.fill = "#0000ff";
        costOfIt.visible = true;

        setTimeout( function() {
            costOfIt.visible = false;
        }, 1000 );

        if ( game.input.keyboard.isDown( Phaser.Keyboard.E ) )
        {
            if ( totalBlueTint >= 0 ) // 10000
            {
                game.state.start('win');
            }
            else
            {
                textNoMoney.visible = true;
                setTimeout( function() {
                    textNoMoney.visible = false;
                }, 2000 );
            }
        }
    }

    barrierSafeZoneGroup.forEach( CheckDistanceWithBarriers , this );

    if ( closeToBarrier && btnInteract.visible && character.y > 2850 && game.input.keyboard.isDown( Phaser.Keyboard.E ) )
    {
        if ( canEnterSafeZone )
        {
            barrierSafeZoneGroup.forEach(function(barrier) {
                barrier.loadTexture('safe_zone_opened', 0);
                safeZoneSecondsCounter.visible = true;
                canEnterSafeZone = false;
        
                // Iniciar el contador de tiempo
                let counter = 10;
                safeZoneSecondsCounter.loadTexture('safeZoneCounter' + counter, 0);
                let timer = setInterval(function() {
                    counter--;
                    if (counter >= 1) {
                        // Cambiar el sprite del contador
                        safeZoneSecondsCounter.loadTexture('safeZoneCounter' + counter, 0);
                    } else {
                        // Detener el contador y ocultarlo
                        clearInterval(timer);
                        safeZoneSecondsCounter.loadTexture('safeZoneCounter1', 0);
                        safeZoneSecondsCounter.visible = false;
                    }
                }, 1000);
        
                setTimeout(function() {
                    barrier.loadTexture('safe_zone_closed', 0);
                    barrierSafeZoneGroup.setAll('body.enable', true);
                    if (character.y > 2900) {
                        game.state.start('endscreen');
                    }
        
                    // Iniciar el contador de cooldown
                    counter = 1;
                    safeZoneSecondsCounter.visible = true;
                    timer = setInterval(function() {
                        counter++;
                        if (counter <= 10) {
                            // Cambiar el sprite del contador
                            safeZoneSecondsCounter.loadTexture('safeZoneCounter' + counter, 0);
                        } else {
                            // Detener el contador y ocultarlo
                            clearInterval(timer);
                            safeZoneSecondsCounter.loadTexture('safeZoneCounter10', 0);
                            safeZoneSecondsCounter.visible = false;
                            canEnterSafeZone = true;
                        }
                    }, 1000);
                }, 10000);
            });
    
            // Desactivar la colisión para todos los hijos del grupo
            barrierSafeZoneGroup.setAll('body.enable', false);
        }
    }

    rec_life.forEach( CheckDistanceWithRecLife , this );

    rec_ammo_group1.forEach( CheckDistanceWithRecAmmo , this );

    shopWeaponsGroup.forEach( CheckDistanceWithShopWeapons , this );

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
    if ( game.physics.arcade.distanceBetween( enemy , character ) < DISTANCE_DETECTION_ENEMY * 2 )
    {
        let angle = game.physics.arcade.angleBetween( enemy , character );
        enemy.rotation = angle;
    }
}

function CheckDistanceWithShopWeapons ( shopWeapon )
{
    game.physics.arcade.collide(character, shopWeapon, function() {
        btnInteract.visible = true;

        let cost;

        if ( shopWeapon.key == 'shotgun' )
        {
            cost = 100;
        }
        else if ( shopWeapon.key == 'bow' )
        {
            cost = 200;
        }

        costOfIt.text = "COST: " + cost;
        costOfIt.fill = "#0000ff";
        costOfIt.visible = true;

        setTimeout( function() {
            costOfIt.visible = false;
        }, 1000 );

        if ( game.input.keyboard.isDown( Phaser.Keyboard.E ) )
        {
            if ( shopWeapon.key == 'shotgun' && totalBlueTint >= 100 )
            {
                hasShotgun = true;
                shopWeapon.kill();
            }
            else if ( shopWeapon.key == 'bow' && totalBlueTint >= 200 )
            {
                hasBow = true;
                shopWeapon.kill();
            }
            else
            {
                textNoMoney.visible = true;
                setTimeout( function() {
                    textNoMoney.visible = false;
                }, 2000 );
            }
        }

        setTimeout( function() {
            btnInteract.visible = false;
        }, 1000 );
    });
}

function CheckDistanceWithRecAmmo ( rec_ammo )
{
    if ( game.physics.arcade.distanceBetween( character , rec_ammo ) < DISTANCE_DETECTION_REC_AMMO )
    {
        btnInteract.visible = true;
        setTimeout( function() {
            btnInteract.visible = false;
        }, 1000 );

        costOfIt.text = "COST: " + RELOAD_COST;
        costOfIt.fill = "#0000ff";
        costOfIt.visible = true;

        setTimeout( function() {
            costOfIt.visible = false;
        }, 1000 );

        if ( game.input.keyboard.isDown( Phaser.Keyboard.E ) && totalBlueTint >= RELOAD_COST )
        {
            if ( needsToReload )
            {
                if ( weaponSelected == 0 )
                {
                    ReloadZone.ReloadCharacter(pistol);
                }
                else if ( weaponSelected == 1 )
                {
                    ReloadZone.ReloadCharacter(shotgun);
                }
                else if ( weaponSelected == 2 )
                {
                    ReloadZone.ReloadCharacter(bow);
                }

                isBuyingReloads = true;
                black_background.visible = true;

                // Crear un sprite de texto y añadir un tween
                B = game.add.sprite(character.x - 75, character.y - 75, 'B');
                C = game.add.sprite(character.x, character.y - 100, 'C');
                E = game.add.sprite(character.x + 75, character.y - 75, 'E');
                H = game.add.sprite(character.x + 100, character.y - 50, 'H');
                K = game.add.sprite(character.x + 100, character.y + 50, 'K');
                L = game.add.sprite(character.x + 75, character.y + 75, 'L');
                O = game.add.sprite(character.x, character.y + 100, 'O');
                S = game.add.sprite(character.x - 75, character.y + 75, 'S');
                T = game.add.sprite(character.x - 100, character.y + 50, 'T');
                U = game.add.sprite(character.x - 100, character.y - 50, 'U');
                
                let letters = [B, C, E, H, K, L, O, S, T, U];

                letters.forEach(function(letter) {
                    let tween = game.add.tween(letter).to({ x: character.x, y: character.y }, 2000, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(function() {
                        letter.destroy();
                    }, this);
                });

                let tween = game.add.tween(black_background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function() {
                    black_background.visible = false;
                    black_background.alpha = 1; // Restablecer la transparencia para la próxima vez
                }, this);

                setTimeout( function() {
                    isBuyingReloads = false;
                }, 2000 );
            }
        }
        else
        {
            textNoMoney.visible = true;
            setTimeout( function() {
                textNoMoney.visible = false;
            }, 2000 );
        }
    }
}

function CheckDistanceWithRecLife ( recLife )
{
    game.physics.arcade.overlap(character, recLife, function() {
        btnInteract.visible = true;

        costOfIt.text = "COST: " + 500;
        costOfIt.fill = "#ff0000";
        costOfIt.visible = true;

        setTimeout( function() {
            costOfIt.visible = false;
        }, 1000 );

        if ( totalRedTint >= 500 && game.input.keyboard.isDown( Phaser.Keyboard.E ) )
        {
            totalRedTint -= 500;
            red_tint_counter.text = totalRedTint;
            character_health = DEFAULT_CHARACTER_HEALTH;
            life_bar.scale.y = 1;
        }
        else
        {
            textNoMoney.visible = true;
            setTimeout( function() {
                textNoMoney.visible = false;
            }, 2000 );
        }
    });
}

function InkBagFollowsCharacter ( inkBag )
{
    if ( game.physics.arcade.distanceBetween( character , inkBag ) < DISTANCE_DETECTION_INKBAG )
    {
        game.physics.arcade.moveToObject( inkBag , character , 200 );
    }
    else
    {
        inkBag.body.velocity.x = 0;
        inkBag.body.velocity.y = 0;
    }
}

function CheckDistanceWithBarriers ( barrier )
{
    if ( game.physics.arcade.overlap(character, barrier ) )
    {
        btnInteract.visible = true;
        closeToBarrier = true;
        setTimeout( function() {
            closeToBarrier = false;
            btnInteract.visible = false;
        }, 1000 );
    }
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