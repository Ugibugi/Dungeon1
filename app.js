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

    -Fix flickering sprites

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
        this.player.update(this.map);
    }
}
    

let app = new App();
function loop()
{
    requestAnimationFrame(loop);
	app.update();
    app.scr.drawScr(app.player,app.map,app.res);
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
