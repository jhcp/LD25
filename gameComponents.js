function initializeGameComponents()
{
  //BASIC APE MOVEMENTS
  Crafty.c('Ape', {
    init: function()
    {
      //setup animations
      this.requires('SpriteAnimation')
      .animate('walk_left', 0, 1, 0)
      .animate('walk_right', 0, 0, 0)

      .bind('NewDirection',
        function (direction)
        {
          if (direction.x < 0)
          {
            if (!this.isPlaying('walk_left'))
              this.stop().animate('walk_left', 10, -1);
          }
          if (direction.x > 0)
          {
            if (!this.isPlaying('walk_right'))
              this.stop().animate('walk_right', 10, -1);
          }
          if(!direction.x && !direction.y)
          {
            this.stop();
          }
        });
    }});
    
  //   AAAAAAAAAAXEEEEEEEEEEE
  Crafty.c('AxeAttacker', {
    init: function()
    {
      //setup animations
      this.requires('SpriteAnimation')
      .animate('attack', 0, 2, 1)

      .requires('Keyboard')
      .attr('attackCounter', 150)
      .bind('EnterFrame', function ()
      {
          this.attackCounter++;
          if (this.attackCounter > 50)
          {
            if (this.isDown('SPACE')) this.attack();
          }
      })
      ;
    }
    ,
    attack: function()
    {
      this.attackCounter = 0;
      this.stop().animate('attack', 50, 0);
      var treesHit = this.hit('Tree');
      if(treesHit)
      {
        treesHit[0].obj.trigger('Hit');
        console.log('hit');
      }
    }


    });
    
    //  TREEEEEEEE
    Crafty.c('Tree', {
    init: function()
    {
      this
        .attr('life', 3)
        .bind('Hit',
          function ()
          {
            this.life--;
            if (this.life>0)
            {
              this.addTween({rotation: 2}, 'easeOutElastic', 50)   //bounce the tree
            }
            else
            {
              this.addTween({rotation: 80}, 'easeOutBounce', 200);    //tree falls down
            }
          })
        ;
    }});

};