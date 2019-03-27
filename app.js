class Vec2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
function add(v1, v2) {
    return new Vec2D(v1.x + v2.x, v1.y + v2.y);
}
function sub(v1, v2) {
    return new Vec2D(v1.x - v2.x, v1.y - v2.y);
}
function mul(v1, t) {
    return new Vec2D(v1.x * t, v1.y * t);
}
function floor(v) {
    return new Vec2D(Math.floor(v.x), Math.floor(v.y));
}
class Mat2D {
    constructor(a, b, c, d) {
        this.left = new Vec2D(a, c);
        this.right = new Vec2D(b, d);
    }
}
function trans(mat, v) {
    return add(mul(mat.left, v.x), mul(mat.right, v.y));
}
class Global {
}
Global.ScrWidth = 800;
Global.ScrHeight = 600;
Global.wallHeight = 500;
Global.resList = [
    {
        name: "BRICK1",
        path: "res/wall.jpg"
    },
    {
        name:"BRICK2",
        path: "res/bricks2.jpg"
    }
];
Global.tileTypes = [
    //0
    {
        blocking: false,
        texName: "NONE",
        texW: 0
    },
    //1
    {
        blocking: true,
        texName: "BRICK1",
        texW: 256
    }
    //2
    ,{
        blocking: true,
        texName: "BRICK2",
        texW: 1024
    }
];
Global.map01 = {
    data: [
        1, 1, 1, 1, 2, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        2, 0, 1, 1, 1, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 1, 0, 1, 1, 0, 1,
        1, 0, 1, 1, 1, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],
    width: 10,
    height: 7
};
Global.lrot = new Mat2D(0, -1, 1, 0);
Global.rrot = new Mat2D(0, 1, -1, 0);
Global.debugScale = 100;
class GameMapInfo {
}
class RenderScreen {
    constructor(parentId,w,h) {
        this.parentEl = document.getElementById(parentId);
        this.parentEl.width = w;
        this.parentEl.height = h;
        this.Mctx = this.parentEl.getContext("2d");
        this.w = w;
        this.h = h;
        this.buffCanvas = document.createElement("canvas");
        this.buffCanvas.width = w;
        this.buffCanvas.height = h;
        this.ctx = this.buffCanvas.getContext("2d");
    }
    update() {
        this.Mctx.clearRect(0, 0, this.w, this.h);
        this.Mctx.drawImage(this.buffCanvas, 0, 0);
    }
}
class Tile {
    constructor(type) {
        this.type = type;
        this.texName = Global.tileTypes[type].texName;
        this.texW = Global.tileTypes[type].texW;
        this.blocking = Global.tileTypes[type].blocking;
    }
}
class GameMap {
    constructor() {
        this.tiles = new Array();
    }
    load(info) {
        this.info = info;
        for (let i in info.data) {
            this.tiles[i] = new Tile(info.data[i]);
        }
    }
    /*at(x: number, y: number): Tile {
        return this.tiles[y * this.info.width + x];
    }*/
    at(v) {
        return this.tiles[v.y * this.info.width + v.x];
    }
}
class Player {
    constructor() {
        /*movement*/
        this.speed = 0.1;
        this.invSpeed = 10;
        this.counter = 0;
        this.rotspeed = 0.05;
        this.moving = false;
        /*input*/
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.pos = new Vec2D(1.5, 1.5);
        this.dir = new Vec2D(1, 0);
        this.cam = new Vec2D(0, 0.66);
    }
    move() {
        if (this.counter != 0) {
            this.counter--;
            this.pos = add(this.pos, this.dPos);
        }
        else {
            this.moving = false;
        }
    }
    update(map) {
        if (this.moving) {
            this.move();
        }
        else {
            if (this.up) {
                this.dPos = mul(this.dir, this.speed);
                if (!map.at(add(this.pos, this.dir)).blocking) {
                    this.moving = true;
                    this.counter = this.invSpeed;
                }
                this.up = false;
            }
            if (this.down) {
                this.dPos = mul(this.dir, -this.speed);
                if (!map.at(sub(this.pos, this.dir)).blocking) {
                    this.moving = true;
                    this.counter = this.invSpeed;
                }
                this.down = false;
            }
            if (this.left) {
                this.dir = trans(Global.lrot, this.dir);
                this.cam = trans(Global.lrot, this.cam);
                this.left = false;
            }
            if (this.right) {
                this.dir = trans(Global.rrot, this.dir);
                this.cam = trans(Global.rrot, this.cam);
                this.right = false;
            }
        }
    }
}
class ResourceManager {
    constructor() {
        this.textures = new Array();
        for (let i of Global.resList) {
            this.textures[i.name] = new Image();
            this.textures[i.name].src = i.path;
        }
    }
    getTex(name) {
        if (name == "NONE")
            console.log("Warning [ResMgr]: Attempted to get NONE texture");
        return this.textures[name];
    }
}
class App {
    constructor() {
    }
    init()
    {
        console.log("Starting Resource Manager...");
        this.res = new ResourceManager();
        console.log("Starting Screen...");
        this.scr = new RenderScreen("display",Global.ScrWidth,Global.ScrHeight);
        console.log("Loading map...");
        this.map = new GameMap();
        this.map.load(Global.map01);
        console.log("Placing player...");
        this.player = new Player();

        //DEBUGGING code
        this.debugInfo = document.getElementById("debugInfo");
        this.debugDisplay = null;
        if(document.getElementById("debugDisplay") != null)
        {
            this.debugDisplay = new RenderScreen("debugDisplay",this.map.info.width*Global.debugScale,this.map.info.height*Global.debugScale);
        }
    }
    debugInfoAdd(string)
    {
        this.debugInfo.innerText += "   "+string;
    }
    debugInfoClear()
    {
        this.debugInfo.innerText = "";
    }
    drawScr()
    {
        this.scr.ctx.clearRect(0, 0, Global.ScrWidth, Global.ScrHeight);
        let W = Global.ScrWidth;
        let zBuffer = [];
        for (var col = 0; col < W; col++) {
            let camX = 2 * col / W - 1;
            let rayStart = this.player.pos;
            let rayDir = add(mul(this.player.cam, camX), this.player.dir);
            let tile = floor(this.player.pos);
            let delta = new Vec2D(0,0);
            delta.x = Math.sqrt(1 + (rayDir.y * rayDir.y) / (rayDir.x * rayDir.x));
            delta.y = Math.sqrt(1 + (rayDir.x * rayDir.x) / (rayDir.y * rayDir.y));
            let step= new Vec2D(0,0);
            let dist = new Vec2D(0,0);
            if (rayDir.x < 0) {
                step.x = -1;
                dist.x = (this.player.pos.x - tile.x) * delta.x;
            }
            else {
                step.x = 1;
                dist.x = (tile.x + 1 - this.player.pos.x) * delta.x;
            }
            if (rayDir.y < 0) {
                step.y = -1;
                dist.y = (this.player.pos.y - tile.y) * delta.y;
            }
            else {
                step.y = 1;
                dist.y = (tile.y + 1 - this.player.pos.y) * delta.y;
            }
            let horiz;
            while (true) {
                if (dist.x < dist.y) {
                    dist.x += delta.x;
                    tile.x += step.x;
                    horiz = true;
                }
                else {
                    dist.y += delta.y;
                    tile.y += step.y;
                    horiz = false;
                }
                if (this.map.at(tile).blocking)
                    break;
            }
            let wall_dist;
            let wallX;
            if (horiz) {
                wall_dist = (tile.x - this.player.pos.x + (1 - step.x) / 2) / rayDir.x;
                wallX = this.player.pos.y + wall_dist * rayDir.y;
            }
            else {
                wall_dist = (tile.y - this.player.pos.y + (1 - step.y) / 2) / rayDir.y;
                wallX = this.player.pos.x + wall_dist * rayDir.x;
            }
            wallX -= Math.floor(wallX);
            wall_dist = Math.abs(wall_dist);
            zBuffer[col] = wall_dist;
            let wH = Global.wallHeight;
            let wall_height = Math.abs(Math.floor(wH / wall_dist));
            let draw_start = -wall_height / 2 + wH / 2;
            wallX = Math.floor(wallX * this.map.at(tile).texW);
            if (horiz && rayDir.x > 0) {
                wallX = this.map.at(tile).texW - wallX - 1;
            }
            if (!horiz && rayDir.y < 0) {
                wallX = this.map.at(tile).texW - wallX - 1;
            }
            let tex = this.res.getTex(this.map.at(tile).texName);
            this.scr.ctx.drawImage(tex, wallX, 0, 1, tex.height, col, draw_start, 1, wall_height);
            var tint = (wall_height * 1.6) / wH;
            var c = Math.round(60 / tint);
            c = 60 - c;
            if (c < 0) {
                c = 0;
            }
            tint = 1 - tint;
            this.scr.ctx.fillStyle = "rgba(" + c + ", " + c + ", " + c + ", " + tint + ")";
            this.scr.ctx.fillRect(col, draw_start, 1, wall_height);
            this.scr.update();
        }
    }
    debugDraw()
    {
        this.debugDisplay.ctx.clearRect(0,0,this.debugDisplay.w,this.debugDisplay.h);
        for(var y = 0; y < this.map.info.width; y++)
        {
            for(var x=0; x < this.map.height; x++)
            {
                if(this.map.at({x:x,y:y}).blocking)
                    this.debugDisplay.ctx.strokeRect(x*Global.debugScale,y*Global.debugScale,Global.debugScale,Global.debugScale);
            }
        }
        this.debugDisplay.update();
    }
}

let app = new App();
function loop()
{
    requestAnimationFrame(loop);
    if(app.debugInfo)app.debugInfoClear();
	app.player.update();
    app.drawScr();
    if(app.debugDisplay)app.debugDraw();
}
window.onload = () => {
    app.init();
    document.getElementById("up").onclick = () => {
        app.player.up = true;
    }
    document.getElementById("rot_right").onclick = () => {
        app.player.right = true;
    }
    document.getElementById("rot_left").onclick = () => {
        app.player.left = true; 
    }

    loop();
    
};
