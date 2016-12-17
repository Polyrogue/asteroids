/*
  ___   _____ _____ ___________ _____ ___________  _____ 
 / _ \ /  ___|_   _|  ___| ___ \  _  |_   _|  _  \/  ___|
/ /_\ \\ `--.  | | | |__ | |_/ / | | | | | | | | |\ `--. 
|  _  | `--. \ | | |  __||    /| | | | | | | | | | `--. \
| | | |/\__/ / | | | |___| |\ \\ \_/ /_| |_| |/ / /\__/ /
\_| |_/\____/  \_/ \____/\_| \_|\___/ \___/|___/  \____/ 

DEVELOPED BY TAHA NASIR.
FONT USED IS HYPERSPACE


NO ADDITIONAL LIBRARIES HAVE BEEN USED, BESIDES P5.SOUND AND P5.DOM
COLLISION DETECTION WAS ACHIEVED ENTIRELY USING PURE MATHS
COMPLETED 10/12/2016
*/

//Game State: 0 = start splash screen 1 = main game  2 = game over screen
var gameState;
var gameFont;

var score = 0;
var lives = 3;
var scoreThreshold = 5000;

var spawnRadius;
var spawnQuantity = 2;
var player;
var cool = false;
var bgCol;
var starting = false;
var playText;

var engine;

function preload()
{
	bgCol = color(0);
	playText = "PUSH [ENTER] TO PLAY";
	
	sndLaser = loadSound("assets/laser.wav");
	sndLaser.setVolume(0.3);
	
	sndAsteroid = loadSound("assets/asteroid.wav");
	sndAsteroid.setVolume(0.3);
	
	sndDeath = loadSound("assets/death.wav");
	sndDeath.setVolume(0.3);
	
	sndTeleport = loadSound("assets/teleport.wav");
	sndTeleport.setVolume(0.3);

	bgmIntro = loadSound("assets/bgmIntro.mp3");
	bgmIntro.setVolume(0.3);
	
	bgm = loadSound("assets/bgmMain.mp3");
	bgm.setVolume(0.3);
	
	sndGameOver = loadSound("assets/gameOver.wav");
	sndGameOver.setVolume(0.3);	
	
	sndComplete = loadSound("assets/complete.wav");
	sndComplete.setVolume(0.3);
	
	sndLife = loadSound("assets/life.wav");
	sndLife.setVolume(0.3);
	
	try
	{
		gameFont = loadFont("assets/Hyperspace Bold.otf");
	}
	catch(error)
	{
		gameFont = false;
	}
	gameState = 0;
	spawnRadius = 300;
}

function setup() 
{
  angleMode(DEGREES);
  frameRate(30);
  createCanvas(800,800);
  background(0);
  engine = new p5.Oscillator();
  engine.setType("saw");
  engine.freq(100);
  engine.amp(0);
  engine.start();
}

function draw()
{
	switch(gameState)
	{
		case 0:
			startScreen();
			break;
			
		case 1:
			updateGame();
			updateGUI();
			checkForVictory();
			//ellipse(width/2,height/2,spawnRadius,spawnRadius); //for debugging. Uncomment to see radius where asteroids are not allowed to spawn.
			break;
	}
}

function updateGame()
{
  if(keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW))
  {
    if(player.angle <= 0)
    {
      player.angle = 359;
    }
    else
    {
      player.angle -= player.rot;      
    }
  }
  
  if(keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW))
  {
    if(player.angle >= 360)
    {
      player.angle = 0;
    }
    else
    {
      player.angle += player.rot;      
    }
  }
  
  if(keyIsDown(UP_ARROW))
  {
  	player.move();
  }
  else
  {
  	player.moving = false;
    player.xVel = player.xVel/1.01;
    player.yVel = player.yVel/1.01;
  }
     //limit velocity so you can't accelerate infinitely fast
    if(player.xVel > 10)
    {
    	player.xVel = 10;
    }
    if(player.xVel < -10)
    {
    	player.xVel = -10;
    }
    if(player.yVel > 10)
    {
    	player.yVel = 10;
    }
    if(player.yVel < -10)
    {
    	player.yVel = -10;
    }
  
  //Move the ship to the current rotation and position
  updateShip();
  translate(-player.x,-player.y);
  
  //Move bullets
  for(var i = 0; i < bullets.length; i++)
  {
    bullets[i].move();
    bullets[i].show();
    
    if(bullets[i].alive === false)
    {
    	bullets.splice(i,1);
    }
  }
  
     //check for collisions
    checkCols();
  
  //Display and move asteroids
  for(var i = 0; i < asteroids.length; i++)
	{
		if(asteroids[i].alive)
		{
			asteroids[i].move();
			asteroids[i].show();
		}
		else
		{
			//Replace the asteroid with two smaller ones, unless it is a small one, in which case just destroy it
			if(asteroids[i].type != 2)
			{
				asteroids.push(new Asteroid(asteroids[i].x,asteroids[i].y,asteroids[i].type+1))
				asteroids.push(new Asteroid(asteroids[i].x,asteroids[i].y,asteroids[i].type+1))
				
			}
			asteroids.splice(i,1);	
		}
	}
	
	//display any explosions
	for(var i = 0; i < explosions.length; i++)
	{
		if(explosions[i].alive)
		{
			explosions[i].show();
		}
		else
		{
			explosions.splice(i,1);	
		}
	}
	
}

function keyPressed()
{
	if(key === " " && bullets.length <= 4 && gameState == 1 && player.alive)
  	{
  		sndLaser.play();
	    bullets.push(new Bullet(player.x,player.y,player.angle,player.xVel,player.yVel));
  	}
  	
  	if(keyCode == UP_ARROW && gameState == 1 && player.alive)
  	{
  		engine.amp(0.05);
  	}
  	
  	//Asteroids has a feature where pressing a button would send you into "hyperspace", teleporting you to a random location, to be used in dire situations, at the risk of teleporting into an asteroid.
	if(keyCode == DOWN_ARROW && gameState == 1 && player.alive)
  	{
  		sndTeleport.play();
	    player.x = random(1,width-1);
	    player.y = random(1,height-1);
  	}
  	
	if( keyCode == ENTER && gameState == 0 && !starting)
	{
		starting = true;
		bgmIntro.play();
		playText = "PREPARE YOURSELF COMMANDER";
		
		setTimeout(function(){bgm.loop();},6900);
		
		setTimeout(function(){bgCol = color(255);},1900);
		
  		setTimeout(loadLevel,2000);
  		player = new Ship();
	}

}

function keyReleased()
{
	if(keyCode == UP_ARROW)
	{
		engine.amp(0);
	}
}



function checkCols()
{
	checkShipAsteroidCol();
	checkBulletAsteroidCol();
}

function startScreen()
{
	background(bgCol);
	textAlign(CENTER);
	textFont(gameFont);
	fill(255);
	textSize(72);
	text("ASTEROIDS",width/2,height/4);
	textSize(48);
	text(playText,width/2,height/1.5);
	textSize(22);
	text("(C) 2016 TAHA NASIR   ASTEROIDS (C) 1979 ATARI INC",width/2,height/1.05);
}

function loadLevel()
{
	starting = false;
	bgCol = color(0);
	if(spawnQuantity < 15)
	{
		spawnQuantity += 1;
	}
	gameState = 1;
	background(0);
	player.x = width/2;
	player.y = height/2;
	
	for(var i = 0; i < spawnQuantity; i++)
	{
		var allowed = false;
		var x = random(0,width);
		var y = random(0,height);
		while(!allowed)
		{
			//ensure the coordinates are outside the spawn protection circle.
			if(dist(x,y,player.x,player.y) < spawnRadius)
			{
				x = random(0,width);
				y = random(0,height);
			}
			else
			{
				allowed = true;
			}
		}
		asteroids.push(new Asteroid(x,y,0));
	}
	cool = false;
}

//Displays the Score, lives, and the silly little copyright text that the original Asteroids had.
function updateGUI()
{
	fill(255);
	
	textAlign(RIGHT);
	text("SCORE: " + score,width/1.05,32);
	
	textAlign(CENTER);
	textSize(22);
	text("(C) 2016 TAHA NASIR   ASTEROIDS (C) 1979 ATARI INC",width/2,height/1.05);
	
	fill(0)
	stroke(255);
	for(var i = 1; i < lives+1; i++)
	{
		x = 30*i
		triangle(x+5,40,x+15,10,x+25,40);
	}
}

function checkForVictory()
{
	if(asteroids.length == 0 && !cool)
	{
		sndComplete.play();
		setTimeout(loadLevel,1000);
		cool = true;
	}
}

function gameOver()
{
	bgm.stop();
	sndGameOver.play();
	background(0);
	textAlign(CENTER);
	if(gameFont != false)
	{
		textFont(gameFont);
	}
	else
	{
		textFont("Courier New");
	}
	fill(255);
	textSize(72);
	text("GAME OVER",width/2,height/4);
	textSize(48);
	text("FINAL SCORE: " + score,width/2,height/1.5);
	textSize(22);
	text("(C) 2016 TAHA NASIR   ASTEROIDS (C) 1979 ATARI INC",width/2,height/1.05);
	playText = "PUSH [ENTER] TO PLAY";
	
	setTimeout(reset,3000);
}
function reset()
{
	if(asteroids.length > 0)
	{
		for(var i = asteroids.length-1; i > 0; i--)
		{
			asteroids[i].alive = false;
			asteroids.splice(i,1);
		}
	}
	score = 0;
	spawnQuantity = 1;
	lives = 3;
	gameState = 0;
}