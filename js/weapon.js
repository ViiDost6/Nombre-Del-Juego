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
            if ( canShoot && isNotInSafeZone ) // EACH CLICK FIRES A BULLET IF NONE HAS BEEN FIRED SINCE THE LAST RESET, INCREMENTING THE COUNTER.
            {
                console.log( game.input.activePointer );
                this.core.fireAtPointer( game.input.activePointer );  
            }
            else if ( isShooting && isNotInSafeZone )
            {
                this.core.fireAtPointer( game.input.activePointer );
            }   
            else if ( needsReload && isNotInSafeZone ) // ONCE ALL 6 BULLETS ARE FIRED, THE COUNTER IS RESET TO RESTART THE PROCESS.
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