class OptionalWeapons
{
    constructor ( nbullets , sprite , distance , speed , rate , variance , weaponType , maxMagazines, sound )
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
        this.sound = sound; // THE SOUND OF THE WEAPON
        console.log( this.sound );
        this.distance = distance;
        this.lanceisback = true;
        this.lancedistance = 0;
        this.lanceiscoming = false;
        this.ycoord = 0;
        this.xcoord = 0;
    }

    shootflame () 
    {
        let shotsThatHaveBeenShot = this.core.shots; // GET THE NUMBER OF BULLETS SHOT
        // console.log( shotsThatHaveBeenShot );
        
        
        let canShoot = game.input.activePointer.leftButton.isDown && shotsThatHaveBeenShot == 0;
        let isShooting = shotsThatHaveBeenShot > 0 && shotsThatHaveBeenShot < this.nbullets;
        let needsReload = shotsThatHaveBeenShot == this.nbullets;
        
        if ( canShoot && isNotInSafeZone ) // EACH CLICK FIRES A BULLET IF NONE HAS BEEN FIRED SINCE THE LAST RESET, INCREMENTING THE COUNTER.
        {
            this.sound.play();
            this.core.fireAtPointer( game.input.activePointer );  
        }
        else if ( isShooting && isNotInSafeZone )
        {
            this.core.fireAtPointer( game.input.activePointer );
        }   
        else if ( needsReload && isNotInSafeZone ) // ONCE ALL 6 BULLETS ARE FIRED, THE COUNTER IS RESET TO RESTART THE PROCESS.
        {
            shotsThatHaveBeenShot = this.core.resetShots();
            this.numberOfReloads++;
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

        }else if ( needsReload )
        {
            if ( ! this.delayShoot ){
                this.delayShoot = true;
                setTimeout( function() {
                    this.shotsThatHaveBeenShot = this.core.resetShots();
                    this.delayShoot = false;
                }.bind(this), 2000 );  
            } 
        }   
    }

    shootMine()
    {
        this.core.bulletSpeed = 0;
        let shotsThatHaveBeenShot = this.core.shots;
        let canShoot = game.input.activePointer.leftButton.isDown;
        let needsReload = shotsThatHaveBeenShot == this.nbullets;

        if (canShoot)
        {
            this.sound.play();
            this.core.fireAtPointer( game.input.activePointer );

        }else if ( needsReload )
        {
            if ( ! this.delayShoot ){
                this.delayShoot = true;
                setTimeout( function() {
                    this.shotsThatHaveBeenShot = this.core.resetShots();
                    this.delayShoot = false;
                }.bind(this), 2000 );  
            } 
        }  
    }

    shootLance()
    {
        this.core.bulletKillType = Phaser.Weapon.KILL_NEVER;
        
        
        let canShoot = game.input.activePointer.leftButton.isDown && lanceisback;

        if (canShoot)
        {
            this.xcoord = characterOptional.x;
            this.ycoord = characterOptional.y;
            this.sound.play();
            this.core.fireAtPointer( game.input.activePointer );
            this.lanceisback = false;
        }else if ( !this.lanceisback )
        {
            this.core.bullets.forEach( function( bullet ){
                if ( !this.lanceiscoming && this.lancedistance == this.distance )
                {
                    this.lanceiscoming = true;
                }else if ( this.lanceiscoming )
                {
                    bullet.body.velocity.x = -bullet.body.velocity.x;
                    bullet.body.velocity.y = -bullet.body.velocity.y;
                }else if (bullet.x == this.xcoord && bullet.y == this.ycoord )
                {
                    bullet.body.velocity.x = 0;
                    bullet.body.velocity.y = 0;
                }
            });
        }
    }
}