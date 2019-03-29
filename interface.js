
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
        this.Mctx.drawImage(this.buffCanvas, 0, 0,this.w, this.h);
    }
    drawScr(player,map,resMgr)
    {
        let ddrawStart = performance.now();
        this.ctx.clearRect(0, 0, Global.ScrWidth, Global.ScrHeight);
        let W = Global.ScrWidth;
        let H = Global.ScrHeight;
        
        var grad = this.ctx.createLinearGradient(0, H / 2, 0, H);
        grad.addColorStop(0, "rgb(0,0,0)");
        grad.addColorStop(1, "rgb(80,80,80)");
        this.ctx.fillStyle = grad
        this.ctx.fillRect(0, H / 2, W, H / 2);


        grad =this.ctx.createLinearGradient(0, 0, 0, H / 2);
        grad.addColorStop(0, "rgb(80,80,80)");
        grad.addColorStop(1, "rgb(0,0,0)");
        this.ctx.fillStyle = grad
        this.ctx.fillRect(0, 0, W, H / 2);


        let zBuffer = [];
        for (var col = 0; col < W; col++)
        {
            let camX = 2 * col / W - 1;
            let rayStart = player.pos;
            let rayDir = add(mul(player.cam, camX), player.dir);
            let tile = floor(player.pos);
            let delta = new Vec2D(0,0);
            delta.x = Math.sqrt(1 + (rayDir.y * rayDir.y) / (rayDir.x * rayDir.x));
            delta.y = Math.sqrt(1 + (rayDir.x * rayDir.x) / (rayDir.y * rayDir.y));
            let step= new Vec2D(0,0);
            let dist = new Vec2D(0,0);
            if (rayDir.x < 0) {
                step.x = -1;
                dist.x = (player.pos.x - tile.x) * delta.x;
            }
            else {
                step.x = 1;
                dist.x = (tile.x + 1 - player.pos.x) * delta.x;
            }
            if (rayDir.y < 0) {
                step.y = -1;
                dist.y = (player.pos.y - tile.y) * delta.y;
            }
            else {
                step.y = 1;
                dist.y = (tile.y + 1 - player.pos.y) * delta.y;
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
                if (map.at(tile).blocking)
                    break;
            }
            let wall_dist;
            let wallX;
            if (horiz) {
                wall_dist = (tile.x - player.pos.x + (1 - step.x) / 2) / rayDir.x;
                wallX = player.pos.y + wall_dist * rayDir.y;
            }
            else {
                wall_dist = (tile.y - player.pos.y + (1 - step.y) / 2) / rayDir.y;
                wallX = player.pos.x + wall_dist * rayDir.x;
            }
            wallX -= Math.floor(wallX);
            wall_dist = Math.abs(wall_dist);
            zBuffer[col] = wall_dist;
            let wH = Global.wallHeight;
            let wall_height = Math.abs(Math.floor(wH / wall_dist));
            let draw_start = -wall_height / 2 + Global.ScrHeight / 2;
            wallX = Math.floor(wallX * map.at(tile).texW);
            if (horiz && rayDir.x > 0) {
                wallX = map.at(tile).texW - wallX - 1;
            }
            if (!horiz && rayDir.y < 0) {
                wallX = map.at(tile).texW - wallX - 1;
            }
            let tex = resMgr.getTex(map.at(tile).texName);
            this.ctx.drawImage(tex, wallX, 0, 1, tex.height, col, draw_start, 1, wall_height);




            var tint = (wall_height * 1.6) / wH;
            var c = Math.round(60 / tint);
            c = 60 - c;
            if (c < 0) {
                c = 0;
            }
            tint = 1 - tint;
            this.ctx.fillStyle = "rgba(" + c + ", " + c + ", " + c + ", " + tint + ")";
            this.ctx.fillRect(col, draw_start, 1, wall_height);
            

            
        }
        let ddelta = ddrawStart - dlastdraw;
        dlastdraw = ddrawStart;
        debug.log("FrameTime",ddelta);
        this.update();
    }
}
