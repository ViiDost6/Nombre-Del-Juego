class SpawnerBasicEnemyOptional
{
    constructor ( sprite )
    {
        basicEnemiesOptional = game.add.group();
        basicEnemiesOptional.enableBody = true;
        basicEnemiesOptional.createMultiple( ZONE_1_MAX_ENEMIES * difficultyMultiplier , sprite );
        basicEnemiesOptional.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
        /* basicEnemiesOptional.maxEnemies = this.getMaxEnemies();
        basicEnemiesOptional.currentEnemies = 0; */
    }

    /* getMaxEnemies ()
    {
        return 20 * difficultyMultiplier;
    } */

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
        let canSpawn;

        canSpawn = true;

        console.log( 'Basic Enemy Optional can spawn: ' + canSpawn );

        if ( canSpawn )
        {
            // let enemy = basicEnemiesOptional.getFirstExists( false );

            let enemy = game.add.sprite( WORLD_WIDTH_OPTIONAL / 2 , WORLD_HEIGHT_OPTIONAL / 2 , 'basicEnemyOptional' );

            console.log( enemy );

            if ( enemy )
            {
                let possibleXCoordinates = WORLD_WIDTH_OPTIONAL - enemy.body.width;
                let xRandomSpawnCoordinate = Math.floor( Math.random() * possibleXCoordinates );
                let xSpawnCoordinate = enemy.body.width / 2 + xRandomSpawnCoordinate;

                let possibleYCoordinates = WORLD_HEIGHT_OPTIONAL - enemy.body.height;
                let yRandomSpawnCoordinate = Math.floor( Math.random() * possibleYCoordinates );
                let ySpawnCoordinate = enemy.body.height / 2 + yRandomSpawnCoordinate;

                enemy.reset( xSpawnCoordinate , ySpawnCoordinate );
                console.log( 'Basic Enemy Optional spawned at: ' + xSpawnCoordinate + ' ' + ySpawnCoordinate );
            }
        }
    }
}