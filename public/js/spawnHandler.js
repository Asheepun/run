import vec, * as v 				from "/js/lib/vector.js";
import traitHolder, * as traits from "/js/lib/traits.js";
import * as obstacles 			from "/js/obstacles.js";
import * as coins				from "/js/coins.js";
import seagull					from "/js/seagull.js";

const startScreen = [
	"................",
	"................",
	"................",
	"................",
	"................",
	"................",
	"................",
	"................",
	"################",
	"################",
];

const flats = [
	[
		"................",
		"................",
		"................",
		"............#...",
		"............#...",
		"............#...",
		"............#...",
		".....##...$$$...",
		"#######.....####",
		"#######.....####",
	],
	[
		"................",
		"................",
		"................",
		"................",
		"......#####.....",
		".......$$$......",
		"......#...#.....",
		"......#...#.....",
		"#######...######",
		"#######...######",
	],
	[
		"................",
		"................",
		"......$$$.......",
		".........#......",
		".........#......",
		".........#......",
		".........#......",
		".B.......#......",
		"##.......#######",
		"##.......#######",
	],
	//none stairs
	[
		"................",
		"................",
		"................",
		"................",
		"................",
		".....$$$........",
		"........#.......",
		"........#.......",
		"###.....########",
		"###.....########",
	],
	[
		"................",
		"................",
		"................",
		"................",
		".....########...",
		"................",
		".....#......#...",
		".....#....$$$...",
		"######......####",
		"######......####",
	],
	//none bridges
	[
		"................",
		"................",
		"................",
		"................",
		"................",
		"..#.............",
		"..#######.......",
		"....$$..$$......",
		"###...#...######",
		"###...#...######",
	],
	[
		"................",
		"................",
		"................",
		"................",
		"................",
		"......$$$.......",
		"................",
		"................",
		"###.........####",
		"###.........####",
	],
];

const stairs = [
	[
		"................",
		"................",
		"................",
		"................",
		".............###",
		".....$$$........",
		"........#.......",
		"........#.......",
		"###.....########",
		"###.....########",
	],
	[
		"................",
		"................",
		"................",
		"................",
		".....######.....",
		"............B...",
		".....#......#...",
		".....#....$$$...",
		"######......####",
		"######......####",
	],
];

const bridges = [
	[
		"................",
		"................",
		"................",
		"....#...........",
		"................",
		"..#.............",
		"..#######.......",
		"....$$..$$......",
		"###...#...######",
		"###...#...######",
	],
	[
		"................",
		"................",
		"................",
		"....#...........",
		"................",
		"......$$$.......",
		"................",
		"................",
		"###.........####",
		"###.........####",
	],
];

const rewards = [
	[
		"...#............",
		"................",
		"................",
		"......£.........",
		".#######........",
		".#####...$$$....",
		".###............",
		"..$$$...........",
		"##...#......####",
		"##...#......####",
	]
]

const spawnHandler = () => {
	const that = traitHolder();

	let lastPlayerPos = 0;
	let screensPlaced = 0;

	that.addScreen = (screen, width, add) => {
		let pos;
		screen.forEach((row, y) => strEach(row, (tile, x) => {
			pos = vec(x * 20 + screensPlaced * width, y * 20);

			if(tile === "#"){
				if(y === 8){
					if(screen[y][x+1] !== "#" && screen[y][x-1] !== "#")
						add(obstacles.edge(pos.copy(), vec(21, 0)), "obstacles", 2);
					else if(screen[y][x+1] !== "#" && x !== screen[0].length-1)
						add(obstacles.edge(pos.copy(), vec(42, 0)), "obstacles", 2);
					else if(screen[y][x-1] !== "#" && x !== 0)
						add(obstacles.edge(pos.copy(), vec(0, 0)), "obstacles", 2);
					else add(obstacles.ground(pos.copy()), "obstacles", 2);
				}
				else add(obstacles.box(pos.copy()), "obstacles", 2);
			}
			if(tile === "B") add(obstacles.bumper(pos.copy()), "bumpers", 2);
			if(tile === "$") add(coins.smallCoin(pos.copy()), "coins", 4);
			if(tile === "£") add(coins.diamond(pos.copy()), "coins", 4);
		}));

		screensPlaced++;
	}

	let init = false;
	that.initStage = ({ world, world: { add }, width }) => {
		if(!init){
			that.addScreen(startScreen, width, add);
			that.addScreen(getScreen(flats), width, add);
			init = true;
		}
	}

	let lastScreen = "flat";
	let screen;

	that.handleScreens = ({ world: { add, player }, context, width }) => {
		if(player.pos.x > lastPlayerPos + 300){
			if(lastScreen === "flat"){
				if(Math.random() < 0.2){
					screen = getScreen(stairs);
					lastScreen = "stair";
				}else {
					screen = getScreen(flats);
					lastScreen = "flat";
				}
			}else if(lastScreen === "stair"){
				screen = getScreen(bridges);
				lastScreen = "bridge";
			}else if(lastScreen == "bridge"){
				screen = getScreen(rewards);
				lastScreen = "reward";
			}else if(lastScreen = "reward"){
				screen = getScreen(flats);
				lastScreen = "flat";
			}

			that.addScreen(screen, width, add);
			lastPlayerPos = player.pos.x
			//add nice looking things
			for(let i = 0; i < Math.random()*2; i++){
				add(seagull(vec(-context.x + width * 1.5 + Math.random()*width/2, 0)), "particles", 3);
			}

		}
	}

	that.addMethods("initStage", "handleScreens");

	return that;
}

const getScreen = (array) => array[Math.floor(Math.random()*array.length)];

const strEach = (str, func) => {
	for(let i = 0; i < str.length; i++){
		func(str[i], i);
	}
}

export default spawnHandler;
