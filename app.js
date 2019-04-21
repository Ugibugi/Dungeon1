/*
TODO:
    -Full movement
    -Flats rendering
    -Settings control
    -Doors
    -Messages
    -Time
    -Objects 
    -Creatures
*/

class App {
    constructor() {
    }
    init()
    {
        console.log("Starting Resource Manager...");
        this.res = new ResourceManager();
        console.log("Starting Screen...");
        this.scr = new RenderScreen("display",Global.ScrWidth,Global.ScrHeight,Global.innerWidth,Global.innerHeight);
        console.log("Loading map...");
        this.map = new GameMap();
        this.map.load(Global.map01);
        console.log("Placing player...");
        this.player = new Player();
    }
    update()
    {
        if(this.player.update(this.map))
        {
            for(let it in this.map.objects)
            {
                this.map.objects[it].doFunc();
            }
        }
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
    //console.log("Log [AIFunc]: called with pos = "+entity.pos.x+", "+entity.pos.y);
    let deltaX = app.player.pos.x - entity.pos.x;
    let deltaY = app.player.pos.y - entity.pos.y;
    let destDelta = new Vec2D(0,0);
    if(deltaX < 0) destDelta.x--;
    else destDelta.x++;
    if(deltaY < 0)destDelta.y--;
    else destDelta.y++;

    let destPos = add(entity.pos,destDelta);
    let destTile = app.map.at(destPos);
    if(destTile.solid || destTile.blocking) return;
    else 
    {
        app.map.at(entity.pos).clearObj();
        app.map.at(destPos).place(entity);
        entity.pos = destPos;
    }

}
window.onload = () => {
    app.init();
    debug.init();
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
