define(['lodash'],
    function(_) {
        function KeyCoder(listenerWindow) {
            this.keys = [];
            var self = this;

            this.listeners = [];
            this.listenerWindow = listenerWindow;

            this.keyEventsCallbacks = {
                keydown: function(event) {
                    self.keys[event.keyCode] = true;

                    _.each(self.listeners, function(el) {
                        if (el.event === "keydown" && el.key === event.keyCode)
                            el.handler(event);
                    });
                },
                keyup: function(event) {
                    self.keys[event.keyCode] = false;

                    _.each(self.listeners, function(el) {
                        if (el.event === "keyup" && el.keyCode === event.keyCode) {
                            el.handler(event);
                        }
                    });
                },
                keypress: function(event) {
                    _.each(self.listeners, function(el) {
                        if (el.event === "keypress" && el.keyCode === event.keyCode) {
                            el.handler(event);
                        }
                    });
                }
            };

            _.each(_.keys(this.keyEventsCallbacks), function(keyEvent) {
                self.listenerWindow.on(keyEvent, self.keyEventsCallbacks[keyEvent]);
            });



            this.getKeys = function() {
                return {
                    keys: this.keys
                };
            };

            this.addEventListener = function (event, keyCode, handler) {
                this.listeners.push({
                    event: event,
                    keyCode: keyCode,
                    handler: handler
                });
            };

            this.removeAllListeners = function() {
                var self = this;

                this.listeners = [];
                this.keys = [];
            };

            this.removeAllEvents = function() {
                this.listenerWindow.off('keydown');
                this.listenerWindow.off('keypress');
                this.listenerWindow.off('keyup');
            };
        }

        KeyCoder.KEY = {
            SHIFT: 16,
            CTRL: 17,
            SPACE: 32,
            LEFT_ARROW: 37,
            UP_ARROW: 38,
            RIGHT_ARROW: 39,
            DOWN_ARROW: 40,
            DEL: 46,
            ONE: 49,
            TWO: 50,
            THREE: 51,
            PLUS: 107,
            MINUS: 109,
            A: 65,
            B: 66,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            I: 73,
            K: 75,
            M: 77,
            O: 79,
            P: 80,
            Q: 81,
            S: 83,
            V: 86,
            W: 87,
            X: 88,
            Z: 90
        };

        return KeyCoder;
    });