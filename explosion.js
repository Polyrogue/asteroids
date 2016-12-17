explosions = [];

this.Explosion = function(x,y,size)
{
	this.x = x;
	this.y = y;
	this.r = 3;
	this.maxR = size;
	this.alive = true;
	
	this.show = function()
	{
		if(this.r < this.maxR)
		{
			this.r += 15;
			noFill();
			ellipse(this.x,this.y,this.r,this.r)
		}
		else
		{
			alive = false;	
		}
	}
}