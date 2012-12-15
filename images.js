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

function setupImages()
{
  Crafty.sprite(32, images.baseTiles[0].file, {
    grass1: [0, 0],
  });
  Crafty.sprite(131, 212, images.trees.tree2, {
    tree: [0, 0],
  });
  /*Crafty.sprite(64, images.player.sprite, {
    blob: [0, 0],
  });*/
}