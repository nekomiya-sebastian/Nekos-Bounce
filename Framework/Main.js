class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.mouse = new Mouse( this.gfx )
		this.kbd = new Keyboard( this.gfx )
		this.nekoCam = new NekoCam( this.gfx )
		this.gfx.SetNekoCam( this.nekoCam )
		
		this.testImg = new Sprite( "Images/Cat1.png" )
		this.imgPos = new Vec2( 0,0 )
	}
	
	Update( dt )
	{
	}
	
	Draw()
	{
		this.nekoCam.DrawCamArea()
		
		this.nekoCam.DrawSprite( this.testImg,this.imgPos )
		
		const mousePos = this.nekoCam.Scr2WorldPos( new Vec2( this.mouse.x,this.mouse.y ) )
		this.nekoCam.DrawRect( mousePos,0.2,0.2,"red" )
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