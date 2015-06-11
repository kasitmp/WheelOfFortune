var Wheel = (function() {
    var _wheel = {},
        _game = {},
        _fieldsConfig = {},
        _fields = [],
        _colors = ['#FFB300', '#803E75', '#FF6800', '#A6BDD7', '#C10020', '#CEA262'],
        _separationColor = '#817066',
        _activeFieldIndex = 0,
        _nextFieldReady = true,
        _end = false,
        _degreePerField,
        _wheelBmp,
        _wheelSprite,
        _clackSound,
        _cheerSound,
        _acceleration,
        _text;

    var preload = function() {
        _game.load.image('arrow', 'assets/arrow.png');
        _game.load.audio('clack', 'assets/clack.mp3');
        _game.load.audio('cheer', 'assets/cheer.mp3');
        calculateFields();
        drawWheelBitmap();
    };

    var create = function() {
        _game.stage.backgroundColor = '#cccccc';
        _clackSound = _game.add.sound('clack');
        _cheerSound = _game.add.sound('cheer');
        _text = _game.add.text(100, 500, _fields[_activeFieldIndex].text, {fill: _fields[_activeFieldIndex].color});
        _text.x = 250 - _text.width * 0.5;
        _game.physics.startSystem(Phaser.Physics.P2JS);
        _wheelSprite = _game.add.sprite(250, 250, _wheelBmp);
        _game.add.sprite(440, 230, 'arrow');
        _game.physics.p2.enable(_wheelSprite);
        _wheelSprite.body.type = Phaser.Physics.P2.Body.KINEMATIC;
        _wheelSprite.body.collideWorldBounds = false;
        _wheelSprite.body.rotateLeft(_acceleration);
    };

    var update = function() {
        var actField = _fields[_activeFieldIndex];
        var nextIndex = (_activeFieldIndex + 1) % _fields.length;
        var nextField = _fields[nextIndex];
        var degree = Math.round(_wheelSprite.body.rotation * 180 / Math.PI * -1 % 360);
        if (!_nextFieldReady && degree < actField.end) {
            _nextFieldReady = true;
        }
        if (_nextFieldReady && degree > nextField.start) {
            _activeFieldIndex = nextIndex;
            _clackSound.play();
            updateText();
            _nextFieldReady = false;
        }

        if (_wheelSprite.body.angularVelocity > -0.1 && !_end) {
            _end = true;
            _wheelSprite.body.rotateLeft(0);
            _clackSound.stop();
            _cheerSound.play();
            setWinnerText();
        }

    };

    var updateText = function() {
        _text.text = _fields[_activeFieldIndex].text;
        _text.fill = _fields[_activeFieldIndex].color;
        _text.x = 250 - _text.width * 0.5;
    };

    var setWinnerText = function() {
        _text.text = 'WINNER: ' + _fields[_activeFieldIndex].text;
        _text.fill = _fields[_activeFieldIndex].color;
        _text.x = 250 - _text.width * 0.5;
        var winnerText = _game.add.text(100, 550, 'CONGRATULATIONS ' + _fields[_activeFieldIndex].owner, {fill: _fields[_activeFieldIndex].color});
        winnerText.x = 250 - winnerText.width * 0.5;
    };

    var calculateFields = function() {
        var fieldKeys = Object.keys(_fieldsConfig);
        var fieldsCount = fieldKeys.length;
        _degreePerField = 360 / fieldsCount;
        var useSeparationColor = _colors.length % fieldsCount === 1;
        fieldKeys.forEach(function (value, index) {
            var field = {
                start: index * _degreePerField - (_degreePerField / 2),
                end: index * _degreePerField + (_degreePerField / 2),
                owner: value,
                text: _fieldsConfig[value]
            };
            if (field.start < 0) {
                field.start = 360 + field.start;
            }
            if (useSeparationColor && index + 1  === fieldsCount) {
                field.color = _separationColor;
            } else {
                field.color = _colors[index];
            }

            _fields.push(field);
        });
    };

    var drawWheelBitmap = function() {
        _wheelBmp = _game.add.bitmapData(400, 400);
        _wheelBmp.ctx.font = "20px serif";
        var pizzaStart = _fields[0].start;
        var pizzaEnd = _fields[0].end;
        _fields.forEach(function (value) {
            _wheelBmp.ctx.fillStyle = value.color;
            _wheelBmp.ctx.beginPath();
            _wheelBmp.ctx.moveTo(200, 200);
            _wheelBmp.ctx.arc(200, 200, 200, pizzaStart * Math.PI / 180, pizzaEnd * Math.PI / 180);
            _wheelBmp.ctx.lineTo(200, 200);
            _wheelBmp.ctx.closePath();
            _wheelBmp.ctx.fill();
            _wheelBmp.ctx.fillStyle = '#ffffff';
            _wheelBmp.ctx.fillText(value.text, 230, 205, 170);
            _wheelBmp.ctx.translate(200, 200);
            _wheelBmp.ctx.rotate(_degreePerField * Math.PI / 180);
            _wheelBmp.ctx.translate(-200, -200);
        });
    };

    _wheel.setAcceleration = function(acceleration) {
        _acceleration = acceleration;
    };

    _wheel.start = function() {
        _game = new Phaser.Game(500, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});
    };

    return function(fieldsConfig) {
        _fieldsConfig = fieldsConfig;
        return _wheel;
    };
}());
