var  images =
  {
    'baseTiles':
    [
      {'name': 'grass', 'file': 'assets/images/tile2big.png'},
    ],
    'trees':
    {
      'tree1': 'assets/images/tree3.png',
    },
    'enemySprites':
    [
      {'name': 'nativeMan', 'file': 'assets/images/native2.png'},
    ],
    'player':
    {
      'sprite': 'assets/images/joe5.png',
    },
    'other':
    {
      'arrow': 'assets/images/arrow2x.png',
      'blood': 'assets/images/blood.png',
      'title': 'assets/images/title.png',
    }
  };

function getImagesToLoad()
{
  var toLoad = new Array();
  for (var i = 0; i < images.baseTiles.length; i++) toLoad.push(images.baseTiles[i].file);
  for (var i = 0; i < images.enemySprites.length; i++) toLoad.push(images.enemySprites[i].file);
  toLoad.push(images.trees.tree1);
  toLoad.push(images.player.sprite);
  toLoad.push(images.other.arrow);toLoad.push(images.other.blood);toLoad.push(images.other.title);
  
  return toLoad;
}

function setupImages()
{
  Crafty.sprite(32, images.baseTiles[0].file, {
    grass2: [0, 0],
  });
  Crafty.sprite(238, 464, images.trees.tree1, {
    tree1: [0, 0],
    tree2: [1, 0],
    tree3: [2, 0],
  });
  Crafty.sprite(128, 64, images.player.sprite, {
    joe: [0, 0],
  });
  Crafty.sprite(128, 64, images.enemySprites[0].file, {
    nativeMan: [0, 0],
  });
  
  Crafty.sprite(98, 52, images.other.arrow, {
    nextStageArrow: [0, 0],
  });
  Crafty.sprite(567, 461, images.other.title, {
    title: [0, 0],
  });
  Crafty.sprite(41, 30, images.other.blood, {
    blood1: [0, 0],
    blood2: [1, 0],
    blood3: [2, 0],
    blood4: [3, 0],
    blood5: [4, 0],
    blood6: [5, 0],
  });
}