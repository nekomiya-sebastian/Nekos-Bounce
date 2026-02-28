class Sprite
{
	constructor( path )
	{
		this.sprite = new Image()
		this.sprite.src = path
		this.rect = null
		
		this.loaded = false
		
		const self = this
		this.sprite.onload = function()
		{
			self.rect = new Rect( 0,self.sprite.height,0,self.sprite.width )
			self.loaded = true
		}
		this.sprite.onerror = function()
		{
			NekoUtils.Assert( false,"Sprite failed to load! " + path )
			self.loaded = false
		}
	}
	
	GetWidth()
	{
		return( this.rect.GetWidth() )
	}
	GetHeight()
	{
		return( this.rect.GetHeight() )
	}
	GetHSize()
	{
		return( this.rect.GetHalfSize() )
	}
}