var testingMode = false;
var collisionBox = false;

//stage variables
var stageWidth = 832;   //26*32 =  832
var stageHeight = 512;  //16*32 =  512
var tileSize = 32;

//global state and variables
var level;
var stage;
var points;
var killedIndians;
var indiansToKill;
var pointsHUD = document.getElementById('points');
var lifeHUD = document.getElementById('life');
var finalText = null;  //todo remove this global var
var marginTop = 25;
var player = null;
var indians = new Array();
var boundaryLeft;
var boundaryRight;


var dialog = null;
var nextMsgTime;

function reset()
{
  Crafty.viewport.x = 0;

  level = 0;
  stage = 0;
  points = 0;
  killedIndians = 0;
  indiansToKill = 5;
  dialog = null;
  nextMsgTime = -1;

  pointsHUD.innerHTML = 0;
  lifeHUD.innerHTML = 10;
  boundaryLeft = -30;
  boundaryRight = stageWidth;
}

function generateLevel()
{
  //generate floor to prevent the characters to fall
  var floorTile = Crafty.e('2D, DOM, Collision, floor')
      .attr({ x: -100, y: 13*tileSize+50, w:map1.size + 2000, h:3, z:10 });

  //generate trees
  createTree(map1.trees[0].x, map1.trees[0].y, map1.trees[0].type, i)
    .attr('isFirst', true);
  for(var i=1;i<map1.trees.length;i++)
  {
    createTree(map1.trees[i].x, map1.trees[i].y, map1.trees[i].type, i);
  };

};

window.onload = function ()
{
  Crafty.init(stageWidth, stageHeight);
  setupImages();
  initializeGameComponents();
  initializeEnemyComponents();
  Crafty.viewport.clampToEntities = false;

  //todo check if the audio files can be loaded with the load function
  //using names as .add, instead of using the files
  var sounds = 
	{
	  'chop': 'assets/audio/chop.ogg',
	  'playerHurt': 'assets/audio/6.ogg',
	  'hurt': 'assets/audio/randomize12.ogg',
	  'treeFall': 'assets/audio/explosion3.ogg',
	  'go': 'assets/audio/8repeat.ogg'
	};
  var assets = new Array();
  for (image in images) assets.push(images[image]);
  for (sound in sounds) assets.push(sounds[sound]);

  Crafty.scene('loading', function ()
  {
    Crafty.background('rgb(30,30,30)');
    var loadingText = Crafty.e('2D, DOM, Text')
      .attr({ w: 480, h: 20, x: 0, y: 20 })
      .text('Loading...')
      .css({ 'text-align': 'center' });

    Crafty.load(assets, function ()
    {
      setupImages();
	Crafty.audio.add("chop", "assets/audio/chop.ogg");
	Crafty.audio.add("playerHurt", "assets/audio/6.ogg");
	Crafty.audio.add("hurt", "assets/audio/randomize12.ogg");
	Crafty.audio.add("treeFall", "assets/audio/explosion3.ogg");
	Crafty.audio.add("go", "assets/audio/8repeat.ogg");
	
      loadingText.destroy();

      Crafty.scene('title');
    },
    function (progress)
    {
      console.log(progress.percent);
    });

  });

  Crafty.scene('title', function ()
  {
    Crafty.background('url("assets/images/bg.png")');
    reset();  console.log('here');

    Crafty.e('2D, DOM, title')
      .attr({ x: 0, y: 20, z:10 })
      ;

    Crafty.e('2D, DOM, Text, Keyboard')
      .attr({ w: 300, h: 50, x: 270, y: 385, z:100 })
      .text('(press SPACE to play)')
      .css({ 'text-align': 'center' })
      .css({ 'color': 'white' })
      .bind('KeyDown', function(e)
      {
        if(e.key == Crafty.keys['SPACE'])
        {
          Crafty.scene('level1');
        }
      });

  });

  Crafty.scene('level1', function ()
  {
    Crafty.background('url("assets/images/bg.png")');
    generateLevel();
    createPlayer(3,11);
  });

  Crafty.scene('loading');
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
  player.axe = Crafty.e('2D')
      .attr({ x: x*32, y: y*32, w:36, h:46 })
      .addComponent('Collision');

  if (collisionBox) player.addComponent('WiredHitBox');
  if (collisionBox) player.axe.addComponent('WiredHitBox');

  return player;
}

function createNative(x, y)
{
  var nativeMan = Crafty.e('2D, DOM, nativeMan, Tweenable, Collision, Gravity,     Ape, Enemy, NativeTypeAxe')
    .attr({ x: x * 32, y: y * 32, z:1000 })
    .origin('bottom center')
    .collision([55,3], [75,3], [75,50], [55,50])
    .gravity('floor')
    .gravityConst(.1)
    ;
  nativeMan.axe = Crafty.e('2D')
    .attr({ x: x*32, y: y*32, w:30, h:46})
    .addComponent('Collision');

  if (collisionBox) nativeMan.addComponent('WiredHitBox');
  if (collisionBox) nativeMan.axe.addComponent('WiredHitBox');

  return nativeMan;
}

function createTree(x, y, treeType, treeNumber)
{
  var randomDisplacement = Crafty.math.randomInt(-2,2);
  var tree = Crafty.e('2D, DOM, tree'+treeType+', Tweenable, Collision,       Tree')
    .attr({ x: x, y: y + (randomDisplacement*5), z:800-treeNumber+randomDisplacement, treeType: treeType})
    .origin('bottom center')
    .collision([85,250], [160,150], [160,305+140], [85,305+140])
    ;

  if (collisionBox) tree.addComponent('WiredHitBox');
  return tree;
}

function createArrow()
{
  Crafty.e('2D, DOM, nextStageArrow, Blink')
    .attr({ x: stageWidth*(stage+1)-150, y: 50, z:1500 })
    ;
  Crafty.audio.play("go");
}

function createBlood(x, y)
{
  Crafty.e('2D, DOM, Tween, Blood, blood'+Crafty.math.randomInt(1,6))
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

function createText(speaker, msg)
{
  dialog = Crafty.e('2D, DOM, Text, TimedDialog')
    .attr({ w: 220, h: 120, x: speaker.x-55, y: speaker.y-50, z:2001 })
    .text(msg);
  speaker.attach(dialog);

  return dialog;
}