import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v				from "/js/lib/vector.js";

const particle = ({ img, pos, size, velocity, acceleration, gravity }) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size,
	})(that);

	traits.addSpriteTrait({
		img,
		imgSize: size.copy(),
	})(that);

	traits.addMoveTrait({
		velocity,
	})(that);

	traits.addPhysicsTrait({
		acceleration,
		gravity,
	})(that);

	return that;
}

export const fader = ({ fade, alpha, pos, size, img, velocity, acceleration, gravity }) => {
	const that = particle({
		pos,
		size,
		img,
		velocity,
		acceleration,
		gravity,
	});

	that.fadeAmount = fade;
	that.alpha = alpha;

	that.fade = ({ world: { remove } }) => {
		that.alpha -= that.fadeAmount;
		if(that.alpha <= 0) remove(that);
	}

	that.addMethods("fade");

	return that;
}

export const dust = ({ pos, velocity }) => {
	const that = particle({
		pos,
		velocity,
		img: "dust",
		size: vec(3 + Math.random()*2, 3 + Math.random()*2),
		acceleration: vec(0, 0),
		gravity: 0,
	});
	that.imgSize = vec(5, 5);

	traits.addColTrait({
		bounce: true,
	})(that);

	let shrinkage;
	that.shrink = ({ world: { remove } }) => {
		that.velocity.x *= 0.97;
		that.velocity.y *= 0.97;
		shrinkage = Math.random()*0.2;
		that.size.x -= shrinkage;
		that.size.y -= shrinkage;
		that.drawSize.x -= shrinkage;
		that.drawSize.y -= shrinkage;
		if(that.size.x < 1 || that.size.y < 1) remove(that);
	}

	let rotation = Math.random()*0.5 - 0.25;

	that.rotate = () => {
		that.rotation += rotation;
	}

	that.addMethods("shrink", "rotate");

	return that;
}

export const starDust = ({ pos, velocity }) => {
	const that = dust({
		pos,
		velocity,
	});

	that.img = "stardust";
	that.imgSize = vec(5, 5);
	that.handleColX = that.handleColY = undefined;
	that.swing = () => {
	}

	that.addMethods("swing");

	return that;
}

export const text = ({ value, pos, size, velocity, color, life }) => {
	const that = traitHolder();
	that.value = value;
	that.pos = pos;
	that.color = color;
	that.life = life;

	that.fixCenter = () => {
	
	}

	traits.addMoveTrait({
		velocity,
	})(that);

	that.draw = (ctx) => {
		ctx.font = size + "px game";
		ctx.fillStyle = that.color;
		ctx.fillText(value, that.pos.x, that.pos.y);
	}

	that.remove = ({ world: { remove } }) => {
		that.life--;
		if(that.life === 0){
			remove(that);
		}
	}

	that.addMethods("remove");

	return that;
}

export const blinkText = ({ value, pos, size, velocity, life, color, secondColor, blinkDelay }) => {
	const that = text({
		value,
		pos,
		size,
		velocity,
		color,
		life,
	});

	that.blinkDelay = blinkDelay;

	let counter = blinkDelay;

	that.blink = () => {
		counter--;

		if(counter === 0){
			counter = that.blinkDelay;
			if(that.color === color){
				that.color = secondColor;
			}else that.color = color;
		}
	}

	that.addMethods("blink");

	return that;
}
