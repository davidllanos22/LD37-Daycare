var animations = {
    a: 0,
    _update: function(){
        this.a += 0.04;
    },
    hello: function(entity){
        entity.armLeftRot += Math.sin(this.a);
    },
    walk: function(entity){
        entity.armRightRot =  WIZARD.math.lerp(entity.armRightRot,entity.baseArmRightRot + Math.random() * 50, 0.1);
        entity.legLeftRot += Math.sin(this.a);
        entity.legRightRot += Math.cos(this.a);
    },
    stopWalk: function(entity){
        entity.armRightRot = WIZARD.math.lerp(entity.armRightRot, entity.baseArmRightRot, 0.05);
        entity.legLeftRot = WIZARD.math.lerp(entity.legLeftRot, entity.baseLegLeftRot, 0.05);
        entity.legRightRot = WIZARD.math.lerp(entity.legRightRot, entity.baseLegRightRot, 0.05);
    }
};
var entityPlayer = function(params){
    this.x = params.x;
    this.y = params.y;

    this.bodyStyle = 0;
    this.headStyle = 0;
    this.armStyle = 0;
    this.legStyle = 0;

    this.speed = 0.5;

    this.baseBodyRot = 0;
    this.baseHeadRot = 0;
    this.baseArmLeftRot = 0;
    this.baseArmRightRot = -50;
    this.baseLegLeftRot = 0;
    this.baseLegRightRot = 0;

    this.bodyRot = this.baseBodyRot;
    this.headRot = this.baseHeadRot;
    this.armLeftRot = this.baseArmLeftRot;
    this.armRightRot = this.baseArmRightRot;
    this.legLeftRot = this.baseLegLeftRot;
    this.legRightRot = this.baseLegRightRot;

    this.createRandomAppearance = function(){
        this.bodyStyle = Math.floor(WIZARD.math.randomBetween(0, 2));
        this.headStyle = Math.floor(WIZARD.math.randomBetween(0, 2));
        this.armStyle = Math.floor(WIZARD.math.randomBetween(0, 2));
        this.legStyle = Math.floor(WIZARD.math.randomBetween(0, 2));
    };

    this.createRandomAppearance();

    this.update = function(wiz){
        animations.hello(this);

        var left = WIZARD.input.keyPressed(WIZARD.keys.LEFT) || WIZARD.input.gamepadPressed(0, WIZARD.gamepad.LEFT);
        var right = WIZARD.input.keyPressed(WIZARD.keys.RIGHT) || WIZARD.input.gamepadPressed(0, WIZARD.gamepad.RIGHT);
        var up = WIZARD.input.keyPressed(WIZARD.keys.UP) || WIZARD.input.gamepadPressed(0, WIZARD.gamepad.UP);
        var down = WIZARD.input.keyPressed(WIZARD.keys.DOWN) || WIZARD.input.gamepadPressed(0, WIZARD.gamepad.DOWN);

        var space = WIZARD.input.keyJustPressed(WIZARD.keys.SPACEBAR) || WIZARD.input.gamepadJustPressed(0, WIZARD.gamepad.BUTTON_2);

        if(space){
            this.createRandomAppearance();
        }

        var moving = false;

        if(left){
            moving = true;
            this.x -= this.speed;
        }else if(right){
            moving = true;
            this.x += this.speed;
        }

        if(up){
            moving = true;
            this.y -= this.speed;
        }else if(down){
            moving = true;
            this.y += this.speed;
        }

        if(moving) animations.walk(this);
        else{
           animations.stopWalk(this);
        }

    };

    this.render = function(wiz){
        wiz.drawImageRot("body", this.x, this.y, this.bodyRot, 0.5, 0.5, this.bodyStyle, 0);
        wiz.drawImageRot("head", this.x - 1, this.y - 17, this.bodyRot + this.headRot, 0.5, 1, this.headStyle, 0);
        wiz.drawImageRot("arm", this.x - 12, this.y - 14, this.bodyRot + this.armLeftRot, 1, 0.5, this.armStyle, 0);
        wiz.drawImageRot("leg", this.x - 11, this.y + 14, this.bodyRot +  this.legLeftRot, 0.5, 0, this.legStyle, 0);

        wiz.drawImageRot("arm", this.x + 12, this.y - 14, this.bodyRot - this.armRightRot, 1, 0.5, this.armStyle, 0, true);
        wiz.drawImageRot("leg", this.x + 11, this.y + 14, this.bodyRot -  this.legRightRot, 0.5, 0, this.legStyle, 0, true);
    }
};

var testRoom = {
    entities: [],
    onEnter: function(wiz){
        WIZARD.entity.instantiate("player", {x: 100, y: 100});
    },
    update: function(wiz){
        WIZARD.scene.updateEntities(this, wiz);
    },
    render: function(wiz){
        wiz.clear("#cc4400");
        WIZARD.scene.renderEntitiesAndLayers(this, wiz);
    },
    onExit: function(wiz){
    }
};


wizard({
    fillScreen: true,
    scale: 2,
    pixelArt: true,
    create: function(){
        this.loadImages("arm.png", "body.png", "head.png", "leg.png");

        WIZARD.spritesheet.create("arm", 24, 14);
        WIZARD.spritesheet.create("body", 40, 39);
        WIZARD.spritesheet.create("head", 48, 35);
        WIZARD.spritesheet.create("leg", 14, 18);

        WIZARD.scene.create("testRoom", testRoom);

        WIZARD.entity.create("player", entityPlayer);

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
