var testingMode = false;
var collisionBox = false;

//stage variables
var stageWidth = 26;   //26*32 =  832
var stageHeight = 16;  //16*32 =  512
var tileSize = 32;

//global state and variables
var points = 0;
var pointsHUD = document.getElementById('points');
var player = null;

function generateWorld()
{
    //loop through all tiles
    for (var i = 0; i < stageWidth*2; i++) {
        for (var j = 13; j < 14; j++) {

            //place grass on all tiles
            grassType = Crafty.math.randomInt(1, 4);
            Crafty.e('2D, DOM, grass' + 1)
                .attr({ x: i * tileSize, y: j * tileSize, z:1 });
        }
    }

}
window.onload = function ()
{
  Crafty.init(stageWidth*tileSize, stageHeight*tileSize);
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
    createTree(1, 13);
    createTree(2, 15);
    createTree(1, 19);
    createTree(1, 28);
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
  player = Crafty.e('2D, DOM, joe, Tween, Twoway, Collision, Gravity,     Ape, AxeAttacker')
    .attr({ x: x * 32, y: y * 32, z:1000 })
    .twoway(3, 5)
    .collision([22,3], [45,3], [45,42], [22,42])
    .gravity('grass1')
    .gravityConst(.3)
    ;

  if (collisionBox) player.addComponent('WiredHitBox');
}

function createNative(x, y)
{
  var nativeMan = Crafty.e('2D, DOM, nativeMan, Tweener, Collision, Gravity,     Ape, Enemy, NativeTypeAxe')
    .attr({ x: x * 32, y: y * 32, z:1000 })
    .origin('bottom center')
    .collision([22,3], [45,3], [45,62], [22,62])
    .gravity('grass1')
    .gravityConst(.1)
    ;

  if (collisionBox) nativeMan.addComponent('WiredHitBox');
}

function createTree(treeType, x)
{
  var tree = Crafty.e('2D, DOM, tree'+treeType+', Tweener, Collision,       Tree')
    .attr({ x: x * 32, y: 101, z:500 })
    .origin('bottom center')
    .collision([85,250], [160,250], [160,305], [85,305])
    //.trigger('Bounce')
    ;

  if (collisionBox) tree.addComponent('WiredHitBox');
}

function createArrow()
{
  Crafty.e('2D, DOM, nextStageArrow')
    .attr({ x: 680, y: 50, z:1500 })
    ;
}

function increasePoints(x)
{
  points += x;
  pointsHUD.innerHTML = points;
}