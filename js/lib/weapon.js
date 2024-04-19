//---------------------------------------------------------------------------------
// Weapons used in-game
//---------------------------------------------------------------------------------

const { Weapon, Bullet } = require("phaser-ce");

//----------------------------------------------------------------------------------
// Pistol weapon
//----------------------------------------------------------------------------------

var pistol = this.add.Weapon(6, 'bullet'); 
// creation vars are (charger-size, bullet-textures, bullet-frame, weapon-group, class-of-bullets-used)

pistol.fireFrom.set(character.x, character.y);
pistol.input.onLeftClick.add(pistol.fire, this);
// sets fire position, and key control

let angle = game.physics.arcade.angleToPointer( character );
pistol.bulletAngleOffset(angle + 90);
// gets the angle the character looks when firing, then rotates the bullet

pistol.bulletKillDistance(100);
// pixels until the bullet instance gets killed

pistol.bulletSpeed(10);
// how many pixels per second the bullet travels

pistol.fireRate(6);
// milisecond until next bullet can be fired

//----------------------------------------------------------------------------------
// End of pistol definition
//----------------------------------------------------------------------------------


