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
    for (var i = 0; i < stageWidth; i++) {
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
    createTree(9);
    createTree(13);
    createTree(15);
    createPlayer(6,11);
    createNative(3,11);
    createNative(8,11);
    createNative(14,11);

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
  player = Crafty.e('2D, DOM, joe, Twoway, Collision, Gravity,     Ape, AxeAttacker')
    .attr({ x: x * 32, y: y * 32, z:1000 })
    .twoway(3, 5)
    .collision([22,3], [45,3], [45,62], [22,62])
    .gravity('grass1')
    .gravityConst(.3)
    ;
  
  if (collisionBox) player.addComponent('WiredHitBox');
}

function createNative(x, y)
{
  var nativeMan = Crafty.e('2D, DOM, nativeMan, Tweener, Collision, Gravity,     Ape, Enemy, NativeTypeA')
    .attr({ x: x * 32, y: y * 32, z:1000 })
    .origin('bottom center')
    .collision([22,3], [45,3], [45,62], [22,62])
    .gravity('grass1')
    .gravityConst(.1)
    ;

  if (collisionBox) nativeMan.addComponent('WiredHitBox');
}

function createTree(x)
{
  var tree = Crafty.e('2D, DOM, tree1, Tweener, Collision,       Tree')
    .attr({ x: x * 32, y: 200, z:500 })
    .origin('bottom center')
    .collision([62,150], [102,150], [102,212], [62,212])
    //.trigger('Bounce')
    ;
    
  if (collisionBox) tree.addComponent('WiredHitBox');
}

function increasePoints(x)
{
  points += x;
  pointsHUD.innerHTML = points;
}