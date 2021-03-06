function initializeEnemyComponents()
{
  Crafty.c('Enemy', {
    init: function()
    {
      this
        .attr({'attackCounter': 150, 'life': 1, 'saidMsg': null})
        .bind('Hit',
        function ()
        {
          if(!this.state.dying && !this.state.dead)
          {
            this.life--;
            if (this.life>0)
            {

            }
            else
            {
              for (ztate in this.state) {
                this.state[ztate] = false;
              }
              this.state.dying = true;
              this.stop();

              this.setTweenProperties(0, 80, 50);
              createBlood(this.x + this.w/2, this.y+60);
              Crafty.audio.play("hurt");

              player.indianKilled();

              if (this.first)
              {
                this.first = false;
                indians.push(createNative(49,11));
                indians.push(createNative(47,11));
              }
            }
          }
        })
      ;
      ;
    }
    ,
    attack: function()
    {
      this.state.walking = false;
      this.state.attacking = true;
      this.counter.attacking = 0;
      if (this.facingRight)
      {
        //attack to the right
        this.stop().animate('attackRight', 20, 0);
        this.axe.x = this.x + this.w/2 + 11;
        this.axe.y = this.y + this.h/2 - 24;
      }
      else
      {
        //attack to the left
        this.stop().animate('attackLeft', 20, 0);
        this.axe.x = this.x + this.w/2 - 11 - this.axe.w;
        this.axe.y = this.y + this.h/2 - 24;
      }

      var playersHit = this.axe.hit('joe');
      if(playersHit)
      {
        playersHit[0].obj.trigger('Hit');
      }
    },
    backup: function()
    {
      this.counter.backing = 0;
      this.state.backing = true;

      if (this.facingRight)
      {
        this.movement.x = -4;
      }
      else
      {
        this.movement.x = 4;
      }
    },
    calculateDistanceFromTarget: function()
    {
      var targetX = player.x+player.w/2;
      var distanceX = targetX - (this.x + this.w/2);

      return distanceX;
    }
    });


    Crafty.c('NativeTypeAxe',{

    init: function()
    {
      this.
      attr({'movement': { x: 0}, 'first': false, 'backingCounter': 0,
            'state': {walking: true, attacking: false, backing: false, crossing: false, dying: false, dead: false},
            'counter': {walking: 100, attacking:0, backing:0, crossing:0},
            'animationSpeed':100, 'nextThinking':10
      })
      .requires('Collision')
      .animate('attackRight', 0, 2, 1)
      .animate('attackLeft', 0, 3, 1)
      .bind('EnterFrame', function ()
      {
        if (this.state.crossing)
        {
          this.counter.crossing++;
          if (this.counter.crossing > 30)
          {
            this.state.crossing = false;
            this.state.walking = true
          }
          this.x += this.movement.x;
        }
        if (this.state.dying)
        {
          this.rotation = this.easeOutBounce();
          this.y +=0.25;
          this.tweenProperties.timeCounter++;
          if (this.tweenProperties.timeCounter > this.tweenProperties.duration)
          {
            this.state.dying = false;
            this.state.dead = true;
            this.setTweenProperties(1, 0, 50);
          }
        }
        if (this.state.dead)
        {
          this.alpha -=0.05;
          if (this.alpha < 0)
          {
            this.rotation = 0;
            this.alpha = 1;

            if (stage == 2)
            {
              this.x = stageWidth*2 - Crafty.math.randomInt(1,5)*150;
            }
            else if (stage == 3)
            {
              this.x = stageWidth*4 + (killedIndians % 3)*80;
            }
            else
            {
              this.x = stageWidth*(stage+1) + Crafty.math.randomInt(1,5)*200;
            }
            this.y = 11*32;
            this.state.dead = false;
            this.state.walking = true;
            
            if (indiansToKill <= 0) this.destroy();
          }
        }
        if (this.state.attacking)
        {
          this.counter.attacking++;
          if (this.counter.attacking > 20)
          {
            this.state.attacking = false;
            this.backup();
          }
        }
        if (this.state.backing)
        {
          this.counter.backing++;
          if (this.counter.backing > 20)
          {
            this.state.backing = false;
            this.state.walking = true;
            this.movement.x = 0;
          }
          else
          {
            this.x += this.movement.x;
          }
        }
        if (this.state.walking)
        {
          this.counter.walking++;      //this flag is a delay for the re-routing
          if (this.counter.walking > this.nextThinking)      //follow the player:
          {      
            var randomNumber = Crafty.math.randomInt(1,10);
            var distanceX = this.calculateDistanceFromTarget();

            //define different speeds according to the distance
            var distanceLimit = 100;
            var distanceLimit2 = 30
            if (distanceX >= 0)
            {
              this.trigger('NewDirection', {x:1, y:0});  //trigger a NewDirection event so that it can change it's moving animation
              if (distanceX > distanceLimit)
              {
                this.movement.x = 2;
              }
              else if (distanceX > distanceLimit2)
              {
                if (randomNumber > 9)
                {
                  this.movement.x = 4;
                  this.state.walking = false;
                  this.state.crossing = true;
                  this.counter.crossing = 0;
                }
                else
                {
                  this.movement.x = 1;
                }
              }
              else
              {
                this.attack();
              }
            }
            else
            {
              this.trigger('NewDirection', {x:-1, y:0});  //trigger a NewDirection event so that it can change it's moving animation
              if (distanceX < -distanceLimit)
              {
                this.movement.x = -2;
              }
              else if (distanceX < -distanceLimit2)
              {
                if (randomNumber > 9)
                {
                  this.movement.x = -4;
                  this.state.walking = false;
                  this.state.crossing = true;
                  this.counter.crossing = 0;
                }
                else
                {
                  this.movement.x = -1;
                }
              }
              else
              {
                this.attack();
              }
            }

            this.nextThinking = Crafty.math.randomInt(10,20);
            this.counter.walking = 0;
          }

          //the actual movement
          if ( !(this.first && this.x < 600)) //little hack for stoping the first indian
          {
            this.x += this.movement.x;
            if (stage == 3) this.x += this.movement.x;
          }
          else
          {
            if (!this.saidMsg)
            {
              createText(this, "What are you doing?")
                .attr('timeLimit', 50);
              nextMsgTime = dialog.lastMsgTime + 1500 + Crafty.math.randomInt(100,500);
              this.saidMsg = true;

            }
            this.stop();
          }
        }

      });
      return this;
    }});


}


var insults = 
[
  "Don't destroy the forest!",
  "Are you insane?",
  "How do you do (do you do) the things that you do?",
  "Why are you doing this?",
  "You make me sick",
  "All in the name of progress, right?",
  "OMG, where are your eyes?!??",
  "Me... kill... you",
  "You killed my family!!",
  "You're a lumberjack? But where's your beard!?",
  "Hmph",
  "Is it worthy, destroying nature?"
];