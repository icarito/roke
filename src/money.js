import * as ex from 'excalibur';
import { coinAnim } from './resources';

export class Coin extends ex.Actor {

  coinAnim = coinAnim.clone()
  spinning = false

  constructor(x, y) {
    super({
      x: x,
      y: y,
      radius: 8,
      scale: ex.vec(0.4, 0.4),
      anchor: ex.vec(0.5, 0.5),
      collisionType: ex.CollisionType.Active,
    });
    this.coinAnim.events.on("end", ()=>{
      setTimeout(()=>this.coinAnim.goToFrame(0))
    })
    this.body.mass = 0.1
    this.body.friction = 0
    this.body.bounciness = 0
    this.graphics.use(this.coinAnim);
  }
  update(engine, delta) {
    if (this.spinning && this.vel.magnitude < 2) {
      this.spinning = false
      this.coinAnim.strategy = ex.AnimationStrategy.Freeze
    } else if (!this.spinning && this.vel.magnitude > 2) {
      this.spinning = true
      this.coinAnim.strategy = ex.AnimationStrategy.Loop
      this.coinAnim.reset()
      this.coinAnim.goToFrame(1)
    }
    this.coinAnim.frameDuration = 1/this.vel.magnitude * 10
  }
}