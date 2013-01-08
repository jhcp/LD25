var images =
{
  'trees': 'assets/images/tree3.png',
  'nativeMan': 'assets/images/native2.png',
  'player': 'assets/images/joe5.png',
  'arrow': 'assets/images/arrow2x.png',
  'blood': 'assets/images/blood.png',
  'title': 'assets/images/title.png',
  'bg': 'assets/images/bg.png'
};

function getImagesToLoad()
{
  var toLoad = new Array();
  for (image in images) toLoad.push(images[image]);
  return toLoad;
}

function setupImages()
{
  Crafty.sprite(238, 464, images.trees, {
    tree1: [0, 0],
    tree2: [1, 0],
    tree3: [2, 0],
  });
  Crafty.sprite(128, 64, images.player, {
    joe: [0, 0],
  });
  Crafty.sprite(128, 64, images.nativeMan, {
    nativeMan: [0, 0],
  });

  Crafty.sprite(98, 52, images.arrow, {
    nextStageArrow: [0, 0],
  });
  Crafty.sprite(567, 461, images.title, {
    title: [0, 0],
  });
  Crafty.sprite(41, 30, images.blood, {
    blood1: [0, 0],
    blood2: [1, 0],
    blood3: [2, 0],
    blood4: [3, 0],
    blood5: [4, 0],
    blood6: [5, 0],
  });
}