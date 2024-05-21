class AdvancedEnemyOptional
{
    constructor ( sprite , bulletSprite )
    {
        advancedEnemiesOptional = game.add.group();
        advancedEnemiesOptional.enableBody = true;
        advancedEnemiesOptional.createMultiple( ZONE_1_MAX_ENEMIES * difficultyMultiplier , sprite );
        advancedEnemiesOptional.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_X );

        this.sprite = advancedEnemiesGroup.create( x , y , sprite )
        this.sprite.anchor.setTo( 0.5 , 0.5 );
        this.bulletSprite = bulletSprite;

        this.enemyWeapon = game.add.weapon( 1000 , this.bulletSprite );
        this.enemyWeapon.trackSprite( this.sprite , 10 , -25 , true );
        this.enemyWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.enemyWeapon.bulletSpeed = 800;
        this.enemyWeapon.fireRate = 1000;
        this.enemyWeapon.bulletAngleVariance = 5;
        

        this.triggerTimer = game.time.events.loop( 1000 , this.firefunction , this );
        if ( this.sprite.x == 100 )
        {
            this.sprite.rotation = Phaser.Math.degToRad(0);
        }
        else
        {
            this.sprite.rotation = Phaser.Math.degToRad(180);
        }
    }

    firefunction (){
        if ( this.sprite.alive )
        {
            console.log( this.sprite.alive );
            this.enemyWeapon.fire();
        }
    }
}