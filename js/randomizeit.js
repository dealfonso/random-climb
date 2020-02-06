function RandomizeIt(selector, objects) {
    this._timers = {
        duration_fadeout: 1000,
        duration_fadein: 400,
    };

    this.placeholder = $(selector).html('');

    this._data = [];
    this._movimientos = [];
    this._i_movimiento = 0;
    this._objects = [];

    for (i_serie = 0; i_serie < arguments.length - 1; i_serie++)
        this._data[i_serie] = arguments[i_serie + 1];


    let col_class = "col";
    let col_width = Math.floor(12 / this._data.length);
    if (col_width > 0)
        col_class = `col-sm-${col_width}`;

    let row_wrapper = $('<div class="row h-100 w-100">');
    this._data.forEach(function (serie, i_serie) {
        this._objects[i_serie] = [];
        let id_prefix = `obj_${i_serie}_`;
        let col_wrapper = $(`<div class="${col_class} vert-middle">`);

        serie.forEach(function(obj, i_obj) {
            obj.id = `${id_prefix}${i_obj}`;
            let div_obj = this.createObject(obj);
            this._objects[i_serie][i_obj] = div_obj;
            col_wrapper.append(div_obj);
        }.bind(this));

        col_wrapper.append(this.createObject({id: `placeholder_${i_serie}`, img: 'images/transparent_1024.png'}).addClass('placeholder').show());
        row_wrapper.append(col_wrapper);
    }.bind(this));
    
    this.placeholder.append(row_wrapper);

    this._current = null;     
    this._running = false;
    this._movimientos = [];
    this.sounds = [];
}    

RandomizeIt.prototype.appendSound = function(id) {
    this.sounds.push(id);
}

RandomizeIt.prototype.nextSound = function () {
    if (this.sounds.length > 0) {
        let s_id = this.sounds.shift();
        let src = this._data[s_id[0]][s_id[1]].sound || null;
        if (sound && (src !== null)) {
            let audioplayer = $('#audioplayer')[0];
            audioplayer.pause();
            $('#audio_mp3').attr('src', src);
            audioplayer.load()
            audioplayer.play();
        } else
            this.nextSound();
    }
}

RandomizeIt.prototype._nextSound = function () {
    if (this.sounds.length > 0) {
        let s_id = this.sounds.shift();
        let a = this._objects[s_id[0]][s_id[1]].find('audio');
        if (sound && (a.length > 0)) {
            $(a[0]).off('ended').on('ended', function() {
                this.nextSound();
            }.bind(this));
            a[0].curretTime=0;
            a[0].play();
        }
        else
            this.nextSound();
    }
}

RandomizeIt.prototype.createObject = function(o) {
    let div = $(`<div class="object w-100" id="${o.id}">`).hide();
    if (o.img !== undefined) {
        let span = $('<span class="exgallery">')
            .css('background-image', "url('" + o.img + "')")
            .append(
                $('<img style="border: 0px" src="images/transparent_1024.png">')
            );
        div.append(span);
    }
    if (o.txt !== undefined)
        div.append($('<h2>').text(o.txt));
    if (o.sound !== undefined)
        div.append($('<audio preload="auto">').append(`<source src="${o.sound}">`))

    return div;
}

RandomizeIt.prototype.setTimeout = function(fnc = null, timeout = null) {
    if (! this._running) {
        $('.seconds').text('');
        return;
    }
    if (timeout !== null) {
        this._timer = timeout;
        this._t0 = new Date().getTime();
        this._fnc = fnc;
    }
    let elapsed = new Date().getTime() - this._t0;

    if ($('#showseconds').prop('checked')) 
        $('.seconds').text(Math.ceil((this._timer - elapsed) / 1000));
    else
        $('.seconds').text('');
    if (elapsed < this._timer) {
        setTimeout(function() {
            this.setTimeout();
        }.bind(this), Math.min(this._timer - elapsed, 1000));
    } else {
        $('.seconds').text('');
        this._fnc();
    }
}

RandomizeIt.prototype.pause = function() {
    this._running = false;
}

RandomizeIt.prototype.clear = function() {
    this._i_movimiento = 0;
    this._movimientos = [];
}

RandomizeIt.prototype.start = function() {
    // this._objects.forEach(function (o) { o.hide(); });
    $('.object').hide();
    this.sounds = [];
    this._running = true;
    this.setTimeout(function() { 
        this.next() 
    }.bind(this), 'fast');        
}

RandomizeIt.prototype.random = function() {
    if (this._i_movimiento < this._movimientos.length) {
        let cur = this._i_movimiento;
        this._i_movimiento++;
        return this._movimientos[cur];
    } else {
        let current = [];
        current = this._data.map((s) => Math.floor(Math.random() * s.length));
        this._movimientos.push(current);
        this._i_movimiento++;
        return current;
    }
}

RandomizeIt.prototype.restart = function() {
    this._i_movimiento = 0;
}

RandomizeIt.prototype.step = function() {
    this.sounds = [];
    this.show_next(false);
}

RandomizeIt.prototype.hide_current = function(callback) {
    // Finalize any animation in the objects
    $('.object').finish();

    this._current.forEach(function(i_object, i_serie) {
        if (i_serie == 0)
            this._objects[i_serie][i_object].show().fadeOut(this._timers.duration_fadeout, function() {
                $('.placeholder').show();
                callback();
            });
        else
            this._objects[i_serie][i_object].show().fadeOut(this._timers.duration_fadeout);
    }.bind(this));
}

RandomizeIt.prototype.show_next = function(program = false) {
    let current = this.random();

    // Finalize any animation and hide all the objects, because we are showing the new ones
    $('.object').finish().hide();
    $('.placeholder').hide();
    current.forEach(function(i_object, i_serie) {
        this.appendSound([i_serie, i_object])
        if (i_serie == 0) {
            this._objects[i_serie][i_object].finish().hide().fadeIn(this._timers.duration_fadein, function() {
                this._current = current;            
                update_interface();
                this.nextSound();
                if (program) {
                    this.setTimeout(function() { 
                        this.next() 
                    }.bind(this), $('#segundos').val() * 1000);
                }        
            }.bind(this));

        } else {
            this._objects[i_serie][i_object].finish().hide().fadeIn(this._timers.duration_fadein);
        }

    }.bind(this));
}

RandomizeIt.prototype.next = function() {
    if (this._running === false) return;
    
    if (this._current === null) {
        this.show_next(true);
    } else {
        this.hide_current(function() { 
            this._current = null;
            this.next();
         }.bind(this));
    }
}

RandomizeIt.prototype.stop = function() {
    this._running = false;
    this._current = null;
}

