function initializeGameComponents()
{
  //BASIC APE MOVEMENTS
  Crafty.c('Ape',
  {
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
    
  Crafty.c('Player',
  {
    init: function()
    {
      this.life = 10;
      this
      .bind('Hit',
        function ()
        {
          this.life--;
          console.log(this.life);
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




    //  TREEEEEEEE
    Crafty.c('Tree', {
    init: function()
    {
      this
        .attr('life', 2)
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

            var enemiesHit = this.hit('Enemy');
            if(enemiesHit)
            {
              for(var i=0;i<enemiesHit.length;i++)
              {
                if(!enemiesHit[i].obj.state.dying && !enemiesHit[i].obj.state.dead)
                {
                  enemiesHit[i].obj.trigger('Hit');  console.log('acertou');
                }
              };
            }
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
            if ( (this.hitCounter > 20) && !this.falling )
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
                this.collision([140,250], [160,150], [160,305], [140,305]);
                this.falling = true;

                increasePoints(1);
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


    Crafty.c('LevelManager', {
    init: function()
    {
      this.stage = [];
      for(var i=0;i<map1.stages;i++) this.stage[i] = {completed: false};

      this
      .bind('EnterFrame',
        function ()
        {
          if (level == 0)
          {
            if ( !this.stage[0].completed && (points == 3) )
            {
              createArrow();
              this.stage[0].completed = true;
            }
            else if ( !this.stage[1].completed && (points == 5) )
            {
              createArrow(); console.log('fim stage 2');
              this.stage[1].completed = true;
            }
            else if ( this.stage[stage].completed
                      && player.x > (stageWidth)*(stage+1)-150)
            {
              Crafty.viewport.pan('x', stageWidth, 50);
              player.tween({x: (stageWidth)*(stage+1)+50}, 65);
              stage++;
            }
          }
        });
    }});

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