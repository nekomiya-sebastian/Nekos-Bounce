class NekoCam
{
	constructor( gfx )
	{
		this.gfx = gfx
		
		// modifiable vals
		const pixelSize = 24 // # of pixels per unit
		this.camSize = new Vec2( 5,3.5 ).Scale( pixelSize )
		
		const camHSize = this.camSize.Copy().Divide( 2 )
		this.camRect = new Rect( -camHSize.y,camHSize.y,-camHSize.x,camHSize.x )
		this.screenRect = new Rect( 0,gfx.height,0,gfx.width )
		this.scale = 1
		this.screenHSize = this.screenRect.GetHalfSize()
		
		this.OnResize( this )
	}
	
	OnResize( self )
	{
		self.screenRect.SetTBLR( 0,self.gfx.height,0,self.gfx.width )
		self.screenHSize = self.screenRect.GetHalfSize()
		
		const xScale = self.gfx.width / self.camSize.x
		const yScale = self.gfx.height / self.camSize.y
		self.scale = Math.min( xScale,yScale )
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
				const drawPos = this.World2ScrPos( worldPos )
				if( centered ) drawPos.Subtract( spr.rect.GetHalfSize().Scale( this.scale ) )
				this.gfx.DrawSprite( drawPos.x,drawPos.y,spr,flipped,this.scale )
			}
		}
	}
	
	DrawRect( worldPos,width,height,color,centered = false )
	{
		const rectRect = Rect.FromXYWH( 0,0,width,height )
		const rectPos = worldPos.Copy()
		if( centered ) rectPos.Subtract( rectRect.GetHalfSize().Scale( -1 ) )
		rectRect.MoveTo( rectPos )
		if( this.camRect.Overlaps( rectRect ) )
		{
			const drawPos = this.World2ScrPos( worldPos )
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
	}
	
	Scr2WorldPos( screenPos )
	{
		return( screenPos.Copy().Subtract( this.screenHSize )
			.Divide( this.scale != 0 ? this.scale : 1 ) )
	}
	
	World2ScrPos( worldPos )
	{
		return( worldPos.Copy().Scale( this.scale ).Add( this.screenHSize ) )
	}
	
	GetCamArea()
	{
		return( this.camRect )
	}
}