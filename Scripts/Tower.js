class Tower
{
	constructor()
	{
		this.tileSprs = [
			new Sprite( "Images/SkyTile.png" ),
			new Sprite( "Images/YellowBrickTile.png" )
		]
		
		this.tiles = []
		
		this.tileSize = Vec2.One().Scale( 24 )
		this.width = -1
		this.baseHeight = -1 // size of # of tiles shown on screen
		this.curHeight = -1 // total height of tiles arr
		
		this.loaded = false
		
		this.curRow = 0
		this.fishInterval = 3 // fish every this many rows
	}
	
	Update( nekoCam )
	{
		if( this.loaded )
		{
			// loads new rows when scrolling up
			const yOffset = this.CalcCamYOffset( nekoCam )
			const hHeight = Math.floor( this.baseHeight / 2 )
			const yDiff = hHeight - yOffset
			if( this.curHeight < this.baseHeight + yDiff + 1 )
			{
				// console.log( "load new area!" )
				this.LoadNewRow()
			}
			
			// // loads new rows when scrolling down
			// const yOffset = this.CalcCamYOffset( nekoCam )
			// const hHeight = Math.floor( this.baseHeight / 2 )
			// const yDiff = hHeight - yOffset
			// if( this.curHeight < this.baseHeight - yDiff )
			// {
			// 	// console.log( "load new area!" )
			// 	this.LoadNewRow()
			// }
		}
		else
		{
			let loadedAll = true
			for( const tile of this.tileSprs )
			{
				if( !tile.loaded )
				{
					loadedAll = false
					break
				}
			}
			if( loadedAll )
			{
				this.loaded = true
				this.InitSetup( nekoCam )
			}
		}
	}
	
	Draw( nekoCam )
	{
		// only draw tiles within view window to save on performance
		const yOffset = this.CalcCamYOffset( nekoCam )
		
		const yAdjust = this.curHeight - this.baseHeight
		// console.log( yAdjust )
		
		const hHeight = Math.ceil( this.baseHeight / 2 )
		for( let y = yOffset - hHeight - 1; y < yOffset + hHeight + 1; ++y )
		{
			const tileY = y + yAdjust
			if( tileY >= 0 && tileY < this.curHeight )
			{
				for( let x = 0; x < this.width; ++x )
				{
					const curTile = this.GetTileReverse( x,tileY )
					
					nekoCam.DrawSprite( this.tileSprs[curTile],
						new Vec2( x * this.tileSize.x,y * this.tileSize.y ),
						false,false )
				}
			}
		}
	}
	
	InitSetup( nekoCam )
	{
		this.tileSize = new Vec2( this.tileSprs[0].GetWidth(),this.tileSprs[0].GetHeight() )
		this.width = nekoCam.GetCamArea().GetWidth() / this.tileSize.x
		this.baseHeight = nekoCam.GetCamArea().GetHeight() / this.tileSize.y
		this.curHeight = 0
		
		NekoUtils.Assert( this.width == Math.floor( this.width ),
			"Invalid screen width! " + this.width )
		NekoUtils.Assert( this.baseHeight == Math.floor( this.baseHeight ),
			"Invalid screen height! " + this.baseHeight )
		
		console.log( "tower dims: " + this.width + " " + this.baseHeight )
		
		// just load the screen area worth of rows
		for( let y = 0; y < this.baseHeight; ++y ) this.LoadNewRow()
	}
	
	LoadNewRow()
	{
		++this.curRow
		++this.curHeight
		
		const fishInd = ( this.curRow % this.fishInterval == 0 ? NekoUtils.RandInt( 1,this.width - 1 ) : -1 )
		
		for( let x = 0; x < this.width; ++x )
		{
			let tileVal = 0
			if( x == 0 || x == this.width - 1 ) tileVal = 1
			else if( this.curHeight == 1 ) tileVal = 1
			else if( x == fishInd )
			{
				// spawn fish on this tile
			}
			
			this.tiles.push( tileVal )
		}
	}
	
	GetTile( x,y )
	{
		NekoUtils.Assert( x >= 0 && x < this.width && y >= 0 && y < this.curHeight,
			"Invalid Tower.GetTile coords! x: " + x + ", y: " + y +
			", width: " + this.width + ", cur height: " + this.curHeight )
		
		return( this.tiles[y * this.width + x] )
	}
	// counts y backwards
	GetTileReverse( x,y )
	{
		NekoUtils.Assert( x >= 0 && x < this.width && y >= 0 && y < this.curHeight,
			"Invalid Tower.GetTile coords! x: " + x + ", y: " + y +
			", width: " + this.width + ", cur height: " + this.curHeight )
		
		return( this.tiles[( this.curHeight - y - 1 ) * this.width + x] )
	}
	
	CalcCamYOffset( nekoCam )
	{
		return( Math.floor( nekoCam.GetCamPos().y / this.tileSize.y ) )
	}
}