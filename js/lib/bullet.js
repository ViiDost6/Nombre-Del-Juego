//---------------------------------------------------------------------------
// Bullet Class

const { Game } = require("phaser-ce");

//---------------------------------------------------------------------------
class bullet
{
    constructor(x, y, dmg)
    {
        this.x      = x;
        this.y      = y;
        this.dmg    = dmg;

        let x       = player.x;
        let y       = player.y;
        let dmg     = 1;
    }
}
//---------------------------------------------------------------------------
//End of Bullet Class
//---------------------------------------------------------------------------


//----------------------------------------------------------------------------
// Weapon Class
//----------------------------------------------------------------------------
class weapon
{
    constructor(name, dmgMult, dist, reload, nBullets, type)
    {
        this.name = name;
        this.dmgMult = dmgMult;
        this.dist = dist;
        this.reload = reload;
        this.nBullets = nBullets;
        this.type = type;
    }

    shoot()
    {
        if (this.type == 0)
        {
            this.nBullets = 6;
            
        }
    }
}
//---------------------------------------------------------------------------
// End of weapon class
//---------------------------------------------------------------------------

// Defined weapons ----------------------------------------------------------
