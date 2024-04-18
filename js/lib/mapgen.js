//Global constants used------------------------------------
const enemyMulti = 10;
const interactMulti = 3;
const genMax = 3;
//-----------------------------------------------------------------------------------------------
// Map Generator Class
//-----------------------------------------------------------------------------------------------
class mapGen
{
    constructor(x1, y1, x2, y2, level, enemyCount, enemyMaxCount, interactCount, interactMaxCount)
    {
        this.x1     = x1;
        this.y2     = y1;
        this.x2     = x2;
        this.y2     = y2;
        this.level  = level;

        this.enemyCount          = enemyCount;
        this.enemyMaxCount       = enemyMaxCount;

        this.interactCount       = interactCount;
        this.interactMaxCount    = interactMaxCount;

        let enemyCount          = 0;
        let enemyMaxCount       = level * enemyMulti;

        let interactCount       = 0;
        let interactMaxCount    = level * interactMulti;
    }

    //Enemy generator
    enemyGen ()
    {
        if (this.enemyCount < this.enemyMaxCount) 
        {
            //Generates an random number of enemies to be created
            var rr = Math.floor(Math.random() * (genMax * this.level));
            
            //Defines the maximum count of enemies and creates them
            if (this.enemyCount + rr >= this.enemyMaxCount)
            {
                this.enemyCount = this.enemyMaxCount;
            }
            else
            {
                this.enemyCount = this.enemyCount + rr;
            }
        }
    }
}
//---------------------------------------------------------------------------------------------------
//End of mapGen class
//---------------------------------------------------------------------------------------------------

class enemy
{
    constructor (x, y, type)
    {
        this.x      = x;
        this.y      = y;
        this.type   = type;
    }
}

class interactiveObject
{
    constructor(x, y, type)
    {
        this.x      = x;
        this.y      = y;
        this.type   = type;
    }
}