// Custom component with data for bird flight

@Component('lerpData')
export class LerpData {
  oldPos: Vector3 = Vector3.Zero()
  nextPos: Vector3 = Vector3.Zero()
  fraction: number = 0
  pause: number = 0
  constructor(oldPos: Vector3, nextPos: Vector3, fraction: number,  pause: number){
    this.oldPos = oldPos
    this.nextPos = nextPos
    this.fraction = fraction
    this.pause = pause
  }
}

// Component group holding all birds
export const birds = engine.getComponentGroup(LerpData)

///////////////
// Systems

// System that updates each bird on every frame

export class FlyAround implements ISystem  {
  update(dt: number) {
    for (let bird of birds.entities) {
      let transform = bird.get(Transform)
      let lerp = bird.get(LerpData)
      if (lerp.fraction < 1) {
        transform.position = Vector3.Lerp(lerp.oldPos, lerp.nextPos, lerp.fraction)
        lerp.fraction += 1/50
      } else if (lerp.pause > 0) {
        lerp.pause -= 3
      } else {
        log("new position")
        lerp.oldPos = transform.position
        // new random position
        lerp.nextPos.x = Math.random() * 10
        lerp.nextPos.y = (Math.random() * 3) + 1
        lerp.nextPos.z = Math.random() * 10
        lerp.fraction = 0
        lerp.pause = Math.random() * 500
        // face new position
        transform.lookAt(lerp.nextPos)
      }
    }
  }
}