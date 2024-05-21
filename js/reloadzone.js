class ReloadZone
{
    static AddReloadZone ( x , y )
    {
        this.x = x;
        this.y = y;
        let rec_ammo = rec_ammo_group.create( this.x , this.y , 'rec_ammo' );
        rec_ammo.anchor.setTo( 0.5 , 0.5 );
        rec_ammo.scale.setTo( 2 );
        rec_ammo.body.immovable = true;
    }

    static ReloadCharacter (weapon)
    {
        weapon.numberOfReloads = 0;
        totalBlueTint -= RELOAD_COST;
        blue_tint_counter.text = totalBlueTint;
        needsToReload = false;
    }
}