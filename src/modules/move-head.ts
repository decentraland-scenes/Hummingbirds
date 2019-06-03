import { birds } from "./random-flying";

let INTERVAL: number = 4

// component to regularly attempt a random animation
@Component('timer')
export class Timer {
    timeLeft: number = INTERVAL
}

// system to regularly attempt a random animation
export class MoveHead implements ISystem  {
    update(dt: number) {
      for (let bird of birds.entities) {
        let time = bird.getComponent(Timer)
        time.timeLeft -= dt
        if (time.timeLeft < 0){
            time.timeLeft = INTERVAL
            log("checked")
            randomHeadMovement(bird)
        }
      }
    }
}

// Randomly determine if any additional animations are played
export function randomHeadMovement(bird: IEntity){
    const anim = Math.random()
    if ( anim < 0.4){
	  	let move = bird.getComponent(Animator).getClip('Bird_look')
	  	move.play()
	 	move.looping = false
    } else if (anim < 0.8) {
		let move = bird.getComponent(Animator).getClip('Bird_shake')
	  	move.play()
	  	move.looping = false
    }
}
