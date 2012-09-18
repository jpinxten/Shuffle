// IMPORTANT!
// If you're already using Modernizr, delete it from this file. If you don't know what Modernizr is, leave it :)

/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms-csstransforms3d-csstransitions-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function y(a){i.cssText=a}function z(a,b){return y(l.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransforms=function(){return!!E("transform")},p.csstransforms3d=function(){var a=!!E("perspective");return a&&"webkitPerspective"in f.style&&v("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},p.csstransitions=function(){return E("transition")};for(var F in p)x(p,F)&&(u=F.toLowerCase(),e[u]=p[F](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return C([a])},e.testAllProps=E,e.testStyles=v,e.prefixed=function(a,b,c){return b?E(a,b,c):E(a,"pfx")},e}(this,this.document);

/**
 * jQuery Shuffle Plugin
 * Uses CSS Transforms to filter down a grid of items (degrades to jQuery's animate).
 * Inspired by Isotope http://isotope.metafizzy.co/
 * Use it for whatever you want!
 * @author Glen Cheney (http://glencheney.com)
 * @version 1.5
 * @date 9/17/12
 */
;(function($, Modernizr) {
    "use strict";


    $.fn.sorted = function(options) {
        var opts = $.extend({}, $.fn.sorted.defaults, options),
            arr = this.get();

        // Sort the elements by the opts.by function.
        // If we don't have opts.by, default to DOM order
        if (opts.by !== $.noop && opts.by !== null && opts.by !== undefined) {
            arr.sort(function(a, b) {
                var valA = opts.by($(a));
                var valB = opts.by($(b));
                return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
            });
        }

        if (opts.reverse) {
            arr.reverse();
        }
        return arr;

    };

    $.fn.sorted.defaults = {
        reverse: false,
        by: null
    };

    var Shuffle = function($container, options) {
        var self = this;

        $.extend(self, $.fn.shuffle.options, options, $.fn.shuffle.settings);

        self.$container = $container;
        self.$items = self.$container.children();
        self.$item = self.$items.first();
        self.itemWidth = self.$item.outerWidth();
        self.itemHeight = self.$item.outerHeight();
        self.marginTop = parseInt(self.$item.css('marginTop'), 10);
        self.marginRight = parseInt(self.$item.css('marginRight'), 10);
        self.itemsPerRow = self.getItemsPerRow();
        self.transitionName = self.prefixed('transition'),
        self.transform = self.getPrefixed('transform');

        // Get transitionend event name
        var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd',
            'msTransition'     : 'MSTransitionEnd',
            'transition'       : 'transitionend'
        };
        self.transitionEndName = transEndEventNames[ self.transitionName ];

        // CSS for each item
        self.itemCss = {
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 1
        };

        // Set up css for transitions
        self.$container.css('position', 'relative').get(0).style[self.transitionName] = 'height ' + self.speed + 'ms ' + self.easing;
        self.$items.each(function(index) {
            $(this).css(self.itemCss);
            
            // Set CSS transition for transforms and opacity
            if (self.supported) {
                this.style[self.transitionName] = self.transform + ' ' + self.speed + 'ms ' + self.easing + ', opacity ' + self.speed + 'ms ' + self.easing;
            }

            // Remove margins, we don't need them anymore
            this.style.marginTop = 0;
            this.style.marginRight = 0;
        });
        
        $(window).on('resize.shuffle', function () {
            self.resized();
        });

        // Do it
        self.shuffle(self.key);
    };

    Shuffle.prototype = {

        constructor: Shuffle,

        /**
         * The magic. This is what makes the plugin 'shuffle'
         */
        shuffle : function(category) {
            var self = this;

            if (!category) category = 'all';

            // Hide/show appropriate items
            if (category === 'all') {
                self.$items.removeClass('concealed');
            } else {
                self.$items.removeClass('concealed filtered').each(function() {
                    var keys = $(this).data('groups');
                    if ($.inArray(category, keys) === -1) {
                        $(this).addClass('concealed');
                        return;
                    }
                });
            }
            
            // How many filtered elements?
            self.visibleItems = self.$items.not('.concealed').addClass('filtered').length;

            // Shrink each concealed item
            self.fire('shrink');
            self.shrink();

            // Update transforms on .filtered elements so they will animate to their new positions
            self.fire('filter');
            self.filter();

            // Adjust the height of the container
            self.resizeContainer();
        },

        getItemsPerRow : function() {
            var self = this,
                totalWidth = self.$container.width(),
                num = Math.floor(totalWidth / self.itemWidth);

            // Make sure the items will fit with margins too
            if (num * (self.itemWidth + self.marginRight) - self.marginRight > totalWidth) {
                num -= 1;
            }

            return num;
        },
        
        /**
         * Adjust the height of the grid
         */
        resizeContainer : function() {
            var self = this,
            gridHeight = (Math.ceil(self.visibleItems / self.itemsPerRow) * (self.itemHeight + self.marginTop)) - self.marginTop;
            self.$container.css('height', gridHeight + 'px');
        },

        /**
         * Fire events with .shuffle namespace
         */
        fire : function(name) {
            this.$container.trigger(name + '.shuffle', [this]);
        },
        
        /**
         * Hides the elements that don't match our filter
         */
        shrink : function() {
            var self = this,
                $concealed = self.$container.find('.concealed');

            // Abort if no items
            if ($concealed.length === 0) {
                return;
            }

            self.shrinkTransitionEnded = false;
            $concealed.each(function() {
                var $this = $(this),
                    x = parseInt($this.attr('data-x'), 10),
                    y = parseInt($this.attr('data-y'), 10);

                if (!x) x = 0;
                if (!y) y = 0;

                self.transition({
                    from: 'shrink',
                    $this: $this,
                    x: x,
                    y: y,
                    left: (x + (self.itemWidth / 2)) + 'px',
                    top: (y + (self.itemHeight / 2)) + 'px',
                    scale : 0.001,
                    opacity: 0,
                    height: '0px',
                    width: '0px',
                    callback: self.shrinkEnd
                });
            });
        },


        /**
         * Loops through each item that should be shown
         * Calculates the x and y position and then transitions it
         * @param {array} items - array of items that will be shown/layed out in order in their array.
         *     Because jQuery collection are always ordered in DOM order, we can't pass a jq collection
         * @param {function} complete callback function
         */
        layout: function(items, fn) {
            var self = this,
                y = 0;

            // Abort if no items
            if (items.length === 0) {
                return;
            }
            
            self.layoutTransitionEnded = false;
            $.each(items, function(index) {
                var $this = $(items[index]),
                    x = (index % self.itemsPerRow) * (self.itemWidth + self.marginRight),
                    row = Math.floor(index / self.itemsPerRow);

                if (index % self.itemsPerRow === 0) {
                    y = row * (self.itemHeight + self.marginTop);
                }

                // Save data for shrink
                $this.attr({'data-x' : x, 'data-y' : y});

                self.transition({
                    from: 'layout',
                    $this: $this,
                    x: x,
                    y: y,
                    left: x + 'px',
                    top: y + 'px',
                    scale : 1,
                    opacity: 1,
                    height: self.itemHeight + 'px',
                    width: self.itemWidth + 'px',
                    callback: fn
                });
            });
        },

        /**
         * Grabs the .filtered elements and passes them to layout
         */
        filter : function() {
            var self = this;
            // If we've already sorted the elements, keep them sorted
            if (self.keepSorted && self.lastSort) {
                self.sort(self.lastSort, true);
            } else {
                var items = self.$items.filter('.filtered').get();
                self.layout(items, self.filterEnd);
            }
        },

        /**
         * Gets the .filtered elements, sorts them, and passes them to layout
         *
         * @param {object} opts the options object for the sorted plugin
         * @param {bool} [fromFilter] was called from Shuffle.filter method.
         */
        sort: function(opts, fromFilter) {
            var self = this,
                items = self.$items.filter('.filtered').sorted(opts);
            self.layout(items, function() {
                if (fromFilter) {
                    self.filterEnd();
                }
                self.sortEnd();
            });
            self.lastSort = opts;
        },
        
        /**
         * Uses Modernizr's prefixed() to get the correct vendor property name and sets it using jQuery .css()
         *
         * @param {jq} $el the jquery object to set the css on
         * @param {string} prop the property to set (e.g. 'transition')
         * @param {string} value the value of the prop
         */
        setPrefixedCss : function($el, prop, value) {
            $el.css(this.prefixed(prop), value);
        },


        /**
         * Returns things like -webkit-transition or -moz-box-sizing
         *
         * @param {string} property to be prefixed.
         * @return {string} the prefixed css property
         */
        getPrefixed : function(prop) {
            var styleName = this.prefixed(prop);
            return styleName ? styleName.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-') : styleName;
        },
        
        /**
         * Transitions an item in the grid
         *
         * @param {object}  opts options
         * @param {jQuery}  opts.$this jQuery object representing the current item
         * @param {int}     opts.x translate's x
         * @param {int}     opts.y translate's y
         * @param {String}  opts.left left position (used when no transforms available)
         * @param {String}  opts.top top position (used when no transforms available)
         * @param {float}   opts.scale amount to scale the item
         * @param {float}   opts.opacity opacity of the item
         * @param {String}  opts.height the height of the item (used when no transforms available)
         * @param {String}  opts.width the width of the item (used when no transforms available)
         * @param {function} opts.callback complete function for the animation
         */
        transition: function(opts) {
            var self = this,
            transform,

            // Only fire callback once per collection's transition
            complete = function() {
                if (!self.layoutTransitionEnded && opts.from === 'layout') {
                    opts.callback.call(self);
                    self.layoutTransitionEnded = true;
                } else if (!self.shrinkTransitionEnded && opts.from === 'shrink') {
                    opts.callback.call(self);
                    self.shrinkTransitionEnded = true;
                }
            };


            // Use CSS Transforms if we have them
            if (self.supported) {
                if (self.threeD) {
                    transform = 'translate3d(' + opts.x + 'px, ' + opts.y + 'px, 0) scale3d(' + opts.scale + ', ' + opts.scale + ', 1)';
                } else {
                    transform = 'translate(' + opts.x + 'px, ' + opts.y + 'px) scale(' + opts.scale + ', ' + opts.scale + ')';
                }

                // Update css to trigger CSS Animation
                opts.$this.css('opacity' , opts.opacity);
                self.setPrefixedCss(opts.$this, 'transform', transform);
                opts.$this.one(self.transitionEndName, complete);
            } else {
                // Use jQuery to animate left/top
                opts.$this.animate({
                    left: opts.left,
                    top: opts.top,
                    opacity: opts.opacity,
                    height: opts.height,
                    width: opts.width
                }, self.speed, 'swing', complete);
            }
        },

        /**
         * On window resize, recalculate the width, height, and items per row.
         */
        resized: function() {
            var self = this;
            self.itemWidth = self.$item.outerWidth();
            self.itemHeight = self.$item.outerHeight();
            self.itemsPerRow = self.getItemsPerRow();
            if (self.itemsPerRow > 4) {
                console.log('wtf');
            }
            self.filter();
            self.resizeContainer();
        },

        shrinkEnd: function() {
            this.fire('shrunk');
        },

        filterEnd: function() {
            this.fire('filtered');
        },

        sortEnd: function() {
            this.fire('sorted');
        }

    };

            
    // Plugin definition
    $.fn.shuffle = function(opts, key) {
        return this.each(function() {
            var $this = $(this),
                shuffle = $this.data('shuffle');

            // If we don't have a stored shuffle, make a new one and save it
            if (!shuffle) {
                shuffle = new Shuffle($this, opts);
                $this.data('shuffle', shuffle);
            }

            // If passed a string, lets decide what to do with it
            if (typeof opts === 'string' && opts !== 'sort') {
                shuffle.shuffle(opts);
                
            // Key should be an object with propreties reversed and by.
            } else if (typeof opts === 'string' && opts === 'sort') {
                shuffle.sort(key);
            }
        });
    };

    // Overrideable options
    $.fn.shuffle.options = {
        key : 'all',
        speed : 800,
        easing : 'ease-out',
        keepSorted: true
    };

    // Not overrideable
    $.fn.shuffle.settings = {
        supported: Modernizr.csstransforms && Modernizr.csstransitions,
        prefixed: Modernizr.prefixed,
        threeD: Modernizr.csstransforms3d
    };

})(jQuery, Modernizr);