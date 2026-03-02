class BouncingNeko
{
	constructor( pos )
	{
		this.pos = pos
		
		this.idleAnim = new Anim( BouncingNeko.idleAnimSprArr )
		
		this.hitbox = null
		this.hSize = Vec2.Zero()
		
		this.loaded = false
		
		this.lookDir = new Vec2( NekoUtils.Choose() ? 1 : -1,0 )
		
		this.vel = Vec2.Zero()
		this.jumpPow = 0.15 * 24
		this.jumpUpForce = 0.08 * 24
		this.grav = 0.01 * 24
		this.jumping = false
	}
	
	Update( mouse,nekoCam,dt,bounceArea )
	{
		if( this.loaded )
		{
			this.idleAnim.Update( dt )
			
			const mousePos = nekoCam.GetMouseWorldPos( mouse )
			if( mouse.down && !this.jumping ) this.Jump( mousePos )
			
			const testPos = this.pos.Copy().Add( this.vel.Copy().Scale( dt ) )
			
			let canMove = true
			
			if( testPos.x < bounceArea.left + this.hSize.x ) this.vel.x = Math.abs( this.vel.x )
			else if( testPos.x > bounceArea.right - this.hSize.x ) this.vel.x = -Math.abs( this.vel.x )
			
			if( testPos.y > bounceArea.bot - this.hSize.y )
			{
				this.vel.SetXY( 0,0 )
				canMove = false
				this.jumping = false
			}
			
			if( canMove )
			{
				this.pos = testPos
				
				this.hitbox.MoveTo( this.pos.x,this.pos.y )
				
				this.vel.y += this.grav * dt
			}
		}
		else if( this.idleAnim.Loaded() )
		{
			this.loaded = true
			
			this.hitbox = new Hitbox( 0,0,
				this.idleAnim.GetSize().x,
				this.idleAnim.GetSize().y )
			
			this.hSize = this.hitbox.GetSize().Copy().Divide( 2 )
		}
	}
	
	Draw( nekoCam )
	{
		if( this.hitbox != null ) this.hitbox.Draw( nekoCam,"orange" )
		
		if( this.loaded )
		{
			if( this.jumping )
			{
				nekoCam.DrawSprite( BouncingNeko.jumpSpr,this.pos,this.vel.x > 0.0 )
			}
			else
			{
				this.idleAnim.Draw( this.pos,nekoCam,this.lookDir.x > 0.0 )
			}
		}
	}
	
	Jump( targetLoc )
	{
		if( !this.jumping )
		{
			this.jumping = true
			
			this.vel = targetLoc.Copy().Subtract( this.pos ).Normalize()
				.Scale( this.jumpPow )
				.Add( Vec2.Up().Scale( this.jumpUpForce ) )
		}
	}
}

BouncingNeko.idleAnimSprArr = Anim.GenSprArr( "Images/Cat",2 )
BouncingNeko.jumpSpr = new Sprite( "Images/Cat3.png" )