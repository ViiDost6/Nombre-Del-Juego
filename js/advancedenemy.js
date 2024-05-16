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