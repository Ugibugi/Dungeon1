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
        this.moving = false;
        /*input*/
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.pos = new Vec2D(1.5, 1.5);
        this.dir = new Vec2D(1, 0);
        this.cam = new Vec2D(0, 1.3);

        this.rotating = false;
        this.rotCount = 0;
        this.rotspeed = 0.1;
        this.invrotspd = 10;
        
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
    rotate()
    {
        if (this.rotCount != 0) {
            this.rotCount--;
            this.dir = trans(this.trn, this.dir);
            this.cam = trans(this.trn, this.cam);
        }
        else {
            
            this.dir = round(this.dir);
            this.cam = mul(round(this.cam),1.3);
            this.rotating = false;
        }

    }
    update(map)
    {
        if (this.moving) {
            this.move();
        }
        else {
            if (this.up) {
                this.dPos = mul(this.dir, this.speed);
                let futurePos = floor(add(this.pos, this.dir));
                let futureTile = map.at(futurePos);
                if (!futureTile.blocking) {
                    this.moving = true;
                    this.counter = this.invSpeed;
                }
                this.up = false;
            }
            if (this.down) {
                this.dPos = mul(this.dir, -this.speed);
                let futurePos = floor(sub(this.pos, this.dir));
                let futureTile = map.at(futurePos);
                if (!futureTile.blocking) {
                    this.moving = true;
                    this.counter = this.invSpeed;
                }
                this.down = false;
            }
            if(this.rotating)
            {
                this.rotate();
            }
            else{

                if (this.left) {
                    this.trn = Global.lrot;
            
                    this.rotCount = this.invrotspd;
                    this.rotating = true;
                    this.left = false;
                }
                if (this.right) {
                    this.trn = Global.rrot;

                    this.rotCount = this.invrotspd;
                    this.rotating = true;
                    this.right = false;
                }
            }
        }
        
        
    }
}
