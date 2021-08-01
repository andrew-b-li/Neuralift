import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'

export default class MainScene extends Phaser.Scene {
  fpsText
  fullWidth: number
  bottomCap: Phaser.GameObjects.Image
  middle: Phaser.GameObjects.Image
  topCap: Phaser.GameObjects.Image
  fullHeight: number

  constructor() {
    super({ key: 'MainScene' })
    this.fullHeight = 300
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

    const bottomShadowCap = this.add.image(x, y, 'bottom-cap-shadow').setOrigin(0.5, 0)

    const middleShadowCap = this.add.image(x, bottomShadowCap.y - this.fullHeight, 'middle-shadow').setOrigin(0.5, 0)

    middleShadowCap.displayHeight = this.fullHeight

    this.add.image(x, middleShadowCap.y, 'top-cap-shadow').setOrigin(0.5, 1)

    // health bar

    this.bottomCap = this.add.image(x, y, 'bottom-cap').setOrigin(0.5, 0)
    
    this.middle = this.add.image(this.bottomCap.x, this.bottomCap.y, 'middle').setOrigin(0.5, 0)

    this.topCap = this.add.image(x, this.bottomCap.y - this.fullHeight, 'top-cap').setOrigin(0.5, 1)

    this.setMeterPercentage(0)

    //this.setMeterPercentageAnimated(0.15)

  }

  setMeterPercentage(percent = 1) {
    const height = this.fullHeight * percent
    this.middle.displayHeight = - height
    this.topCap.y = this.middle.y - this.middle.displayHeight
  }

  setMeterPercentageAnimated(percent = 1, duration = 5000) {
    const height = -this.fullHeight * percent

    this.tweens.add({
      targets: this.middle,
      displayHeight: height,
      duration,

      ease: Phaser.Math.Easing.Sine.Out,
      onUpdate: () => {
        this.topCap.y = this.middle.y - this.middle.displayHeight
        this.bottomCap.visible = this.middle.displayHeight > 0
        this.middle.visible = this.middle.displayHeight > 0
        this.topCap.visible = this.middle.displayHeight > 0
      }
    })
  }


  update() {
    this.fpsText.update()
  }
}
