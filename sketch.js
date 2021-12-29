var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;


var obstaclesGroup, obstacle1, obstacle2;
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("sun.png");
  
  mario_running = loadAnimation("mario1.png","mario2.png","mario3.png");
  mario_collided = loadAnimation("mario_collided.png");
  
  groundImage = loadImage("ground.png");
  
  
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-500,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.02;
  
  mario = createSprite(50,height-70,20,50);
  
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.setCollider('circle',0,0,350)
  mario.scale = 0.10;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && mario.y  >= height-120) {
      jumpSound.play( )
      mario.velocityY = -10;
       touches = [];
    }
    
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(invisibleGround);
   
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    obstacle.depth = mario.depth;
    mario.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  score = 0;
  
}
