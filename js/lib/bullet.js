
//----------------------------------------------------------------------------
// Weapon Class

const { Bullet } = require("phaser-ce");

//----------------------------------------------------------------------------
class weapon
{
    constructor(type, name, dmgMult, dist, reload, nBullets)
    {
        this.type = type;
        this.name = name;
        this.dmgMult = dmgMult;
        this.dist = dist;
        this.reload = reload;
        this.nBullets = nBullets; 

        if (type = 0)
        {
            let name = 'Base';
            let dmgMult = 1;
            let dist = 100;
            let reload = 0.1;
            let nBullets = 6;
        }
    }

    shoot(character)
    {
        if (this.type = 0)
        {
            let angle = game.physics.arcade.angleToPointer( character );
            angle = angle + Phaser.Math.degToRad( 90 );
            
            let bullet = new Bullet(game, character.x, character.y);
        }
    }
}
//---------------------------------------------------------------------------
// End of weapon class
//---------------------------------------------------------------------------

// Defined weapons ----------------------------------------------------------
