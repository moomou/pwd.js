(function($) {
    var pwdBtn = $('<button>', {'id': 'pwdBtn', 'class': 'btn', 'html': 'pwd'});

    var pwdPad = (function() { //private
        //dom
        var pad = $('<div />', {'class': 'pwdPad'});
        pad.html('\
            <div style="" class="pwd_xBtn"><img src="http://progressivedentalnw.com/wp-content/themes/progressive/images/popup-closeButton.png"></img></div> \
            <br>\
            <div class="pwd_androidPad"> \
            <ul class="pwd_row"> \
            <li class="pwd_circle"></li> \
            <li class="pwd_circle"></li> \
            <li class="pwd_circle"></li> \
            </ul><br> \
            <ul class="pwd_row"> \
            <li class="pwd_circle"></li> \
            <li class="pwd_circle"></li> \
            <li class="pwd_circle"></li> \
            </ul><br> \
            <ul class="pwd_row"> \
            <li class="pwd_circle"></li> \
            <li class="pwd_circle"></li> \
            <li class="pwd_circle"></li> \
            </ul> \
            </div> \
            <div class="break"></div>');

        //configs
        var initialized = false,
            timeoutPeriod = 850,
            counter = 0,
            secretPattern = [];

        //modify the pad look
        var initializePad = function(options) {
            if (options['closeBtnState'] === 'off')  {
                pad.find('.pwd_xBtn').css('display', 'none');
            }
        };

        var populatePadValue = function(options) {
            pwdCircles = $('.pwd_circle');

            for (var ind = 0; ind < pwdCircles.length; ind++) {
                $(pwdCircles[ind]).data('value',ind);
                $(pwdCircles[ind]).data('activated',false);
            }
        };

        var attachPadEvents = function(options) {
            $('.pwd_circle').hover(function(event) {
                var circle = $(event.target); 

                if (circle.data('activated')) {
                    return;
                }

                var curCounter = ++counter;

                circle.data('activated', true);
                secretPattern.push(circle.data('value'));

                //animation code
                circle.animate({opacity: "-=0.35",
                    }, timeoutPeriod, function() {

                    //onComplete
                    setTimeout(function() {
                        circle.css('opacity', '1.0');
                        circle.data('activated', false);

                        console.log(counter);
                        console.log('prev: '+curCounter.toString());

                        if (counter == curCounter) {
                            //appending the password to input field
                            options['dom'].val(secretPattern.join().replace(/,/g,''));
                            secretPattern = [];
                        }

                    }, timeoutPeriod+150);
                });
            });

            $('.pwd_xBtn').click(function(event) {
                pad.slideToggle(function() {
                    $('#pwdBtn').toggle();
                });
            });

            $('#pwdBtn').click(function(event) {
                event.preventDefault();
                pad.slideToggle();
                $(this).toggle();
            });
        };

        //public
        return {
            initPad: function(options) {
                var $this = options['dom'];

                //add the DOM
                if (!$this) {
                    console.log('options["dom"] is not defined');
                    return;
                }

                //add DOM
                $this.after(pad);
                $this.after(pwdBtn);
                $this.after($('<div>', {'class':'break'}));

                //modification
                initializePad(options);
                populatePadValue(options);
                attachPadEvents(options);

                initialized = true;
            }
        };
    })();

    var methods = {
        init: function(options) {
            var settings = $.extend({
                'closeBtnState': 'on',
                'padStyle': 'default',
                'values': undefined,
                'pwdBtn': undefined,
                'dom': $(this)
            }, options);

            pwdPad.initPad(settings);
        },
        show: function() {
        },
        hide: function() {
        }
    };

    $.fn.pwd = function(method) {
        if (methods[method]) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if (typeof method === 'object' || !method) {
            methods.init.apply(this, arguments);
        }
        else {
            $.error('Method '+method + ' does not exist on jQuery');
        }
    };

})(jQuery);
