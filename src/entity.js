var animations = {
    a: 0,
    b: 0,
    _update: function(){
        this.a += 0.04;
    },
    hello: function(entity){
        entity.armLeftRot += 4 + Math.sin(this.a);
    },
    walk: function(entity){
        entity.bodyRot += Math.sin(this.a) / 10;
        entity.armLeftRot += Math.sin(this.a) / 4;
        entity.armRightRot += Math.sin(this.a) / 4;
        entity.legLeftRot += Math.sin(this.a) / 2;
        entity.legRightRot += Math.cos(this.a) / 2;
        entity.headRot += Math.cos(this.a) / 5;
    },
    stopWalk: function(entity){
        // entity.armRightRot = WIZARD.math.lerp(entity.armRightRot, entity.baseArmRightRot, 0.05);
        // entity.legLeftRot = WIZARD.math.lerp(entity.legLeftRot, entity.baseLegLeftRot, 0.05);
        // entity.legRightRot = WIZARD.math.lerp(entity.legRightRot, entity.baseLegRightRot, 0.05);
    }
};
var entityPlayer = function(params){
    this.x = params.x;
    this.y = params.y;
    this.controlled = params.controlled;

    this.solid = WIZARD.physics.createAABB(this.x, this.y, 40, 20);

    this.bodyStyle = 0;
    this.headStyle = 0;
    this.armStyle = 0;
    this.legStyle = 0;

    this.speed = 0.5;

    this.baseBodyRot = 0;
    this.baseHeadRot = 0;
    this.baseArmLeftRot = -50;
    this.baseArmRightRot = -50;
    this.baseLegLeftRot = 0;
    this.baseLegRightRot = 0;

    this.bodyRot = this.baseBodyRot;
    this.headRot = this.baseHeadRot;
    this.armLeftRot = this.baseArmLeftRot;
    this.armRightRot = this.baseArmRightRot;
    this.legLeftRot = this.baseLegLeftRot;
    this.legRightRot = this.baseLegRightRot;

    var left, right, up, down, attack, interact;
    this.salute = false;


    this.createRandomAppearance = function(){
        this.bodyStyle = Math.floor(WIZARD.math.randomBetween(0, 2));
        this.headStyle = Math.floor(WIZARD.math.randomBetween(0, 2));
        this.armStyle = Math.floor(WIZARD.math.randomBetween(0, 2));
        this.legStyle = Math.floor(WIZARD.math.randomBetween(0, 2));
    };

    this.createRandomAppearance();

    this.collides = function(){
        for(var i = 0; i < WIZARD.scene.current.entities.length; i++){
            var e = WIZARD.scene.current.entities[i];
            if(e.name == this.name && e.controlled) continue;
            if(WIZARD.physics.intersects(this.solid, e.solid)){
                return true;
            }
        }
        return false;
    };

    this.interact = function(){
        if(this.controlled){
            for(var i = 0; i < WIZARD.scene.current.entities.length; i++){
                var e = WIZARD.scene.current.entities[i];
                if(e.name == this.name && !e.controlled) {
                    var distance = WIZARD.math.distance(this, e);
                    if(distance < 180){
                        e.interact();
                    }
                }
            }
        }else{
            var _this = this;
            var delay = WIZARD.math.randomBetween(200, 400);
            var timeSaluting = WIZARD.math.randomBetween(800, 1200);
            WIZARD.time.createTimer("saluteDelay", delay, function(){
                _this.salute = true;
                WIZARD.time.createTimer("saluteTime", timeSaluting, function(){
                    _this.salute = false;
                }, 1, true);
            }, 1, true);
        }
    };

    this.resetRotations = function(){
        this.bodyRot = WIZARD.math.lerp(this.bodyRot, this.baseBodyRot, 0.05);
        this.headRot = WIZARD.math.lerp(this.headRot, this.baseHeadRot, 0.05);
        this.armLeftRot = WIZARD.math.lerp(this.armLeftRot, this.baseArmLeftRot, 0.05);
        this.armRightRot = WIZARD.math.lerp(this.armRightRot, this.baseArmRightRot, 0.05);
        this.legLeftRot = WIZARD.math.lerp(this.legLeftRot, this.baseLegLeftRot, 0.05);
        this.legRightRot = WIZARD.math.lerp(this.legRightRot, this.baseLegRightRot, 0.05);
    };

    this.update = function(wiz){
        this.resetRotations();
        var moving = false;

        if(this.salute){
            animations.hello(this);
        }

        if(this.controlled) {

            left = WIZARD.input.keyPressed(WIZARD.keys.LEFT) || WIZARD.input.gamepadPressed(0, WIZARD.gamepad.LEFT);
            right = WIZARD.input.keyPressed(WIZARD.keys.RIGHT) || WIZARD.input.gamepadPressed(0, WIZARD.gamepad.RIGHT);
            up = WIZARD.input.keyPressed(WIZARD.keys.UP) || WIZARD.input.gamepadPressed(0, WIZARD.gamepad.UP);
            down = WIZARD.input.keyPressed(WIZARD.keys.DOWN) || WIZARD.input.gamepadPressed(0, WIZARD.gamepad.DOWN);
            attack = WIZARD.input.keyJustPressed(WIZARD.keys.Z) || WIZARD.input.gamepadJustPressed(0, WIZARD.gamepad.BUTTON_1);
            this.salute = WIZARD.input.keyPressed(WIZARD.keys.C) || WIZARD.input.gamepadPressed(0, WIZARD.gamepad.BUTTON_0);

            var saluteJustPressed = WIZARD.input.keyJustPressed(WIZARD.keys.C) || WIZARD.input.gamepadJustPressed(0, WIZARD.gamepad.BUTTON_0);

            interact = WIZARD.input.keyJustPressed(WIZARD.keys.SPACEBAR) || WIZARD.input.gamepadJustPressed(0, WIZARD.gamepad.BUTTON_2);

            if(saluteJustPressed){
                this.interact();
            }

            if (interact) {
                this.createRandomAppearance();
                // for (var i = 0; i < GLITCH.scenes.current.entities.length; i++) {
                //     var e = GLITCH.scenes.current.entities[i];
                //     if (e.name == "Player" || e.name == "Solid") continue;
                //     if (WIZARD.physics.intersects(this.interactBody, e.body.body)) {
                //         if (e.interact != null) {
                //             e.interact();
                //         }
                //         break;
                //     }
                // }
            }


            if (left) {
                moving = true;
                this.x -= this.speed;
                if (this.collides()) this.x += this.speed * 2;
            } else if (right) {
                moving = true;
                this.x += this.speed;
                if (this.collides()) this.x -= this.speed * 2;
            }

            if (up) {
                moving = true;
                this.y -= this.speed;
                if (this.collides())  this.y += this.speed * 2;
            } else if (down) {
                moving = true;
                this.y += this.speed;
                if (this.collides()) this.y -= this.speed * 2;
            }

            var xx = WIZARD.math.lerp(WIZARD.camera.x, this.x - 3.5 - wiz.width / 2, 1);
            var yy = WIZARD.math.lerp(WIZARD.camera.y, this.y - wiz.height / 2 - 12, 1);

            WIZARD.camera.setPosition(xx, yy);
        }

        if (moving) animations.walk(this);
        else {
            animations.stopWalk(this);
        }

        this.solid.x = this.x - 20;
        this.solid.y = this.y + 12;

    };

    this.render = function(wiz){
        wiz.drawSprite("tiles", this.x - 20, this.y + 12, 8, 9);
        wiz.drawImageRot("leg", this.x - 11, this.y + 14, this.bodyRot +  this.legLeftRot, 0.5, 0, this.legStyle, 0);
        wiz.drawImageRot("leg", this.x + 11, this.y + 14, this.bodyRot -  this.legRightRot, 0.5, 0, this.legStyle, 0, true);
        wiz.drawImageRot("body", this.x, this.y, this.bodyRot, 0.5, 0.5, this.bodyStyle, 0);

        wiz.drawImageRot("head", this.x - 1, this.y - 19, this.bodyRot + this.headRot, 0.5, 1, this.headStyle, 0);
        wiz.drawImageRot("arm", this.x - 12, this.y - 14, this.bodyRot + this.armLeftRot, 1, 0.5, this.armStyle, 0);
        wiz.drawImageRot("arm", this.x + 12, this.y - 14, this.bodyRot - this.armRightRot, 1, 0.5, this.armStyle, 0, true);


        if(DEBUG)wiz.drawAABB(this.solid, "red");
    }
};

var tileEntity = function(params){
    this.x = params.x;
    this.y = params.y;
    this.xx = params.xx;
    this.yy = params.yy;

    this.update = function(wiz){
    };

    this.render = function(wiz){
        wiz.drawSprite("tiles", this.x, this.y, this.xx, this.yy);
    }
};

var solidEntity = function(params){
    this.solid = WIZARD.physics.createAABB(params.x, params.y, params.w, params.h);

    this.update = function(wiz){
    };
    this.render = function(wiz){
        if(DEBUG)wiz.drawAABB(this.solid, "red");
    }
};