import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v				from "/js/lib/vector.js";

const seagull = (pos) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size: vec(7, 10),
	})(that);

	traits.addSpriteTrait({
		img: "seagull",
		imgSize: that.size.copy(),
	})(that);

	traits.addMoveTrait({
		velocity: vec(0, 19),
	})(that);

	that.handleColY = (obstacle) => {
		if(that.velocity.y > 0 && that.pos.y + that.size.y > obstacle.pos.y){
			that.velocity.y = 0;
			that.acceleration.y = 0;
			that.pos.y = obstacle.pos.y - that.size.y;
		}
	}

	traits.addPhysicsTrait({
		gravity: 0.005,
	})(that);

	traits.addFrameTrait({
		delay: 4,
		frames: "seagullFrames",
		initState: "sitting",
	})(that);

	that.remove = ({ world: { remove }, context }) => {
		if(that.pos.x + that.size.x < -context.x) remove(that);
	}

	that.flying = false;

	that.checkPlayer = ({ world: { player } }) => {
		if(v.sub(that.center, player.center).mag < 60 && player.pos.y < that.pos.y){
			that.flying = true;
			that.velocity = vec(-Math.random() * 2 - 2, -Math.random() * 1.5 -1);
			that.acceleration.y = -0.001;
		}
	}

	that.animate = () => {
		if(that.flying){
			that.frameState = "flying",
			that.size = vec(12, 8);
			that.drawSize = vec(12, 8);
			that.imgSize = vec(12, 8);
		}
	}

	that.addMethods("remove", "checkPlayer", "animate");

	return that;
}

export default seagull;
