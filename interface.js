
class ResourceManager {
    constructor() {
        this.textures = new Array();
        this.animated = new Array();
        for (let i of Global.resList) {

            this.textures[i.name] = new Image();
            this.textures[i.name].src = i.path;
            if(i.type == "animated")
            {
                this.animated[i.name] = [];
                this.animated[i.name][0] = i.path;


                let ppath = i.path.split('.');
                for(let it = 1;it<i.frames;it++)
                {
                    this.animated[i.name][it] = ppath[0] + it +"."+ppath[1]; 
                }
                this.animated[i.name].frames = i.frames
                this.animated[i.name].currFrame =0;
            }
        }
    }
    updateFrames()
    {
        for(let i in this.animated)
        {
            this.animated[i].currFrame++;
            if(this.animated[i].currFrame == this.animated[i].frames) this.animated[i].currFrame = 0;
            this.textures[i].src = this.animated[i][this.animated[i].currFrame];
        }
    }
    getTex(name) {
        if (name == "NONE")
            console.log("Warning [ResMgr]: Attempted to get NONE texture");
        return this.textures[name];
    }

}

class RenderScreen {
    constructor(parentId,outW,outH,inW,inH) {
        this.parentEl = document.getElementById(parentId);
        this.parentEl.width = outW;
        this.parentEl.height = outH;
        this.Mctx = this.parentEl.getContext("2d");

        this.inW = inW;
        this.inH = inH;
        this.outW = outW;
        this.outH = outH;

        this.buffCanvas = document.createElement("canvas");
        this.buffCanvas.width = inW;
        this.buffCanvas.height = inH;
        this.ctx = this.buffCanvas.getContext("2d");
        this.framesTotal = 0;

        
    }
    update() {
        this.Mctx.clearRect(0, 0, this.outW, this.outH);
        this.Mctx.drawImage(this.buffCanvas, 0, 0,this.outW, this.outH);
    }
    drawScr(player,map,resMgr)
    {
        let ddrawStart = performance.now();
        let W = this.inW;
        let H = this.inH;
        this.ctx.clearRect(0, 0,W, H);
        
        
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
                if (map.at(tile).solid)
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
            let wH = H/2;
            let wall_height = Math.abs(Math.floor(wH / wall_dist));
            let draw_start = -wall_height / 2 + H / 2;

            let tex = resMgr.getTex(map.at(tile).texName);

            let texW = map.at(tile).texW;
            if(texW == "full") texW = tex.width;
            wallX = Math.floor(wallX * texW);
            if (horiz && rayDir.x > 0) {
                wallX = texW - wallX - 1;
            }
            if (!horiz && rayDir.y < 0) {
                wallX = texW - wallX - 1;
            }
            
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
        let sqDist = []
        for(let i in map.objects)
        {
            let distVec = sub(player.pos,map.objects[i].pos)
            let sqd =distVec.x*distVec.x + distVec.y*distVec.y;
            sqDist.push({dist: sqd, ind:i});
        }
        sqDist.sort((a,b) => {return b.dist-a.dist});
        
        let camMat = new Mat2D(player.cam.x,player.dir.x,player.cam.y,player.dir.y);
        let invCamMat = inv(camMat);
        for(let it in sqDist)
        {
            let i = sqDist[it].ind;
            let distVec = sub(map.objects[i].pos,player.pos);
            let transVec = trans(invCamMat,distVec);

            let spriteX = Math.floor( (W/2) * (1+transVec.x/transVec.y));
            
            let spriteH = Math.abs(Math.floor(H/(transVec.y*2)));
            let drawStartY = Math.floor(-spriteH/2 + H/2);
            if(drawStartY < 0) drawStartY =0;
            let drawEndY = spriteH / 2 + H / 2;
            if(drawEndY >= H) drawEndY = H - 1;

            let spriteW = Math.abs(Math.floor(H/(transVec.y*2)));
            let drawStartX = Math.floor(-spriteW/2 + spriteX);
            if(drawStartX<0)drawStartX =0;
            let drawEndX = spriteW/2 + spriteX;
            if(drawEndX >=W) drawEndX = W-1;

            let tex = resMgr.getTex(map.objects[i].texName);
            for(let stripe = drawStartX;stripe <drawEndX;stripe++)
            {
                if(transVec.y > 0 && stripe > 0  && stripe < W && transVec.y < zBuffer[stripe])
                {
                    let texX = Math.floor((stripe - (-spriteW / 2 + spriteX)) * tex.width / spriteW);
                    this.ctx.drawImage(tex,texX,0,1,tex.height,stripe,drawStartY,1,spriteH);
                    zBuffer[stripe] = transVec.y;
                }
            }


        }

        let ddelta = ddrawStart - dlastdraw;
        dlastdraw = ddrawStart;
        //this.ctx.font = "10 Verdana";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText("FPS: "+Math.floor(1000/ddelta),1,10)
       // debug.log("FrameTime",ddelta);
        this.framesTotal++
        if((this.framesTotal % 10) == 0)resMgr.updateFrames();

        this.update();
    }
}
function sortObj(array,fun)
{
    array.sort()
}