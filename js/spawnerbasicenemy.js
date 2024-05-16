class SpawnerBasicEnemy
{
    constructor ( zoneNumber , sprite )
    {
        // IT ADDS THE ENEMY TO THE GROUP OF THE SPECIFIED ZONE

        switch ( zoneNumber )
        {
            case 1:
                basicEnemiesZone1 = game.add.group();
                basicEnemiesZone1.enableBody = true;
                basicEnemiesZone1.createMultiple( ZONE_1_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone1.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                basicEnemiesZone1.maxEnemies = this.getMaxEnemies(zoneNumber);
                basicEnemiesZone1.currentEnemies = 0;
                break;
            case 2:
                basicEnemiesZone2 = game.add.group();
                basicEnemiesZone2.enableBody = true;
                basicEnemiesZone2.createMultiple( ZONE_2_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone2.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                basicEnemiesZone2.maxEnemies = this.getMaxEnemies(zoneNumber);
                basicEnemiesZone2.currentEnemies = 0;
                break;
            case 3:
                basicEnemiesZone3 = game.add.group();
                basicEnemiesZone3.enableBody = true;
                basicEnemiesZone3.createMultiple( ZONE_3_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone3.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                basicEnemiesZone3.maxEnemies = this.getMaxEnemies(zoneNumber);
                basicEnemiesZone3.currentEnemies = 0;
                break;
            case 4:
                basicEnemiesZone4 = game.add.group();
                basicEnemiesZone4.enableBody = true;
                basicEnemiesZone4.createMultiple( ZONE_4_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone4.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                basicEnemiesZone4.maxEnemies = this.getMaxEnemies(zoneNumber);
                basicEnemiesZone4.currentEnemies = 0;
                break;
            case 5:
                basicEnemiesZone5 = game.add.group();
                basicEnemiesZone5.enableBody = true;
                basicEnemiesZone5.createMultiple( ZONE_5_MAX_ENEMIES * difficultyMultiplier , sprite );
                basicEnemiesZone5.callAll( 'anchor.setTo' , 'anchor' , BASIC_ENEMIES_ANCHOR_X , BASIC_ENEMIES_ANCHOR_Y );
                basicEnemiesZone5.maxEnemies = this.getMaxEnemies(zoneNumber);
                basicEnemiesZone5.currentEnemies = 0;
                break;
            default:
                break;
        }
    }

    getMaxEnemies ( zoneNumber )
    {
        switch (zoneNumber) {
            case 1: return 20 * difficultyMultiplier;
            case 2: return 15 * difficultyMultiplier;
            case 3: return 10 * difficultyMultiplier;
            case 4: return 7 * difficultyMultiplier;
            case 5: return 5 * difficultyMultiplier;
            default: return 0;
        }
    }

    MoveEnemies ( zoneNumber )
    {
        switch (zoneNumber)
        {
            case 1:
                basicEnemiesZone1.forEach( this.MoveSingleEnemy , this , zoneNumber );
                break;
            case 2:
                basicEnemiesZone2.forEach( this.MoveSingleEnemy , this , zoneNumber );
                break;
            case 3:
                basicEnemiesZone3.forEach( this.MoveSingleEnemy , this , zoneNumber );
                break;
            case 4:
                basicEnemiesZone4.forEach( this.MoveSingleEnemy , this , zoneNumber );
                break;
            case 5:
                basicEnemiesZone5.forEach( this.MoveSingleEnemy , this , zoneNumber );
                break;
            default:
                break;
        }
    }

    MoveSingleEnemy ( enemy , zoneNumber )
    {
        if ( ! isBuyingReloads )
        {
            if ( enemy.x == character.x && enemy.y == character.y )
            {
                enemy.body.velocity.x = 0;
                enemy.body.velocity.y = 0;
            }
            else if ( game.physics.arcade.distanceBetween( character , enemy ) < DISTANCE_DETECTION_ENEMY )
            {
                if ( enemy.y < 2850 )
                {
                    enemy.x < 0 || enemy.x > WORLD_WIDTH ? enemy.body.velocity.x *= -1 : game.physics.arcade.moveToObject( enemy , character , DEFAULT_VELOCITY_ENEMY );
    
                    enemy.y < ZONES_HEIGHT * ( zoneNumber - 1 ) || enemy.y > ZONES_HEIGHT * zoneNumber ? enemy.body.velocity.y *= -1 : game.physics.arcade.moveToObject( enemy , character , DEFAULT_VELOCITY_ENEMY );
                }
            }
            else
            {
                let minusOrPlusX = Math.floor( Math.random() * 2 );
                let minusOrPlusY = Math.floor( Math.random() * 2 );
    
                minusOrPlusX = minusOrPlusX == 0 ? -1 : 1;
                minusOrPlusY = minusOrPlusY == 0 ? -1 : 1;
    
                let enemyVelocityX = Math.floor( Math.random() * Math.floor(Math.random() * DEFAULT_VELOCITY_ENEMY) * minusOrPlusX );
                let enemyVelocityY = Math.floor( Math.random() * Math.floor(Math.random() * DEFAULT_VELOCITY_ENEMY) * minusOrPlusY );
    
                enemy.x < 0 || enemy.x > WORLD_WIDTH ? enemy.body.velocity.x = -enemyVelocityX : enemy.body.velocity.x = enemyVelocityX;
                enemy.y < ZONES_HEIGHT * ( zoneNumber - 1 ) || enemy.y > ZONES_HEIGHT * zoneNumber ? enemy.body.velocity.y = -enemyVelocityY : enemy.body.velocity.y = enemyVelocityY;
            }

            if ( enemy.y >= MAX_POS_Y_ENEMIES )
            {
                enemy.kill();
            }
        }
        else
        {
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = 0;
        }
    }
    
    SpawnEnemies ( zoneNumber )
    {
        let canSpawn;

        switch ( zoneNumber )
        {
            case 1: 
                canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN && basicEnemiesZone1.currentEnemies < basicEnemiesZone1.maxEnemies;
                break;
            case 2:
                canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN && basicEnemiesZone2.currentEnemies < basicEnemiesZone2.maxEnemies;
                break;
            case 3:
                canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN && basicEnemiesZone3.currentEnemies < basicEnemiesZone3.maxEnemies;
                break;
            case 4:
                canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN && basicEnemiesZone4.currentEnemies < basicEnemiesZone4.maxEnemies;
                break;
            case 5:
                canSpawn = Math.random() < PROBABILITY_BASIC_ENEMY_SPAWN && basicEnemiesZone5.currentEnemies < basicEnemiesZone5.maxEnemies;
                break;
            default:
                break;
        }

        if ( canSpawn )
        {
            let enemy;

            switch ( zoneNumber )
            {
                case 1:
                    enemy = basicEnemiesZone1.getFirstExists( false );
                    break;
                case 2:
                    enemy = basicEnemiesZone2.getFirstExists( false );
                    break;
                case 3:
                    enemy = basicEnemiesZone3.getFirstExists( false );
                    break;
                case 4:
                    enemy = basicEnemiesZone4.getFirstExists( false );
                    break;
                case 5:
                    enemy = basicEnemiesZone5.getFirstExists( false );
                    break;
                default:
                    break;
            }

            if ( enemy )
            {
                let possibleXCoordinates = WORLD_WIDTH - enemy.body.width;
                let xRandomSpawnCoordinate = Math.floor( Math.random() * possibleXCoordinates );
                let xSpawnCoordinate = enemy.body.width / 2 + xRandomSpawnCoordinate;

                let barrierAbove = ZONES_HEIGHT * ( zoneNumber - 1 );
                let barrierBelow = ZONES_HEIGHT * zoneNumber;

                let possibleYCoordinates = 2750;

                let yRandomSpawnCoordinate;

                do
                {
                    yRandomSpawnCoordinate = Math.floor( Math.random() * possibleYCoordinates );
                } while ( yRandomSpawnCoordinate < barrierAbove || yRandomSpawnCoordinate > barrierBelow);

                let ySpawnCoordinate = enemy.body.height / 2 + yRandomSpawnCoordinate;

                enemy.reset( xSpawnCoordinate , ySpawnCoordinate );
            }
        }
    }
}