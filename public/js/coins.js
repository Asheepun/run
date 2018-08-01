import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v				from "/js/lib/vector.js";
import * as particles			from "/js/particles.js";

const coin = ({ pos, size, img, value }) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size,
	})(that);

	traits.addSpriteTrait({
		img,
		imgSize: size,
	})(that);

	traits.addCheckColTrait({
		singles: ["player"],
	})(that);

	that.value = value;
	that.picked = false;

	that.playerCol = (player, GAME) => {
		if(!that.picked) GAME.points += that.value;
		that.picked = true;
	}

	let counter = 10;
	that.fade = ({ world: { remove, add } }) => {
		if(that.picked){
			that.pos.y -= 4;
			that.size.x -= 1;
			that.size.y -= 1;
			that.drawSize.x -= 1;
			that.drawSize.y -= 1;
			that.pos.x += 0.5;
			that.imgSize = vec(20, 20);
			counter--;
		}
		if(counter === 0){
			for(let i = 0; i < 3 + Math.random()*5; i++){
				add(particles.starDust({
					pos: that.center.copy(),
					velocity: vec(Math.random()*2, Math.random()*-1 + -0.5),
				}), "particles", 4);
			}
			add(particles.blinkText({
				pos: vec(that.pos.x, that.pos.y),
				value: that.value,
				color: "white",
				secondColor: "yellow",
				size: 10,
				velocity: vec(0, 0),
			}), "particles", 5)
			remove(that);
		}
	}
	
	that.addMethods("fade");

	return that;
}

export const smallCoin = (pos) => coin({
	pos,
	size: vec(20, 20),
	value: 100,
	img: "coin",
});

export const diamond = (pos) => {
	const that = coin({
		pos,
		size: vec(20, 20),
		value: 5000,
		img: "diamond",
	});

	that.slowDown = (GAME) => {
	}

	that.addMethods("slowDown");

	return that;
}


