import * as utils from '@dcl/ecs-scene-utils'

////////////////////
// Lay out environment

const tree = new Entity()
tree.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8),
    scale: new Vector3(1.6, 1.6, 1.6),
  })
)
tree.addComponent(new GLTFShape('models/Tree.gltf'))
tree.addComponent(new Animator())
let treeClip = new AnimationState('Tree_Action')
treeClip.looping = false
tree.getComponent(Animator).addClip(treeClip)
tree.addComponent(
  new OnPointerDown(
    (e) => {
      let anim = tree.getComponent(Animator).getClip('Tree_Action')
      anim.stop()
      anim.play()
      log('new bird')
      newBird()
    },
    { button: ActionButton.POINTER, hoverText: 'Shake' }
  )
)
engine.addEntity(tree)

const ground = new Entity()
ground.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8),
    scale: new Vector3(1.6, 1.6, 1.6),
  })
)
ground.addComponent(new GLTFShape('models/Ground.gltf'))
engine.addEntity(ground)

/////////////////////
// Other functions

// Starting coordinates for all birds

const startPosition = new Vector3(13, 3.5, 5)
const birdScale = new Vector3(0.2, 0.2, 0.2)

// Create a new bird

let birdShape = new GLTFShape('models/hummingbird.glb')

let birdCounter = 0

function newBird() {
  if (birdCounter > 10) {
    return
  }

  birdCounter += 1

  const bird = new Entity()

  bird.addComponent(
    new Transform({
      position: startPosition,
      scale: birdScale,
    })
  )

  bird.addComponent(birdShape)
  let birdAnim = new Animator()
  bird.addComponent(birdAnim)
  const flyAnim = new AnimationState('fly')
  flyAnim.speed = 2
  const lookAnim = new AnimationState('look')
  lookAnim.looping = false
  const shakeAnim = new AnimationState('shake')
  shakeAnim.looping = false
  birdAnim.addClip(flyAnim)
  birdAnim.addClip(lookAnim)
  birdAnim.addClip(shakeAnim)
  flyAnim.play()

  // first sprint
  const nextPos = new Vector3(
    Math.random() * 12 + 2,
    Math.random() * 3 + 1,
    Math.random() * 12 + 2
  )
  bird.getComponent(Transform).lookAt(nextPos)
  bird.addComponent(new utils.MoveTransformComponent(startPosition, nextPos, 2))

  // keep sprinting on a regular basis
  bird.addComponent(
    new utils.Interval(Math.floor(Math.random() * 3000) + 3000, () => {
      const nextPos = new Vector3(
        Math.random() * 12 + 2,
        Math.random() * 3 + 1,
        Math.random() * 12 + 2
      )
      bird.getComponent(Transform).lookAt(nextPos)
      bird.addComponent(
        new utils.MoveTransformComponent(
          bird.getComponent(Transform).position,
          nextPos,
          2,
          () => {
            randomHeadMovement(bird)
          }
        )
      )
    })
  )

  engine.addEntity(bird)
}

// Randomly determine if any head moving animations are played
export function randomHeadMovement(bird: IEntity) {
  const anim = Math.random()
  if (anim < 0.2) {
    let move = bird.getComponent(Animator).getClip('look')
    move.play()
    move.looping = false
  } else if (anim > 0.8) {
    let move = bird.getComponent(Animator).getClip('shake')
    move.play()
    move.looping = false
  }
}
