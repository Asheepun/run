import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";

const cloud = (pos) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size: vec(20 + Math.random()*20, 10 + Math.random()*10),
	})(that);

	traits.addSpriteTrait({
		img: "cloud",
		imgSize: vec(40, 20),
		alpha: 0.6 + Math.random() * 0.3,
	})(that);

	traits.addMoveTrait({
		velocity: vec(-0.2, 0),
	})(that);

	that.remove = ({ world: { remove }, context }) => {
		if(that.pos.x + that.size.x < -context.x) remove(that);
	}

	that.addMethods("remove");

	return that;
}

const cloudHandler = () => {
	const that = traitHolder();

	let counter = 1;
	that.spawn = ({ world: { add }, context, width }) => {
		counter--;

		if(counter === 0){
			counter = 10 + Math.floor(Math.random()*20);
			add(cloud(vec(-context.x + width, 5 + Math.random()*20)), "particles", 10);
		}
	}

	that.addMethods("spawn");

	return that;
}

export default cloudHandler;
