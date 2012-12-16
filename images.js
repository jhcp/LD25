var  images =
  {
    'baseTiles':
    [
      {'name': 'dirt', 'file': 'assets/images/tile2big.png'},
    ],
    'trees':
    {
      'tree1': 'assets/images/tree3.png',
    },
    'enemySprites':
    [
      {'name': 'nativeMan', 'file': 'assets/images/native.png'},
    ],
    'player':
    {
      'sprite': 'assets/images/joe4.png',
    },
    'other':
    {
      'arrow': 'assets/images/arrow2x.png',
    }
  };

function getImagesToLoad()
{
  var toLoad = new Array();
  for (var i = 0; i < images.baseTiles.length; i++) toLoad.push(images.baseTiles[i].file);
  for (var i = 0; i < images.enemySprites.length; i++) toLoad.push(images.enemySprites[i].file);
  toLoad.push(images.trees.tree1);
  toLoad.push(images.player.sprite);
  toLoad.push(images.other.arrow);
  
  return toLoad;
}

function setupImages()
{
  Crafty.sprite(32, images.baseTiles[0].file, {
    grass2: [0, 0],
  });
  Crafty.sprite(238, 316, images.trees.tree1, {
    tree1: [0, 0],
    tree2: [1, 0],
  });
  Crafty.sprite(128, 64, images.player.sprite, {
    joe: [0, 0],
  });
  Crafty.sprite(64, images.enemySprites[0].file, {
    nativeMan: [0, 0],
  });
  
  Crafty.sprite(98, 52, images.other.arrow, {
    nextStageArrow: [0, 0],
  });
}