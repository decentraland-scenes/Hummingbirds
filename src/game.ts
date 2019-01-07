import { FlyAround, birds, LerpData } from "./modules/random-flying";
import { Timer, MoveHead } from "./modules/move-head";



// add systems to the engine

engine.addSystem(new FlyAround())

engine.addSystem(new MoveHead())

////////////////////
// Lay out scenery

const tree = new Entity()
tree.add(new Transform({
  position: new Vector3(5, 0, 5)
}))
tree.add(new GLTFShape("models/Tree.gltf"))
tree.get(GLTFShape).addClip(new AnimationClip('Tree_Action', { weight: 1, speed: 1, loop: false }))
tree.add(
  new OnClick(e => {
    tree.get(GLTFShape).getClip('Tree_Action').play()
    newBird()
  })
)
engine.addEntity(tree)

const ground = new Entity()
ground.add(new Transform({
  position: new Vector3(5, 0, 5)
}))
ground.add(new GLTFShape("models/Ground.gltf"))
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

    bird.add(new Transform({
      position: startPosition,
      scale: birdScale
    }))

    bird.add(new GLTFShape("models/hummingbird.gltf"))
    const flyAnim = new AnimationClip('Bird_fly', { speed: 2 })
    const lookAnim = new AnimationClip('Bird_look', { loop: false })
    const shakeAnim = new AnimationClip('Bird_shake', { loop: false })
    bird.get(GLTFShape).addClip(flyAnim)
    bird.get(GLTFShape).addClip(lookAnim)
    bird.get(GLTFShape).addClip(shakeAnim)
    flyAnim.play()
   
    const nextPos = new Vector3(Math.random() * 10 ,Math.random() * 5 ,Math.random() * 10)
    bird.add(new LerpData(startPosition, nextPos, 0, 200))
    bird.add(new Timer())

    bird.get(Transform).lookAt(nextPos)
    
    engine.addEntity(bird)
}
