function initializeGameComponents()
{
  //BASIC APE MOVEMENTS
  Crafty.c('Ape',
  {
    init: function()
    {
      this
      .attr('facingRight', true)
      .requires('SpriteAnimation')
      .animate('walk_left', 0, 1, 1)
      .animate('walk_right', 0, 0, 1)
      .bind('NewDirection',
        function (direction)
        {
          if (direction.x < 0)
          {
            this.facingRight = false;
            if (!this.isPlaying('walk_left'))
              this.stop().animate('walk_left', 10, -1);
          }
          if (direction.x > 0)
          {
            this.facingRight = true;
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
      this.life = 5;
      this
      .bind('Hit',
        function ()
        {
          if (this.life> 0) this.life--;
          changeLife(this.life);
          Crafty.audio.play("playerHurt");

          if (this.life==0)  //die
          {
            this.tween({'alpha':0}, 30);
            if (indiansToKill>0)
            {
              Crafty.e('2D, DOM, Text')
                .attr({ w: 220, h: 120, x: this.x-55, y: this.y-50, z:2001 })
                .text('You died. Press 5 to start over');
            }
            else
            {
              Crafty.e('2D, DOM, Text, Tween')
                .attr({alpha:0, w: 220, h: 120, x: stageWidth*3+300, y: this.y-50, z:2001 })
                .text('Oopsie. You can\'t beat nature')
                .tween({'alpha': 1}, 200);
		  Crafty.e('2D, DOM, Text, Tween')
                .attr({alpha:0, w: 220, h: 120, x: stageWidth*3+300, y: this.y, z:2001 })
                .text('THE END')
                .tween({'alpha': 1}, 200);
		  Crafty('nextStageArrow').each(function() { this.destroy(); });
            }
          }
        })
	  .bind('Moved', function(from)
	  {
	    if (this.attackCounter < 20)
	    {
	      this.attr({x: from.x, y:from.y});
	    }
	    else
	    {
		    if(this.x < (832 * (stage) - 53)  && this.x<from.x)
		    {
			  this.attr({x: from.x, y:from.y});
		    }
		    else if(this.x>from.x && this.x > ( 832 * (stage+1) - 74) )
		    {
			  this.attr({x: from.x, y:from.y});
		    }
		    
		    if (this.x>from.x && !this.isPlaying('walk_right'))
			  this.stop().animate('walk_right', 10, -1);
		    else if (this.x<from.x && !this.isPlaying('walk_left'))
			  this.stop().animate('walk_left', 10, -1);
		}
	  });
    }});

  //   AAAAAAAAAAXEEEEEEEEEEE
  Crafty.c('AxeAttacker', {
    init: function()
    {
      //setup animations
      this.requires('SpriteAnimation')
      .animate('attack_right', 0, 2, 1)
      .animate('attack_left', 0, 3, 1)

      .requires('Keyboard')
      .attr('attackCounter', 150)
      /*.bind('KeyDown', function (e)
      {
            if (e.key == Crafty.keys['S'])
            {
              this.addComponent('WiredHitBox');
              Crafty('Enemy').each(function(){this.addComponent('SolidHitBox');});
              Crafty('Tree').each(function(){this.addComponent('SolidHitBox');this.draw();});
            }
      })*/
      .bind('EnterFrame', function ()
      {
          this.attackCounter++;
          if (this.attackCounter > 20)
          {
            if (this.isDown('SPACE')) this.attack();
          }

          if (this.isDown('5') || this.isDown('NUMPAD_5')) Crafty.scene('title');
      })
      ;
    }
    ,
    attack: function()
    {
      this.attackCounter = 0;
      if (this.facingRight)
      {
        this.stop().animate('attack_right', 10, 0);
        this.axe.x = this.x + this.w/2 + 8;
        this.axe.y = this.y + this.h/2 - 24;
      }
      else
      {
        this.stop().animate('attack_left', 10, 0);
        this.axe.x = this.x + this.w/2 - 8 - this.axe.w;
        this.axe.y = this.y + this.h/2 - 24;
      }

      var treesHit = this.axe.hit('Tree');
      if(treesHit)
      {
        treesHit[0].obj.trigger('Hit', this.facingRight);
      }

      var enemiesHit = this.axe.hit('Enemy');
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
        .attr('life', 3)
        .attr('treeType', 1)
        .attr('isLast', false)
        .attr('hitCounter', 50)
        .attr('bouncing', false)
        .attr('falling', false)
	  .attr('hurtsEnemies', true)
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
            if (!this.isFirst) this.y -=0.4;
            if (!this.isFirst) this.x +=0.2;
            if (!this.isFirst) this.z -=1;
            this.tweenProperties.timeCounter++;

            var enemiesHit = this.hit('Enemy');
            if(enemiesHit && this.hurtsEnemies)
            {
              for(var i=0;i<enemiesHit.length;i++)
              {
                if(!enemiesHit[i].obj.state.dying && !enemiesHit[i].obj.state.dead)
                {
                  enemiesHit[i].obj.trigger('Hit');
                }
              };
            }
            if (this.tweenProperties.timeCounter > this.tweenProperties.duration)
            {
              this.falling = false;
              this.collision([0,0], [1,0], [1,1])
            }
            else if (this.tweenProperties.timeCounter > 50 && this.tweenProperties.timeCounter < 100)
            {
              if (!this.isFirst)
              {
                if (this.tweenProperties.timeCounter == 66)
                  Crafty.audio.play("treeFall");

                Crafty("Ape").each(function() { this.y -= 1.5; });
                if (this.tweenProperties.timeCounter % 20 == 0)
                {
                  marginTop += 5;
                }
                else if (this.tweenProperties.timeCounter % 20 == 10)
                {
                  marginTop -= 5;
                }
                document.getElementById('pointsHUD').style.marginTop = marginTop + 'px';
		    
		    this.hurtsEnemies = false;
              }
            }
            else if (this.isFirst && this.tweenProperties.timeCounter > 250 && this.tweenProperties.timeCounter < 340)
            {
              if (this.tweenProperties.timeCounter == 274)
                Crafty.audio.play("treeFall");
		    
		  // if (this.tweenProperties.timeCounter == 230)
                // Crafty.audio.play("music", -1, 0.6);

              Crafty("Ape").each(function() { this.y -= 1.5; });
              if (this.tweenProperties.timeCounter % 10 == 0)
              {
                marginTop += 5;
              }
              else if (this.tweenProperties.timeCounter % 10 == 4)
              {
                marginTop -= 5;
              }
              document.getElementById('pointsHUD').style.marginTop = marginTop + 'px';
		  this.hurtsEnemies = false;
            }
          }
        })
        .requires('Tweenable')
        .bind('Hit',
          function (directionRight)
          {
            if ( (this.hitCounter > 20) && !this.falling )
            {
              Crafty.audio.play("chop");
              this.life--;
              this.hitCounter = 0;
              if (this.life>0)
              {
                if (directionRight) this.setTweenProperties(0, 2, 50);
                  else this.setTweenProperties(0, -2, 50);
                this.bouncing = true;
              }
              else if (this.life==0)   //the tree dies
              {
                if (this.isFirst)
                {
                  this.setTweenProperties(0, 80, 700);
                  this.collision([140,250], [160,150], [160,305], [140,305]);
                  createNative(25, 11).first = true;
                }
                else if (this.isLast)
                {
                  this.setTweenProperties(0, -80, 50);
                  this.collision([90,150], [110,250], [110,305], [90,305]);
                }
                else if (directionRight)
                {
                  this.setTweenProperties(0, 80, 150);
                  this.collision([140,300], [160,230], [160,405], [140,405]);
                }
                else
                {
                  this.setTweenProperties(0, -80, 150);
                  this.collision([90,230], [110,300], [110,405], [90,405]);
                }
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

      this.lastTreeCreated = false;
      this
      .bind('EnterFrame',
        function ()
        {
          //handle the messages
          if (nextMsgTime > 0 && Crafty.frame() > nextMsgTime)
          {
            for (var i=0;i<indians.length;i++)
            {
              if (indians[i].x < stageWidth*(stage+1)-150)
              {
                 createText(indians[i], insults[Crafty.math.randomInt(0, insults.length-1)]);
                 nextMsgTime = dialog.lastMsgTime + 1500 + Crafty.math.randomInt(100,500);
                 break;
              }
            }
          }

          //handle the stages within the level
          if (level == 0)
          {
            if ( !this.stage[0].completed && (killedIndians == 1) )
            {
              createArrow();
              this.stage[0].completed = true;
            }
            else if ( !this.stage[1].completed && (points == 7) )  //7
            {
              createArrow();
              this.stage[1].completed = true;
            }
            else if ( !this.stage[2].completed && (points == 14) )    //14
            {
              createArrow();
              this.stage[2].completed = true;

              finalText = Crafty.e('2D, DOM, Text')
              .attr({ w: 400, h: 220, x: stageWidth*3+200, y: 50, z:2001 })
              .text('The forest is destroyed. Now you just need to kill the '+indiansToKill+' men left and go home');
              killedIndians = 0;
            }
            else if ( !this.stage[3].completed && (indiansToKill == 0) )    //14
            {
              createArrow();
		  console.log('fim stage 4');
              this.stage[3].completed = true;
            }
            else if ( stage < 4 && this.stage[stage].completed
                      && player.x > (stageWidth)*(stage+1)-100)
            {
              if (stage==3 && !this.lastTreeCreated && player.life > 0)
              {
                 var lastTree = createTree(stageWidth*4, 1, 3, 40);
                 lastTree.life = 1;
                 lastTree.isLast = true;
                 lastTree.trigger('Hit', false);
                 this.lastTreeCreated = true;

                 player.life = 1;
                 player.trigger('Hit');
                 player.z = 100;
              }
              else
              {
                if (stage!=3)
                {
                  Crafty.viewport.pan('x', stageWidth, 50);

                  //player.tween({x: (stageWidth)*(stage+1)+50}, 45);
                  //player.x = (stageWidth)*(stage+1)+10;
                  stage++;
                  Crafty('Blood').each(function() { this.destroy(); });
                }
              }
            }
          }
        });
    },
    indianKilled: function()
    {
      killedIndians++;
      if (stage == 3)
      {
         if (indiansToKill > 0)
         {
           indiansToKill--;
           if (indiansToKill > 1) finalText.text('The forest is destroyed. Now you just need to kill the ' +indiansToKill+' men left and go home');
           else finalText.text('The forest is destroyed. Now you just need to kill the ' +indiansToKill+' man left and go home');
         }
         else
         {
           finalText.destroy();
         }
      }
    }
    });

    Crafty.c('Blink',
    {
      init: function()
      {
        this.rate = 10;
        this.bind('EnterFrame', function()
        {
          if (Crafty.frame() % this.rate == 0)
          {
            this.visible = !this.visible;
          }
        });
      }
    });

    Crafty.c('TimedDialog',
    {
      init: function()
      {
        this.lastMsgTime = Crafty.frame();
        this.timeLimit = 250;
        this.bind('EnterFrame', function()
        {
          if (Crafty.frame() - this.lastMsgTime > this.timeLimit)
          {
            this.destroy();
          }
        });
      }
    });
};