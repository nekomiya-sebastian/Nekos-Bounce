class Rect
{
	constructor( top,bot,left,right )
	{
		this.top = top
		this.bot = bot
		this.left = left
		this.right = right
	}
	
	MoveBy( move )
	{
		this.top += move.y
		this.bot += move.y
		this.left += move.x
		this.right += move.x
		
		return( this )
	}
	
	MoveTo( move )
	{
		const xDiff = move.x - this.left
		const yDiff = move.y - this.top
		
		return( this.MoveBy( new Vec2( xDiff,yDiff ) ) )
	}
	
	Copy()
	{
		return( new Rect( this.top,this.bot,this.left,this.right ) )
	}
	
	SetTBLR( top,bot,left,right )
	{
		this.top = top
		this.bot = bot
		this.left = left
		this.right = right
	}
	
	Set( other )
	{
		this.SetTBLR( other.top,other.bot,other.left,other.right )
	}
	
	Contains( x,y )
	{
		return( x >= this.left && x < this.right &&
			y >= this.top && y < this.bot )
	}
	
	Overlaps( rect )
	{
		return( this.right > rect.left && this.left < rect.right &&
			this.bot > rect.top && this.top < rect.bot )
	}
	
	OverlapsAt( rect,pos )
	{
		return( this.right > rect.left + pos.x && this.left < rect.right + pos.x &&
			this.bot > rect.top + pos.y && this.top < rect.bot + pos.y )
	}
	
	ContainsRect( rect )
	{
		return( rect.left > this.left && rect.right < this.right &&
			rect.top > this.top && rect.bot < this.bot )
	}
	
	GetSize()
	{
		return( new Vec2( this.GetWidth(),this.GetHeight() ) )
	}
	
	GetHalfSize()
	{
		return( this.GetSize().Scale( 0.5 ) )
	}
	
	GetWidth()
	{
		return( this.right - this.left )
	}
	
	GetHeight()
	{
		return( this.bot - this.top )
	}
	
	GetCenter()
	{
		return( new Vec2( Math.floor( ( this.left + this.right ) / 2 ),
			Math.floor( ( this.top + this.bot ) / 2 ) ) )
	}
	
	GetTopLeft()
	{
		return( new Vec2( this.left,this.top ) )
	}
	
	GetPosList()
	{
		const posList = []
		for( let y = this.top; y < this.bot; ++y )
		{
			for( let x = this.left; x < this.right; ++x )
			{
				posList.push( new Vec2( x,y ) )
			}
		}
		return( posList )
	}
	
	GetEdgeTiles()
	{
		const tiles = []
		
		for( let y = this.top; y <= this.bot; ++y )
		{
			tiles.push( new Vec2( this.left,y ) )
			tiles.push( new Vec2( this.right,y ) )
		}
		
		for( let x = this.left; x <= this.right; ++x )
		{
			tiles.push( new Vec2( x,this.top ) )
			tiles.push( new Vec2( x,this.bot ) )
		}
		
		return( tiles )
	}
	
	Fix()
	{
		if( this.top > this.bot )
		{
			const temp = this.top
			this.top = this.bot
			this.bot = temp
		}
		if( this.left > this.right )
		{
			const temp = this.left
			this.left = this.right
			this.right = temp
		}
	}
}

Rect.FromXYWH = function( x,y,w,h )
{
	return( new Rect( y,y + h,x,x + w ) )
}