function initializeEnemyComponents()
{
  //   EEEEENEMYY
  Crafty.c('Enemy', {
    init: function()
    {
      //setup animations
      this.requires('SpriteAnimation')
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
              this.setTweenProperties(0, 80, 50);
              
              createBlood(this.x + this.w/2);
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
      if (this.calculateDistanceFromPlayer() >= 0)
      {
        this.stop().animate('attackRight', 20, 0);
      }
      else
      {
        this.stop().animate('attackLeft', 20, 0);
      }
      
      var playersHit = this.hit('joe');
      if(playersHit)
      {
        playersHit[0].obj.trigger('Hit');
      }
    },
    backup: function()
    {
      this.counter.backing = 0;
      this.state.backing = true;

      if (this.calculateDistanceFromPlayer() >= 0)
      {
        this.movement.x = -4;
      }
      else
      {
        this.movement.x = 4;
      }
    },
    calculateDistanceFromPlayer: function()
    {
      var targetX = player.x+player.w/2;
      var distanceX = targetX - (this.x + this.w/2);

      return distanceX;
    }
    });


    
    
    Crafty.c('NativeTypeAxe',{
      
    init: function()
    {
      this.movement = { x: 0};
      this.backingCounter = 0;
      this.state = {walking: true, attacking: false, backing: false, crossing: false, dying: false, dead: false};
      this.counter = {walking: 100, attacking:0, backing:0, crossing:0};
      this.requires('Collision')
      .animate('attackRight', 0, 2, 1)
      .animate('attackLeft', 0, 3, 1)
      .attr({animationSpeed:100, nextThinking:10})
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
            this.x = 1000;
            this.y = 11*32;
            this.state.dead = false;
            this.state.walking = true;
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
            var distanceX = this.calculateDistanceFromPlayer();

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
          this.x += this.movement.x;
        }

      });
      return this;
    }});


}