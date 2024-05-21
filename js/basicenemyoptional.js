class SpawnerBasicEnemyOptional
{
    constructor ( sprite )
    {
        basicEnemiesOptional = game.add.group();
        basicEnemiesOptional.enableBody = true;
        basicEnemiesOptional.createMultiple( ZONE_1_MAX_ENEMIES * difficultyMultiplier , sprite );
        basicEnemiesOptional.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
    }

    MoveEnemies ()
    {
        basicEnemiesOptional.forEach( this.MoveSingleEnemy , this );
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
    
    SpawnEnemies ()
    {
        let possibleXCoordinates = WORLD_WIDTH_OPTIONAL - 48;
        let xRandomSpawnCoordinate = Math.floor( Math.random() * possibleXCoordinates );
        let xSpawnCoordinate = 48 / 2 + xRandomSpawnCoordinate;

        let possibleYCoordinates = WORLD_HEIGHT_OPTIONAL - 50;
        let yRandomSpawnCoordinate = Math.floor( Math.random() * possibleYCoordinates );
        let ySpawnCoordinate = 50 / 2 + yRandomSpawnCoordinate;

        
        basicEnemiesOptional.create( xSpawnCoordinate , ySpawnCoordinate , 'basicEnemyOptional' );
    }
}