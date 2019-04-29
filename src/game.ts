import { FlyAround, birds, LerpData } from "./modules/random-flying";
import { Timer, MoveHead } from "./modules/move-head";



// add systems to the engine

engine.addSystem(new FlyAround())

engine.addSystem(new MoveHead())

////////////////////
// Lay out environment

const tree = new Entity()
tree.addComponent(new Transform({
  position: new Vector3(8, 0, 8),
  scale: new Vector3(1.6, 1.6, 1.6)
}))
tree.addComponent(new GLTFShape("models/Tree.gltf"))
tree.addComponent(new Animator)
let treeClip = new AnimationClip('Tree_Action')
treeClip.looping = false
tree.getComponent(Animator).addClip(treeClip)
tree.addComponent(
  new OnPointerDown(e => {
    let anim = tree.getComponent(Animator).getClip('Tree_Action')
    anim.reset()
    anim.play()
    log("new bird")
    newBird()
  })
)
engine.addEntity(tree)

const ground = new Entity()
ground.addComponent(new Transform({
  position: new Vector3(8, 0, 8),
  scale: new Vector3(1.6, 1.6, 1.6)
}))
ground.addComponent(new GLTFShape("models/Ground.gltf"))
engine.addEntity(ground)

/////////////////////
// Other functions

// Starting coordinates for all birds

const startPosition = new Vector3(13, 3.5, 5)
const birdScale = new Vector3(0.2, 0.2, 0.2)

// Create a new bird

function newBird(){
  if (birds.entities.length > 10) {return}
    const bird = new Entity()

    bird.addComponent(new Transform({
      position: startPosition,
      scale: birdScale
    }))

    bird.addComponent(new GLTFShape("models/hummingbird.glb"))
    bird.addComponent(new Animator() )
    const flyAnim = new AnimationClip('fly')
    flyAnim.speed = 2
    const lookAnim = new AnimationClip('look')
    lookAnim.looping = false
    const shakeAnim = new AnimationClip('shake')
    shakeAnim.looping = false
    bird.getComponent(Animator).addClip(flyAnim)
    bird.getComponent(Animator).addClip(lookAnim)
    bird.getComponent(Animator).addClip(shakeAnim)
    flyAnim.play()
   
    const nextPos = new Vector3((Math.random() * 12) + 2 ,(Math.random() * 3) + 1 ,(Math.random() * 12) + 2)
    bird.addComponent(new LerpData(startPosition, nextPos, 0, 200))
    bird.addComponent(new Timer())

    bird.getComponent(Transform).lookAt(nextPos)
    
    engine.addEntity(bird)
}
