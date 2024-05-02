//---------------------------------------------------------------------------------
// Weapons used in-game
//---------------------------------------------------------------------------------

import { Weapon, Bullet } from "phaser";

//----------------------------------------------------------------------
// Universal functions all weapons use on callbacks

function fullBullets(weapon)
{
    weapon.quantity = -1;
    // This number sets all chargers to max
}

//----------------------------------------------------------------------------------
// Pistol weapon
//----------------------------------------------------------------------------------

var pistol = this.add.weapon(6, 'bullet'); 
var pistolIs = false;
// creation vars are (charger-size, bullet-textures, bullet-frame, weapon-group, class-of-bullets-used)
// bool for knowing which weapon is equipped so controls work

pistol.trackSprite(character, 0, 0, true);

if (pistolIs && Phaser.Pointer.mouse.LEFT_BUTTON == 1)
{
    pistol.fire(null, null, null, 0, 0);
    // Nulls are set so fire follows the tracked sprite defined
}
// sets fire position, and key control. angles and position are managed with spriteTracker

pistol.bulletKillDistance = 100;
// pixels until the bullet instance gets killed

pistol.bulletSpeed = 100;
// how many pixels per second the bullet travels

pistol.fireRate = 100;
// miliseconds until next bullet can be fired

pistol.onFireLimit()
{
    var reload = new Timer(game, true);
    // A timer manages reload events. Bool indicates it kills
    // itself when all events finish. Events call functions

    if (Phaser.Pointer.mouse.LEFT_BUTTON == 1)
    {
        reload.add(1000, fullBullets, pistol, pistol);
        reload.start();
    }
}

//pistols come with textures, which may be spritesheets
// this bool changes the frame per shot

pistol.bulletFrameCycle = true;



pistol = game.add.weapon( 6 , 'bullet' ); // 6 IS THE NUMBER OF BULLETS
pistol.trackSprite( character , 25 , -25 , true ); // 25, -25 IS THE OFFSET OF THE BULLET RESPECT TO THE CHARACTER
pistol.bulletKillType = Phaser.Weapon.KILL_DISTANCE; // KILL THE BULLET WHEN IT REACHES A CERTAIN DISTANCE
pistol.bulletKillDistance = 300; // THE DISTANCE TO KILL THE BULLET
pistol.bulletSpeed = 250; // THE SPEED OF THE BULLET
pistol.fireRate = 100; // THE FIRE RATE OF THE BULLET
pistol.bulletAngleVariance = 20; // THE VARIANCE OF THE ANGLE OF THE BULLET
    

ShootPistol () // SHOOT THE PISTOL. A SINGLE CLICK SHOOTS THE 6 BULLETS
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

FullBullets ( weapon ) // RELOAD ALL THE BULLETS OF EVERY TYPE OF WEAPON
{
    weapon.quantity = -1;
}


class Weapon
{
    constructor ( nbullets, sprite, distance, speed, rate, variance)
    {
        core = game.add.weapon( nbullets , sprite ); // 6 IS THE NUMBER OF BULLETS
        core.trackSprite( character , 25 , -25 , true ); // 25, -25 IS THE OFFSET OF THE BULLET RESPECT TO THE CHARACTER
        core.bulletKillType = Phaser.Weapon.KILL_DISTANCE; // KILL THE BULLET WHEN IT REACHES A CERTAIN DISTANCE
        core.bulletKillDistance = distance; // THE DISTANCE TO KILL THE BULLET
        core.bulletSpeed = speed; // THE SPEED OF THE BULLET
        core.fireRate = rate; // THE FIRE RATE OF THE BULLET
        core.bulletAngleVariance = variance; // THE VARIANCE OF THE ANGLE OF THE BULLET
    }

    static Shoot () // SHOOT. A SINGLE CLICK SHOOTS ALL BULLETS
    {
        let bulletsshoots = core.shots; // GET THE NUMBER OF BULLETS SHOT

        // TO TRACK THE REMAINING BULLETS IN A ‘MAGAZINE’ IN PHASER, YOU MUST COUNT THE SHOTS. 
        // PHASER.WEAPON LACKS A FUNCTION FOR THIS, SO WE USE PISTOL.SHOTS, WHICH COUNTS THE SHOTS SINCE THE LAST RESET.
        
        let canShoot = game.input.activePointer.leftButton.isDown && bulletsshoots == 0;
        let isShooting = bulletsshoots > 0 && bulletsshoots < nbullets;
        let needsReload = bulletsshoots == nbullets;

        if ( canShoot ) // EACH CLICK FIRES A BULLET IF NONE HAS BEEN FIRED SINCE THE LAST RESET, INCREMENTING THE COUNTER.
        {
            core.fireAtPointer( game.input.activePointer );  
        }
        else if ( isShooting )
        {
            core.fireAtPointer( game.input.activePointer );
        }   
        else if ( needsReload ) // ONCE ALL 6 BULLETS ARE FIRED, THE COUNTER IS RESET TO RESTART THE PROCESS.
        {
            bulletsshoots = core.resetShots();
        }
    }

    FullBullets ( weapon ) // RELOAD ALL THE BULLETS OF EVERY TYPE OF WEAPON
    {
        weapon.quantity = -1;
    }

}
// pistola (6, 'bullet', 300, 250, 100, 20);
/*
class Weapon
{
    constructor ( x , y , sprite )
    {
        this.sprite = game.add.sprite( x , y , sprite );
        game.physics.arcade.enable( this.sprite );
        this.sprite.anchor.setTo( ANCHOR_X , ANCHOR_Y );

    }
}
*/

class Enemy
{
    static enemyGroup = {};

    constructor ( x , y , zoneNumber , sprite )
    {
        this.sprite = game.add.sprite( x , y , sprite );
        game.physics.arcade.enable( this.sprite );
        this.sprite.anchor.setTo( ANCHOR_X , ANCHOR_Y );
        this.zoneNumber = zoneNumber;

        this.posx = this.sprite.x;
        this.posy = this.sprite.y;

        // IT ADDS THE ENEMY TO THE GROUP OF THE SPECIFIED ZONE

        let groupDoesntExist = ! Enemy.enemyGroup[ zoneNumber ];

        if ( groupDoesntExist )
        {
            Enemy.enemyGroup[ zoneNumber ] = game.add.group();
        }

        Enemy.enemyGroup[ zoneNumber ].add( this.sprite );
    }

    static NumberOfEnemies ( zoneNumber ) // GET THE NUMBER OF ENEMIES IN A SPECIFIC ZONE
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

    static basicPatrol(margenx1, margeny1, margenx2, margeny2, velocity = 100)
    {
        if (posx == this.sprite.x && posy == this.sprite.y)
        {
            posx = Math.random() * (margenx2 - margenx1);
            posy = Math.random() * (margeny2 - margeny1);
        }
        else{
            this.physics.arcade.moveToXY(this.sprite, posx, posy, velocity);
        }
    }


    static moveEnemy (player, distance = 200,  velocity = 100)
    {
        if (game.physics.arcade.distanceBetween(player, this.sprite) < distance)
        {
            game.physics.arcade.moveToObject(this.sprite, player, velocity);
        }else {
            this.basicPatrol(0, 600*zoneNumber, 2400, 600*(zoneNumber+1), velocity);
        }
    }
    
}

