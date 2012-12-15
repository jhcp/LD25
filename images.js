var  images =
  {
    'baseTiles':
    [
      {'name': 'dirt', 'file': 'assets/images/tile2big.png'},
    ],
    'trees':
    {
      'tree2': 'assets/images/tree2.png',
    },
    'enemySprites':
    [
      {'name': 'native', 'file': 'assets/images/native.png'},
    ],
    'player':
    {
      'sprite': 'assets/images/joe.png',
    },
    'other':
    {
      'hpBg': 'assets/images/hp-bg.png',
      'hpFg': 'assets/images/hp-fg.png',
    }
  };

function getImagesToLoad()
{
  var toLoad = new Array();
  for (var i = 0; i < images.baseTiles.length; i++) toLoad.push(images.baseTiles[i].file);
  //for (var i = 0; i < images.enemySprites.length; i++) toLoad.push(images.enemySprites[i].file);
  toLoad.push(images.trees.tree2);
  toLoad.push(images.player.sprite);
//  toLoad.push(images.other.hpBg);toLoad.push(images.other.hpFg);
  
  return toLoad;
}

function setupImages()
{
  Crafty.sprite(32, images.baseTiles[0].file, {
    grass1: [0, 0],
  });
  Crafty.sprite(131, 212, images.trees.tree2, {
    tree1: [0, 0],
  });
  Crafty.sprite(64, images.player.sprite, {
    joe: [0, 0],
  });
}