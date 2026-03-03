class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		this.nekoCam = new NekoCam( this.gfx )
		this.gfx.SetNekoCam( this.nekoCam )
		
		this.tower = new Tower()
		
		const bounceAreaSize = 35
		this.bounceArea = new Rect( -bounceAreaSize,bounceAreaSize,-bounceAreaSize,bounceAreaSize )
		
		this.bouncingNeko = new BouncingNeko( Vec2.Zero() )
		
		this.fishes = []
		Fish.spr.AddLoadFunc( this.SpawnFish,this )
	}
	
	Update( dt )
	{
		this.tower.Update( this.nekoCam )
		
		this.bouncingNeko.Update( this.mouse,this.nekoCam,dt,this.bounceArea )
		
		for( let i = 0; i < this.fishes.length; ++i )
		{
			if( this.fishes[i].hitbox && this.bouncingNeko.hitbox.Overlaps( this.fishes[i].hitbox ) )
			{
				this.fishes[i] = this.fishes[this.fishes.length - 1]
				this.fishes.pop()
				this.SpawnFish( this )
			}
		}
		
		const camMoveSpd = 8.5
		if( this.kbd.IsKeyDown( "W" ) ) this.nekoCam.MoveCam( Vec2.Up().Scale( camMoveSpd * dt ) )
		if( this.kbd.IsKeyDown( "S" ) ) this.nekoCam.MoveCam( Vec2.Down().Scale( camMoveSpd * dt ) )
		// if( this.kbd.IsKeyDown( "A" ) ) this.nekoCam.MoveCam( Vec2.Left().Scale( camMoveSpd * dt ) )
		// if( this.kbd.IsKeyDown( "D" ) ) this.nekoCam.MoveCam( Vec2.Right().Scale( camMoveSpd * dt ) )
	}
	
	Draw()
	{
		// this.nekoCam.DrawCamArea()
		
		this.tower.Draw( this.nekoCam )
		
		// this.bounceArea.Draw( this.nekoCam,"cyan" )
		
		for( const fish of this.fishes ) fish.Draw( this.nekoCam )
		
		this.bouncingNeko.Draw( this.nekoCam )
		
		const mousePos = this.nekoCam.GetMouseWorldPos( this.mouse )
		this.nekoCam.DrawRect( mousePos,2,2,"red",true )
	}
	
	SpawnFish( self )
	{
		if( !self.fishSpawnArea )
		{
			// self.fishSpawnArea = self.nekoCam.GetCamArea().Copy().ShrinkXY( Fish.spr.GetSize() )
			self.fishSpawnArea = self.bounceArea.Copy().ShrinkXY( Fish.spr.GetSize() )
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