class AdvancedEnemyOptional
{
    constructor ( x , y , sprite , bulletSprite )
    {
        this.x = x;
        this.y = y;
        this.sprite = advancedEnemiesOptional.create( x , y , sprite );
        this.sprite.anchor.setTo( 0.5 , 0.5 );
        this.bulletSprite = bulletSprite;
        this.enemyWeaponOptional = game.add.weapon( 1000 , this.bulletSprite );
        this.enemyWeaponOptional.trackSprite( this.sprite , 10 , -25 , true );
        this.enemyWeaponOptional.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.enemyWeaponOptional.bulletSpeed = 800;
        this.enemyWeaponOptional.fireRate = 1000;
        this.enemyWeaponOptional.bulletAngleVariance = 5;
        this.triggerTimer = game.time.events.loop( 1000 , this.firefunction , this );
    }

    firefunction ()
    {
        if ( this.sprite.alive )
        {
            this.enemyWeaponOptional.fire();
        }
    }
}