class Fish
{
	constructor( pos )
	{
		this.pos = pos.Copy()
		this.flipped = NekoUtils.Choose()
		this.hitbox = null
		this.testCol = "blue"
	}
	
	Draw( nekoCam )
	{
		if( Fish.spr.loaded )
		{
			if( this.hitbox == null )
			{
				this.hitbox = new Hitbox( this.pos.x,this.pos.y,
					Fish.spr.GetWidth(),
					Fish.spr.GetHeight() )
				this.hitbox.MoveTo( this.pos.x,this.pos.y )
			}
			
			this.hitbox.Draw( nekoCam,this.testCol )
			nekoCam.DrawSprite( Fish.spr,this.pos,this.flipped,true )
		}
	}
}

Fish.spr = new Sprite( "Images/Fish.png" )