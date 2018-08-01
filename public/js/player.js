import vec, * as v 				from "/js/lib/vector.js";
import traitHolder, * as traits from "/js/lib/traits.js";
import * as particles			from "/js/particles.js";

const player = (pos) => {
	const that = traitHolder();
	
	traits.addEntityTrait({
		pos,
		size: vec(10, 12),
	})(that);

	traits.addSpriteTrait({
		img: "player1",
		imgSize: vec(10, 14),
		drawOffset: vec(0, -2),
		drawSize: vec(10, 14),
	})(that);

	traits.addFrameTrait({
		delay: 6,
		frames: "playerFrames",
		initState: "running",
	})(that);

	traits.addMoveTrait({})(that);

	traits.addPhysicsTrait({
		gravity: 0.01,
	})(that);

	traits.addColTrait({})(that);

	that.handleColY = (obstacle, GAME) => {
		if(that.velocity.y < 0){
			that.pos.y = obstacle.pos.y + obstacle.size.y;
		}else{
			if(!that.onGround && that.velocity.y >= 3) GAME.screenShake.y += Math.random()*1 + 1;
			that.pos.y = obstacle.pos.y - that.size.y;
			that.onGround = true;
		}
		that.velocity.y = 0;
		that.acceleration.y = 0;
	}

	that.checkDeath = (GAME) => {
		if(that.pos.y > 180) that.die(GAME);
	}

	that.die = (GAME) => {
		GAME.state = "dead";
	}

	that.jump = ({ world: { add } }) => {
		if(that.onGround){
			that.velocity.y = -3;
			//particle effect
			for(let i = 0; i < Math.random()*25 + 5; i++){
				add(particles.dust({
					pos: vec(that.center.x, that.pos.y + that.size.y - 5),
					velocity: vec(Math.random()*3, 1 + Math.random()*0.5),
				}), "particles", 4);
			}
		}
	}

	let stepCounter = 0;
	that.run = ({ world: { add }, speed }) => {
		if(!that.dashing) that.velocity.x = speed;
		
		//particle effect
		stepCounter--;
		if(stepCounter <= 0 && that.onGround){
			for(let i = 0; i < Math.random()*3; i++){
				add(particles.dust({
					pos: vec(that.pos.x, that.pos.y + that.size.y - 5),
					velocity: vec(Math.random()*0.3, -Math.random()),
				}), "particles", 4)
				stepCounter += Math.random()*5 + 3;
			}
		}
	}

	that.handleGravity = () => {
		if(that.velocity.y > 3) that.velocity.y = 3;
	}

	that.dashing = false;
	that.canDash = true;
	that.dashCounter = 0;
	that.velocityBeforeDash = 0;
	that.dashYPos;

	that.dash = () => {
		if(that.canDash){
			that.velocityBeforeDash = that.velocity.x;
			that.velocity.x = 10;
			that.dashing = true;
			that.canDash = false;
			that.dashCounter = 7;
			that.dashYPos = Math.floor(that.pos.y);
		}
	}

	let shake = 1;
	that.handleDash = (GAME) => {
		that.dashCounter--;

		if(that.dashCounter === 0){
			that.dashing = false;
			that.velocity.x = that.velocityBeforeDash;
			GAME.sleep = 1;
		}
		if(that.dashing){
			that.acceleration.y = 0;
			that.velocity.y = 0;
			that.pos.y = that.dashYPos;
			GAME.world.add(particles.fader({
				acceleration: vec(0, 0),
				velocity: vec(4, 0),
				pos: vec(that.pos.x + 0, that.pos.y-2),
				size: vec(10, 14),
				img: "extra/dashing",
				alpha: 0.9,
				fade: 0.1,
			}), "particles", 4);
			GAME.screenShake.y += shake;
			GAME.screenShake.x += 10;
			shake *= -1;
		}
		if(!that.dashing && that.onGround) that.canDash = true;
	}

	that.animate = () => {
		if(that.onGround) that.frameState = "running";
		else if(that.velocity.y <= 1) that.frameState = "jumping";
		else that.frameState = "falling";
		if(that.dashing) that.frameState = "dashing";
	}

	that.removeMethods("move", "handlePhysics");
	that.addMethods("run", "handleDash", "move", "handlePhysics", "handleGravity", "checkDeath", "animate");

	return that;
}

export default player;
