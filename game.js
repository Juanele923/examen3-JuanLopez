/*global Phaser*/
const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

new Phaser.Game(config)

function preload() {
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png")
  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png")

  this.load.spritesheet("mario", "assets/entities/mario.png", {
    frameWidth: 18,
    frameHeight: 16
  })

  this.load.audio('gameover', "assets/sound/music/gameover.mp3")
}

function create() {
  this.add.image(100, 50, "cloud1").setOrigin(0, 0).setScale(0.15)

  this.floor = this.physics.add.staticGroup()

  this.floor.create(0, config.height - 16, "floorbricks").setOrigin(0, 0).refreshBody()
  this.floor.create(160, config.height - 16, "floorbricks").setOrigin(0, 0).refreshBody()

  this.mario = this.physics.add
    .sprite(50, 210, "mario")
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(300)

  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)

  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  this.anims.create({
    key: "mario-walk",
    frames: this.anims.generateFrameNumbers("mario", { start: 1, end: 3 }),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: "mario-idle",
    frames: [{ key: "mario", frame: 0 }]
  })

  this.anims.create({
    key: "mario-jump",
    frames: [{ key: "mario", frame: 5 }]
  })

  this.anims.create({
    key: "mario-dead",
    frames: [{ key: "mario", frame: 4 }]
  })

  this.keys = this.input.keyboard.createCursorKeys()
}

function update() {
  if (this.mario.isDead){return} 

  if (this.keys.left.isDown) {
    this.mario.anims.play("mario-walk", true)
    this.mario.x -= 2
    this.mario.flipX = true
  } else if (this.keys.right.isDown) {
    this.mario.anims.play("mario-walk", true)
    this.mario.x += 2
    this.mario.flipX = false
  } else {
    this.mario.anims.play("mario-idle", true)
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.anims.play("mario-jump", true)
    this.mario.setVelocityY(-300)
  }

  if (this.mario.y >= config.height) {
    this.mario.isDead = true
    this.mario.anims.play('mario-dead',true)
    this.mario.setCollideWorldBounds(false)
    this.sound.add('gameover',{volume:0.2}).play()

    setTimeout(() => {
      this.mario.setVelocityY(-350)
    }, 100)

    setTimeout(() => {
      this.scene.restart()
    }, 7700)
  }
}
