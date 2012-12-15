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
          if(!direction.x)
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
          };
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
            //this.addTween({rotation: 2}, 'easeOutElastic', 18, endOfTween, [this])
          }
          else
          {
            this.addTween({rotation: 80}, 'easeOutBounce', 50, endOfTween, [this]);
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
              var targetX;
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
        .attr('bouncing', false)
        .attr('falling', false)
        .bind('EnterFrame', function ()
        {
          this.hitCounter++;
          
          if (this.bouncing)
          {
            this.rotation = this.easeOutElastic();
            this.tweenProperties.timeCounter++;
            if (this.tweenProperties.timeCounter > this.tweenProperties.duration)
            {
              this.bouncing = false;
            }
          }
          if (this.falling)
          {
            this.rotation = this.easeOutBounce();
            this.y +=0.5;
            this.tweenProperties.timeCounter++;
            if (this.tweenProperties.timeCounter > this.tweenProperties.duration)
            {
              this.falling = false;
            }
          }
        })
        .requires('Tweenable')
        .bind('Hit',
          function ()
          {
            if (this.hitCounter > 20)
            {
              Crafty.audio.play("chop");
              this.life--;
              this.hitCounter = 0;
              if (this.life>0)
              {
                this.setTweenProperties(0, 2, 50);
                this.bouncing = true;
              }
              else if (this.life==0)   //the tree dies
              {
                this.setTweenProperties(0, 80, 150);
                this.falling = true;

                increasePoints(1);
                if (points == 2)
                {
                  createArrow();
                }
                if (points == 3)
                {
                  Crafty.viewport.pan('x', 800, 50);
                  player.tween({x: 850}, 65);
                }
              }
            }
          })
        ;
    }});
    
    // TTTTTTTTTWEENABLE
    Crafty.c('Tweenable', {
    init: function()
    {
      this.tweenProperties = { initialValue: 0,
                               targetValue: 0,
                               duration: 0,
                               timeCounter: 0,
                               
                               transformationDelta: 0,    //targetValue minus initialValue
                               timeCounter: 0};

    },
    setTweenProperties: function(initialValue, targetValue, duration)
    {
      this.tweenProperties.initialValue = initialValue;
      this.tweenProperties.targetValue = targetValue;
      this.tweenProperties.duration = duration;

      this.tweenProperties.transformationDelta = targetValue - initialValue;
      this.tweenProperties.timeCounter = 0;

    },
    
    easeOutElastic: function(a, p)
    {
      var t = this.tweenProperties.timeCounter;
      var b = this.tweenProperties.initialValue;
      var c = this.tweenProperties.transformationDelta;
      var d = this.tweenProperties.duration;
    
      if (t === 0) { return b; }
      if ((t /= d) === 1) { return b + c; }
      if (!p) { p = d * 0.3; }
      if (!a) { a = 1; }
      var s = 0;
      
      if (a < Math.abs(c))
      {
        a = c;
        s = p / 4;
      } else
      {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeOutBounce: function () 
    {
      var t = this.tweenProperties.timeCounter;
      var b = this.tweenProperties.initialValue;
      var c = this.tweenProperties.transformationDelta;
      var d = this.tweenProperties.duration;
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      }
      else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
      }
      else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
      } else {
	return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
      }
    }
    });

};

function endOfTween(tweenedEntity)
{
  tweenedEntity.trigger('RemoveComponent', tweenedEntity);
};
function endOfTreeFall(tree)
{
  endOfTween(tree);
  tree.addTween({alpha: 0}, 'easeOutQuad', 80, endOfTween, [tree]);
};