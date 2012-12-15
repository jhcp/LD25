var testingMode = false;

//stage variables
var stageWidth = 26;
var stageHeight = 16;
var tileSize = 32;

//global state and variables
var points = 0;

function generateWorld()
{
    //loop through all tiles
    for (var i = 0; i < stageWidth; i++) {
        for (var j = 13; j < stageHeight; j++) {

            //place grass on all tiles
            grassType = Crafty.math.randomInt(1, 4);
            Crafty.e("2D, DOM, grass" + 1)
                .attr({ x: i * tileSize, y: j * tileSize, z:1 });
        }
    }

}
window.onload = function ()
{
  Crafty.init(stageWidth*tileSize, stageHeight*tileSize);
  setupImages();

  initializeCraftyComponents();

  Crafty.scene('level1', function ()
  {
    Crafty.background('white');
    generateWorld();
    createPlayer(6,11);
    
    Crafty.e("2D, DOM, tree, Tweener")
      .attr({ x: 250, y: 200, z:101 })
      .origin("bottom center")
      .addTween({rotation: 5}, "easeInElastic", 50)   //bounce the tree
      //.addTween({rotation: 80}, "easeOutBounce", 200);    //tree falls down

  });
  

  Crafty.scene('level1');

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
  Crafty.e("2D, DOM, joe")
                .attr({ x: x * 32, y: y * 32, z:100 });
}

function initializeCraftyComponents()
{
  Crafty.c('Letter',{init: function()
  {
    this
    .requires('Collision')
    //.requires('Mouse')
    .bind('EnterFrame', function ()
    {
      //hit floor or roof
      if (this.y <= 0 || this.y >= stageHeight)
        this.dY = - this.dY;
      if (this.x <= 0 || this.x >= stageWidth)
        this.dX = - this.dX;

      this.x += this.dX;
      this.y += this.dY;

    })
    ;

      return this;
  }});
}