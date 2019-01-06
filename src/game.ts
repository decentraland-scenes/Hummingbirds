
// Custom component with data for bird flight

@Component('nextPos')
export class NextPos {
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
const birds = engine.getComponentGroup(Transform, NextPos)

///////////////
// Systems

// System that updates each bird on every frame

export class FlyAround implements ISystem  {
  update(dt: number) {
    for (let bird of birds.entities) {
      let transform = bird.get(Transform)
      let next = bird.get(NextPos)
      if (next.fraction < 1) {
        transform.position = Vector3.Lerp(next.oldPos, next.nextPos, next.fraction)
        next.fraction += 1/50
      } else if (next.pause > 0) {
        next.pause -= 3
      } else {
        log("new position")
        next.oldPos = transform.position
        next.nextPos.x = Math.random() * 10
        next.nextPos.y = (Math.random() * 3) + 1
        next.nextPos.z = Math.random() * 10
        next.fraction = 0
        next.pause = Math.random() * 500
        transform.lookAt(next.nextPos)

        moveHead(bird)
      }
    }
  }
}

// add system to the engine

engine.addSystem(new FlyAround())

////////////////////
// Lay out scenery

const tree = new Entity()
tree.set(new Transform({
  position: new Vector3(5, 0, 5)
}))
tree.set(new GLTFShape("models/Tree.gltf"))
tree.get(GLTFShape).addClip(new AnimationClip('Tree_Action', { weight: 1, speed: 1, loop: false }))
tree.set(
  new OnClick(e => {
    tree.get(GLTFShape).getClip('Tree_Action').play()
    newBird()
  })
)
engine.addEntity(tree)

const ground = new Entity()
ground.set(new Transform({
  position: new Vector3(5, 0, 5)
}))
ground.set(new GLTFShape("models/Ground.gltf"))
engine.addEntity(ground)

/////////////////////
// Other functions

// Starting coordinates for all birds

const startPosition = new Vector3(4, 2, 8)
const birdScale = new Vector3(0.2, 0.2, 0.2)

// Create a new bird

function newBird(){
  if (birds.entities.length > 10) {return}
    const bird = new Entity()

    bird.set(new Transform({
      position: startPosition,
      scale: birdScale

    }))

    bird.set(new GLTFShape("models/hummingbird.gltf"))
    const flyAnim = new AnimationClip('Bird_fly', { speed: 2 })
    const lookAnim = new AnimationClip('Bird_look', { loop: false })
    const shakeAnim = new AnimationClip('Bird_shake', { loop: false })
    bird.get(GLTFShape).addClip(flyAnim)
    bird.get(GLTFShape).addClip(lookAnim)
    bird.get(GLTFShape).addClip(shakeAnim)
    flyAnim.play()
   
    const nextPos = new Vector3(Math.random() * 10 ,Math.random() * 5 ,Math.random() * 10)
    bird.set(new NextPos(startPosition, nextPos, 0, 200))
    bird.get(Transform).lookAt(nextPos)
    engine.addEntity(bird)
}

// Randomly determine if any additional animations are played

function moveHead(bird: Entity){
  const anim = Math.random()
  if ( anim < 0.4){
    bird.get(GLTFShape).getClip('Bird_look').play()
  } else if (anim < 0.8) {
    bird.get(GLTFShape).getClip('Bird_shake').play()
  }
}
