function Ship()
{
  this.angle = 0; //current angle
  this.rot = 10; //constant to modify angle
  this.x = width/2; //x position 
  this.y = height/2; //y position
  this.w = 25; //width
  this.h = 30; //height
  this.spd = 0.5; //multiplier for movement
  this.xVel = 0; //X velocity
  this.yVel = 0; //Y velocity
  this.moving = false;
  this.invuln = false;
  this.visible = true;
  
  this.alive = true;
  
  //For collision purposes;
  //top node
  this.z0 = 
  {
  	x : this.x-this.w/2,
  	y : this.y-this.h/2
  }
  
  //bot node
  this.z1 = 
  {
  	x : this.x-this.w/2,
  	y : this.y+this.h/2
  }
  
  //right node
  this.z2 = 
  {
  	x : this.x+this.w,
  	y : this.y
  }
  //ship faces right like |>
  
  this.show = function()
  {
    if(this.alive && this.visible)
    {
      stroke(255);
      strokeWeight(2);
      
      if(this.moving)
      {
      	  if(this.spd <= 1.2)
      	  {
      	  	this.spd += 0.03;
      	  }
      	  else
      	  {
      	  	this.spd = 1.2;
      	  }
    	  fill(255);
    	  triangle(this.x-this.w/2,this.y-this.h/3,this.x-this.w,this.y,this.x-this.w/2,this.y+this.h/3);
      }
      else
      {
      	if(this.spd > 0.5)
      	{
      		this.spd -= 0.03;
      	}
      	else
      	{
      		this.spd = 0.5;
      	}
      }
      
      
      this.z0.x = this.x-this.w/2;
      this.z0.y = this.y-this.h/2;
    
     this.z1.x = this.x-this.w/2;
     this.z1.y = this.y+this.h/2;
    
     this.z2.x = this.x+this.w;
     this.z2.y = this.y;
      
      
      noFill(0);
      //point(this.x,this.y); //for debugging, shows the center of the ship, which currently is the only source of collision between the ship and asteroids :(
      //triangle(this.x-this.w/2,this.y+this.h/2,this.x,this.y-this.h/2,this.x+this.w/2,this.y+this.h/2);
      //triangle(this.x-this.w/2,this.y-this.h/2,this.x-this.w/2,this.y+this.h/2,this.x+this.w,this.y);
      triangle(this.z0.x,this.z0.y,this.z1.x,this.z1.y,this.z2.x,this.z2.y);
    }
  }
  
  this.move = function()
  {
  	if(this.alive)
  	{
	  	this.moving = true;
	    this.xVel += cos(this.angle)*this.spd;
	    this.yVel += sin(this.angle)*this.spd;
	    this.show();
  	}
  }
  
  this.toggleVis = function()
  {
  	if(this.invuln)
  	{
  		if(!this.visible)
  		{
  			this.visible = true;
  		}
  		else
  		{
  			this.visible = false;
  		}
  	}
  	else
  	{
  		this.visible = true;
  	}
  }
}

function updateShip()
{
    //ensure ship is not out of bounds by wrapping it around if crosses the border
    if(player.x > width)
    {
      player.x = 0;
    }
    if(player.x < 0)
    {
      player.x = width;
    }
    if(player.y > height)
    {
      player.y = 0;
    }
    if(player.y < 0)
    {
      player.y = height;
    }
  
    //Update the ship's coordinates according to its velocity
    player.x += player.xVel;
    player.y += player.yVel;
    
    //Draw the ship at its current position and rotation
    tempX = player.x;
    tempY = player.y;
    translate(player.x,player.y);
    player.x = 0;
    player.y = 0;
    background(0);
    rotate(player.angle);
    player.show();
    translate(-player.x,-player.y);
    rotate(-player.angle);
    
    player.x = tempX;
    player.y = tempY
    

}

function killPlayer()
{
	if(!player.invuln)
	{
		explosions.push(new Explosion(player.x,player.y,80));
		sndDeath.play();
		engine.amp(0);
		setTimeout(respawnPlayer,2000);
		player.invuln = true;
		player.alive = false;
		player.xVel = 0;
		player.yVel = 0;
	}
}

function respawnPlayer()
{
	if(lives > 0)
	{
		lives -= 1;
		setTimeout(function(){player.invuln = false;},2000);
		player.x = width/2;
		player.y = height/2;
	  	player.alive = true;
	  	setInterval("player.toggleVis()",50);
	}
	else
	{
		gameState = 2;
		gameOver();
	}
}
