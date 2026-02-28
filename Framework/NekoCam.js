class NekoCam
{
	constructor( gfx )
	{
		this.gfx = gfx
		
		// modifiable vals
		this.camSize = new Vec2( 5,3.5 )
		this.pixelSize = 24
		
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
		self.scale = Math.min( xScale,yScale ) / self.pixelSize
	}
	
	// worldPos in world coords, not screen coords
	DrawSprite( spr,worldPos,flipped = false )
	{
		if( spr.loaded )
		{
			const rectRect = Rect.FromXYWH( spr.rect.left,spr.rect.top,
				spr.rect.GetWidth() / this.pixelSize,spr.rect.GetHeight() / this.pixelSize )
			if( this.camRect.OverlapsAt( rectRect,worldPos.Copy().Subtract( rectRect.GetHalfSize() ) ) )
			{
				const drawPos = this.World2ScrPos( worldPos )
					.Subtract( spr.rect.GetHalfSize().Scale( this.scale ) )
				this.gfx.DrawSprite( drawPos.x,drawPos.y,spr,flipped,this.scale )
			}
		}
	}
	
	DrawRect( worldPos,width,height,color )
	{
		const rectRect = Rect.FromXYWH( 0,0,width,height )
		if( this.camRect.OverlapsAt( rectRect,worldPos.Copy().Subtract( rectRect.GetHalfSize() ) ) )
		{
			const drawPos = this.World2ScrPos( worldPos )
				.Subtract( rectRect.GetHalfSize().Scale( this.scale * this.pixelSize ) )
			this.gfx.DrawRect( drawPos.x,drawPos.y,
				rectRect.GetWidth() * this.scale * this.pixelSize,
				rectRect.GetHeight() * this.scale * this.pixelSize,
				color )
		}
	}
	
	DrawCamArea()
	{
		this.DrawRect( Vec2.Zero(),this.camRect.GetWidth(),this.camRect.GetHeight(),"#33CC77" )
	}
	
	Scr2WorldPos( screenPos )
	{
		return( screenPos.Copy().Subtract( this.screenHSize )
			.Divide( ( this.scale != 0 ? this.scale : 1 ) * this.pixelSize ) )
	}
	
	World2ScrPos( worldPos )
	{
		return( worldPos.Copy().Scale( this.scale * this.pixelSize ).Add( this.screenHSize ) )
	}
}