function initializeGameComponents()
{
  //BASIC APE MOVEMENTS
  Crafty.c('Ape', {
    init: function()
    {
      //setup animations
      this.requires("SpriteAnimation")
      .animate("walk_left", 0, 1, 0)
      .animate("walk_right", 0, 0, 0)

      .bind("NewDirection",
        function (direction)
        {
          if (direction.x < 0)
          {
            if (!this.isPlaying("walk_left"))
              this.stop().animate("walk_left", 10, -1);
          }
          if (direction.x > 0)
          {
            if (!this.isPlaying("walk_right"))
              this.stop().animate("walk_right", 10, -1);
          }
          if(!direction.x && !direction.y)
          {
            this.stop();
          }
        });
    }});
    
    //  TREEEEEEEE
    Crafty.c('Tree', {
    init: function()
    {
      this.bind("Fall",
          function ()
          {
            this.addTween({rotation: 80}, "easeOutBounce", 200);    //tree falls down
          })
        .bind("Bounce",
          function ()
          {
            this.addTween({rotation: 5}, "easeInElastic", 50)   //bounce the tree
          })
        ;
    }});

};