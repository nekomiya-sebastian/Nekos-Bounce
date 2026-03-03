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
		this.jumpPow = 7.5
		this.jumpUpForce = 4.5
		this.grav = 0.5
		this.jumping = false
		
		this.checkDirs = Vec2.Ordinals()
	}
	
	Update( mouse,nekoCam,dt,tower )
	{
		if( this.loaded )
		{
			this.idleAnim.Update( dt )
			
			const mousePos = nekoCam.GetMouseWorldPos( mouse )
			if( mouse.down && !this.jumping ) this.Jump( mousePos )
			
			const moveAmount = Math.min( this.hSize.x,this.hSize.y ) * 0.3
			// const scaledVel = this.vel.Copy().Scale( dt )
			// const nMoves = Math.ceil( scaledVel.GetDist() / maxMoveAmount )
			let curDist = this.vel.GetDist() * dt // this is how far we need to travel this turn
			let xDist = this.vel.x * dt
			let yDist = this.vel.y * dt
			const velDir = this.vel.Copy().Normalize()
			
			while( curDist > 0.0 )
			{
				const testPos = this.pos.Copy().Add( velDir.Copy().Scale( Math.min( curDist,moveAmount ) ) )
				curDist -= moveAmount
				
				let canMove = true
				
				for( const dir of this.checkDirs )
				{
					const checkPos = testPos.Copy().Add( dir.Copy().MultiplyVec( this.hSize ) )
					const hitTile = tower.World2TilePos( checkPos )
					if( tower.GetTile( hitTile.x,hitTile.y ) == 1 )
					{
						const hitTilePos = tower.Tile2WorldPos( hitTile )
						const diff = testPos.Copy().Subtract( hitTilePos )
						
						if( Math.abs( diff.x ) > Math.abs( diff.y ) )
						{
							// console.log( "bounce x " + diff.x + ", " + diff.y )
							if( diff.x > 0 ) this.vel.x = Math.abs( this.vel.x )
							else this.vel.x = -Math.abs( this.vel.x )
						}
						else
						{
							// console.log( "bounce y " + diff.x + ", " + diff.y )
							if( diff.y > 0 ) this.vel.y = Math.abs( this.vel.y )
							// else this.vel.y = -Math.abs( this.vel.y )
							else // stop jump when hit floor
							{
								this.vel.SetXY( 0,0 )
								canMove = false
								this.jumping = false
							}
						}
						
						curDist = -1 // stop looping if we hit a tile
					}
				}
				
				// if( testPos.x < nekoCam.GetCamArea().left + this.hSize.x ) this.vel.x = Math.abs( this.vel.x )
				// else if( testPos.x > nekoCam.GetCamArea().right - this.hSize.x ) this.vel.x = -Math.abs( this.vel.x )
				// 
				// if( testPos.y > nekoCam.GetCamArea().bot - this.hSize.y )
				// {
				// 	this.vel.SetXY( 0,0 )
				// 	canMove = false
				// 	this.jumping = false
				// }
				
				if( canMove )
				{
					this.pos = testPos
					
					this.hitbox.MoveTo( this.pos.x,this.pos.y )
				}
			}
			
			this.vel.y += this.grav * dt
		}
		else if( this.idleAnim.Loaded() )
		{
			this.loaded = true
			
			this.hitbox = new Hitbox( 0,0,
				this.idleAnim.GetSize().x,
				this.idleAnim.GetSize().y )
			this.hitbox.MoveTo( this.pos.x,this.pos.y )
			
			this.hSize = this.hitbox.GetSize().Copy().Divide( 2 )
		}
	}
	
	Draw( nekoCam,tower )
	{
		// if( this.hitbox != null ) this.hitbox.Draw( nekoCam,"orange" )
		
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