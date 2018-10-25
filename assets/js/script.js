
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 300 }, debug: false } },
    scene: { preload: preload, create: create, update: update }
  };

  var player;
  var stars;
  var bombs;
  var platforms;
  var cursors;
  var score = 0;
  var gameOver = false;
  var scoreText;
  var z,q,d;
  var lastButton = 'Right';
  var seconds = 0;

  var game = new Phaser.Game(config);

  function preload() {
    this.load.image('sky', './assets/ressources/stage1/sky.png');
    this.load.image('sky2', './assets/ressources/stage3/sky3.png');
    this.load.image('ground1', './assets/ressources/stage1/platform_bot.png');
    this.load.image('ground2', './assets/ressources/stage3/platform_bot.png');
    this.load.image('plate2', './assets/ressources/stage2/platform-top.png');
    this.load.image('plate3', './assets/ressources/stage3/platform-top.png');
    this.load.image('plateWallMini', './assets/ressources/stage3/platform-mini.png');
    this.load.image('plateWall', './assets/ressources/stage2/platform-wall.png');
    this.load.image('plateWall3', './assets/ressources/stage3/platform-wall.png');
    this.load.image('transition1', './assets/ressources/transition/transition1.png');
    this.load.image('ground', 'assets/ressources/platform.png');
    this.load.spritesheet('star', 'assets/ressources/eggs.png', { frameWidth : 35, frameHeight : 39 });
    this.load.image('bomb', 'assets/ressources/bomb.png');
    this.load.spritesheet('dude', 'assets/ressources/duck.png', { frameWidth: 33, frameHeight: 33 });
    this.load.spritesheet('monsters', 'assets/ressources/hero_spritesheet.png', { frameWidth: 36, frameHeight: 42 });
    this.load.image('invisible-wall', 'assets/ressources/invisible_wall.png');
  }

  function create() {
    this.cameras.main.setBounds(0, 0, 800 * 8, 600);
    this.physics.world.setBounds(0, 0, 800 * 8, 600);
    this.add.image(0, 0, 'sky').setOrigin(0);
    this.add.image(1024, 0, 'sky').setOrigin(0).setFlipX(true);
    this.add.image(2048, 0, 'sky').setOrigin(0).setFlipX(true);
    this.add.image(3072, 0, 'sky').setOrigin(0).setFlipX(true);
    this.add.image(4096, 0, 'sky').setOrigin(0).setFlipX(true);
    this.add.image(4520, 0, 'sky2').setOrigin(0).setFlipX(true);
    this.add.image(5543, 0, 'sky2').setOrigin(0).setFlipX(true);
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    // LEVEL 1
    //  Now let's create some ledges
    platforms.create(200, 120, 'plate2');
    platforms.create(600, 400, 'plate2');
    platforms.create(750, 220, 'plate2');
    platforms.create(800, 420, 'plateWall');
    platforms.create(1000, 250, 'plate2');
    platforms.create(1600, 350, 'plate2');
    platforms.create(1400, 200, 'plate2');
    platforms.create(2000, 150, 'plate2');
    platforms.create(2600, 150, 'plate2');
    platforms.create(3000, 420, 'plateWall');
    //GROUND
    platforms.create(400, 560, 'ground1').setScale(3).refreshBody();
    platforms.create(1580, 560, 'ground1').setScale(3).refreshBody();
    platforms.create(2760, 560, 'ground1').setScale(3).refreshBody();
    platforms.create(3940, 560, 'ground1').setScale(3).refreshBody();
    // LEVEL 2
    platforms.create(4800, 450, 'plateWall3');
    platforms.create(400, 560, 'ground1').setScale(3).refreshBody();
    platforms.create(1580, 560, 'ground1').setScale(3).refreshBody();
    platforms.create(2760, 560, 'ground1').setScale(3).refreshBody();
    platforms.create(3940, 560, 'ground1').setScale(3).refreshBody();
    platforms.create(5120, 560, 'ground2').setScale(3).refreshBody();
    platforms.create(6300, 560, 'ground2').setScale(3).refreshBody();
    platforms.create(7480, 560, 'ground2').setScale(3).refreshBody();
    platforms.create(8560, 560, 'ground2').setScale(3).refreshBody();
    //  Now let's create some ledges
    platforms.create(5390, 148, 'plateWall3');
    platforms.create(5090, 448, 'plateWallMini');
    platforms.create(3400, 250, 'plate2');
    platforms.create(4050, 220, 'plate2');
    platforms.create(4200, 400, 'plate2');
    platforms.create(4800, 320, 'plate3');
    platforms.create(5000, 120, 'plate3');
    platforms.create(5300, 295, 'plate3');
    platforms.create(5800, 395, 'plate3');
    platforms.create(6200, 295, 'plate3');
    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'turnRight',
      frames: [{ key: 'dude', frame: 0 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'turnLeft',
      frames: [{ key: 'dude', frame: 6 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 13 }),
      frameRate: 10,
      repeat: -1
    });

    monsters = [this.physics.add.sprite(600, 450, 'monsters'),this.physics.add.sprite(10, 10, 'monsters'),this.physics.add.sprite(60, 200, 'monsters'),this.physics.add.sprite(500, 350, 'monsters')];
    invisibleWalls = [this.physics.add.sprite(0, 100, 'invisible_wall'),this.physics.add.sprite(400, 100, 'invisible_wall'),this.physics.add.sprite(400, 380, 'invisible_wall')];
    for(var i = 0; i < invisibleWalls.length; i++) {
      invisibleWalls[i].body.allowGravity = false;
      invisibleWalls[i].body.immovable = true;
      invisibleWalls[i].setVisible(false);
    }
    this.anims.create({
      key:'monsterLeft',
      frames: this.anims.generateFrameNumbers('monsters', { start : 1, end : 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key:'monsterRight',
      frames: this.anims.generateFrameNumbers('monsters', { start : 1, end : 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'egg',
      frames: [{ key: 'star', frame: 0 }],
      frameRate: 10
    });
    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({ key: 'star', frame : 5, repeat: 11, setXY: { x: 50, y: 0, stepX: 70 } });
    stars.children.iterate(function (child) {
      //  Give each star a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    bombs = this.physics.add.group();
    gunShots = this.physics.add.group();
    //  The score
    scoreText = this.add.text(16, 16, 'Temps: ' + seconds + ' secondes', { fontSize: '32px', fill: '#000' });
    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(gunShots, platforms);
    this.physics.add.collider(gunShots, bombs);
    this.physics.add.collider(gunShots, stars);
    this.physics.add.collider(monsters, platforms);
    this.physics.add.collider(monsters, invisibleWalls);
    this.physics.add.collider(monsters, monsters);
    this.physics.add.collider(player, monsters, die, null, this)
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, die, null, this);
    this.cameras.main.startFollow(player)
    player.setCollideWorldBounds(true);
    for(var i = 0;i < monsters.length; i++) {
      monsters[i].setCollideWorldBounds(true);
      monsters[i].setVelocityX(-160);
      monsters[i].play('monsterLeft');
    }
  }
  setInterval(function() {
    seconds += 1;
    var secondText = (seconds === 1) ? 'seconde' : 'secondes';
    scoreText.setText('Temps: ' + seconds + ' ' + secondText);
  }, 1000);
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
  }
  function update() {
    if (gameOver) {
      alert('Tu as perdu!');
      return;
    }
    if(monsters[0].body.touching.right || monsters[0].body.blocked.right) {
      monsters[0].setVelocityX(-160);
      monsters[0].play('monsterLeft');
    } else if(monsters[0].body.touching.left || monsters[0].body.blocked.left) {
      monsters[0].setVelocityX(160);
      monsters[0].play('monsterRight');
    }
    if(monsters[1].body.touching.right || monsters[1].body.blocked.right) {
      monsters[1].setVelocityX(-160);
      monsters[1].play('monsterLeft');
    } else if(monsters[1].body.touching.left || monsters[1].body.blocked.left) {
      monsters[1].setVelocityX(160);
      monsters[1].play('monsterRight');
    }
    if(monsters[2].body.touching.right || monsters[2].body.blocked.right) {
      monsters[2].setVelocityX(-160);
      monsters[2].play('monsterLeft');
    } else if(monsters[2].body.touching.left || monsters[2].body.blocked.left) {
      monsters[2].setVelocityX(160);
      monsters[2].play('monsterRight');
    }
    if(monsters[3].body.touching.right || monsters[3].body.blocked.right) {
      monsters[3].setVelocityX(-160);
      monsters[3].play('monsterLeft');
    } else if(monsters[3].body.touching.left || monsters[3].body.blocked.left) {
      monsters[3].setVelocityX(160);
      monsters[3].play('monsterRight');
    }
    if(cursors.left.isDown || q.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
      lastButton = 'Left';
    } else if(cursors.right.isDown || d.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
      lastButton = 'Right';
    } else {
      player.anims.play('turn' + lastButton);
      player.setVelocityX(0);
    }
    if(cursors.up.isDown || cursors.space.isDown || z.isDown) {
      if(player.body.touching.down) {
        player.setVelocityY(-360);
      }
    }
  }

  function collectStar(player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if(stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

  function die(player, bomb)
  {
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
  }
