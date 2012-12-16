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
var pointsHUD = document.getElementById('points');
var player = null;

function generateWorld()
{
  //generate floor
  var floorTile = Crafty.e('2D, DOM, Color, Collision, floor')
      .attr({ x: -100, y: 13*tileSize, w:map1.size + 200, h:3, z:10 })
      .color('white');
  floorTile.addComponent('WiredHitBox');

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

      Crafty.scene('level1');
    });
    

  });
  Crafty.scene('loading');

  Crafty.scene('level1', function ()
  {
    //Crafty.background('white');
    Crafty.background('url("assets/images/bg.png")');
    generateWorld();

    createPlayer(6,11);
    createNative(10,11);
    createNative(32,11);
    createNative(33,11);

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
    .collision([22,3], [45,3], [45,42], [22,42])
    .gravity('floor')
    .gravityConst(.3)
    ;

  if (collisionBox) player.addComponent('WiredHitBox');
}

function createNative(x, y)
{
  var nativeMan = Crafty.e('2D, DOM, nativeMan, Tweenable, Collision, Gravity,     Ape, Enemy, NativeTypeAxe')
    .attr({ x: x * 32, y: y * 32, z:1000 })
    .origin('bottom center')
    .collision([22,3], [45,3], [45,62], [22,62])
    .gravity('floor')
    .gravityConst(.1)
    ;

  if (collisionBox) nativeMan.addComponent('WiredHitBox');
}

function createTree(x, y, treeType, treeNumber)
{
  var tree = Crafty.e('2D, DOM, tree'+treeType+', Tweenable, Collision,       Tree')
    .attr({ x: x, y: y, z:999-treeNumber })
    .origin('bottom center')
    .collision([85,250], [160,150], [160,305], [85,305])
    //.trigger('Bounce')
    ;

  if (collisionBox) tree.addComponent('WiredHitBox');
}

function createArrow()
{
  Crafty.e('2D, DOM, nextStageArrow')
    .attr({ x: stageWidth*(stage+1)-150, y: 50, z:1500 })
    ;
}

function increasePoints(x)
{
  points += x;
  pointsHUD.innerHTML = points;
}