class OptionalWeapons
{
    constructor ( nbullets , sprite , distance , speed , rate , variance , weaponType , maxMagazines, sound )
    {
        this.core = game.add.weapon( nbullets , sprite ); // CREATE THE WEAPON
        this.core.trackSprite( characterOptional , WEAPON_OFFSET_X , WEAPON_OFFSET_Y , true ); // TRACK THE CHARACTER
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
        this.sound = sound; // THE SOUND OF THE WEAPON
        this.distance = distance;
        this.lanceisback = true;
        this.lancedistance = 0;
        this.lanceiscoming = false;
        this.ycoord = 0;
        this.xcoord = 0;
        this.changed = false;

        if ( this.weaponType == 'flamethrower' )
        {
            this.core.setBulletFrames( 0 , nbullets - 1 , true ); // SET THE FRAMES OF THE BULLET
        }
    }

    shootFlame () 
    {
        let shotsThatHaveBeenShot = this.core.shots; // GET THE NUMBER OF BULLETS SHOT
        
        let canShoot = game.input.activePointer.leftButton.isDown && shotsThatHaveBeenShot == 0;
        let isShooting = shotsThatHaveBeenShot > 0 && shotsThatHaveBeenShot < this.nbullets;
        let needsReload = shotsThatHaveBeenShot == this.nbullets;
        
        if ( canShoot ) // EACH CLICK FIRES A BULLET IF NONE HAS BEEN FIRED SINCE THE LAST RESET, INCREMENTING THE COUNTER.
        {
            this.sound.play();
            this.core.fireAtPointer( game.input.activePointer );  
        }
        else if ( isShooting )
        {
            this.core.fireAtPointer( game.input.activePointer );
        }   
        else if ( needsReload ) // ONCE ALL 6 BULLETS ARE FIRED, THE COUNTER IS RESET TO RESTART THE PROCESS.
        {
            shotsThatHaveBeenShot = this.core.resetShots();
        }     
    }

    shootGrenade () 
    {
        let shotsThatHaveBeenShot = this.core.shots;
        let canShoot = game.input.activePointer.leftButton.isDown;
        let needsReload = shotsThatHaveBeenShot == this.nbullets;

        if (canShoot)
        {
            this.sound.play();
            this.core.fireAtPointer( game.input.activePointer );
            // Create a tween that scales the bullet up and then down
            let scaleUp = game.add.tween(this.core.bullets.getAt(0).scale).to({x: 2, y: 2}, 500, Phaser.Easing.Linear.None);
            let scaleDown = game.add.tween(this.core.bullets.getAt(0).scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None);

            // Chain the tweens together so they run one after the other
            scaleUp.chain(scaleDown);

            // Start the first tween
            scaleUp.start();
        }
        else if ( needsReload )
        {
            if ( ! this.delayShoot )
            {
                this.delayShoot = true;

                setTimeout( function() {
                    this.shotsThatHaveBeenShot = this.core.resetShots();
                    this.delayShoot = false;
                }.bind( this ), 2000 );  
            } 
        }   
    }

    shootMine()
    {
        this.core.bulletSpeed = 0;
        let shotsThatHaveBeenShot = this.core.shots;
        let canShoot = game.input.activePointer.leftButton.isDown;
        let needsReload = shotsThatHaveBeenShot == this.nbullets;

        if ( canShoot )
        {
            this.sound.play();
            this.core.fireAtPointer( game.input.activePointer );

        }else if ( needsReload )
        {
            shotsThatHaveBeenShot = this.core.resetShots();
        }  
    }

    shootLance()
    {
        this.core.bulletKillType = Phaser.Weapon.KILL_NEVER;
        let canShoot = game.input.activePointer.leftButton.isDown && this.lanceisback;

        if ( canShoot )
        {
            this.sound.play();
            this.xcoord = characterOptional.x;
            this.ycoord = characterOptional.y;
            this.core.fireAtPointer( game.input.activePointer );
            this.lanceisback = false;
        }
        else if ( !this.lanceisback )
        {
            if ( ! this.lanceiscoming && this.lancedistance >= this.distance )
            {
                this.lanceiscoming = true;
            }
            else if ( this.lanceiscoming && ! this.changed )
            {
                this.changed = true;
                this.core.bullets.getAt( 0 ).body.velocity.x = -this.core.bullets.getAt(0).body.velocity.x;
                this.core.bullets.getAt( 0 ).body.velocity.y = -this.core.bullets.getAt(0).body.velocity.y;
            }
            else if ( this.lancedistance <= 50 && this.lanceiscoming )
            {
                this.core.bullets.getAt( 0 ).body.velocity.x = 0;
                this.core.bullets.getAt( 0 ).body.velocity.y = 0;
            }

            this.lancedistance = Phaser.Math.distance( this.xcoord , this.ycoord , this.core.bullets.getAt( 0 ).x , this.core.bullets.getAt( 0 ).y );
        }
    }
}