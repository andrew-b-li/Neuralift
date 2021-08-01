import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'

export default class MainScene extends Phaser.Scene {
  fpsText
  fullWidth: number
  bottomCap: Phaser.GameObjects.Image
  middle: Phaser.GameObjects.Image
  topCap: Phaser.GameObjects.Image
  bottomShadowCap: Phaser.GameObjects.Image
  middleShadow: Phaser.GameObjects.Image

  fullHeight: number
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  spacebar: Phaser.Input.Keyboard.Key
  score: number

  constructor() {
    super({ key: 'MainScene' })
    this.fullHeight = 300
    this.score = 0
  }

  create() {
    new PhaserLogo(this, this.cameras.main.width / 2, 0)
    this.fpsText = new FpsText(this)

    // display the Phaser.VERSION

    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setOrigin(1, 0)

    // bar

    const y = this.cameras.main.height * 0.75
    const x = this.cameras.main.width * 0.75

    // background shadow

    this.bottomShadowCap = this.add.image(x, y, 'bottom-cap-shadow').setOrigin(0.5, 0)

    this.middleShadow = this.add.image(x, this.bottomShadowCap.y - this.fullHeight, 'middle-shadow').setOrigin(0.5, 0)

    this.middleShadow.displayHeight = this.fullHeight

    this.add.image(x, this.middleShadow.y, 'top-cap-shadow').setOrigin(0.5, 1)

    // health bar

    this.bottomCap = this.add.image(x, y, 'bottom-cap').setOrigin(0.5, 0)

    this.topCap = this.add.image(x, this.bottomCap.y - this.fullHeight, 'top-cap').setOrigin(0.5, 1)

    this.middle = this.add.image(this.topCap.x, this.topCap.y, 'middle').setOrigin(0.5, 0)

    this.setMeterPercentage(this.score)

    console.log(this.score)

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  setMeterPercentage(percent = 1) {
    const topDrop = this.fullHeight * (1-percent)
    const height = this.fullHeight * percent
    this.topCap.y = this.topCap.y + topDrop
    this.middle.y = this.topCap.y
    this.middle.displayHeight = height
  }

  setMeterPercentageAnimated(percent = 1, duration = 1000) {
    const topDrop = this.fullHeight * (1-percent)
    const height = this.fullHeight * percent

    this.tweens.add({
      targets: this.topCap,
      y: this.middleShadow.y + topDrop,
      duration,

      ease: Phaser.Math.Easing.Sine.Out,
      onUpdate: () => {

        this.middle.y = this.topCap.y
        this.middle.displayHeight = this.bottomCap.y - this.topCap.y 
        this.bottomCap.visible = this.middle.displayHeight > 0
        this.middle.visible = this.middle.displayHeight > 0
        this.topCap.visible = this.middle.displayHeight > 0
      }
    })
  }

  update() {
    this.fpsText.update()

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.score = this.score + 0.20;
      this.setMeterPercentageAnimated(this.score)
    }
  }
}
