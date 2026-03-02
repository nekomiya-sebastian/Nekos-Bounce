class NekoCam
{
	constructor( gfx )
	{
		this.gfx = gfx
		
		// modifiable vals
		const pixelSize = 24 // # of pixels per unit
		this.camSize = new Vec2( 5,3.5 ).Scale( pixelSize )
		
		this.camPos = Vec2.Zero()
		const camHSize = this.camSize.Copy().Divide( 2 )
		this.camRect = new Rect( -camHSize.y,camHSize.y,-camHSize.x,camHSize.x )
		// this.screenRect = new Rect( 0,gfx.height,0,gfx.width )
		this.scale = 1
		// this.screenHSize = this.screenRect.GetHalfSize()
		this.screenHSize = new Vec2( gfx.width / 2,gfx.height / 2 )
		
		this.OnResize( this )
	}
	
	OnResize( self )
	{
		// self.screenRect.SetTBLR( 0,self.gfx.height,0,self.gfx.width )
		// self.screenHSize = self.screenRect.GetHalfSize()
		self.screenHSize.SetXY( self.gfx.width / 2,self.gfx.height / 2 )
		
		const xScale = self.gfx.width / self.camSize.x
		const yScale = self.gfx.height / self.camSize.y
		self.scale = Math.min( xScale,yScale )
	}
	
	MoveCam( move )
	{
		this.camPos.Add( move )
		this.camRect.MoveBy( move )
	}
	
	// worldPos in world coords, not screen coords
	DrawSprite( spr,worldPos,flipped = false,centered = true )
	{
		if( spr.loaded )
		{
			const rectRect = Rect.FromXYWH( spr.rect.left,spr.rect.top,
				spr.rect.GetWidth(),spr.rect.GetHeight() )
			rectRect.MoveTo( worldPos )
			if( centered ) rectRect.MoveBy( rectRect.GetHalfSize().Scale( -1 ) )
			if( this.camRect.Overlaps( rectRect ) )
			{
				const drawPos = this.World2ScrPos( worldPos.Copy().Subtract( this.camPos ) )
				if( centered ) drawPos.Subtract( spr.rect.GetHalfSize().Scale( this.scale ) )
				this.gfx.DrawSprite( drawPos.x,drawPos.y,spr,flipped,this.scale )
			}
		}
	}
	
	DrawRect( worldPos,width,height,color,centered = false,test = false )
	{
		const rectRect = Rect.FromXYWH( 0,0,width,height )
		const rectPos = worldPos.Copy()
		if( centered ) rectPos.Subtract( rectRect.GetHalfSize() )
		rectRect.MoveTo( rectPos )
		if( this.camRect.Overlaps( rectRect ) )
		{
			const drawPos = this.World2ScrPos( worldPos.Copy().Subtract( this.camPos ) )
			if( centered ) drawPos.Subtract( rectRect.GetHalfSize().Scale( this.scale ) )
			this.gfx.DrawRect( drawPos.x,drawPos.y,
				rectRect.GetWidth() * this.scale,
				rectRect.GetHeight() * this.scale,
				color )
		}
	}
	
	DrawCamArea()
	{
		this.camRect.Draw( this,"#33CC77" )
		
		// const staticCamRect = this.camRect.Copy()
		// staticCamRect.MoveTo( new Vec2( -this.camRect.GetWidth() / 2,-this.camRect.GetHeight() / 2 ) )
		// this.DrawRect( staticCamRect.GetTopLeft(),staticCamRect.GetWidth(),staticCamRect.GetHeight(),"#33CC77" )
	}
	
	Scr2WorldPos( screenPos )
	{
		return( screenPos.Copy().Subtract( this.screenHSize )
			.Divide( this.scale != 0 ? this.scale : 1 )
			// .Add( this.camPos )
			)
	}
	World2ScrPos( worldPos )
	{
		return( worldPos.Copy()
			// .Subtract( this.camPos )
			.Scale( this.scale ).Add( this.screenHSize ) )
	}
	GetMouseWorldPos( mouse )
	{
		return( this.Scr2WorldPos( new Vec2( mouse.x,mouse.y ) ).Add( this.camPos ) )
	}
	
	GetCamArea()
	{
		return( this.camRect )
	}
}