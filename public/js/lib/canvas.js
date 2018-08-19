import vec, { div, sub } from "/js/lib/vector.js";

const createCanvas = (width = 800, height = 600, element = document.body) => new Promise((resolve, reject) => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;    
	ctx.imageSmoothingEnabled = false;

    //fix canvas size
    const dif = height/width;

    const reSize  = () => {
        c.width = window.innerWidth-10;
        c.height = c.width*dif;
        while(c.height > window.innerHeight-10){
            c.width -= 2;
            c.height = c.width*dif;
        }
		c.scale = c.width/width;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;    
		ctx.imageSmoothingEnabled = false;
    }
    reSize();
	console.log(ctx.imageSmoothingEnabled);

    window.addEventListener("resize", reSize);

    const pointer = {
        pos: vec(0, 0),
        down: false,
        downed: false,
        upped: false,
    };

	pointer.update = () => {
		pointer.downed = false;
		pointer.upped = false;
	}

    c.addEventListener("mousedown", e => {
        if(!pointer.down) pointer.downed = true;
        pointer.down = true;
    });
    c.addEventListener("mouseup", e => {
        if(pointer.down) pointer.upped = true;
        pointer.down = false;
    });
    c.addEventListener("mousemove", e => {
        const offset = vec(c.offsetLeft, c.offsetTop);
        pointer.pos = div(sub(vec(e.pageX, e.pageY), offset), c.scale);
    });
    c.addEventListener("contextmenu", e => {
        e.preventDefault();
    });

	const touch = {
		downed: false,
		pos: vec(0, 0),
	}

	c.addEventListener("touchstart", (e) => {
		touch.downed = true;
        touch.pos = div(sub(vec(e.touches[0].pageX, e.touches[0].pageY), offset), c.scale);
	});

	touch.update = () => {
		touch.downed = false;
	}

    element.appendChild(c);
    resolve({
        c,
        ctx,
        pointer,
		touch,
        width,
        height,
		scale: c.scale,
    });

});

export default createCanvas;
