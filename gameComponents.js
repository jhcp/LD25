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
          if (this.attackCounter > 20)
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
      this.stop().animate('attack', 20, 0);
      var treesHit = this.hit('Tree');
      if(treesHit)
      {
        treesHit[0].obj.trigger('Hit');
      }
      
      var enemiesHit = this.hit('Enemy');
      if(enemiesHit)
      {
        enemiesHit[0].obj.trigger('Hit');
      }
    }
    });
    

  //   EEEEENEMYY
  Crafty.c('Enemy', {
    init: function()
    {
      //setup animations
      this.requires('SpriteAnimation')
      .animate('attack', 0, 2, 1)
      .attr('attackCounter', 150)
      .bind('EnterFrame', function ()
      {
          this.attackCounter++;
          if (this.attackCounter > 50)
          {
            //if (this.isDown('SPACE')) this.attack();
          }
      })
      
      .attr('life', 1)
      .bind('Hit',
        function ()
        {
          this.life--;
          if (this.life>0)
          {
            //this.addTween({rotation: 2}, 'easeOutElastic', 18, endOfTween, [this])   //bounce the tree
          }
          else
          {
            this.addTween({rotation: 80}, 'easeOutBounce', 50, endOfTween, [this]);    //tree falls down
          }
        })
      ;
      ;
    }
    ,
    attack: function()
    {
      this.attackCounter = 0;
      this.stop().animate('attack', 50, 0);
    }
    });
    

    
    
    Crafty.c('NativeTypeA',{init: function()
    {
      this.movement = { x: 0};
      this.requires('Collision')
      .attr({calculateRouteCounter: 95, animationSpeed:100, nextThinking:40})
      .bind('EnterFrame', function ()
      {
        if (this.life > 0)
        {
          this.calculateRouteCounter++;      //this flag is a delay for the re-routing
          if (this.calculateRouteCounter > this.nextThinking)      //follow the player:
          {
            var randomNumber = Crafty.math.randomInt(1,10);
            //random movements: stop, move to a random position or follow the player
            if (Crafty.math.randomInt(1,10) > 9)
            {
              //stop
              this.movement.x = 0;
              this.nextThinking = 40;
            }
            else
            {
              var targetX, targetY;
              if (randomNumber > 7)
              {
                //targets a random position
                targetX = Crafty.math.randomInt(0, stageWidth - 1)*tileSize + (tileSize/2);
              }
              else
              {
                //targets the player
                targetX = player.x;
              }
  
              //we calculate a movement vector of size 1, by dividing the distance vector for its size
              var distanceX = targetX - this.x;
              if (distanceX >= 0)
              {
                this.movement.x = 1;
              }
              else
              {
                this.movement.x = -1;
              }
  
              this.nextThinking = Crafty.math.randomInt(30,50);
            }
  
            this.calculateRouteCounter = 0;
            this.trigger('NewDirection', this.movement);  //trigger a NewDirection event so that it can change it's moving animation (e.g., Ape)
          }
  
          //the actual movement
          this.x += this.movement.x;
        }

      });
      return this;
    }});



    //  TREEEEEEEE
    Crafty.c('Tree', {
    init: function()
    {
      this
        .attr('life', 3)
        .attr('hitCounter', 50)
        .bind('EnterFrame', function ()
        {
          this.hitCounter++;
        })
        .bind('Hit',
          function ()
          {
            if (this.hitCounter > 55)
            {
              this.life--;
              this.hitCounter = 0;
              if (this.life>0)
              {
                this.addTween({rotation: 2}, 'easeOutElastic', 50, endOfTween, [this])   //bounce the tree
              }
              else if (this.life==0)
              {
                this.addTween({rotation: 80}, 'easeOutBounce', 50, endOfTreeFall, [this]);    //tree falls down
  
                increasePoints(1);
                //endOfTreeAnimation();
              }
            }
          })
        ;
    }});

};

function endOfTween(tweenedEntity)
{
  tweenedEntity.trigger('RemoveComponent', tweenedEntity);
};
function endOfTreeFall(tree)
{
  endOfTween(tree);
  tree.addTween({alpha: 0}, 'easeInQuad', 100, endOfTween, [tree]);
}