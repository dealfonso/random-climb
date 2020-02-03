
    function TextIt(selector, text) {
        this.lines = text.split('.').map((x)=>x.trim());
        this.i = 0;
        this.placeholder = $(selector);
        this.placeholder.text('');
        this._duration_base = 500;
        this._duration_word = 250;
        this._duration_fadeout = 1000;
        this._duration_fadeout_now = 0;
        this._duration_fadein = 400;
        this._delay_start = 0;
        this._on_end = null;
    }

    TextIt.prototype.on = function(on, func) {
        if (on === 'end') this._on_end = func;
    }

    TextIt.prototype.start = function() {
        this.i = 0;
        this.placeholder.text('').show();
        this._duration_fadeout_now = 0;
        setTimeout(function() { 
            this.next() 
        }.bind(this), this._delay_start);        
    }

    TextIt.prototype.nextchar = function() {
        let current = this.lines[this.i];
    }

    TextIt.prototype.next = function() {
        if (this.i < this.lines.length) {
            let current = this.lines[this.i++];
            if (current === '')
                // Just wait
                setTimeout(function() { this.next() }.bind(this), this._duration_fadeout_now);
            else {
                // Fade out current text and then show the next
                this.placeholder.fadeOut(this._duration_fadeout_now, function() {
                    this.placeholder.text(current).fadeIn('fast');
                    let duration = this._duration_base + current.split(' ').length * this._duration_word;
                    setTimeout(function() { this.next() }.bind(this), duration);
                }.bind(this));
            }
        } else {
            if (this._on_end !== null)
                this._on_end();
        }

        // This trick is to make functions easier to start, take into account the delay, etc.
        this._duration_fadeout_now = this._duration_fadeout;
    }