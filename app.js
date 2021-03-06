/*
TODO:
    -Flats rendering
    -Settings control
    -Messages
    -Time
*/

class App {
    constructor() {
    }
    init()
    {
        console.log("Starting Resource Manager...");
        this.res = new ResourceManager();
        console.log("Starting Screen...");
        Global.ScrWidth = document.getElementById("display").width;
        Global.ScrHeight = document.getElementById("display").height;
        this.scr = new RenderScreen("display",Global.ScrWidth,Global.ScrHeight,Global.innerWidth,Global.innerHeight);
        console.log("Loading map...");
        this.map = new GameMap();
        this.map.load(Global.map01);
        console.log("Placing player...");
        this.player = new Player();
        this.playerMoved = false;
    }
    update()
    {
        
        if(!this.playerMoved)this.playerMoved = this.player.updateControls(this.map);
    
        if(this.playerMoved && !this.player.moving)
        {
            for(let it in this.map.objects)
            {
                this.map.objects[it].doFunc();
            }
            this.playerMoved = false;
        }
        this.player.updateMovement(this.map);
    }
}
    

let app = new App();
function loop()
{
    requestAnimationFrame(loop);
	app.update();
    app.scr.drawScr(app.player,app.map,app.res);
}
function moveAI(entity)
{
    console.log("Log [AIFunc]: called with pos = "+entity.pos.x+", "+entity.pos.y);
    let deltaPos = sub(app.player.pos, entity.pos);
    let destDelta = new Vec2D(0,0);

    if(sqSum(round(deltaPos)) == 1)
    {//attack
        console.log("        attacking Player");
    }
    else
    {//move
        if(deltaPos.x < 0) destDelta.x--;
        else if(deltaPos.x > 0) destDelta.x++;
        if(deltaPos.y < 0)destDelta.y--;
        else if(deltaPos.y > 0)destDelta.y++;

        let destPos = add(entity.pos,destDelta);
        let destTile = app.map.at(destPos);
        if(destTile.solid || destTile.blocking)
        {
            console.log("        moving failed");
            return;
        }
        else 
        {
            console.log("        moving (");
            app.map.at(entity.pos).clearObj();
            app.map.at(destPos).place(entity);
            entity.pos = destPos;
        }
    }
}
window.onload = () => {
    app.init();
    debug.init();
    document.getElementById("up").onclick = () => {
        app.player.up = true;
    };
    document.getElementById("rot_right").onclick = () => {
        app.player.right = true;
    };
    document.getElementById("rot_left").onclick = () => {
        app.player.left = true; 
    };
    document.getElementById("display").onclick = () => {
        app.player.use = true;
    };

    document.getElementById("strafe_left").onclick = () => {
        app.player.sleft = true;
    };
    document.getElementById("down").onclick = () => {
        app.player.down = true;
    };
    document.getElementById("strafe_right").onclick = () => {
        app.player.sright = true;
    };
    loop();
    
};
