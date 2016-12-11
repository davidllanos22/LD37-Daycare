var DEBUG = false;

wizard({
    scale: 2,
    fillScreen: true,
    pixelArt: true,
    create: function(){
        this.loadImages("arm.png", "body.png", "head.png", "leg.png", "tiles.png", "hair.png");

        WIZARD.spritesheet.create("tiles", 40, 40);

        WIZARD.spritesheet.create("arm", 24, 14);
        WIZARD.spritesheet.create("body", 40, 39);
        WIZARD.spritesheet.create("head", 48, 35);
        WIZARD.spritesheet.create("leg", 14, 18);
        WIZARD.spritesheet.create("hair", 46, 40);

        WIZARD.scene.create("testRoom", testRoom);

        WIZARD.entity.create("player", entityPlayer);
        WIZARD.entity.create("tile", tileEntity);
        WIZARD.entity.create("solid", solidEntity);

        WIZARD.map.create("testMap", testMap);
        WIZARD.map.loadToScene("testMap", "testRoom", mapLoader);

        WIZARD.scene.setCurrent("testRoom", 0, this);
    },

    update: function(){
        WIZARD.scene.current.update(this);
        animations._update();


    },
    render: function(){
        this.clear("#686868");
        WIZARD.scene.current.render(this);
    }
}).play();
