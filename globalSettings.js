class Global {
}
Global.ScrWidth = 800;
Global.ScrHeight = 600;
Global.innerWidth = 320;
Global.innerHeight = 240;
Global.resList = [
    {
        type: "texture",
        name: "BRICK1",
        path: "res/dLQwall.jpg"
    },
    {
        type: "texture",
        name:"BRICK2",
        path: "res/LQbricks.jpg"
    },
    {
        type: "texture",
        name: "AWALL",
        path: "res/LQwall.jpg"
    },
    {
        type: "animated",
        name: "TORCH1",
        path: "res/TRED.png",
        frames: 2,
    },
    {
        type: "texture",
        name: "DOOR1",
        path: "res/DOR2C.png"
    }

];
Global.objTypes = [
    {
        name: "TORCH_R",
        texName: "TORCH1",
        alt: null,
        blocking: true,
        
    },
    {
        name: "WDOOR",
        texName: "DOOR1",
        alt: null,
        blocking: true,
        
    }
];
Global.tileTypes = [
    //0
    {
        num: 0,
        blocking: false,
        texName: "NONE",
       
        texW: 0
        
    },
    //1
    {
        num: 1,
        blocking: true,
        texName: "AWALL",
        solid:true,
        texW: "full"
    }
    //2
    ,{
        num:2,
        blocking: true,
        texName: "BRICK2",
        solid:true,
        texW: "full"
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
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],
    width: 10,
    height: 9,
    objects: [
        {
            name: "WDOOR",
            place:{
                x:5,
                y:3
            }
        },
        {
            name: "TORCH_R",
            place:{
                x:3,
                y:3
            }
        },
        {
            name: "TORCH_R",
            place:{
                x:6,
                y:2
            }
        },
        {
            name: "TORCH_R",
            place:{
                x:6,
                y:4
            }
        },
        {
            name: "TORCH_R",
            place:{
                x:6,
                y:7
            }
        },
        {
            name: "TORCH_R",
            place:{
                x:7,
                y:7
            }
        },
        {
            name: "TORCH_R",
            place:{
                x:8,
                y:7
            }
        },
        {
            name: "TORCH_R",
            place:{
                x:9,
                y:7
            }
        }
    ]
};
th= 0.1508 //9 degrees 1/10 of a turn
Global.lrot = new Mat2D(Math.cos(th), -Math.sin(th), Math.sin(th), Math.cos(th));
Global.rrot = new Mat2D(Math.cos(-th), -Math.sin(-th), Math.sin(-th), Math.cos(-th));

Global.l90rot = new Mat2D(0, -1, 1, 0);
Global.r90rot = new Mat2D(0, 1, -1, 0);

Global.debugScale = 100;
function getObjectType(objname)
{
    for(let i in Global.objTypes)
    {
        if(Global.objTypes[i].name == objname) return Global.objTypes[i];
    }
}
class DebugInfo
{
    constructor(id)
    {
        this.element = document.createElement("div");
        this.element.id = id;
    }
    init()
    {
        document.body.appendChild(this.element);
    }
    log(varName,val)
    {
        let el = document.getElementById(varName);
        if(el == null)
        {
            el = document.createElement("div");
            el.id = varName;
            this.element.appendChild(el);
        }
        el.innerText = varName + " = " + val;
    } 
}
let debug = new DebugInfo("debug");
let dlastdraw=performance.now();