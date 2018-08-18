import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";

const obstacle = ({ pos, size, img, color }) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size,
	})(that);

	traits.addSpriteTrait({
		color,
		img,
		imgSize: that.size.copy(),
	})(that);

	that.handleRemove  = ({ world: { remove }, context }) => {
		if(that.pos.x + that.size.x < -context.x - 100){
			remove(that);
		}
	}

	that.addMethods("handleRemove");

	return that;
}

export const ground = (pos) => obstacle({
	pos,
	size: vec(20, 20),
	img: "concrete",
});

export const box = (pos) => obstacle({
	pos,
	size: vec(20, 20),
	img: "box",
});

export const bumper = (pos) => {
	const that = obstacle({
		pos: vec(pos.x, pos.y + 15),
		size: vec(20, 5),
		color: "brown",
	});

	traits.addCheckColTrait({
		singles: ["player"],
	})(that);

	that.touched = false;
	that.playerCol = (player, GAME) => {
		player.velocity.y = -5;
		player.acceleration.y = -0.01;
		player.dashCounter = 1;
		player.canDash = true;
	}

	return that;
}

export const edge = (pos, imgPos) => {
	const that = obstacle({
		pos,
		size: vec(20, 20),
		img: "edge",
	});

	that.imgPos = imgPos;

	return that;
}
