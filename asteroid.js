asteroids = []

function Asteroid(x,y,type)
{
	// 0 = big asteroid 1 = medium asteroid 2 = small asteroid
	this.type = type;
	this.alive = true;
	
	this.x = x;
	this.y = y;
	
	
	//range is the range of pixels the four corners can vary from, both in the x and in the y. From -range to +range
	
	//size is the approximate "radius" of asteroid
	switch(this.type)
	{
		case 0:
			this.range = 30;
			this.size = 35;
			this.xSpd = random(-2,2);
			this.ySpd = random(-2,2);
			
			break;
		case 1:
			this.range = 10;
			this.size = 25;
			this.xSpd = 1.5*random(-4,4);
			this.ySpd = 1.5*random(-4,4);
			
			break;
		case 2:
			this.range = 3;
			this.size = 8;
			this.xSpd = 2*random(-6,6);
			this.ySpd = 2*random(-6,6);
			break;
	}
	
	//r is the radius of the hitbox
	this.r = 2.2*(this.size + this.range);
	
	this.q0 = 
	{
		x: 0,
		ox : random(-this.range,this.range),
		y : 0,
	    oy : random(-this.range,this.range)
	};
	
	this.q1 = 
	{
		x: 0,
		ox : random(-this.range,this.range),
		y : 0,
	    oy : random(-this.range,this.range)
	};
	
	this.q2 = 
	{
		x: 0,
		ox : random(-this.range,this.range),
		y : 0,
	    oy : random(-this.range,this.range)
	};
	
	this.q3 = 
	{
		x: 0,
		ox : random(-this.range,this.range),
		y : 0,
	    oy : random(-this.range,this.range)
	};
	
	this.edges = [this.q0,this.q1,this.q2,this.q3];
	
	this.show = function()
	{
		this.q0.x = this.x-this.size + this.q0.ox;
		this.q0.y = this.y-this.size + this.q0.oy;
		
		this.q1.x = this.x+this.size + this.q1.ox;
		this.q1.y = this.y-this.size + this.q1.oy;
		
		this.q2.x = this.x+this.size + this.q2.ox;
		this.q2.y = this.y+this.size + this.q2.oy;
		
		this.q3.x = this.x-this.size + this.q3.ox;
		this.q3.y = this.y+this.size + this.q3.oy;
		this.edges = [this.q0,this.q1,this.q2,this.q3];
		
		if(this.alive)
		{	
			fill(0);
			strokeWeight(2);
			quad(this.q0.x,this.q0.y,this.q1.x,this.q1.y,this.q2.x,this.q2.y,this.q3.x,this.q3.y);
			//ellipse(this.x,this.y,this.r,this.r); //For debugging. Uncomment to display the bounding circle of the asteroid. Collision detection is only enabled if a bullet or the player has entered this circle.
		}
	}
	
	this.move = function()
	{
		//ensure asteroid is not out of bounds by wrapping it around if crosses the border
    	if(this.x > width)
    	{
      		this.x = 0;
    	}
    	
    	if(this.x < 0)
    	{	
      		this.x = width;
    	}
    	
    	if(this.y > height)
    	{
      		this.y = 0;
    	}
    	
    	if(this.y < 0)
    	{
      		this.y = height;
    	}
    	
		this.x += this.xSpd;
		this.y += this.ySpd;
	}
}