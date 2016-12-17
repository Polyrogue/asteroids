function checkBulletAsteroidCol()
{
  	for(var i = 0; i < asteroids.length; i++)
	{
		for(var j = 0; j < bullets.length; j++)
		{
			if(dist(bullets[j].x,bullets[j].y,asteroids[i].x,asteroids[i].y) < asteroids[i].r)
			{
				//The bullet has entered the bounding circle. As a result, lets check to see if the shape is between every edge.
				//This is a big if statement so it is split into four checks, one for each edge
				//The logic used here is, given the bullets coordinates are ax and ay and the centre of the asteroid sun is bx and by,
				//And one of the edges two points is q0.x,q0.y and q1.x,q1.y,
				//Then if ((y1−y2)(ax−x1)+(x2−x1)(ay−y1))((y1−y2)(bx−x1)+(x2−x1)(by−y1)) is > 0 then the centre and bullet are on the same side of the line.
				//If this is true for all four sides, there is a collision.
				//This formula was retrieved from here: http://math.stackexchange.com/questions/162728/how-to-determine-if-2-points-are-on-opposite-sides-of-a-line
				
				if(asteroids[i].type != 2)
				{
				  //top edge
				  if(((asteroids[i].q0.y-asteroids[i].q1.y)*(bullets[j].x-asteroids[i].q0.x) + (asteroids[i].q1.x-asteroids[i].q0.x)*(bullets[j].y-asteroids[i].q0.y))*((asteroids[i].q0.y-asteroids[i].q1.y)*(asteroids[i].x-asteroids[i].q0.x) + (asteroids[i].q1.x-asteroids[i].q0.x)*(asteroids[i].y-asteroids[i].q0.y)) > 0)
					{
						//right edge
						if(((asteroids[i].q1.y-asteroids[i].q2.y)*(bullets[j].x-asteroids[i].q1.x) + (asteroids[i].q2.x-asteroids[i].q1.x)*(bullets[j].y-asteroids[i].q1.y))*((asteroids[i].q1.y-asteroids[i].q2.y)*(asteroids[i].x-asteroids[i].q1.x) + (asteroids[i].q2.x-asteroids[i].q1.x)*(asteroids[i].y-asteroids[i].q1.y)) > 0)
						{
							//bottom edge
							if(((asteroids[i].q2.y-asteroids[i].q3.y)*(bullets[j].x-asteroids[i].q2.x) + (asteroids[i].q3.x-asteroids[i].q2.x)*(bullets[j].y-asteroids[i].q2.y))*((asteroids[i].q2.y-asteroids[i].q3.y)*(asteroids[i].x-asteroids[i].q2.x) + (asteroids[i].q3.x-asteroids[i].q2.x)*(asteroids[i].y-asteroids[i].q2.y)) > 0)
							{
								//left edge
								if(((asteroids[i].q3.y-asteroids[i].q0.y)*(bullets[j].x-asteroids[i].q3.x) + (asteroids[i].q0.x-asteroids[i].q3.x)*(bullets[j].y-asteroids[i].q3.y))*((asteroids[i].q3.y-asteroids[i].q0.y)*(asteroids[i].x-asteroids[i].q3.x) + (asteroids[i].q0.x-asteroids[i].q3.x)*(asteroids[i].y-asteroids[i].q3.y)) > 0)
								{
									//YES. The bullet is colliding with the asteroid.
									//The intensity of these checks is why we only do this if the bullet has entered the bounding circle.
									if(asteroids[i].type == 0)
									{
										score += 20;
										explosions.push(new Explosion(asteroids[i].x,asteroids[i].y,100));
									}
									else
									{
										explosions.push(new Explosion(asteroids[i].x,asteroids[i].y,75));
										score += 50;
									}
									bullets[j].alive = false;
									asteroids[i].alive = false;
									sndAsteroid.play();
									if(score >= scoreThreshold)
									{
										scoreThreshold += 5000;
										lives += 1;
										sndLife.play();
									}
								}
							}
						}
					}
				}
				else
				{
					explosions.push(new Explosion(asteroids[i].x,asteroids[i].y,30));
					score += 100;
					bullets[j].alive = false;
					asteroids[i].alive = false;
					sndAsteroid.play();
					if(score >= scoreThreshold)
						{
							lives += 1;
							scoreThreshold += 5000;
							sndLife.play();
						}
				}
			}
		}
	}
}

//tests whether two lines intersect or not, and returns the location if they are. I don't need the location, but it's useful to have.
//Function was discovered using this video series: https://www.youtube.com/watch?v=A86COO8KC58
function segmentIntersect(p0,p1,p2,p3)
{
	strokeWeight(5);
	stroke(255,0,0);
	stroke(255);
			var A1 = p1.y - p0.y,
			B1 = p0.x - p1.x,
			C1 = A1 * p0.x + B1 * p0.y,
			A2 = p3.y - p2.y,
			B2 = p2.x - p3.x,
			C2 = A2 * p2.x + B2 * p2.y,
			denominator = A1 * B2 - A2 * B1;
		
	if(denominator == 0)
	{
		return null;
	}
		
	var	intersectX = (B2 * C1 - B1 * C2) / denominator,
		intersectY = (A1 * C2 - A2 * C1) / denominator
		rx0 = (intersectX - p0.x) / (p1.x - p0.x),
		ry0 = (intersectY - p0.y) / (p1.y - p0.y),
		rx1 = (intersectX - p2.x) / (p3.x - p2.x),
		ry1 = (intersectY - p2.y) / (p3.y - p2.y);

	if(((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) && ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) 
	{
		return {
			x: intersectX,
			y: intersectY
			};
	}
	else 
	{
		return null;
	}
		
}




function 	checkShipAsteroidCol()
{
	//This function provides pixel perfect collision detection between an asteroid and the player's ship.
	//z0 z1 and z2 all contain coordinates that are RELATIVE to the centre of the ship. We need to create three temporary objects that contain the absolute coordinates:
	var a0 = 
	{
		x : player.x + player.z0.x,
		y : player.y + player.z0.y
	};
	
	var a1 = 
	{
		x : player.x + player.z1.x,
		y : player.y + player.z1.y
	};
	
	var a2 = 
	{
		x : player.x + player.z2.x,
		y : player.y + player.z2.y
	};
	
	//To check the collision, every edge of the ship (which is a triangle) will be tested for intersection against every edge of an asteroid, but only if they have entered a bounding circle
	for(var i = 0; i < asteroids.length; i++)
	{
		if(dist(player.x,player.y,asteroids[i].x,asteroids[i].y) <= asteroids[i].r)
		{
			//test all three edges of the ship agaisnt the asteroid
			var intersect;
			//test the top edge (assuming ship is facing right like |>)
			for(var j = 0; j < asteroids[i].edges.length; j++)
			{
				if(j+1 == asteroids[i].edges.length)
				{
					intersect = segmentIntersect(a0,a2,asteroids[i].edges[j],asteroids[i].edges[0]);
				}
				else
				{
					intersect = segmentIntersect(a0,a2,asteroids[i].edges[j],asteroids[i].edges[j+1]);
				}
				if(intersect)
				{
					killPlayer();
				}
			}
			
			//test the bot edge (assuming ship is facing right like |>)
			for(var j = 0; j < asteroids[i].edges.length; j++)
			{
				if(j+1 == asteroids[i].edges.length)
				{
					intersect = segmentIntersect(a1,a2,asteroids[i].edges[j],asteroids[i].edges[0]);
				}
				else
				{
					intersect = segmentIntersect(a1,a2,asteroids[i].edges[j],asteroids[i].edges[j+1]);
				}
				if(intersect)
				{
					killPlayer();
				}
			}
			
			//test the back edge (assuming ship is facing right like |>)
			for(var j = 0; j < asteroids[i].edges.length; j++)
			{
				if(j+1 == asteroids[i].edges.length)
				{
					var intersect = segmentIntersect(a0,a1,asteroids[i].edges[j],asteroids[i].edges[0]);
				}
				else
				{
					var intersect = segmentIntersect(a0,a1,asteroids[i].edges[j],asteroids[i].edges[j+1]);
				}
				if(intersect)
				{
					killPlayer();
				}
			}
			
		}
	}
}

