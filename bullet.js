bullets = [];

function Bullet(shipX,shipY,angle,sxv,syv)
{
  this.x = shipX;
  this.y = shipY;
  this.xVel = cos(angle);
  this.yVel = sin(angle);
  this.speed = 15;
  
  //The time in ms since running the program
  this.initTime = millis();
  
  //the duration the bullet should exist, in ms
  this.life = 500;
  
  //if not alive, then the first time Draw discovers this it will be destroyed and removed from the array
  this.alive = true;
  
  this.show = function()
  {
  	//check if the bullet should actually exist
  	if(millis() >= this.initTime + this.life)
  	{
  		this.alive = false;
  	}
  	else
  	{
    	stroke(255);
    	strokeWeight(4);
    	point(this.x,this.y);
  	}
  }
  
  this.move = function()
  {
    //ensure bullet is not out of bounds by wrapping it around if crosses the border
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
  	
  	//move the bullet normally.
    this.x += sxv + this.xVel*this.speed;
    this.y += syv + this.yVel*this.speed;
  }
}
