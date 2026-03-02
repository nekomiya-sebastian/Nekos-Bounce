class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		this.nekoCam = new NekoCam( this.gfx )
		this.gfx.SetNekoCam( this.nekoCam )
		
		// this.testImg = new Sprite( "Images/Cat1.png" )
		// this.imgPos = new Vec2( 0,0 )
		
		this.bouncingNeko = new BouncingNeko( Vec2.Zero() )
		
		this.fishes = []
		// these can spawn on the edge of the screen
		Fish.spr.AddLoadFunc( this.SpawnFish,this )
		
		this.testHitbox = new Hitbox( 0,0,10,10 )
	}
	
	Update( dt )
	{
		this.bouncingNeko.Update( this.mouse,this.nekoCam,dt )
		
		for( let i = 0; i < this.fishes.length; ++i )
		{
			if( this.fishes[i].hitbox && this.bouncingNeko.hitbox.Overlaps( this.fishes[i].hitbox ) )
			{
				this.fishes[i].testCol = "green"
			}
			else this.fishes[i].testCol = "blue"
		}
		
		const mousePos = this.nekoCam.Scr2WorldPos( new Vec2( this.mouse.x,this.mouse.y  ) )
		this.testHitbox.MoveTo( mousePos.x,mousePos.y )
	}
	
	Draw()
	{
		this.nekoCam.DrawCamArea()
		
		// this.nekoCam.DrawSprite( this.testImg,this.imgPos )
		
		for( const fish of this.fishes ) fish.Draw( this.nekoCam )
		
		this.bouncingNeko.Draw( this.nekoCam )
		
		this.testHitbox.Draw( this.nekoCam,this.bouncingNeko.hitbox.Overlaps( this.testHitbox )
			? "green" : "red" )
		
		const mousePos = this.nekoCam.Scr2WorldPos( new Vec2( this.mouse.x,this.mouse.y ) )
		this.nekoCam.DrawRect( mousePos,2,2,"red",true )
	}
	
	SpawnFish( self )
	{
		if( !self.fishSpawnArea )
		{
			self.fishSpawnArea = self.nekoCam.GetCamArea().Copy().ShrinkXY( Fish.spr.GetSize() )
		}
		
		self.fishes.push( new Fish( self.fishSpawnArea.GetRandPos() ) )
	}
}

const delay = 1000.0 / 60.0
const main = new Main()
let prevTime = Date.now()
setInterval( function()
{
	const now = Date.now()
	const dt = ( now - prevTime ) / 30
	prevTime = now
	
	main.Update( dt )
	main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#000000" )
	main.Draw()
},delay )