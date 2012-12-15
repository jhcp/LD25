var testingMode = false;

//stage variables
var stageWidth = 26;
var stageHeight = 16;
var tileSize = 32;

//global state and variables
var points = 0;
var player = null;

function generateWorld()
{
    //loop through all tiles
    for (var i = 0; i < stageWidth; i++) {
        for (var j = 13; j < stageHeight; j++) {

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
    Crafty.background('white');
    generateWorld();
    createTree();
    createPlayer(6,11);

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
    .twoway(1, 0)
    .gravity('grass1')
    .gravityConst(.1)
    ;
}

function createTree()
{
  Crafty.e('2D, DOM, tree1, Tweener, Collision,       Tree')
    .attr({ x: 250, y: 200, z:500 })
    .origin('bottom center')
    .collision([62,150], [102,150], [102,212], [62,212])
    //.trigger('Bounce')
    ;
}