function initializeEnemyComponents()
{
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
            for (var i = 0; i < this.state.length; i++) this.state[i] = false;
            this.state.walking = false;
            this.addTween({rotation: 80}, 'easeOutBounce', 50, endOfTween, [this]);
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
      this.stop().animate('attack', 20, 0);
    },
    backup: function()
    {
      this.counter.backing = 0;
      this.state.backing = true;

      var targetX = player.x+player.w/2;
      var distanceX = targetX - (this.x + this.w/2);
      if (distanceX >= 0)
      {
        this.movement.x = -4;
      }
      else
      {
        this.movement.x = 4;
      }
    }
    });
    

    
    
    Crafty.c('NativeTypeAxe',{
      
    init: function()
    {
      this.movement = { x: 0};
      this.backingCounter = 0;
      this.state = {walking: true, attacking: false, backing: false, dying: false, dead: false};
      this.counter = {walking: 100, attacking:0, backing:0};
      this.requires('Collision')
      .attr({animationSpeed:100, nextThinking:10})
      .bind('EnterFrame', function ()
      {
        if (this.state.attacking)
        {
          this.counter.attacking++;
          if (this.counter.attacking > 5)
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
            var targetX = player.x+player.w/2;
            var distanceX = targetX - (this.x + this.w/2);

            //define different speeds according to the distance
            var distanceLimit = 100;
            var distanceLimit2 = 30
            if (distanceX >= 0)
            {
              this.trigger('NewDirection', 1);  //trigger a NewDirection event so that it can change it's moving animation
              if (distanceX > distanceLimit)
              {
                this.movement.x = 2;
              }
              else if (distanceX > distanceLimit2)
              {
                this.movement.x = 1;
              }
              else
              {
                this.attack();
              }
            }
            else
            {
              this.trigger('NewDirection', -1);  //trigger a NewDirection event so that it can change it's moving animation
              if (distanceX < -distanceLimit)
              {
                this.movement.x = -2;
              }
              else if (distanceX < -distanceLimit2)
              {
                this.movement.x = -1;
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