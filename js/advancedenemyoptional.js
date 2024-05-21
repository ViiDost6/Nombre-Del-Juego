class AdvancedEnemyOptional
{
    constructor ()
    {
        advancedEnemiesOptional = game.add.group();
        advancedEnemiesOptional.enableBody = true;
        advancedEnemiesOptional.createMultiple( ZONE_1_MAX_ENEMIES * difficultyMultiplier , 'grapadoraOptional' );
        advancedEnemiesOptional.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_X );
    }

    MoveEnemies ()
    {
        advancedEnemiesOptional.forEach( this.MoveSingleEnemy , this );
    }

    MoveSingleEnemy ( enemy )
    {
        if ( enemy.x == characterOptional.x && enemy.y == characterOptional.y )
        {
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = 0;
        }
        else
        {
            game.physics.arcade.moveToObject( enemy , characterOptional , DEFAULT_VELOCITY_ENEMY );
        }
    }

    Fire ()
    {
        advancedEnemiesOptional.forEach( this.firefunction , this );
    }

    firefunction (enemy)
    {
        if ( enemy.sprite.alive )
        {
            enemy.enemyWeaponOptional.fire();
        }
    }

    SpawnEnemies ()
    {
        let possibleXCoordinates = WORLD_WIDTH_OPTIONAL - 48;
        let xRandomSpawnCoordinate = Math.floor( Math.random() * possibleXCoordinates );
        let xSpawnCoordinate = 48 / 2 + xRandomSpawnCoordinate;

        let possibleYCoordinates = WORLD_HEIGHT_OPTIONAL - 50;
        let yRandomSpawnCoordinate = Math.floor( Math.random() * possibleYCoordinates );
        let ySpawnCoordinate = 50 / 2 + yRandomSpawnCoordinate;

        
        let enemy = advancedEnemiesOptional.create( xSpawnCoordinate , ySpawnCoordinate , 'grapadoraOptional' );

        enemy.enemyWeaponOptional = game.add.weapon( 1000 , 'grapasOptional' );
        enemy.enemyWeaponOptional.trackSprite( enemy.sprite , 10 , -25 , true );
        enemy.enemyWeaponOptional.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        enemy.enemyWeaponOptional.bulletSpeed = 800;
        enemy.enemyWeaponOptional.fireRate = 1000;
        enemy.enemyWeaponOptional.bulletAngleVariance = 5;
        

        enemy.triggerTimer = game.time.events.loop( 1000 , enemy.Fire , this );
    }
}