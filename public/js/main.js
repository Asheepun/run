import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import createCanvas				from "/js/lib/canvas.js";
import * as loaders				from "/js/lib/assets.js";
import gameWorld				from "/js/lib/gameWorld.js";
import keys						from "/js/lib/keys.js";
import * as text				from "/js/lib/text.js";
import player				    from "/js/player.js";
import * as obstacles			from "/js/obstacles.js";
import spawnHandler 			from "/js/spawnHandler.js";

Promise.all([
	createCanvas(320, 180),
	loaders.loadSprites(
		"player1",
		"extra/dashing",
		"coin",
		"diamond",
		"dust",
		"stardust",
		"rock",
		"background",
	),
	loaders.loadJSON(
		"playerFrames",
	)
]).then(([ { c, ctx, width, height, pointer, scale }, sprites, JSON ]) => {

	const GAME = {
		c,
		ctx,
		width,
		height,
		pointer,
		sprites,
		JSON,
		world: gameWorld(),
		states: {
		
		},
		sleep: 0,
		screenShake: vec(0, 0),
	};

	GAME.keys = keys(
		" ",
		"W",
		"w",
		"O",
		"o",
	);

	GAME.states.setupLevel = () => {

		GAME.context = vec(0, 0)
		GAME.speed = 3;
		GAME.points = 0;

		//handle world
		GAME.world.clearAll();

		GAME.world.add(player(vec(80, 140)), "player", 6, true);

		GAME.world.add(spawnHandler(), "spawnHandler", 0, true);


		GAME.state = "level";
	}

	GAME.states.level = () => {

		if(GAME.keys.W.down || GAME.keys.w.down || GAME.keys[" "].down || (GAME.pointer.downed && GAME.pointer.pos.x < GAME.width/2)) 
			GAME.world.player.jump(GAME);

		if(GAME.keys.o.downed || GAME.keys.O.downed || (GAME.pointer.downed && GAME.pointer.pos.x > GAME.width/2))
			GAME.world.player.dash(GAME);

		GAME.world.update(GAME);

		GAME.context.x = -GAME.world.player.pos.x + 80;
		GAME.context.y = 0;
		GAME.context = v.add(GAME.context, GAME.screenShake);
		
		ctx.save();
		ctx.scale(GAME.c.scale, GAME.c.scale);
		ctx.translate(GAME.context.x, GAME.context.y);
		ctx.drawImage(GAME.sprites.background, -GAME.context.x, 0, 320, 180);

		GAME.world.draw(ctx, GAME.sprites);

		text.white10(GAME.points, 310 - GAME.context.x - (GAME.points + "").length * 5, 15, ctx);

		ctx.restore();
		GAME.screenShake = vec(0, 0);
	
	}

	GAME.states.dead = (GAME, ctx) => {
		if(GAME.keys[" "].upped || GAME.keys.w.upped || GAME.keys.W.upped || GAME.pointer.upped) GAME.state = GAME.state = "setupLevel";

		ctx.save();
		ctx.scale(GAME.c.scale, GAME.c.scale);
		ctx.fillStyle = "brown";
		ctx.fillRect(90, 90, 130, 15);
		text.white10("Press space to retry", 100, 100, ctx);
		ctx.restore();
	}

	GAME.state = "setupLevel";

	let lastTime = 0;
	let accTime = 0;

	const loop = (time = 0) => {
		accTime += time - lastTime;
		lastTime = time;
		while(accTime > 1000/60){
			if(GAME.sleep > 0){
				GAME.sleep--;
			}else{
				GAME.states[GAME.state](GAME, GAME.ctx);
				GAME.keys.update();
				GAME.pointer.update();
			}
			accTime -= 1000/60;
		}
		requestAnimationFrame(loop);
	}

	loop();
});
