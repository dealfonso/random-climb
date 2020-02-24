function bind_buttons(update_interface) {
    $('#showseconds').on('change', function(e) {
        setCookie('showseconds', $('#showseconds').prop('checked'), 365);
    })

    $('#start').on('click', function(e) {
        e.preventDefault();
        r.start();
        noSleep.enable();
        $('#bigstatetext').hide();
        update_interface();
    })
    $('#stop').on('click', function(e) {
        e.preventDefault();
        r.clear();
        noSleep.disable();
        update_interface();
    })
    $('#repeat').on('click', function(e) {
        e.preventDefault();
        r.restart();
        noSleep.enable();
        update_interface();
    });
    $('#pause').on('click', function(e) {
        e.preventDefault();
        r.pause();
        noSleep.disable();
        $('#bigstatetext').show();
        setTimeout(function() { $('#bigstatetext').fadeOut(); }, 1000);
        update_interface();
    });
    $('#step').on('click', function(e) {
        e.preventDefault();
        r.step();
        $('#bigstatetext').hide();
        update_interface();
    });
    $('#mute').on('click', function(e) {
        e.preventDefault();
        sound = ! sound;
        setCookie('sound', sound, 365);
        update_interface();
    })

    $('#bigbutton').on('click', function(e) {
        e.preventDefault();
        if (r._running) {
            r.pause();
            noSleep.disable();
            $('#bigstatetext').show();
            setTimeout(function() { $('#bigstatetext').fadeOut(); }, 1000);
        } else {
            r.step();
            $('#bigstatetext').hide();
        }
        update_interface();
    })

    $('#segundos').on('change', function(e) {
        setCookie('segundos', $('#segundos').val(), 365);
    })
}

function update_interface() {
    if (r._running) {
        $('#step').addClass('disabled');
        $('#start').addClass('disabled');
        $('#pause').removeClass('disabled');
        $('.statetext').text('funcionando');
    }
    else {
        $('#step').removeClass('disabled');
        $('#start').removeClass('disabled');
        $('#pause').addClass('disabled');
        $('.statetext').text('pausado');
    }
    if (r._movimientos.length > 0) {
        $('#stop').removeClass('disabled');
    } else {
        $('#stop').addClass('disabled');
    }

    if (r._i_movimiento > 0) {
        $('#repeat').removeClass('disabled');
    } else {
        $('#repeat').addClass('disabled');
    }

    $('#movs_actual').text(Math.max(r._i_movimiento, 1));
    $('#movs_maximo').text(r._movimientos.length);

    if (r._i_movimiento >= r._movimientos.length) {
        $('#movs_actual').addClass('mayor');
    } else
        $('#movs_actual').removeClass('mayor');

    if (sound)
        $('#mute i').addClass('fa-volume-up').removeClass('fa-volume-mute');
    else
        $('#mute i').addClass('fa-volume-mute').removeClass('fa-volume-up');
}

let values = [
    { img: 'images/presas/amarillo-romo.png', txt: 'amarillo romo', sound: 'sound/amarilloromo.mp3' },
    { img: 'images/presas/amarilla.png', txt: 'amarilla', sound: 'sound/amarilla.mp3' },
    { img: 'images/presas/azul-p.png', txt: 'azul', sound: 'sound/azul.mp3' },
    { img: 'images/presas/azul.png', txt: 'azul', sound: 'sound/azul.mp3' },
    { img: 'images/presas/verde.png', txt: 'verde', sound: 'sound/verde.mp3' },
    { img: 'images/presas/morada-clara.png', txt: 'morada', sound: 'sound/morada.mp3' },
    { img: 'images/presas/morada-g.png', txt: 'morada', sound: 'sound/morada.mp3' },
    { img: 'images/presas/naranja.png', txt: 'naranja', sound: 'sound/naranja.mp3' },
];

let values2 = [
    { txt: 'mano derecha', sound: 'sound/manoderecha.mp3' },
    { txt: 'mano izquierda', sound: 'sound/manoizquierda.mp3'  },
    { txt: 'pie derecho', sound: 'sound/piederecho.mp3'  },
    { txt: 'pie izquierdo', sound: 'sound/pieizquierdo.mp3'  }
];

let noSleep = new NoSleep();

let r = null;
let sound = true;

$(function() {
    const urlParams = new URLSearchParams(window.location.search);

    sound = getCookie('sound') === 'true';
    $('#showseconds').prop('checked', getCookie('showseconds') === 'true');
    let segundos = parseInt(getCookie('segundos'))
    if (!isNaN(segundos)) $('#segundos').val(segundos);

    let mode = '1';
    switch (urlParams.get('m')) {
        case '1': mode = 1; break;
        case '2': mode = 2; break;
        case '3': mode = 3; break;
    }

    switch (mode) {
        case 2:
            r = new RandomizeIt('#randomplace', values2, values);
            break;
        case 3:
            r = new RandomizeIt('#randomplace', values, values, values);
            break;
        default:
            r = new RandomizeIt('#randomplace', values);
            break;
    }

    bind_buttons(update_interface);
    update_interface();
})