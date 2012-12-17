var testingMode = false;
var collisionBox = false;

//stage variables
var stageWidth = 832;   //26*32 =  832
var stageHeight = 16;  //16*32 =  512
var tileSize = 32;

//global state and variables
var level = 0;
var stage = 0;
var points = 0;
var killedIndians = 0;
var indiansLeft = 20;
var pointsHUD = document.getElementById('points');
var lifeHUD = document.getElementById('life');
var finalText = null;
var marginTop = 25;
var player = null;
var indians = new Array();


var dialog = null;
var lastMsgTimer = 0;
var nextMsgTime = -1;

function reset()
{
  level = 0;
  stage = 0;
  points = 0;
  killedIndians = 0;
  indiansLeft = 20;
  dialog = null;
  lastMsgTimer = 0;
  nextMsgTime = -1;
  
  pointsHUD.innerHTML = 0;
  lifeHUD.innerHTML = 10;
}

function generateWorld()
{
  //generate floor
  var floorTile = Crafty.e('2D, DOM, Collision, floor')
      .attr({ x: -100, y: 13*tileSize+50, w:map1.size + 2000, h:3, z:10 })
      //.color('white')
      ;

  //generate trees
  for(var i=0;i<map1.trees.length;i++)
  {
    createTree(map1.trees[i].x, map1.trees[i].y, map1.trees[i].type, i);

  };
};

window.onload = function ()
{
  Crafty.init(stageWidth, stageHeight*tileSize);
  setupImages();
  initializeGameComponents();
  initializeEnemyComponents();

  Crafty.audio.add("chop", "assets/audio/chop.ogg");
  Crafty.audio.add("playerHurt", "assets/audio/6.ogg");
  Crafty.audio.add("hurt", "assets/audio/randomize12.ogg");
  Crafty.audio.add("treeFall", "assets/audio/explosion3.ogg");
  Crafty.audio.add("go", "assets/audio/8repeat.ogg");

  Crafty.scene('loading', function ()
  {
    Crafty.background('rgb(30,30,30)');
    var loadingText = Crafty.e('2D, DOM, Text')
      .attr({ w: 480, h: 20, x: 0, y: 20 })
      .text('Loading...')
      .css({ 'text-align': 'center' });

    Crafty.load(getImagesToLoad(), function ()
    {
      setupImages();
      loadingText.destroy();

      Crafty.scene('title');
    });
    

  });
  Crafty.scene('loading');


  Crafty.scene('title', function ()
  {
    Crafty.background('url("assets/images/bg.png")');
    reset();

    var titleEntity = Crafty.e('2D, DOM, title')
      .attr({ x: 0, y: 20, z:10 })
      ;
    var titleText = Crafty.e('2D, DOM, Text, Keyboard')
      .attr({ w: 300, h: 50, x: 270, y: 385, z:100 })
      .text('(press SPACE to play)')
      .css({ 'text-align': 'center' })
      .css({ 'color': 'white' });
    
    titleText.bind('KeyDown', function(e)
    {
      if(e.key == Crafty.keys['SPACE'])
      {
        Crafty.scene('level1');
      }
    });

  });

  Crafty.scene('level1', function ()
  {
    //Crafty.background('white');
    Crafty.background('url("assets/images/bg.png")');
    generateWorld();

    createPlayer(3,11);
    //createNative(10,11);
    //createNative(32,11);
    //createNative(33,11);

    Crafty.viewport.clampToEntities = false;

  });
  



  Crafty.scene('gameOver', function ()
  {
    Crafty.background('black');
    Crafty.e('2D, DOM, Text, Keyboard, css_general')
      .attr({ w: 480, h: 20, x: 0, y: 80, z:5 })
      .text('Game Over')
      .css({ 'text-align': 'center' })
      .bind('KeyDown', function ()
      {
        if (this.isDown('SPACE') )
        {
          Crafty.scene('mainMenu'); //restart the fun!
        }
      });
  });


}

function createPlayer(x, y)
{
  player = Crafty.e('2D, DOM, joe, Tween, Twoway, Collision, Gravity,     Ape, Player, AxeAttacker, LevelManager')
    .attr({ x: x * 32, y: y * 32, z:1000 })
    .twoway(3, 5)
    .collision([58,3], [72,3], [72,50], [58,50])
    .gravity('floor')
    .gravityConst(.3)
    ;

  player.axe = Crafty.e('2D, DOM')
      .attr({ x: x*32, y: y*32, w:36, h:46, z:999 })
     // .color('blue')
      .addComponent('Collision');

  if (collisionBox) player.addComponent('WiredHitBox');
  if (collisionBox) player.axe.addComponent('WiredHitBox');
}

function createNative(x, y, first)
{
  var nativeMan = Crafty.e('2D, DOM, nativeMan, Tweenable, Collision, Gravity,     Ape, Enemy, NativeTypeAxe')
    .attr({ x: x * 32, y: y * 32, z:1000 })
    .origin('bottom center')
    .collision([55,3], [75,3], [75,50], [55,50])
    .gravity('floor')
    .gravityConst(.1)
    ;

  nativeMan.axe = Crafty.e('2D, DOM')
    .attr({ x: x*32, y: y*32, w:30, h:46, z:999 })
   // .color('blue')
    .addComponent('Collision');

  indians.push(nativeMan);


  if (first) nativeMan.first = true;

  if (collisionBox) nativeMan.addComponent('WiredHitBox');
  if (collisionBox) nativeMan.axe.addComponent('WiredHitBox');
}

var lastTreeCreated = false;
function createTree(x, y, treeType, treeNumber)
{
  var tree = Crafty.e('2D, DOM, tree'+treeType+', Tweenable, Collision,       Tree')
    .attr({ x: x, y: y + (Crafty.math.randomInt(-2,2)*5), z:999-treeNumber })
    //.attr({ x: x, y: y + (Crafty.math.randomInt(-2,2)*5), z:600+treeNumber })
    .origin('bottom center')
    .collision([85,250], [160,150], [160,305+140], [85,305+140])
    ;
  if (treeNumber == 0) tree.setFirst();
  else if (treeNumber == 40)
  {
    tree.life = 1;
    tree.isLast = true;
    tree.trigger('Hit', false);
  }


  if (collisionBox) tree.addComponent('WiredHitBox');
}

function createArrow()
{
  Crafty.e('2D, DOM, nextStageArrow, Blinker')
    .attr({ x: stageWidth*(stage+1)-150, y: 50, z:1500 })
    ;
  Crafty.audio.play("go");
}

function createBlood(x, y)
{
  Crafty.e('2D, DOM, Tween, blood, blood'+Crafty.math.randomInt(1,6))
    .attr({ x: x, y: y, z:600, h:1 })
    .tween({h: 30}, 65);
    ;
}

function increasePoints(x)
{
  points += x;
  pointsHUD.innerHTML = points;
}

function changeLife(newValue)
{
  lifeHUD.innerHTML = newValue;
}

function showText(speaker, msg)
{
   dialog = Crafty.e('2D, DOM, Text')
        .attr({ w: 220, h: 120, x: speaker.x-55, y: speaker.y-50, z:2001 })
        .text(msg);
   lastMsgTimer = Crafty.frame();
   speaker.attach(dialog);
   
   nextMsgTime = lastMsgTimer + 1500 + Crafty.math.randomInt(100,500);
}