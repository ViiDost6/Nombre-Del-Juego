//---------------------------------------------------------------------------------
// Weapons used in-game
//---------------------------------------------------------------------------------

const { Weapon, Bullet } = require("phaser-ce");

//----------------------------------------------------------------------
// Universal functions all weapons use on callbacks

function fullBullets(weapon)
{
    weapon.quantity = -1;
    // This number sets all chargers to max
}



//----------------------------------------------------------------------------------
// Pistol weapon
//----------------------------------------------------------------------------------

var pistol = this.add.weapon(6, 'bullet'); 
var pistolIs = false;
// creation vars are (charger-size, bullet-textures, bullet-frame, weapon-group, class-of-bullets-used)
// bool for knowing which weapon is equipped so controls work

pistol.trackSprite(character, 0, 0, true);

if (pistolIs && Phaser.Pointer.mouse.LEFT_BUTTON == 1)
{
    pistol.fire(null, null, null, 0, 0);
    // Nulls are set so fire follows the tracked sprite defined
}
// sets fire position, and key control. angles and position are managed with spriteTracker

pistol.bulletKillDistance(100);
// pixels until the bullet instance gets killed

pistol.bulletSpeed(100);
// how many pixels per second the bullet travels

pistol.fireRate(100);
// miliseconds until next bullet can be fired

pistol.onFireLimit()
{
    var reload = new Timer(game, true);
    // A timer manages reload events. Bool indicates it kills
    // itself when all events finish. Events call functions

    if (Phaser.Pointer.mouse.LEFT_BUTTON == 1)
    {
        reload.add(1000, fullBullets, pistol, pistol);
        reload.start();
    }
}