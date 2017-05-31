/*!
 * Morphext - Text Rotating Plugin for jQuery
 * https://github.com/MrSaints/Morphext
 *
 * Built on jQuery Boilerplate
 * http://jqueryboilerplate.com/
 *
 * Copyright 2014 Ian Lai and other contributors
 * Released under the MIT license
 * http://ian.mit-license.org/
 */

/*eslint-env browser */
/*global jQuery:false */
/*eslint-disable no-underscore-dangle */

(function ($) {
    "use strict";

    var pluginName = "Morphext",
        defaults = {
            animation: "bounceIn",
            separator: ",",
            speed: 2000,
            complete: $.noop
        };

    function Plugin (element, options) {
        this.element = $(element);

        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._init();
    }

    Plugin.prototype = {
        _init: function () {
            var $that = this;
            this.phrases = [];

            this.element.addClass("morphext");

            $.each(this.element.text().split(this.settings.separator), function (key, value) {
                $that.phrases.push($.trim(value));
            });

            this.index = -1;
            this.animate();
            this.start();
        },
        animate: function () {
            this.index = ++this.index % this.phrases.length;
            this.element[0].innerHTML = "<span class=\"animated " + this.settings.animation + "\">" + this.phrases[this.index] + "</span>";

            if ($.isFunction(this.settings.complete)) {
                this.settings.complete.call(this);
            }
        },
        start: function () {
            var $that = this;
            this._interval = setInterval(function () {
                $that.animate();
            }, this.settings.speed);
        },
        stop: function () {
            this._interval = clearInterval(this._interval);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery);

/*
 *  Vide - v0.5.0
 *  Easy as hell jQuery plugin for video backgrounds.
 *  http://vodkabears.github.io/vide/
 *
 *  Made by Ilya Makarov
 *  Under MIT License
 */
!(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(root.jQuery);
  }
})(this, function($) {

  'use strict';

  /**
   * Name of the plugin
   * @private
   * @const
   * @type {String}
   */
  var PLUGIN_NAME = 'vide';

  /**
   * Default settings
   * @private
   * @const
   * @type {Object}
   */
  var DEFAULTS = {
    volume: 1,
    playbackRate: 1,
    muted: true,
    loop: true,
    autoplay: true,
    position: '50% 50%',
    posterType: 'detect',
    resizing: true,
    bgColor: 'transparent',
    className: ''
  };

  /**
   * Not implemented error message
   * @private
   * @const
   * @type {String}
   */
  var NOT_IMPLEMENTED_MSG = 'Not implemented';

  /**
   * Parse a string with options
   * @private
   * @param {String} str
   * @returns {Object|String}
   */
  function parseOptions(str) {
    var obj = {};
    var delimiterIndex;
    var option;
    var prop;
    var val;
    var arr;
    var len;
    var i;

    // Remove spaces around delimiters and split
    arr = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',').split(',');

    // Parse a string
    for (i = 0, len = arr.length; i < len; i++) {
      option = arr[i];

      // Ignore urls and a string without colon delimiters
      if (
        option.search(/^(http|https|ftp):\/\//) !== -1 ||
        option.search(':') === -1
      ) {
        break;
      }

      delimiterIndex = option.indexOf(':');
      prop = option.substring(0, delimiterIndex);
      val = option.substring(delimiterIndex + 1);

      // If val is an empty string, make it undefined
      if (!val) {
        val = undefined;
      }

      // Convert a string value if it is like a boolean
      if (typeof val === 'string') {
        val = val === 'true' || (val === 'false' ? false : val);
      }

      // Convert a string value if it is like a number
      if (typeof val === 'string') {
        val = !isNaN(val) ? +val : val;
      }

      obj[prop] = val;
    }

    // If nothing is parsed
    if (prop == null && val == null) {
      return str;
    }

    return obj;
  }

  /**
   * Parse a position option
   * @private
   * @param {String} str
   * @returns {Object}
   */
  function parsePosition(str) {
    str = '' + str;

    // Default value is a center
    var args = str.split(/\s+/);
    var x = '50%';
    var y = '50%';
    var len;
    var arg;
    var i;

    for (i = 0, len = args.length; i < len; i++) {
      arg = args[i];

      // Convert values
      if (arg === 'left') {
        x = '0%';
      } else if (arg === 'right') {
        x = '100%';
      } else if (arg === 'top') {
        y = '0%';
      } else if (arg === 'bottom') {
        y = '100%';
      } else if (arg === 'center') {
        if (i === 0) {
          x = '50%';
        } else {
          y = '50%';
        }
      } else {
        if (i === 0) {
          x = arg;
        } else {
          y = arg;
        }
      }
    }

    return { x: x, y: y };
  }

  /**
   * Search a poster
   * @private
   * @param {String} path
   * @param {Function} callback
   */
  function findPoster(path, callback) {
    var onLoad = function() {
      callback(this.src);
    };

    $('<img src="' + path + '.gif">').load(onLoad);
    $('<img src="' + path + '.jpg">').load(onLoad);
    $('<img src="' + path + '.jpeg">').load(onLoad);
    $('<img src="' + path + '.png">').load(onLoad);
  }

  /**
   * Vide constructor
   * @param {HTMLElement} element
   * @param {Object|String} path
   * @param {Object|String} options
   * @constructor
   */
  function Vide(element, path, options) {
    this.$element = $(element);

    // Parse path
    if (typeof path === 'string') {
      path = parseOptions(path);
    }

    // Parse options
    if (!options) {
      options = {};
    } else if (typeof options === 'string') {
      options = parseOptions(options);
    }

    // Remove an extension
    if (typeof path === 'string') {
      path = path.replace(/\.\w*$/, '');
    } else if (typeof path === 'object') {
      for (var i in path) {
        if (path.hasOwnProperty(i)) {
          path[i] = path[i].replace(/\.\w*$/, '');
        }
      }
    }

    this.settings = $.extend({}, DEFAULTS, options);
    this.path = path;

    // https://github.com/VodkaBears/Vide/issues/110
    try {
      this.init();
    } catch (e) {
      if (e.message !== NOT_IMPLEMENTED_MSG) {
        throw e;
      }
    }
  }

  /**
   * Initialization
   * @public
   */
  Vide.prototype.init = function() {
    var vide = this;
    var path = vide.path;
    var poster = path;
    var sources = '';
    var $element = vide.$element;
    var settings = vide.settings;
    var position = parsePosition(settings.position);
    var posterType = settings.posterType;
    var $video;
    var $wrapper;

    // Set styles of a video wrapper
    $wrapper = vide.$wrapper = $('<div>')
      .addClass(settings.className)
      .css({
        position: 'absolute',
        'z-index': -1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflow: 'hidden',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
        'background-color': settings.bgColor,
        'background-repeat': 'no-repeat',
        'background-position': position.x + ' ' + position.y
      });

    // Get a poster path
    if (typeof path === 'object') {
      if (path.poster) {
        poster = path.poster;
      } else {
        if (path.mp4) {
          poster = path.mp4;
        } else if (path.webm) {
          poster = path.webm;
        } else if (path.ogv) {
          poster = path.ogv;
        }
      }
    }

    // Set a video poster
    if (posterType === 'detect') {
      findPoster(poster, function(url) {
        $wrapper.css('background-image', 'url(' + url + ')');
      });
    } else if (posterType !== 'none') {
      $wrapper.css('background-image', 'url(' + poster + '.' + posterType + ')');
    }

    // If a parent element has a static position, make it relative
    if ($element.css('position') === 'static') {
      $element.css('position', 'relative');
    }

    $element.prepend($wrapper);

    if (typeof path === 'object') {
      if (path.mp4) {
        sources += '<source src="' + path.mp4 + '.mp4" type="video/mp4">';
      }

      if (path.webm) {
        sources += '<source src="' + path.webm + '.webm" type="video/webm">';
      }

      if (path.ogv) {
        sources += '<source src="' + path.ogv + '.ogv" type="video/ogg">';
      }

      $video = vide.$video = $('<video>' + sources + '</video>');
    } else {
      $video = vide.$video = $('<video>' +
        '<source src="' + path + '.mp4" type="video/mp4">' +
        '<source src="' + path + '.webm" type="video/webm">' +
        '<source src="' + path + '.ogv" type="video/ogg">' +
        '</video>');
    }

    // https://github.com/VodkaBears/Vide/issues/110
    try {
      $video

        // Set video properties
        .prop({
          autoplay: settings.autoplay,
          loop: settings.loop,
          volume: settings.volume,
          muted: settings.muted,
          defaultMuted: settings.muted,
          playbackRate: settings.playbackRate,
          defaultPlaybackRate: settings.playbackRate
        });
    } catch (e) {
      throw new Error(NOT_IMPLEMENTED_MSG);
    }

    // Video alignment
    $video.css({
      margin: 'auto',
      position: 'absolute',
      'z-index': -1,
      top: position.y,
      left: position.x,
      '-webkit-transform': 'translate(-' + position.x + ', -' + position.y + ')',
      '-ms-transform': 'translate(-' + position.x + ', -' + position.y + ')',
      '-moz-transform': 'translate(-' + position.x + ', -' + position.y + ')',
      transform: 'translate(-' + position.x + ', -' + position.y + ')',

      // Disable visibility, while loading
      visibility: 'hidden',
      opacity: 0
    })

    // Resize a video, when it's loaded
    .one('canplaythrough.' + PLUGIN_NAME, function() {
      vide.resize();
    })

    // Make it visible, when it's already playing
    .one('playing.' + PLUGIN_NAME, function() {
      $video.css({
        visibility: 'visible',
        opacity: 1
      });
      $wrapper.css('background-image', 'none');
    });

    // Resize event is available only for 'window'
    // Use another code solutions to detect DOM elements resizing
    $element.on('resize.' + PLUGIN_NAME, function() {
      if (settings.resizing) {
        vide.resize();
      }
    });

    // Append a video
    $wrapper.append($video);
  };

  /**
   * Get a video element
   * @public
   * @returns {HTMLVideoElement}
   */
  Vide.prototype.getVideoObject = function() {
    return this.$video[0];
  };

  /**
   * Resize a video background
   * @public
   */
  Vide.prototype.resize = function() {
    if (!this.$video) {
      return;
    }

    var $wrapper = this.$wrapper;
    var $video = this.$video;
    var video = $video[0];

    // Get a native video size
    var videoHeight = video.videoHeight;
    var videoWidth = video.videoWidth;

    // Get a wrapper size
    var wrapperHeight = $wrapper.height();
    var wrapperWidth = $wrapper.width();

    if (wrapperWidth / videoWidth > wrapperHeight / videoHeight) {
      $video.css({

        // +2 pixels to prevent an empty space after transformation
        width: wrapperWidth + 2,
        height: 'auto'
      });
    } else {
      $video.css({
        width: 'auto',

        // +2 pixels to prevent an empty space after transformation
        height: wrapperHeight + 2
      });
    }
  };

  /**
   * Destroy a video background
   * @public
   */
  Vide.prototype.destroy = function() {
    delete $[PLUGIN_NAME].lookup[this.index];
    this.$video && this.$video.off(PLUGIN_NAME);
    this.$element.off(PLUGIN_NAME).removeData(PLUGIN_NAME);
    this.$wrapper.remove();
  };

  /**
   * Special plugin object for instances.
   * @public
   * @type {Object}
   */
  $[PLUGIN_NAME] = {
    lookup: []
  };

  /**
   * Plugin constructor
   * @param {Object|String} path
   * @param {Object|String} options
   * @returns {JQuery}
   * @constructor
   */
  $.fn[PLUGIN_NAME] = function(path, options) {
    var instance;

    this.each(function() {
      instance = $.data(this, PLUGIN_NAME);

      // Destroy the plugin instance if exists
      instance && instance.destroy();

      // Create the plugin instance
      instance = new Vide(this, path, options);
      instance.index = $[PLUGIN_NAME].lookup.push(instance) - 1;
      $.data(this, PLUGIN_NAME, instance);
    });

    return this;
  };

  $(document).ready(function() {
    var $window = $(window);

    // Window resize event listener
    $window.on('resize.' + PLUGIN_NAME, function() {
      for (var len = $[PLUGIN_NAME].lookup.length, i = 0, instance; i < len; i++) {
        instance = $[PLUGIN_NAME].lookup[i];

        if (instance && instance.settings.resizing) {
          instance.resize();
        }
      }
    });

    // https://github.com/VodkaBears/Vide/issues/68
    $window.on('unload.' + PLUGIN_NAME, function() {
      return false;
    });

    // Auto initialization
    // Add 'data-vide-bg' attribute with a path to the video without extension
    // Also you can pass options throw the 'data-vide-options' attribute
    // 'data-vide-options' must be like 'muted: false, volume: 0.5'
    $(document).find('[data-' + PLUGIN_NAME + '-bg]').each(function(i, element) {
      var $element = $(element);
      var options = $element.data(PLUGIN_NAME + '-options');
      var path = $element.data(PLUGIN_NAME + '-bg');

      $element[PLUGIN_NAME](path, options);
    });
  });

});

/**
 * Owl Carousel v2.1.1
 * Copyright 2013-2016 David Deutsch
 * Licensed under MIT (https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE)
 */
/**
 * Owl carousel
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 * @todo Lazy Load Icon
 * @todo prevent animationend bubling
 * @todo itemsScaleUp
 * @todo Test Zepto
 * @todo stagePadding calculate wrong active classes
 */
;(function($, window, document, undefined) {

	/**
	 * Creates a carousel.
	 * @class The Owl Carousel.
	 * @public
	 * @param {HTMLElement|jQuery} element - The element to create the carousel for.
	 * @param {Object} [options] - The options
	 */
	function Owl(element, options) {

		/**
		 * Current settings for the carousel.
		 * @public
		 */
		this.settings = null;

		/**
		 * Current options set by the caller including defaults.
		 * @public
		 */
		this.options = $.extend({}, Owl.Defaults, options);

		/**
		 * Plugin element.
		 * @public
		 */
		this.$element = $(element);

		/**
		 * Proxied event handlers.
		 * @protected
		 */
		this._handlers = {};

		/**
		 * References to the running plugins of this carousel.
		 * @protected
		 */
		this._plugins = {};

		/**
		 * Currently suppressed events to prevent them from beeing retriggered.
		 * @protected
		 */
		this._supress = {};

		/**
		 * Absolute current position.
		 * @protected
		 */
		this._current = null;

		/**
		 * Animation speed in milliseconds.
		 * @protected
		 */
		this._speed = null;

		/**
		 * Coordinates of all items in pixel.
		 * @todo The name of this member is missleading.
		 * @protected
		 */
		this._coordinates = [];

		/**
		 * Current breakpoint.
		 * @todo Real media queries would be nice.
		 * @protected
		 */
		this._breakpoint = null;

		/**
		 * Current width of the plugin element.
		 */
		this._width = null;

		/**
		 * All real items.
		 * @protected
		 */
		this._items = [];

		/**
		 * All cloned items.
		 * @protected
		 */
		this._clones = [];

		/**
		 * Merge values of all items.
		 * @todo Maybe this could be part of a plugin.
		 * @protected
		 */
		this._mergers = [];

		/**
		 * Widths of all items.
		 */
		this._widths = [];

		/**
		 * Invalidated parts within the update process.
		 * @protected
		 */
		this._invalidated = {};

		/**
		 * Ordered list of workers for the update process.
		 * @protected
		 */
		this._pipe = [];

		/**
		 * Current state information for the drag operation.
		 * @todo #261
		 * @protected
		 */
		this._drag = {
			time: null,
			target: null,
			pointer: null,
			stage: {
				start: null,
				current: null
			},
			direction: null
		};

		/**
		 * Current state information and their tags.
		 * @type {Object}
		 * @protected
		 */
		this._states = {
			current: {},
			tags: {
				'initializing': [ 'busy' ],
				'animating': [ 'busy' ],
				'dragging': [ 'interacting' ]
			}
		};

		$.each([ 'onResize', 'onThrottledResize' ], $.proxy(function(i, handler) {
			this._handlers[handler] = $.proxy(this[handler], this);
		}, this));

		$.each(Owl.Plugins, $.proxy(function(key, plugin) {
			this._plugins[key.charAt(0).toLowerCase() + key.slice(1)]
				= new plugin(this);
		}, this));

		$.each(Owl.Workers, $.proxy(function(priority, worker) {
			this._pipe.push({
				'filter': worker.filter,
				'run': $.proxy(worker.run, this)
			});
		}, this));

		this.setup();
		this.initialize();
	}

	/**
	 * Default options for the carousel.
	 * @public
	 */
	Owl.Defaults = {
		items: 3,
		loop: false,
		center: false,
		rewind: false,

		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		freeDrag: false,

		margin: 0,
		stagePadding: 0,

		merge: false,
		mergeFit: true,
		autoWidth: false,

		startPosition: 0,
		rtl: false,

		smartSpeed: 250,
		fluidSpeed: false,
		dragEndSpeed: false,

		responsive: {},
		responsiveRefreshRate: 200,
		responsiveBaseElement: window,

		fallbackEasing: 'swing',

		info: false,

		nestedItemSelector: false,
		itemElement: 'div',
		stageElement: 'div',

		refreshClass: 'owl-refresh',
		loadedClass: 'owl-loaded',
		loadingClass: 'owl-loading',
		rtlClass: 'owl-rtl',
		responsiveClass: 'owl-responsive',
		dragClass: 'owl-drag',
		itemClass: 'owl-item',
		stageClass: 'owl-stage',
		stageOuterClass: 'owl-stage-outer',
		grabClass: 'owl-grab'
	};

	/**
	 * Enumeration for width.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
	Owl.Width = {
		Default: 'default',
		Inner: 'inner',
		Outer: 'outer'
	};

	/**
	 * Enumeration for types.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
	Owl.Type = {
		Event: 'event',
		State: 'state'
	};

	/**
	 * Contains all registered plugins.
	 * @public
	 */
	Owl.Plugins = {};

	/**
	 * List of workers involved in the update process.
	 */
	Owl.Workers = [ {
		filter: [ 'width', 'settings' ],
		run: function() {
			this._width = this.$element.width();
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			cache.current = this._items && this._items[this.relative(this._current)];
		}
	}, {
		filter: [ 'items', 'settings' ],
		run: function() {
			this.$stage.children('.cloned').remove();
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			var margin = this.settings.margin || '',
				grid = !this.settings.autoWidth,
				rtl = this.settings.rtl,
				css = {
					'width': 'auto',
					'margin-left': rtl ? margin : '',
					'margin-right': rtl ? '' : margin
				};

			!grid && this.$stage.children().css(css);

			cache.css = css;
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			var width = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
				merge = null,
				iterator = this._items.length,
				grid = !this.settings.autoWidth,
				widths = [];

			cache.items = {
				merge: false,
				width: width
			};

			while (iterator--) {
				merge = this._mergers[iterator];
				merge = this.settings.mergeFit && Math.min(merge, this.settings.items) || merge;

				cache.items.merge = merge > 1 || cache.items.merge;

				widths[iterator] = !grid ? this._items[iterator].width() : width * merge;
			}

			this._widths = widths;
		}
	}, {
		filter: [ 'items', 'settings' ],
		run: function() {
			var clones = [],
				items = this._items,
				settings = this.settings,
				view = Math.max(settings.items * 2, 4),
				size = Math.ceil(items.length / 2) * 2,
				repeat = settings.loop && items.length ? settings.rewind ? view : Math.max(view, size) : 0,
				append = '',
				prepend = '';

			repeat /= 2;

			while (repeat--) {
				clones.push(this.normalize(clones.length / 2, true));
				append = append + items[clones[clones.length - 1]][0].outerHTML;
				clones.push(this.normalize(items.length - 1 - (clones.length - 1) / 2, true));
				prepend = items[clones[clones.length - 1]][0].outerHTML + prepend;
			}

			this._clones = clones;

			$(append).addClass('cloned').appendTo(this.$stage);
			$(prepend).addClass('cloned').prependTo(this.$stage);
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function() {
			var rtl = this.settings.rtl ? 1 : -1,
				size = this._clones.length + this._items.length,
				iterator = -1,
				previous = 0,
				current = 0,
				coordinates = [];

			while (++iterator < size) {
				previous = coordinates[iterator - 1] || 0;
				current = this._widths[this.relative(iterator)] + this.settings.margin;
				coordinates.push(previous + current * rtl);
			}

			this._coordinates = coordinates;
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function() {
			var padding = this.settings.stagePadding,
				coordinates = this._coordinates,
				css = {
					'width': Math.ceil(Math.abs(coordinates[coordinates.length - 1])) + padding * 2,
					'padding-left': padding || '',
					'padding-right': padding || ''
				};

			this.$stage.css(css);
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			var iterator = this._coordinates.length,
				grid = !this.settings.autoWidth,
				items = this.$stage.children();

			if (grid && cache.items.merge) {
				while (iterator--) {
					cache.css.width = this._widths[this.relative(iterator)];
					items.eq(iterator).css(cache.css);
				}
			} else if (grid) {
				cache.css.width = cache.items.width;
				items.css(cache.css);
			}
		}
	}, {
		filter: [ 'items' ],
		run: function() {
			this._coordinates.length < 1 && this.$stage.removeAttr('style');
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			cache.current = cache.current ? this.$stage.children().index(cache.current) : 0;
			cache.current = Math.max(this.minimum(), Math.min(this.maximum(), cache.current));
			this.reset(cache.current);
		}
	}, {
		filter: [ 'position' ],
		run: function() {
			this.animate(this.coordinates(this._current));
		}
	}, {
		filter: [ 'width', 'position', 'items', 'settings' ],
		run: function() {
			var rtl = this.settings.rtl ? 1 : -1,
				padding = this.settings.stagePadding * 2,
				begin = this.coordinates(this.current()) + padding,
				end = begin + this.width() * rtl,
				inner, outer, matches = [], i, n;

			for (i = 0, n = this._coordinates.length; i < n; i++) {
				inner = this._coordinates[i - 1] || 0;
				outer = Math.abs(this._coordinates[i]) + padding * rtl;

				if ((this.op(inner, '<=', begin) && (this.op(inner, '>', end)))
					|| (this.op(outer, '<', begin) && this.op(outer, '>', end))) {
					matches.push(i);
				}
			}

			this.$stage.children('.active').removeClass('active');
			this.$stage.children(':eq(' + matches.join('), :eq(') + ')').addClass('active');

			if (this.settings.center) {
				this.$stage.children('.center').removeClass('center');
				this.$stage.children().eq(this.current()).addClass('center');
			}
		}
	} ];

	/**
	 * Initializes the carousel.
	 * @protected
	 */
	Owl.prototype.initialize = function() {
		this.enter('initializing');
		this.trigger('initialize');

		this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl);

		if (this.settings.autoWidth && !this.is('pre-loading')) {
			var imgs, nestedSelector, width;
			imgs = this.$element.find('img');
			nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined;
			width = this.$element.children(nestedSelector).width();

			if (imgs.length && width <= 0) {
				this.preloadAutoWidthImages(imgs);
			}
		}

		this.$element.addClass(this.options.loadingClass);

		// create stage
		this.$stage = $('<' + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>')
			.wrap('<div class="' + this.settings.stageOuterClass + '"/>');

		// append stage
		this.$element.append(this.$stage.parent());

		// append content
		this.replace(this.$element.children().not(this.$stage.parent()));

		// check visibility
		if (this.$element.is(':visible')) {
			// update view
			this.refresh();
		} else {
			// invalidate width
			this.invalidate('width');
		}

		this.$element
			.removeClass(this.options.loadingClass)
			.addClass(this.options.loadedClass);

		// register event handlers
		this.registerEventHandlers();

		this.leave('initializing');
		this.trigger('initialized');
	};

	/**
	 * Setups the current settings.
	 * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
	 * @todo Support for media queries by using `matchMedia` would be nice.
	 * @public
	 */
	Owl.prototype.setup = function() {
		var viewport = this.viewport(),
			overwrites = this.options.responsive,
			match = -1,
			settings = null;

		if (!overwrites) {
			settings = $.extend({}, this.options);
		} else {
			$.each(overwrites, function(breakpoint) {
				if (breakpoint <= viewport && breakpoint > match) {
					match = Number(breakpoint);
				}
			});

			settings = $.extend({}, this.options, overwrites[match]);
			delete settings.responsive;

			// responsive class
			if (settings.responsiveClass) {
				this.$element.attr('class',
					this.$element.attr('class').replace(new RegExp('(' + this.options.responsiveClass + '-)\\S+\\s', 'g'), '$1' + match)
				);
			}
		}

		if (this.settings === null || this._breakpoint !== match) {
			this.trigger('change', { property: { name: 'settings', value: settings } });
			this._breakpoint = match;
			this.settings = settings;
			this.invalidate('settings');
			this.trigger('changed', { property: { name: 'settings', value: this.settings } });
		}
	};

	/**
	 * Updates option logic if necessery.
	 * @protected
	 */
	Owl.prototype.optionsLogic = function() {
		if (this.settings.autoWidth) {
			this.settings.stagePadding = false;
			this.settings.merge = false;
		}
	};

	/**
	 * Prepares an item before add.
	 * @todo Rename event parameter `content` to `item`.
	 * @protected
	 * @returns {jQuery|HTMLElement} - The item container.
	 */
	Owl.prototype.prepare = function(item) {
		var event = this.trigger('prepare', { content: item });

		if (!event.data) {
			event.data = $('<' + this.settings.itemElement + '/>')
				.addClass(this.options.itemClass).append(item)
		}

		this.trigger('prepared', { content: event.data });

		return event.data;
	};

	/**
	 * Updates the view.
	 * @public
	 */
	Owl.prototype.update = function() {
		var i = 0,
			n = this._pipe.length,
			filter = $.proxy(function(p) { return this[p] }, this._invalidated),
			cache = {};

		while (i < n) {
			if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
				this._pipe[i].run(cache);
			}
			i++;
		}

		this._invalidated = {};

		!this.is('valid') && this.enter('valid');
	};

	/**
	 * Gets the width of the view.
	 * @public
	 * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
	 * @returns {Number} - The width of the view in pixel.
	 */
	Owl.prototype.width = function(dimension) {
		dimension = dimension || Owl.Width.Default;
		switch (dimension) {
			case Owl.Width.Inner:
			case Owl.Width.Outer:
				return this._width;
			default:
				return this._width - this.settings.stagePadding * 2 + this.settings.margin;
		}
	};

	/**
	 * Refreshes the carousel primarily for adaptive purposes.
	 * @public
	 */
	Owl.prototype.refresh = function() {
		this.enter('refreshing');
		this.trigger('refresh');

		this.setup();

		this.optionsLogic();

		this.$element.addClass(this.options.refreshClass);

		this.update();

		this.$element.removeClass(this.options.refreshClass);

		this.leave('refreshing');
		this.trigger('refreshed');
	};

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
	Owl.prototype.onThrottledResize = function() {
		window.clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
	};

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
	Owl.prototype.onResize = function() {
		if (!this._items.length) {
			return false;
		}

		if (this._width === this.$element.width()) {
			return false;
		}

		if (!this.$element.is(':visible')) {
			return false;
		}

		this.enter('resizing');

		if (this.trigger('resize').isDefaultPrevented()) {
			this.leave('resizing');
			return false;
		}

		this.invalidate('width');

		this.refresh();

		this.leave('resizing');
		this.trigger('resized');
	};

	/**
	 * Registers event handlers.
	 * @todo Check `msPointerEnabled`
	 * @todo #261
	 * @protected
	 */
	Owl.prototype.registerEventHandlers = function() {
		if ($.support.transition) {
			this.$stage.on($.support.transition.end + '.owl.core', $.proxy(this.onTransitionEnd, this));
		}

		if (this.settings.responsive !== false) {
			this.on(window, 'resize', this._handlers.onThrottledResize);
		}

		if (this.settings.mouseDrag) {
			this.$element.addClass(this.options.dragClass);
			this.$stage.on('mousedown.owl.core', $.proxy(this.onDragStart, this));
			this.$stage.on('dragstart.owl.core selectstart.owl.core', function() { return false });
		}

		if (this.settings.touchDrag){
			this.$stage.on('touchstart.owl.core', $.proxy(this.onDragStart, this));
			this.$stage.on('touchcancel.owl.core', $.proxy(this.onDragEnd, this));
		}
	};

	/**
	 * Handles `touchstart` and `mousedown` events.
	 * @todo Horizontal swipe threshold as option
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragStart = function(event) {
		var stage = null;

		if (event.which === 3) {
			return;
		}

		if ($.support.transform) {
			stage = this.$stage.css('transform').replace(/.*\(|\)| /g, '').split(',');
			stage = {
				x: stage[stage.length === 16 ? 12 : 4],
				y: stage[stage.length === 16 ? 13 : 5]
			};
		} else {
			stage = this.$stage.position();
			stage = {
				x: this.settings.rtl ?
					stage.left + this.$stage.width() - this.width() + this.settings.margin :
					stage.left,
				y: stage.top
			};
		}

		if (this.is('animating')) {
			$.support.transform ? this.animate(stage.x) : this.$stage.stop()
			this.invalidate('position');
		}

		this.$element.toggleClass(this.options.grabClass, event.type === 'mousedown');

		this.speed(0);

		this._drag.time = new Date().getTime();
		this._drag.target = $(event.target);
		this._drag.stage.start = stage;
		this._drag.stage.current = stage;
		this._drag.pointer = this.pointer(event);

		$(document).on('mouseup.owl.core touchend.owl.core', $.proxy(this.onDragEnd, this));

		$(document).one('mousemove.owl.core touchmove.owl.core', $.proxy(function(event) {
			var delta = this.difference(this._drag.pointer, this.pointer(event));

			$(document).on('mousemove.owl.core touchmove.owl.core', $.proxy(this.onDragMove, this));

			if (Math.abs(delta.x) < Math.abs(delta.y) && this.is('valid')) {
				return;
			}

			event.preventDefault();

			this.enter('dragging');
			this.trigger('drag');
		}, this));
	};

	/**
	 * Handles the `touchmove` and `mousemove` events.
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragMove = function(event) {
		var minimum = null,
			maximum = null,
			pull = null,
			delta = this.difference(this._drag.pointer, this.pointer(event)),
			stage = this.difference(this._drag.stage.start, delta);

		if (!this.is('dragging')) {
			return;
		}

		event.preventDefault();

		if (this.settings.loop) {
			minimum = this.coordinates(this.minimum());
			maximum = this.coordinates(this.maximum() + 1) - minimum;
			stage.x = (((stage.x - minimum) % maximum + maximum) % maximum) + minimum;
		} else {
			minimum = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
			maximum = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
			pull = this.settings.pullDrag ? -1 * delta.x / 5 : 0;
			stage.x = Math.max(Math.min(stage.x, minimum + pull), maximum + pull);
		}

		this._drag.stage.current = stage;

		this.animate(stage.x);
	};

	/**
	 * Handles the `touchend` and `mouseup` events.
	 * @todo #261
	 * @todo Threshold for click event
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragEnd = function(event) {
		var delta = this.difference(this._drag.pointer, this.pointer(event)),
			stage = this._drag.stage.current,
			direction = delta.x > 0 ^ this.settings.rtl ? 'left' : 'right';

		$(document).off('.owl.core');

		this.$element.removeClass(this.options.grabClass);

		if (delta.x !== 0 && this.is('dragging') || !this.is('valid')) {
			this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
			this.current(this.closest(stage.x, delta.x !== 0 ? direction : this._drag.direction));
			this.invalidate('position');
			this.update();

			this._drag.direction = direction;

			if (Math.abs(delta.x) > 3 || new Date().getTime() - this._drag.time > 300) {
				this._drag.target.one('click.owl.core', function() { return false; });
			}
		}

		if (!this.is('dragging')) {
			return;
		}

		this.leave('dragging');
		this.trigger('dragged');
	};

	/**
	 * Gets absolute position of the closest item for a coordinate.
	 * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
	 * @protected
	 * @param {Number} coordinate - The coordinate in pixel.
	 * @param {String} direction - The direction to check for the closest item. Ether `left` or `right`.
	 * @return {Number} - The absolute position of the closest item.
	 */
	Owl.prototype.closest = function(coordinate, direction) {
		var position = -1,
			pull = 30,
			width = this.width(),
			coordinates = this.coordinates();

		if (!this.settings.freeDrag) {
			// check closest item
			$.each(coordinates, $.proxy(function(index, value) {
				// on a left pull, check on current index
				if (direction === 'left' && coordinate > value - pull && coordinate < value + pull) {
					position = index;
				// on a right pull, check on previous index
				// to do so, subtract width from value and set position = index + 1
				} else if (direction === 'right' && coordinate > value - width - pull && coordinate < value - width + pull) {
					position = index + 1;
				} else if (this.op(coordinate, '<', value)
					&& this.op(coordinate, '>', coordinates[index + 1] || value - width)) {
					position = direction === 'left' ? index + 1 : index;
				}
				return position === -1;
			}, this));
		}

		if (!this.settings.loop) {
			// non loop boundries
			if (this.op(coordinate, '>', coordinates[this.minimum()])) {
				position = coordinate = this.minimum();
			} else if (this.op(coordinate, '<', coordinates[this.maximum()])) {
				position = coordinate = this.maximum();
			}
		}

		return position;
	};

	/**
	 * Animates the stage.
	 * @todo #270
	 * @public
	 * @param {Number} coordinate - The coordinate in pixels.
	 */
	Owl.prototype.animate = function(coordinate) {
		var animate = this.speed() > 0;

		this.is('animating') && this.onTransitionEnd();

		if (animate) {
			this.enter('animating');
			this.trigger('translate');
		}

		if ($.support.transform3d && $.support.transition) {
			this.$stage.css({
				transform: 'translate3d(' + coordinate + 'px,0px,0px)',
				transition: (this.speed() / 1000) + 's'
			});
		} else if (animate) {
			this.$stage.animate({
				left: coordinate + 'px'
			}, this.speed(), this.settings.fallbackEasing, $.proxy(this.onTransitionEnd, this));
		} else {
			this.$stage.css({
				left: coordinate + 'px'
			});
		}
	};

	/**
	 * Checks whether the carousel is in a specific state or not.
	 * @param {String} state - The state to check.
	 * @returns {Boolean} - The flag which indicates if the carousel is busy.
	 */
	Owl.prototype.is = function(state) {
		return this._states.current[state] && this._states.current[state] > 0;
	};

	/**
	 * Sets the absolute position of the current item.
	 * @public
	 * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
	 * @returns {Number} - The absolute position of the current item.
	 */
	Owl.prototype.current = function(position) {
		if (position === undefined) {
			return this._current;
		}

		if (this._items.length === 0) {
			return undefined;
		}

		position = this.normalize(position);

		if (this._current !== position) {
			var event = this.trigger('change', { property: { name: 'position', value: position } });

			if (event.data !== undefined) {
				position = this.normalize(event.data);
			}

			this._current = position;

			this.invalidate('position');

			this.trigger('changed', { property: { name: 'position', value: this._current } });
		}

		return this._current;
	};

	/**
	 * Invalidates the given part of the update routine.
	 * @param {String} [part] - The part to invalidate.
	 * @returns {Array.<String>} - The invalidated parts.
	 */
	Owl.prototype.invalidate = function(part) {
		if ($.type(part) === 'string') {
			this._invalidated[part] = true;
			this.is('valid') && this.leave('valid');
		}
		return $.map(this._invalidated, function(v, i) { return i });
	};

	/**
	 * Resets the absolute position of the current item.
	 * @public
	 * @param {Number} position - The absolute position of the new item.
	 */
	Owl.prototype.reset = function(position) {
		position = this.normalize(position);

		if (position === undefined) {
			return;
		}

		this._speed = 0;
		this._current = position;

		this.suppress([ 'translate', 'translated' ]);

		this.animate(this.coordinates(position));

		this.release([ 'translate', 'translated' ]);
	};

	/**
	 * Normalizes an absolute or a relative position of an item.
	 * @public
	 * @param {Number} position - The absolute or relative position to normalize.
	 * @param {Boolean} [relative=false] - Whether the given position is relative or not.
	 * @returns {Number} - The normalized position.
	 */
	Owl.prototype.normalize = function(position, relative) {
		var n = this._items.length,
			m = relative ? 0 : this._clones.length;

		if (!this.isNumeric(position) || n < 1) {
			position = undefined;
		} else if (position < 0 || position >= n + m) {
			position = ((position - m / 2) % n + n) % n + m / 2;
		}

		return position;
	};

	/**
	 * Converts an absolute position of an item into a relative one.
	 * @public
	 * @param {Number} position - The absolute position to convert.
	 * @returns {Number} - The converted position.
	 */
	Owl.prototype.relative = function(position) {
		position -= this._clones.length / 2;
		return this.normalize(position, true);
	};

	/**
	 * Gets the maximum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
	Owl.prototype.maximum = function(relative) {
		var settings = this.settings,
			maximum = this._coordinates.length,
			boundary = Math.abs(this._coordinates[maximum - 1]) - this._width,
			i = -1, j;

		if (settings.loop) {
			maximum = this._clones.length / 2 + this._items.length - 1;
		} else if (settings.autoWidth || settings.merge) {
			// binary search
			while (maximum - i > 1) {
				Math.abs(this._coordinates[j = maximum + i >> 1]) < boundary
					? i = j : maximum = j;
			}
		} else if (settings.center) {
			maximum = this._items.length - 1;
		} else {
			maximum = this._items.length - settings.items;
		}

		if (relative) {
			maximum -= this._clones.length / 2;
		}

		return Math.max(maximum, 0);
	};

	/**
	 * Gets the minimum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
	Owl.prototype.minimum = function(relative) {
		return relative ? 0 : this._clones.length / 2;
	};

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
	Owl.prototype.items = function(position) {
		if (position === undefined) {
			return this._items.slice();
		}

		position = this.normalize(position, true);
		return this._items[position];
	};

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
	Owl.prototype.mergers = function(position) {
		if (position === undefined) {
			return this._mergers.slice();
		}

		position = this.normalize(position, true);
		return this._mergers[position];
	};

	/**
	 * Gets the absolute positions of clones for an item.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
	 */
	Owl.prototype.clones = function(position) {
		var odd = this._clones.length / 2,
			even = odd + this._items.length,
			map = function(index) { return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2 };

		if (position === undefined) {
			return $.map(this._clones, function(v, i) { return map(i) });
		}

		return $.map(this._clones, function(v, i) { return v === position ? map(i) : null });
	};

	/**
	 * Sets the current animation speed.
	 * @public
	 * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
	 * @returns {Number} - The current animation speed in milliseconds.
	 */
	Owl.prototype.speed = function(speed) {
		if (speed !== undefined) {
			this._speed = speed;
		}

		return this._speed;
	};

	/**
	 * Gets the coordinate of an item.
	 * @todo The name of this method is missleanding.
	 * @public
	 * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
	 * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
	 */
	Owl.prototype.coordinates = function(position) {
		var multiplier = 1,
			newPosition = position - 1,
			coordinate;

		if (position === undefined) {
			return $.map(this._coordinates, $.proxy(function(coordinate, index) {
				return this.coordinates(index);
			}, this));
		}

		if (this.settings.center) {
			if (this.settings.rtl) {
				multiplier = -1;
				newPosition = position + 1;
			}

			coordinate = this._coordinates[position];
			coordinate += (this.width() - coordinate + (this._coordinates[newPosition] || 0)) / 2 * multiplier;
		} else {
			coordinate = this._coordinates[newPosition] || 0;
		}

		coordinate = Math.ceil(coordinate);

		return coordinate;
	};

	/**
	 * Calculates the speed for a translation.
	 * @protected
	 * @param {Number} from - The absolute position of the start item.
	 * @param {Number} to - The absolute position of the target item.
	 * @param {Number} [factor=undefined] - The time factor in milliseconds.
	 * @returns {Number} - The time in milliseconds for the translation.
	 */
	Owl.prototype.duration = function(from, to, factor) {
		if (factor === 0) {
			return 0;
		}

		return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs((factor || this.settings.smartSpeed));
	};

	/**
	 * Slides to the specified item.
	 * @public
	 * @param {Number} position - The position of the item.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.to = function(position, speed) {
		var current = this.current(),
			revert = null,
			distance = position - this.relative(current),
			direction = (distance > 0) - (distance < 0),
			items = this._items.length,
			minimum = this.minimum(),
			maximum = this.maximum();

		if (this.settings.loop) {
			if (!this.settings.rewind && Math.abs(distance) > items / 2) {
				distance += direction * -1 * items;
			}

			position = current + distance;
			revert = ((position - minimum) % items + items) % items + minimum;

			if (revert !== position && revert - distance <= maximum && revert - distance > 0) {
				current = revert - distance;
				position = revert;
				this.reset(current);
			}
		} else if (this.settings.rewind) {
			maximum += 1;
			position = (position % maximum + maximum) % maximum;
		} else {
			position = Math.max(minimum, Math.min(maximum, position));
		}

		this.speed(this.duration(current, position, speed));
		this.current(position);

		if (this.$element.is(':visible')) {
			this.update();
		}
	};

	/**
	 * Slides to the next item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.next = function(speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) + 1, speed);
	};

	/**
	 * Slides to the previous item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.prev = function(speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) - 1, speed);
	};

	/**
	 * Handles the end of an animation.
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onTransitionEnd = function(event) {

		// if css2 animation then event object is undefined
		if (event !== undefined) {
			event.stopPropagation();

			// Catch only owl-stage transitionEnd event
			if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
				return false;
			}
		}

		this.leave('animating');
		this.trigger('translated');
	};

	/**
	 * Gets viewport width.
	 * @protected
	 * @return {Number} - The width in pixel.
	 */
	Owl.prototype.viewport = function() {
		var width;
		if (this.options.responsiveBaseElement !== window) {
			width = $(this.options.responsiveBaseElement).width();
		} else if (window.innerWidth) {
			width = window.innerWidth;
		} else if (document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
		} else {
			throw 'Can not detect viewport width.';
		}
		return width;
	};

	/**
	 * Replaces the current content.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The new content.
	 */
	Owl.prototype.replace = function(content) {
		this.$stage.empty();
		this._items = [];

		if (content) {
			content = (content instanceof jQuery) ? content : $(content);
		}

		if (this.settings.nestedItemSelector) {
			content = content.find('.' + this.settings.nestedItemSelector);
		}

		content.filter(function() {
			return this.nodeType === 1;
		}).each($.proxy(function(index, item) {
			item = this.prepare(item);
			this.$stage.append(item);
			this._items.push(item);
			this._mergers.push(item.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
		}, this));

		this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);

		this.invalidate('items');
	};

	/**
	 * Adds an item.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The item content to add.
	 * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
	 */
	Owl.prototype.add = function(content, position) {
		var current = this.relative(this._current);

		position = position === undefined ? this._items.length : this.normalize(position, true);
		content = content instanceof jQuery ? content : $(content);

		this.trigger('add', { content: content, position: position });

		content = this.prepare(content);

		if (this._items.length === 0 || position === this._items.length) {
			this._items.length === 0 && this.$stage.append(content);
			this._items.length !== 0 && this._items[position - 1].after(content);
			this._items.push(content);
			this._mergers.push(content.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
		} else {
			this._items[position].before(content);
			this._items.splice(position, 0, content);
			this._mergers.splice(position, 0, content.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
		}

		this._items[current] && this.reset(this._items[current].index());

		this.invalidate('items');

		this.trigger('added', { content: content, position: position });
	};

	/**
	 * Removes an item by its position.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {Number} position - The relative position of the item to remove.
	 */
	Owl.prototype.remove = function(position) {
		position = this.normalize(position, true);

		if (position === undefined) {
			return;
		}

		this.trigger('remove', { content: this._items[position], position: position });

		this._items[position].remove();
		this._items.splice(position, 1);
		this._mergers.splice(position, 1);

		this.invalidate('items');

		this.trigger('removed', { content: null, position: position });
	};

	/**
	 * Preloads images with auto width.
	 * @todo Replace by a more generic approach
	 * @protected
	 */
	Owl.prototype.preloadAutoWidthImages = function(images) {
		images.each($.proxy(function(i, element) {
			this.enter('pre-loading');
			element = $(element);
			$(new Image()).one('load', $.proxy(function(e) {
				element.attr('src', e.target.src);
				element.css('opacity', 1);
				this.leave('pre-loading');
				!this.is('pre-loading') && !this.is('initializing') && this.refresh();
			}, this)).attr('src', element.attr('src') || element.attr('data-src') || element.attr('data-src-retina'));
		}, this));
	};

	/**
	 * Destroys the carousel.
	 * @public
	 */
	Owl.prototype.destroy = function() {

		this.$element.off('.owl.core');
		this.$stage.off('.owl.core');
		$(document).off('.owl.core');

		if (this.settings.responsive !== false) {
			window.clearTimeout(this.resizeTimer);
			this.off(window, 'resize', this._handlers.onThrottledResize);
		}

		for (var i in this._plugins) {
			this._plugins[i].destroy();
		}

		this.$stage.children('.cloned').remove();

		this.$stage.unwrap();
		this.$stage.children().contents().unwrap();
		this.$stage.children().unwrap();

		this.$element
			.removeClass(this.options.refreshClass)
			.removeClass(this.options.loadingClass)
			.removeClass(this.options.loadedClass)
			.removeClass(this.options.rtlClass)
			.removeClass(this.options.dragClass)
			.removeClass(this.options.grabClass)
			.attr('class', this.$element.attr('class').replace(new RegExp(this.options.responsiveClass + '-\\S+\\s', 'g'), ''))
			.removeData('owl.carousel');
	};

	/**
	 * Operators to calculate right-to-left and left-to-right.
	 * @protected
	 * @param {Number} [a] - The left side operand.
	 * @param {String} [o] - The operator.
	 * @param {Number} [b] - The right side operand.
	 */
	Owl.prototype.op = function(a, o, b) {
		var rtl = this.settings.rtl;
		switch (o) {
			case '<':
				return rtl ? a > b : a < b;
			case '>':
				return rtl ? a < b : a > b;
			case '>=':
				return rtl ? a <= b : a >= b;
			case '<=':
				return rtl ? a >= b : a <= b;
			default:
				break;
		}
	};

	/**
	 * Attaches to an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The event handler to attach.
	 * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
	 */
	Owl.prototype.on = function(element, event, listener, capture) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, capture);
		} else if (element.attachEvent) {
			element.attachEvent('on' + event, listener);
		}
	};

	/**
	 * Detaches from an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The attached event handler to detach.
	 * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
	 */
	Owl.prototype.off = function(element, event, listener, capture) {
		if (element.removeEventListener) {
			element.removeEventListener(event, listener, capture);
		} else if (element.detachEvent) {
			element.detachEvent('on' + event, listener);
		}
	};

	/**
	 * Triggers a public event.
	 * @todo Remove `status`, `relatedTarget` should be used instead.
	 * @protected
	 * @param {String} name - The event name.
	 * @param {*} [data=null] - The event data.
	 * @param {String} [namespace=carousel] - The event namespace.
	 * @param {String} [state] - The state which is associated with the event.
	 * @param {Boolean} [enter=false] - Indicates if the call enters the specified state or not.
	 * @returns {Event} - The event arguments.
	 */
	Owl.prototype.trigger = function(name, data, namespace, state, enter) {
		var status = {
			item: { count: this._items.length, index: this.current() }
		}, handler = $.camelCase(
			$.grep([ 'on', name, namespace ], function(v) { return v })
				.join('-').toLowerCase()
		), event = $.Event(
			[ name, 'owl', namespace || 'carousel' ].join('.').toLowerCase(),
			$.extend({ relatedTarget: this }, status, data)
		);

		if (!this._supress[name]) {
			$.each(this._plugins, function(name, plugin) {
				if (plugin.onTrigger) {
					plugin.onTrigger(event);
				}
			});

			this.register({ type: Owl.Type.Event, name: name });
			this.$element.trigger(event);

			if (this.settings && typeof this.settings[handler] === 'function') {
				this.settings[handler].call(this, event);
			}
		}

		return event;
	};

	/**
	 * Enters a state.
	 * @param name - The state name.
	 */
	Owl.prototype.enter = function(name) {
		$.each([ name ].concat(this._states.tags[name] || []), $.proxy(function(i, name) {
			if (this._states.current[name] === undefined) {
				this._states.current[name] = 0;
			}

			this._states.current[name]++;
		}, this));
	};

	/**
	 * Leaves a state.
	 * @param name - The state name.
	 */
	Owl.prototype.leave = function(name) {
		$.each([ name ].concat(this._states.tags[name] || []), $.proxy(function(i, name) {
			this._states.current[name]--;
		}, this));
	};

	/**
	 * Registers an event or state.
	 * @public
	 * @param {Object} object - The event or state to register.
	 */
	Owl.prototype.register = function(object) {
		if (object.type === Owl.Type.Event) {
			if (!$.event.special[object.name]) {
				$.event.special[object.name] = {};
			}

			if (!$.event.special[object.name].owl) {
				var _default = $.event.special[object.name]._default;
				$.event.special[object.name]._default = function(e) {
					if (_default && _default.apply && (!e.namespace || e.namespace.indexOf('owl') === -1)) {
						return _default.apply(this, arguments);
					}
					return e.namespace && e.namespace.indexOf('owl') > -1;
				};
				$.event.special[object.name].owl = true;
			}
		} else if (object.type === Owl.Type.State) {
			if (!this._states.tags[object.name]) {
				this._states.tags[object.name] = object.tags;
			} else {
				this._states.tags[object.name] = this._states.tags[object.name].concat(object.tags);
			}

			this._states.tags[object.name] = $.grep(this._states.tags[object.name], $.proxy(function(tag, i) {
				return $.inArray(tag, this._states.tags[object.name]) === i;
			}, this));
		}
	};

	/**
	 * Suppresses events.
	 * @protected
	 * @param {Array.<String>} events - The events to suppress.
	 */
	Owl.prototype.suppress = function(events) {
		$.each(events, $.proxy(function(index, event) {
			this._supress[event] = true;
		}, this));
	};

	/**
	 * Releases suppressed events.
	 * @protected
	 * @param {Array.<String>} events - The events to release.
	 */
	Owl.prototype.release = function(events) {
		$.each(events, $.proxy(function(index, event) {
			delete this._supress[event];
		}, this));
	};

	/**
	 * Gets unified pointer coordinates from event.
	 * @todo #261
	 * @protected
	 * @param {Event} - The `mousedown` or `touchstart` event.
	 * @returns {Object} - Contains `x` and `y` coordinates of current pointer position.
	 */
	Owl.prototype.pointer = function(event) {
		var result = { x: null, y: null };

		event = event.originalEvent || event || window.event;

		event = event.touches && event.touches.length ?
			event.touches[0] : event.changedTouches && event.changedTouches.length ?
				event.changedTouches[0] : event;

		if (event.pageX) {
			result.x = event.pageX;
			result.y = event.pageY;
		} else {
			result.x = event.clientX;
			result.y = event.clientY;
		}

		return result;
	};

	/**
	 * Determines if the input is a Number or something that can be coerced to a Number
	 * @protected
	 * @param {Number|String|Object|Array|Boolean|RegExp|Function|Symbol} - The input to be tested
	 * @returns {Boolean} - An indication if the input is a Number or can be coerced to a Number
	 */
	Owl.prototype.isNumeric = function(number) {
		return !isNaN(parseFloat(number));
	};

	/**
	 * Gets the difference of two vectors.
	 * @todo #261
	 * @protected
	 * @param {Object} - The first vector.
	 * @param {Object} - The second vector.
	 * @returns {Object} - The difference.
	 */
	Owl.prototype.difference = function(first, second) {
		return {
			x: first.x - second.x,
			y: first.y - second.y
		};
	};

	/**
	 * The jQuery Plugin for the Owl Carousel
	 * @todo Navigation plugin `next` and `prev`
	 * @public
	 */
	$.fn.owlCarousel = function(option) {
		var args = Array.prototype.slice.call(arguments, 1);

		return this.each(function() {
			var $this = $(this),
				data = $this.data('owl.carousel');

			if (!data) {
				data = new Owl(this, typeof option == 'object' && option);
				$this.data('owl.carousel', data);

				$.each([
					'next', 'prev', 'to', 'destroy', 'refresh', 'replace', 'add', 'remove'
				], function(i, event) {
					data.register({ type: Owl.Type.Event, name: event });
					data.$element.on(event + '.owl.carousel.core', $.proxy(function(e) {
						if (e.namespace && e.relatedTarget !== this) {
							this.suppress([ event ]);
							data[event].apply(this, [].slice.call(arguments, 1));
							this.release([ event ]);
						}
					}, data));
				});
			}

			if (typeof option == 'string' && option.charAt(0) !== '_') {
				data[option].apply(data, args);
			}
		});
	};

	/**
	 * The constructor for the jQuery Plugin
	 * @public
	 */
	$.fn.owlCarousel.Constructor = Owl;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoRefresh Plugin
 * @version 2.1.0
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the auto refresh plugin.
	 * @class The Auto Refresh Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var AutoRefresh = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Refresh interval.
		 * @protected
		 * @type {number}
		 */
		this._interval = null;

		/**
		 * Whether the element is currently visible or not.
		 * @protected
		 * @type {Boolean}
		 */
		this._visible = null;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.autoRefresh) {
					this.watch();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoRefresh.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	AutoRefresh.Defaults = {
		autoRefresh: true,
		autoRefreshInterval: 500
	};

	/**
	 * Watches the element.
	 */
	AutoRefresh.prototype.watch = function() {
		if (this._interval) {
			return;
		}

		this._visible = this._core.$element.is(':visible');
		this._interval = window.setInterval($.proxy(this.refresh, this), this._core.settings.autoRefreshInterval);
	};

	/**
	 * Refreshes the element.
	 */
	AutoRefresh.prototype.refresh = function() {
		if (this._core.$element.is(':visible') === this._visible) {
			return;
		}

		this._visible = !this._visible;

		this._core.$element.toggleClass('owl-hidden', !this._visible);

		this._visible && (this._core.invalidate('width') && this._core.refresh());
	};

	/**
	 * Destroys the plugin.
	 */
	AutoRefresh.prototype.destroy = function() {
		var handler, property;

		window.clearInterval(this._interval);

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoRefresh = AutoRefresh;

})(window.Zepto || window.jQuery, window, document);

/**
 * Lazy Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the lazy plugin.
	 * @class The Lazy Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Lazy = function(carousel) {

		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Already loaded items.
		 * @protected
		 * @type {Array.<jQuery>}
		 */
		this._loaded = [];

		/**
		 * Event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel change.owl.carousel resized.owl.carousel': $.proxy(function(e) {
				if (!e.namespace) {
					return;
				}

				if (!this._core.settings || !this._core.settings.lazyLoad) {
					return;
				}

				if ((e.property && e.property.name == 'position') || e.type == 'initialized') {
					var settings = this._core.settings,
						n = (settings.center && Math.ceil(settings.items / 2) || settings.items),
						i = ((settings.center && n * -1) || 0),
						position = (e.property && e.property.value !== undefined ? e.property.value : this._core.current()) + i,
						clones = this._core.clones().length,
						load = $.proxy(function(i, v) { this.load(v) }, this);

					while (i++ < n) {
						this.load(clones / 2 + this._core.relative(position));
						clones && $.each(this._core.clones(this._core.relative(position)), load);
						position++;
					}
				}
			}, this)
		};

		// set the default options
		this._core.options = $.extend({}, Lazy.Defaults, this._core.options);

		// register event handler
		this._core.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	Lazy.Defaults = {
		lazyLoad: false
	};

	/**
	 * Loads all resources of an item at the specified position.
	 * @param {Number} position - The absolute position of the item.
	 * @protected
	 */
	Lazy.prototype.load = function(position) {
		var $item = this._core.$stage.children().eq(position),
			$elements = $item && $item.find('.owl-lazy');

		if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
			return;
		}

		$elements.each($.proxy(function(index, element) {
			var $element = $(element), image,
				url = (window.devicePixelRatio > 1 && $element.attr('data-src-retina')) || $element.attr('data-src');

			this._core.trigger('load', { element: $element, url: url }, 'lazy');

			if ($element.is('img')) {
				$element.one('load.owl.lazy', $.proxy(function() {
					$element.css('opacity', 1);
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this)).attr('src', url);
			} else {
				image = new Image();
				image.onload = $.proxy(function() {
					$element.css({
						'background-image': 'url(' + url + ')',
						'opacity': '1'
					});
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this);
				image.src = url;
			}
		}, this));

		this._loaded.push($item.get(0));
	};

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Lazy.prototype.destroy = function() {
		var handler, property;

		for (handler in this.handlers) {
			this._core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoHeight Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the auto height plugin.
	 * @class The Auto Height Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var AutoHeight = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel refreshed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.autoHeight) {
					this.update();
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.autoHeight && e.property.name == 'position'){
					this.update();
				}
			}, this),
			'loaded.owl.lazy': $.proxy(function(e) {
				if (e.namespace && this._core.settings.autoHeight
					&& e.element.closest('.' + this._core.settings.itemClass).index() === this._core.current()) {
					this.update();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	AutoHeight.Defaults = {
		autoHeight: false,
		autoHeightClass: 'owl-height'
	};

	/**
	 * Updates the view.
	 */
	AutoHeight.prototype.update = function() {
		var start = this._core._current,
			end = start + this._core.settings.items,
			visible = this._core.$stage.children().toArray().slice(start, end),
			heights = [],
			maxheight = 0;

		$.each(visible, function(index, item) {
			heights.push($(item).height());
		});

		maxheight = Math.max.apply(null, heights);

		this._core.$stage.parent()
			.height(maxheight)
			.addClass(this._core.settings.autoHeightClass);
	};

	AutoHeight.prototype.destroy = function() {
		var handler, property;

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;

})(window.Zepto || window.jQuery, window, document);

/**
 * Video Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the video plugin.
	 * @class The Video Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Video = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Cache all video URLs.
		 * @protected
		 * @type {Object}
		 */
		this._videos = {};

		/**
		 * Current playing item.
		 * @protected
		 * @type {jQuery}
		 */
		this._playing = null;

		/**
		 * All event handlers.
		 * @todo The cloned content removale is too late
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function(e) {
				if (e.namespace) {
					this._core.register({ type: 'state', name: 'playing', tags: [ 'interacting' ] });
				}
			}, this),
			'resize.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.video && this.isInFullScreen()) {
					e.preventDefault();
				}
			}, this),
			'refreshed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.is('resizing')) {
					this._core.$stage.find('.cloned .owl-video-frame').remove();
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && e.property.name === 'position' && this._playing) {
					this.stop();
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function(e) {
				if (!e.namespace) {
					return;
				}

				var $element = $(e.content).find('.owl-video');

				if ($element.length) {
					$element.css('display', 'none');
					this.fetch($element, $(e.content));
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Video.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);

		this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function(e) {
			this.play(e);
		}, this));
	};

	/**
	 * Default options.
	 * @public
	 */
	Video.Defaults = {
		video: false,
		videoHeight: false,
		videoWidth: false
	};

	/**
	 * Gets the video ID and the type (YouTube/Vimeo/vzaar only).
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {jQuery} item - The item containing the video.
	 */
	Video.prototype.fetch = function(target, item) {
			var type = (function() {
					if (target.attr('data-vimeo-id')) {
						return 'vimeo';
					} else if (target.attr('data-vzaar-id')) {
						return 'vzaar'
					} else {
						return 'youtube';
					}
				})(),
				id = target.attr('data-vimeo-id') || target.attr('data-youtube-id') || target.attr('data-vzaar-id'),
				width = target.attr('data-width') || this._core.settings.videoWidth,
				height = target.attr('data-height') || this._core.settings.videoHeight,
				url = target.attr('href');

		if (url) {

			/*
					Parses the id's out of the following urls (and probably more):
					https://www.youtube.com/watch?v=:id
					https://youtu.be/:id
					https://vimeo.com/:id
					https://vimeo.com/channels/:channel/:id
					https://vimeo.com/groups/:group/videos/:id
					https://app.vzaar.com/videos/:id

					Visual example: https://regexper.com/#(http%3A%7Chttps%3A%7C)%5C%2F%5C%2F(player.%7Cwww.%7Capp.)%3F(vimeo%5C.com%7Cyoutu(be%5C.com%7C%5C.be%7Cbe%5C.googleapis%5C.com)%7Cvzaar%5C.com)%5C%2F(video%5C%2F%7Cvideos%5C%2F%7Cembed%5C%2F%7Cchannels%5C%2F.%2B%5C%2F%7Cgroups%5C%2F.%2B%5C%2F%7Cwatch%5C%3Fv%3D%7Cv%5C%2F)%3F(%5BA-Za-z0-9._%25-%5D*)(%5C%26%5CS%2B)%3F
			*/

			id = url.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

			if (id[3].indexOf('youtu') > -1) {
				type = 'youtube';
			} else if (id[3].indexOf('vimeo') > -1) {
				type = 'vimeo';
			} else if (id[3].indexOf('vzaar') > -1) {
				type = 'vzaar';
			} else {
				throw new Error('Video URL not supported.');
			}
			id = id[6];
		} else {
			throw new Error('Missing video URL.');
		}

		this._videos[url] = {
			type: type,
			id: id,
			width: width,
			height: height
		};

		item.attr('data-video', url);

		this.thumbnail(target, this._videos[url]);
	};

	/**
	 * Creates video thumbnail.
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {Object} info - The video info object.
	 * @see `fetch`
	 */
	Video.prototype.thumbnail = function(target, video) {
		var tnLink,
			icon,
			path,
			dimensions = video.width && video.height ? 'style="width:' + video.width + 'px;height:' + video.height + 'px;"' : '',
			customTn = target.find('img'),
			srcType = 'src',
			lazyClass = '',
			settings = this._core.settings,
			create = function(path) {
				icon = '<div class="owl-video-play-icon"></div>';

				if (settings.lazyLoad) {
					tnLink = '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + path + '"></div>';
				} else {
					tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + path + ')"></div>';
				}
				target.after(tnLink);
				target.after(icon);
			};

		// wrap video content into owl-video-wrapper div
		target.wrap('<div class="owl-video-wrapper"' + dimensions + '></div>');

		if (this._core.settings.lazyLoad) {
			srcType = 'data-src';
			lazyClass = 'owl-lazy';
		}

		// custom thumbnail
		if (customTn.length) {
			create(customTn.attr(srcType));
			customTn.remove();
			return false;
		}

		if (video.type === 'youtube') {
			path = "//img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
			create(path);
		} else if (video.type === 'vimeo') {
			$.ajax({
				type: 'GET',
				url: '//vimeo.com/api/v2/video/' + video.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function(data) {
					path = data[0].thumbnail_large;
					create(path);
				}
			});
		} else if (video.type === 'vzaar') {
			$.ajax({
				type: 'GET',
				url: '//vzaar.com/api/videos/' + video.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function(data) {
					path = data.framegrab_url;
					create(path);
				}
			});
		}
	};

	/**
	 * Stops the current video.
	 * @public
	 */
	Video.prototype.stop = function() {
		this._core.trigger('stop', null, 'video');
		this._playing.find('.owl-video-frame').remove();
		this._playing.removeClass('owl-video-playing');
		this._playing = null;
		this._core.leave('playing');
		this._core.trigger('stopped', null, 'video');
	};

	/**
	 * Starts the current video.
	 * @public
	 * @param {Event} event - The event arguments.
	 */
	Video.prototype.play = function(event) {
		var target = $(event.target),
			item = target.closest('.' + this._core.settings.itemClass),
			video = this._videos[item.attr('data-video')],
			width = video.width || '100%',
			height = video.height || this._core.$stage.height(),
			html;

		if (this._playing) {
			return;
		}

		this._core.enter('playing');
		this._core.trigger('play', null, 'video');

		item = this._core.items(this._core.relative(item.index()));

		this._core.reset(item.index());

		if (video.type === 'youtube') {
			html = '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' +
				video.id + '?autoplay=1&v=' + video.id + '" frameborder="0" allowfullscreen></iframe>';
		} else if (video.type === 'vimeo') {
			html = '<iframe src="//player.vimeo.com/video/' + video.id +
				'?autoplay=1" width="' + width + '" height="' + height +
				'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		} else if (video.type === 'vzaar') {
			html = '<iframe frameborder="0"' + 'height="' + height + '"' + 'width="' + width +
				'" allowfullscreen mozallowfullscreen webkitAllowFullScreen ' +
				'src="//view.vzaar.com/' + video.id + '/player?autoplay=true"></iframe>';
		}

		$('<div class="owl-video-frame">' + html + '</div>').insertAfter(item.find('.owl-video'));

		this._playing = item.addClass('owl-video-playing');
	};

	/**
	 * Checks whether an video is currently in full screen mode or not.
	 * @todo Bad style because looks like a readonly method but changes members.
	 * @protected
	 * @returns {Boolean}
	 */
	Video.prototype.isInFullScreen = function() {
		var element = document.fullscreenElement || document.mozFullScreenElement ||
				document.webkitFullscreenElement;

		return element && $(element).parent().hasClass('owl-video-frame');
	};

	/**
	 * Destroys the plugin.
	 */
	Video.prototype.destroy = function() {
		var handler, property;

		this._core.$element.off('click.owl.video');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Video = Video;

})(window.Zepto || window.jQuery, window, document);

/**
 * Animate Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the animate plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
	var Animate = function(scope) {
		this.core = scope;
		this.core.options = $.extend({}, Animate.Defaults, this.core.options);
		this.swapping = true;
		this.previous = undefined;
		this.next = undefined;

		this.handlers = {
			'change.owl.carousel': $.proxy(function(e) {
				if (e.namespace && e.property.name == 'position') {
					this.previous = this.core.current();
					this.next = e.property.value;
				}
			}, this),
			'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function(e) {
				if (e.namespace) {
					this.swapping = e.type == 'translated';
				}
			}, this),
			'translate.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
					this.swap();
				}
			}, this)
		};

		this.core.$element.on(this.handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	Animate.Defaults = {
		animateOut: false,
		animateIn: false
	};

	/**
	 * Toggles the animation classes whenever an translations starts.
	 * @protected
	 * @returns {Boolean|undefined}
	 */
	Animate.prototype.swap = function() {

		if (this.core.settings.items !== 1) {
			return;
		}

		if (!$.support.animation || !$.support.transition) {
			return;
		}

		this.core.speed(0);

		var left,
			clear = $.proxy(this.clear, this),
			previous = this.core.$stage.children().eq(this.previous),
			next = this.core.$stage.children().eq(this.next),
			incoming = this.core.settings.animateIn,
			outgoing = this.core.settings.animateOut;

		if (this.core.current() === this.previous) {
			return;
		}

		if (outgoing) {
			left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
			previous.one($.support.animation.end, clear)
				.css( { 'left': left + 'px' } )
				.addClass('animated owl-animated-out')
				.addClass(outgoing);
		}

		if (incoming) {
			next.one($.support.animation.end, clear)
				.addClass('animated owl-animated-in')
				.addClass(incoming);
		}
	};

	Animate.prototype.clear = function(e) {
		$(e.target).css( { 'left': '' } )
			.removeClass('animated owl-animated-out owl-animated-in')
			.removeClass(this.core.settings.animateIn)
			.removeClass(this.core.settings.animateOut);
		this.core.onTransitionEnd();
	};

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Animate.prototype.destroy = function() {
		var handler, property;

		for (handler in this.handlers) {
			this.core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Animate = Animate;

})(window.Zepto || window.jQuery, window, document);

/**
 * Autoplay Plugin
 * @version 2.1.0
 * @author Bartosz Wojciechowski
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the autoplay plugin.
	 * @class The Autoplay Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
	var Autoplay = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * The autoplay timeout.
		 * @type {Timeout}
		 */
		this._timeout = null;

		/**
		 * Indicates whenever the autoplay is paused.
		 * @type {Boolean}
		 */
		this._paused = false;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && e.property.name === 'settings') {
					if (this._core.settings.autoplay) {
						this.play();
					} else {
						this.stop();
					}
				} else if (e.namespace && e.property.name === 'position') {
					//console.log('play?', e);
					if (this._core.settings.autoplay) {
						this._setAutoPlayInterval();
					}
				}
			}, this),
			'initialized.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.autoplay) {
					this.play();
				}
			}, this),
			'play.owl.autoplay': $.proxy(function(e, t, s) {
				if (e.namespace) {
					this.play(t, s);
				}
			}, this),
			'stop.owl.autoplay': $.proxy(function(e) {
				if (e.namespace) {
					this.stop();
				}
			}, this),
			'mouseover.owl.autoplay': $.proxy(function() {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.pause();
				}
			}, this),
			'mouseleave.owl.autoplay': $.proxy(function() {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.play();
				}
			}, this),
			'touchstart.owl.core': $.proxy(function() {
				if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
					this.pause();
				}
			}, this),
			'touchend.owl.core': $.proxy(function() {
				if (this._core.settings.autoplayHoverPause) {
					this.play();
				}
			}, this)
		};

		// register event handlers
		this._core.$element.on(this._handlers);

		// set default options
		this._core.options = $.extend({}, Autoplay.Defaults, this._core.options);
	};

	/**
	 * Default options.
	 * @public
	 */
	Autoplay.Defaults = {
		autoplay: false,
		autoplayTimeout: 5000,
		autoplayHoverPause: false,
		autoplaySpeed: false
	};

	/**
	 * Starts the autoplay.
	 * @public
	 * @param {Number} [timeout] - The interval before the next animation starts.
	 * @param {Number} [speed] - The animation speed for the animations.
	 */
	Autoplay.prototype.play = function(timeout, speed) {
		this._paused = false;

		if (this._core.is('rotating')) {
			return;
		}

		this._core.enter('rotating');

		this._setAutoPlayInterval();
	};

	/**
	 * Gets a new timeout
	 * @private
	 * @param {Number} [timeout] - The interval before the next animation starts.
	 * @param {Number} [speed] - The animation speed for the animations.
	 * @return {Timeout}
	 */
	Autoplay.prototype._getNextTimeout = function(timeout, speed) {
		if ( this._timeout ) {
			window.clearTimeout(this._timeout);
		}
		return window.setTimeout($.proxy(function() {
			if (this._paused || this._core.is('busy') || this._core.is('interacting') || document.hidden) {
				return;
			}
			this._core.next(speed || this._core.settings.autoplaySpeed);
		}, this), timeout || this._core.settings.autoplayTimeout);
	};

	/**
	 * Sets autoplay in motion.
	 * @private
	 */
	Autoplay.prototype._setAutoPlayInterval = function() {
		this._timeout = this._getNextTimeout();
	};

	/**
	 * Stops the autoplay.
	 * @public
	 */
	Autoplay.prototype.stop = function() {
		if (!this._core.is('rotating')) {
			return;
		}

		window.clearTimeout(this._timeout);
		this._core.leave('rotating');
	};

	/**
	 * Stops the autoplay.
	 * @public
	 */
	Autoplay.prototype.pause = function() {
		if (!this._core.is('rotating')) {
			return;
		}

		this._paused = true;
	};

	/**
	 * Destroys the plugin.
	 */
	Autoplay.prototype.destroy = function() {
		var handler, property;

		this.stop();

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;

})(window.Zepto || window.jQuery, window, document);

/**
 * Navigation Plugin
 * @version 2.1.0
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {
	'use strict';

	/**
	 * Creates the navigation plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} carousel - The Owl Carousel.
	 */
	var Navigation = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Indicates whether the plugin is initialized or not.
		 * @protected
		 * @type {Boolean}
		 */
		this._initialized = false;

		/**
		 * The current paging indexes.
		 * @protected
		 * @type {Array}
		 */
		this._pages = [];

		/**
		 * All DOM elements of the user interface.
		 * @protected
		 * @type {Object}
		 */
		this._controls = {};

		/**
		 * Markup for an indicator.
		 * @protected
		 * @type {Array.<String>}
		 */
		this._templates = [];

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
		this.$element = this._core.$element;

		/**
		 * Overridden methods of the carousel.
		 * @protected
		 * @type {Object}
		 */
		this._overrides = {
			next: this._core.next,
			prev: this._core.prev,
			to: this._core.to
		};

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'prepared.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.push('<div class="' + this._core.settings.dotClass + '">' +
						$(e.content).find('[data-dot]').addBack('[data-dot]').attr('data-dot') + '</div>');
				}
			}, this),
			'added.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.splice(e.position, 0, this._templates.pop());
				}
			}, this),
			'remove.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.dotsData) {
					this._templates.splice(e.position, 1);
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && e.property.name == 'position') {
					this.draw();
				}
			}, this),
			'initialized.owl.carousel': $.proxy(function(e) {
				if (e.namespace && !this._initialized) {
					this._core.trigger('initialize', null, 'navigation');
					this.initialize();
					this.update();
					this.draw();
					this._initialized = true;
					this._core.trigger('initialized', null, 'navigation');
				}
			}, this),
			'refreshed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._initialized) {
					this._core.trigger('refresh', null, 'navigation');
					this.update();
					this.draw();
					this._core.trigger('refreshed', null, 'navigation');
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Navigation.Defaults, this._core.options);

		// register event handlers
		this.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 * @todo Rename `slideBy` to `navBy`
	 */
	Navigation.Defaults = {
		nav: false,
		navText: [ 'prev', 'next' ],
		navSpeed: false,
		navElement: 'div',
		navContainer: false,
		navContainerClass: 'owl-nav',
		navClass: [ 'owl-prev', 'owl-next' ],
		slideBy: 1,
		dotClass: 'owl-dot',
		dotsClass: 'owl-dots',
		dots: true,
		dotsEach: false,
		dotsData: false,
		dotsSpeed: false,
		dotsContainer: false
	};

	/**
	 * Initializes the layout of the plugin and extends the carousel.
	 * @protected
	 */
	Navigation.prototype.initialize = function() {
		var override,
			settings = this._core.settings;

		// create DOM structure for relative navigation
		this._controls.$relative = (settings.navContainer ? $(settings.navContainer)
			: $('<div>').addClass(settings.navContainerClass).appendTo(this.$element)).addClass('disabled');

		this._controls.$previous = $('<' + settings.navElement + '>')
			.addClass(settings.navClass[0])
			.html(settings.navText[0])
			.prependTo(this._controls.$relative)
			.on('click', $.proxy(function(e) {
				this.prev(settings.navSpeed);
			}, this));
		this._controls.$next = $('<' + settings.navElement + '>')
			.addClass(settings.navClass[1])
			.html(settings.navText[1])
			.appendTo(this._controls.$relative)
			.on('click', $.proxy(function(e) {
				this.next(settings.navSpeed);
			}, this));

		// create DOM structure for absolute navigation
		if (!settings.dotsData) {
			this._templates = [ $('<div>')
				.addClass(settings.dotClass)
				.append($('<span>'))
				.prop('outerHTML') ];
		}

		this._controls.$absolute = (settings.dotsContainer ? $(settings.dotsContainer)
			: $('<div>').addClass(settings.dotsClass).appendTo(this.$element)).addClass('disabled');

		this._controls.$absolute.on('click', 'div', $.proxy(function(e) {
			var index = $(e.target).parent().is(this._controls.$absolute)
				? $(e.target).index() : $(e.target).parent().index();

			e.preventDefault();

			this.to(index, settings.dotsSpeed);
		}, this));

		// override public methods of the carousel
		for (override in this._overrides) {
			this._core[override] = $.proxy(this[override], this);
		}
	};

	/**
	 * Destroys the plugin.
	 * @protected
	 */
	Navigation.prototype.destroy = function() {
		var handler, control, property, override;

		for (handler in this._handlers) {
			this.$element.off(handler, this._handlers[handler]);
		}
		for (control in this._controls) {
			this._controls[control].remove();
		}
		for (override in this.overides) {
			this._core[override] = this._overrides[override];
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	/**
	 * Updates the internal state.
	 * @protected
	 */
	Navigation.prototype.update = function() {
		var i, j, k,
			lower = this._core.clones().length / 2,
			upper = lower + this._core.items().length,
			maximum = this._core.maximum(true),
			settings = this._core.settings,
			size = settings.center || settings.autoWidth || settings.dotsData
				? 1 : settings.dotsEach || settings.items;

		if (settings.slideBy !== 'page') {
			settings.slideBy = Math.min(settings.slideBy, settings.items);
		}

		if (settings.dots || settings.slideBy == 'page') {
			this._pages = [];

			for (i = lower, j = 0, k = 0; i < upper; i++) {
				if (j >= size || j === 0) {
					this._pages.push({
						start: Math.min(maximum, i - lower),
						end: i - lower + size - 1
					});
					if (Math.min(maximum, i - lower) === maximum) {
						break;
					}
					j = 0, ++k;
				}
				j += this._core.mergers(this._core.relative(i));
			}
		}
	};

	/**
	 * Draws the user interface.
	 * @todo The option `dotsData` wont work.
	 * @protected
	 */
	Navigation.prototype.draw = function() {
		var difference,
			settings = this._core.settings,
			disabled = this._core.items().length <= settings.items,
			index = this._core.relative(this._core.current()),
			loop = settings.loop || settings.rewind;

		this._controls.$relative.toggleClass('disabled', !settings.nav || disabled);

		if (settings.nav) {
			this._controls.$previous.toggleClass('disabled', !loop && index <= this._core.minimum(true));
			this._controls.$next.toggleClass('disabled', !loop && index >= this._core.maximum(true));
		}

		this._controls.$absolute.toggleClass('disabled', !settings.dots || disabled);

		if (settings.dots) {
			difference = this._pages.length - this._controls.$absolute.children().length;

			if (settings.dotsData && difference !== 0) {
				this._controls.$absolute.html(this._templates.join(''));
			} else if (difference > 0) {
				this._controls.$absolute.append(new Array(difference + 1).join(this._templates[0]));
			} else if (difference < 0) {
				this._controls.$absolute.children().slice(difference).remove();
			}

			this._controls.$absolute.find('.active').removeClass('active');
			this._controls.$absolute.children().eq($.inArray(this.current(), this._pages)).addClass('active');
		}
	};

	/**
	 * Extends event data.
	 * @protected
	 * @param {Event} event - The event object which gets thrown.
	 */
	Navigation.prototype.onTrigger = function(event) {
		var settings = this._core.settings;

		event.page = {
			index: $.inArray(this.current(), this._pages),
			count: this._pages.length,
			size: settings && (settings.center || settings.autoWidth || settings.dotsData
				? 1 : settings.dotsEach || settings.items)
		};
	};

	/**
	 * Gets the current page position of the carousel.
	 * @protected
	 * @returns {Number}
	 */
	Navigation.prototype.current = function() {
		var current = this._core.relative(this._core.current());
		return $.grep(this._pages, $.proxy(function(page, index) {
			return page.start <= current && page.end >= current;
		}, this)).pop();
	};

	/**
	 * Gets the current succesor/predecessor position.
	 * @protected
	 * @returns {Number}
	 */
	Navigation.prototype.getPosition = function(successor) {
		var position, length,
			settings = this._core.settings;

		if (settings.slideBy == 'page') {
			position = $.inArray(this.current(), this._pages);
			length = this._pages.length;
			successor ? ++position : --position;
			position = this._pages[((position % length) + length) % length].start;
		} else {
			position = this._core.relative(this._core.current());
			length = this._core.items().length;
			successor ? position += settings.slideBy : position -= settings.slideBy;
		}

		return position;
	};

	/**
	 * Slides to the next item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
	Navigation.prototype.next = function(speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
	};

	/**
	 * Slides to the previous item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
	Navigation.prototype.prev = function(speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
	};

	/**
	 * Slides to the specified item or page.
	 * @public
	 * @param {Number} position - The position of the item or page.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
	 */
	Navigation.prototype.to = function(position, speed, standard) {
		var length;

		if (!standard && this._pages.length) {
			length = this._pages.length;
			$.proxy(this._overrides.to, this._core)(this._pages[((position % length) + length) % length].start, speed);
		} else {
			$.proxy(this._overrides.to, this._core)(position, speed);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;

})(window.Zepto || window.jQuery, window, document);

/**
 * Hash Plugin
 * @version 2.1.0
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {
	'use strict';

	/**
	 * Creates the hash plugin.
	 * @class The Hash Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Hash = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Hash index for the items.
		 * @protected
		 * @type {Object}
		 */
		this._hashes = {};

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
		this.$element = this._core.$element;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function(e) {
				if (e.namespace && this._core.settings.startPosition === 'URLHash') {
					$(window).trigger('hashchange.owl.navigation');
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function(e) {
				if (e.namespace) {
					var hash = $(e.content).find('[data-hash]').addBack('[data-hash]').attr('data-hash');

					if (!hash) {
						return;
					}

					this._hashes[hash] = e.content;
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.namespace && e.property.name === 'position') {
					var current = this._core.items(this._core.relative(this._core.current())),
						hash = $.map(this._hashes, function(item, hash) {
							return item === current ? hash : null;
						}).join();

					if (!hash || window.location.hash.slice(1) === hash) {
						return;
					}

					window.location.hash = hash;
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Hash.Defaults, this._core.options);

		// register the event handlers
		this.$element.on(this._handlers);

		// register event listener for hash navigation
		$(window).on('hashchange.owl.navigation', $.proxy(function(e) {
			var hash = window.location.hash.substring(1),
				items = this._core.$stage.children(),
				position = this._hashes[hash] && items.index(this._hashes[hash]);

			if (position === undefined || position === this._core.current()) {
				return;
			}

			this._core.to(this._core.relative(position), false, true);
		}, this));
	};

	/**
	 * Default options.
	 * @public
	 */
	Hash.Defaults = {
		URLhashListener: false
	};

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Hash.prototype.destroy = function() {
		var handler, property;

		$(window).off('hashchange.owl.navigation');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Hash = Hash;

})(window.Zepto || window.jQuery, window, document);

/**
 * Support Plugin
 *
 * @version 2.1.0
 * @author Vivid Planet Software GmbH
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	var style = $('<support>').get(0).style,
		prefixes = 'Webkit Moz O ms'.split(' '),
		events = {
			transition: {
				end: {
					WebkitTransition: 'webkitTransitionEnd',
					MozTransition: 'transitionend',
					OTransition: 'oTransitionEnd',
					transition: 'transitionend'
				}
			},
			animation: {
				end: {
					WebkitAnimation: 'webkitAnimationEnd',
					MozAnimation: 'animationend',
					OAnimation: 'oAnimationEnd',
					animation: 'animationend'
				}
			}
		},
		tests = {
			csstransforms: function() {
				return !!test('transform');
			},
			csstransforms3d: function() {
				return !!test('perspective');
			},
			csstransitions: function() {
				return !!test('transition');
			},
			cssanimations: function() {
				return !!test('animation');
			}
		};

	function test(property, prefixed) {
		var result = false,
			upper = property.charAt(0).toUpperCase() + property.slice(1);

		$.each((property + ' ' + prefixes.join(upper + ' ') + upper).split(' '), function(i, property) {
			if (style[property] !== undefined) {
				result = prefixed ? property : true;
				return false;
			}
		});

		return result;
	}

	function prefixed(property) {
		return test(property, true);
	}

	if (tests.csstransitions()) {
		/* jshint -W053 */
		$.support.transition = new String(prefixed('transition'))
		$.support.transition.end = events.transition.end[ $.support.transition ];
	}

	if (tests.cssanimations()) {
		/* jshint -W053 */
		$.support.animation = new String(prefixed('animation'))
		$.support.animation.end = events.animation.end[ $.support.animation ];
	}

	if (tests.csstransforms()) {
		/* jshint -W053 */
		$.support.transform = new String(prefixed('transform'));
		$.support.transform3d = tests.csstransforms3d();
	}

})(window.Zepto || window.jQuery, window, document);

/*!
 * jQuery Browser Plugin 0.0.7
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Original jquery-browser code Copyright 2005, 2015 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * Modifications Copyright 2015 Gabriel Cebrian
 * https://github.com/gabceb
 *
 * Released under the MIT license
 *
 * Date: 19-05-2015
 */
/*global window: false */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], function($) {
      factory($);
    });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    // Node-like environment
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function(jQuery) {
  "use strict";

  function uaMatch( ua ) {
    // If an UA is not provided, default to the current browser UA.
    if ( ua === undefined ) {
      ua = window.navigator.userAgent;
    }
    ua = ua.toLowerCase();

    var match = /(edge)\/([\w.]+)/.exec( ua ) ||
        /(opr)[\/]([\w.]+)/.exec( ua ) ||
        /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    var platform_match = /(ipad)/.exec( ua ) ||
        /(ipod)/.exec( ua ) ||
        /(iphone)/.exec( ua ) ||
        /(kindle)/.exec( ua ) ||
        /(silk)/.exec( ua ) ||
        /(android)/.exec( ua ) ||
        /(windows phone)/.exec( ua ) ||
        /(win)/.exec( ua ) ||
        /(mac)/.exec( ua ) ||
        /(linux)/.exec( ua ) ||
        /(cros)/.exec( ua ) ||
        /(playbook)/.exec( ua ) ||
        /(bb)/.exec( ua ) ||
        /(blackberry)/.exec( ua ) ||
        [];

    var browser = {},
        matched = {
          browser: match[ 5 ] || match[ 3 ] || match[ 1 ] || "",
          version: match[ 2 ] || match[ 4 ] || "0",
          versionNumber: match[ 4 ] || match[ 2 ] || "0",
          platform: platform_match[ 0 ] || ""
        };

    if ( matched.browser ) {
      browser[ matched.browser ] = true;
      browser.version = matched.version;
      browser.versionNumber = parseInt(matched.versionNumber, 10);
    }

    if ( matched.platform ) {
      browser[ matched.platform ] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if ( browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
      browser.ipod || browser.kindle || browser.playbook || browser.silk || browser[ "windows phone" ]) {
      browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if ( browser.cros || browser.mac || browser.linux || browser.win ) {
      browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if ( browser.chrome || browser.opr || browser.safari ) {
      browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    // IE12 disguises itself as Chrome, but adds a new Edge token.
    if ( browser.rv || browser.edge ) {
      var ie = "msie";

      matched.browser = ie;
      browser[ie] = true;
    }

    // Blackberry browsers are marked as Safari on BlackBerry
    if ( browser.safari && browser.blackberry ) {
      var blackberry = "blackberry";

      matched.browser = blackberry;
      browser[blackberry] = true;
    }

    // Playbook browsers are marked as Safari on Playbook
    if ( browser.safari && browser.playbook ) {
      var playbook = "playbook";

      matched.browser = playbook;
      browser[playbook] = true;
    }

    // BB10 is a newer OS version of BlackBerry
    if ( browser.bb ) {
      var bb = "blackberry";

      matched.browser = bb;
      browser[bb] = true;
    }

    // Opera 15+ are identified as opr
    if ( browser.opr ) {
      var opera = "opera";

      matched.browser = opera;
      browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if ( browser.safari && browser.android ) {
      var android = "android";

      matched.browser = android;
      browser[android] = true;
    }

    // Kindle browsers are marked as Safari on Kindle
    if ( browser.safari && browser.kindle ) {
      var kindle = "kindle";

      matched.browser = kindle;
      browser[kindle] = true;
    }

     // Kindle Silk browsers are marked as Safari on Kindle
    if ( browser.safari && browser.silk ) {
      var silk = "silk";

      matched.browser = silk;
      browser[silk] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;
    return browser;
  }

  // Run the matching process, also assign the function to the returned object
  // for manual, jQuery-free use if desired
  window.jQBrowser = uaMatch( window.navigator.userAgent );
  window.jQBrowser.uaMatch = uaMatch;

  // Only assign to jQuery.browser if jQuery is loaded
  if ( jQuery ) {
    jQuery.browser = window.jQBrowser;
  }

  return window.jQBrowser;
}));
//
// SmoothScroll for websites v1.2.1
// Licensed under the terms of the MIT license.
//
// You may use it in your theme if you credit me. 
// It is also free to use on any individual website.
//
// Exception:
// The only restriction would be not to publish any  
// extension for browsers or native application
// without getting a permission first.
//

// People involved
//  - Balazs Galambosi (maintainer)   
//  - Michael Herf     (Pulse Algorithm)

(function($) {
    $.extend({
        webkitSmoothScroll: function(){
              
            // Scroll Variables (tweakable)
            var defaultOptions = {

                // Scrolling Core
                frameRate        : 120, // [Hz]
                animationTime    : 600, // [px]
                stepSize         : 135, // [px]

                // Pulse (less tweakable)
                // ratio of "tail" to "acceleration"
                pulseAlgorithm   : true,
                pulseScale       : 7,
                pulseNormalize   : 1,

                // Acceleration
                accelerationDelta : 20,  // 20
                accelerationMax   : 1,   // 1

                // Keyboard Settings
                keyboardSupport   : true,  // option
                arrowScroll       : 50,     // [px]

                // Other
                touchpadSupport   : true,
                fixedBackground   : true, 
                excluded          : ""    
            };

            var options = defaultOptions;


            // Other Variables
            var isExcluded = false;
            var isFrame = false;
            var direction = { x: 0, y: 0 };
            var initDone  = false;
            var root = document.documentElement;
            var activeElement;
            var observer;
            var deltaBuffer = [ 120, 120, 120 ];

            var key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32, 
                        pageup: 33, pagedown: 34, end: 35, home: 36 };


            /***********************************************
             * SETTINGS
             ***********************************************/

            var options = defaultOptions;


            /***********************************************
             * INITIALIZE
             ***********************************************/

            /**
             * Tests if smooth scrolling is allowed. Shuts down everything if not.
             */
            function initTest() {

                var disableKeyboard = false; 
                
                // disable keyboard support if anything above requested it
                if (disableKeyboard) {
                    removeEvent("keydown", keydown);
                }

                if (options.keyboardSupport && !disableKeyboard) {
                    addEvent("keydown", keydown);
                }
            }

            /**
             * Sets up scrolls array, determines if frames are involved.
             */
            function init() {
              
                if (!document.body) return;

                var body = document.body;
                var html = document.documentElement;
                var windowHeight = window.innerHeight; 
                var scrollHeight = body.scrollHeight;
                
                // check compat mode for root element
                root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
                activeElement = body;
                
                initTest();
                initDone = true;

                // Checks if this script is running in a frame
                if (top != self) {
                    isFrame = true;
                }

                /**
                 * This fixes a bug where the areas left and right to 
                 * the content does not trigger the onmousewheel event
                 * on some pages. e.g.: html, body { height: 100% }
                 */
                else if (scrollHeight > windowHeight &&
                        (body.offsetHeight <= windowHeight || 
                         html.offsetHeight <= windowHeight)) {

                    // DOMChange (throttle): fix height
                    var pending = false;
                    var refresh = function () {
                        if (!pending && html.scrollHeight != document.height) {
                            pending = true; // add a new pending action
                            setTimeout(function () {
                                html.style.height = document.height + 'px';
                                pending = false;
                            }, 500); // act rarely to stay fast
                        }
                    };
                    html.style.height = 'auto';
                    setTimeout(refresh, 10);

                    // clearfix
                    if (root.offsetHeight <= windowHeight) {
                        var underlay = document.createElement("div"); 	
                        underlay.style.clear = "both";
                        body.appendChild(underlay);
                    }
                }

                // disable fixed background
                if (!options.fixedBackground && !isExcluded) {
                    body.style.backgroundAttachment = "scroll";
                    html.style.backgroundAttachment = "scroll";
                }
            }


            /************************************************
             * SCROLLING 
             ************************************************/
             
            var que = [];
            var pending = false;
            var lastScroll = +new Date;

            /**
             * Pushes scroll actions to the scrolling queue.
             */
            function scrollArray(elem, left, top, delay) {
                
                delay || (delay = 1000);
                directionCheck(left, top);

                if (options.accelerationMax != 1) {
                    var now = +new Date;
                    var elapsed = now - lastScroll;
                    if (elapsed < options.accelerationDelta) {
                        var factor = (1 + (30 / elapsed)) / 2;
                        if (factor > 1) {
                            factor = Math.min(factor, options.accelerationMax);
                            left *= factor;
                            top  *= factor;
                        }
                    }
                    lastScroll = +new Date;
                }          
                
                // push a scroll command
                que.push({
                    x: left, 
                    y: top, 
                    lastX: (left < 0) ? 0.99 : -0.99,
                    lastY: (top  < 0) ? 0.99 : -0.99, 
                    start: +new Date
                });
                    
                // don't act if there's a pending queue
                if (pending) {
                    return;
                }  

                var scrollWindow = (elem === document.body);
                
                var step = function (time) {
                    
                    var now = +new Date;
                    var scrollX = 0;
                    var scrollY = 0; 
                
                    for (var i = 0; i < que.length; i++) {
                        
                        var item = que[i];
                        var elapsed  = now - item.start;
                        var finished = (elapsed >= options.animationTime);
                        
                        // scroll position: [0, 1]
                        var position = (finished) ? 1 : elapsed / options.animationTime;
                        
                        // easing [optional]
                        if (options.pulseAlgorithm) {
                            position = pulse(position);
                        }
                        
                        // only need the difference
                        var x = (item.x * position - item.lastX) >> 0;
                        var y = (item.y * position - item.lastY) >> 0;
                        
                        // add this to the total scrolling
                        scrollX += x;
                        scrollY += y;            
                        
                        // update last values
                        item.lastX += x;
                        item.lastY += y;
                    
                        // delete and step back if it's over
                        if (finished) {
                            que.splice(i, 1); i--;
                        }           
                    }

                    // scroll left and top
                    if (scrollWindow) {
                        window.scrollBy(scrollX, scrollY);
                    } 
                    else {
                        if (scrollX) elem.scrollLeft += scrollX;
                        if (scrollY) elem.scrollTop  += scrollY;                    
                    }
                    
                    // clean up if there's nothing left to do
                    if (!left && !top) {
                        que = [];
                    }
                    
                    if (que.length) { 
                        requestFrame(step, elem, (delay / options.frameRate + 1)); 
                    } else { 
                        pending = false;
                    }
                };
                
                // start a new queue of actions
                requestFrame(step, elem, 0);
                pending = true;
            }


            /***********************************************
             * EVENTS
             ***********************************************/

            /**
             * Mouse wheel handler.
             * @param {Object} event
             */
            function wheel(event) {

                if (!initDone) {
                    init();
                }
                
                var target = event.target;
                var overflowing = overflowingAncestor(target);
                
                // use default if there's no overflowing
                // element or default action is prevented    
                if (!overflowing || event.defaultPrevented ||
                    isNodeName(activeElement, "embed") ||
                   (isNodeName(target, "embed") && /\.pdf/i.test(target.src))) {
                    return true;
                }

                var deltaX = event.wheelDeltaX || 0;
                var deltaY = event.wheelDeltaY || 0;
                
                // use wheelDelta if deltaX/Y is not available
                if (!deltaX && !deltaY) {
                    deltaY = event.wheelDelta || 0;
                }

                // check if it's a touchpad scroll that should be ignored
                if (!options.touchpadSupport && isTouchpad(deltaY)) {
                    return true;
                }

                // scale by step size
                // delta is 120 most of the time
                // synaptics seems to send 1 sometimes
                if (Math.abs(deltaX) > 1.2) {
                    deltaX *= options.stepSize / 120;
                }
                if (Math.abs(deltaY) > 1.2) {
                    deltaY *= options.stepSize / 120;
                }
                
                scrollArray(overflowing, -deltaX, -deltaY);
                event.preventDefault();
            }

            /**
             * Keydown event handler.
             * @param {Object} event
             */
            function keydown(event) {

                var target   = event.target;
                var modifier = event.ctrlKey || event.altKey || event.metaKey || 
                              (event.shiftKey && event.keyCode !== key.spacebar);
                
                // do nothing if user is editing text
                // or using a modifier key (except shift)
                // or in a dropdown
                if ( /input|textarea|select|embed/i.test(target.nodeName) ||
                     target.isContentEditable || 
                     event.defaultPrevented   ||
                     modifier ) {
                  return true;
                }
                // spacebar should trigger button press
                if (isNodeName(target, "button") &&
                    event.keyCode === key.spacebar) {
                  return true;
                }
                
                var shift, x = 0, y = 0;
                var elem = overflowingAncestor(activeElement);
                var clientHeight = elem.clientHeight;

                if (elem == document.body) {
                    clientHeight = window.innerHeight;
                }

                switch (event.keyCode) {
                    case key.up:
                        y = -options.arrowScroll;
                        break;
                    case key.down:
                        y = options.arrowScroll;
                        break;         
                    case key.spacebar: // (+ shift)
                        shift = event.shiftKey ? 1 : -1;
                        y = -shift * clientHeight * 0.9;
                        break;
                    case key.pageup:
                        y = -clientHeight * 0.9;
                        break;
                    case key.pagedown:
                        y = clientHeight * 0.9;
                        break;
                    case key.home:
                        y = -elem.scrollTop;
                        break;
                    case key.end:
                        var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
                        y = (damt > 0) ? damt+10 : 0;
                        break;
                    case key.left:
                        x = -options.arrowScroll;
                        break;
                    case key.right:
                        x = options.arrowScroll;
                        break;            
                    default:
                        return true; // a key we don't care about
                }

                scrollArray(elem, x, y);
                event.preventDefault();
            }

            /**
             * Mousedown event only for updating activeElement
             */
            function mousedown(event) {
                activeElement = event.target;
            }


            /***********************************************
             * OVERFLOW
             ***********************************************/
             
            var cache = {}; // cleared out every once in while
            setInterval(function () { cache = {}; }, 10 * 1000);

            var uniqueID = (function () {
                var i = 0;
                return function (el) {
                    return el.uniqueID || (el.uniqueID = i++);
                };
            })();

            function setCache(elems, overflowing) {
                for (var i = elems.length; i--;)
                    cache[uniqueID(elems[i])] = overflowing;
                return overflowing;
            }

            function overflowingAncestor(el) {
                var elems = [];
                var rootScrollHeight = root.scrollHeight;
                do {
                    var cached = cache[uniqueID(el)];
                    if (cached) {
                        return setCache(elems, cached);
                    }
                    elems.push(el);
                    if (rootScrollHeight === el.scrollHeight) {
                        if (!isFrame || root.clientHeight + 10 < rootScrollHeight) {
                            return setCache(elems, document.body); // scrolling root in WebKit
                        }
                    } else if (el.clientHeight + 10 < el.scrollHeight) {
                        overflow = getComputedStyle(el, "").getPropertyValue("overflow-y");
                        if (overflow === "scroll" || overflow === "auto") {
                            return setCache(elems, el);
                        }
                    }
                } while (el = el.parentNode);
            }


            /***********************************************
             * HELPERS
             ***********************************************/

            function addEvent(type, fn, bubble) {
                window.addEventListener(type, fn, (bubble||false));
            }

            function removeEvent(type, fn, bubble) {
                window.removeEventListener(type, fn, (bubble||false));  
            }

            function isNodeName(el, tag) {
                return (el.nodeName||"").toLowerCase() === tag.toLowerCase();
            }

            function directionCheck(x, y) {
                x = (x > 0) ? 1 : -1;
                y = (y > 0) ? 1 : -1;
                if (direction.x !== x || direction.y !== y) {
                    direction.x = x;
                    direction.y = y;
                    que = [];
                    lastScroll = 0;
                }
            }

            var deltaBufferTimer;

            function isTouchpad(deltaY) {
                if (!deltaY) return;
                deltaY = Math.abs(deltaY)
                deltaBuffer.push(deltaY);
                deltaBuffer.shift();
                clearTimeout(deltaBufferTimer);
                var allDivisable = (isDivisible(deltaBuffer[0], 120) &&
                                    isDivisible(deltaBuffer[1], 120) &&
                                    isDivisible(deltaBuffer[2], 120));
                return !allDivisable;
            } 

            function isDivisible(n, divisor) {
                return (Math.floor(n / divisor) == n / divisor);
            }

            var requestFrame = (function () {
                  return  window.requestAnimationFrame       || 
                          window.webkitRequestAnimationFrame || 
                          function (callback, element, delay) {
                              window.setTimeout(callback, delay || (1000/60));
                          };
            })();


            /***********************************************
             * PULSE
             ***********************************************/
             
            /**
             * Viscous fluid with a pulse for part and decay for the rest.
             * - Applies a fixed force over an interval (a damped acceleration), and
             * - Lets the exponential bleed away the velocity over a longer interval
             * - Michael Herf, http://stereopsis.com/stopping/
             */
            function pulse_(x) {
                var val, start, expx;
                // test
                x = x * options.pulseScale;
                if (x < 1) { // acceleartion
                    val = x - (1 - Math.exp(-x));
                } else {     // tail
                    // the previous animation ended here:
                    start = Math.exp(-1);
                    // simple viscous drag
                    x -= 1;
                    expx = 1 - Math.exp(-x);
                    val = start + (expx * (1 - start));
                }
                return val * options.pulseNormalize;
            }

            function pulse(x) {
                if (x >= 1) return 1;
                if (x <= 0) return 0;

                if (options.pulseNormalize == 1) {
                    options.pulseNormalize /= pulse_(1);
                }
                return pulse_(x);
            }

            var isChrome = /chrome/i.test(window.navigator.userAgent);
            var wheelEvent = null;
            if ("onwheel" in document.createElement("div"))
            	wheelEvent = "wheel";
            else if ("onmousewheel" in document.createElement("div"))
            	wheelEvent = "mousewheel";

            if (wheelEvent && isChrome) {
            	addEvent(wheelEvent, wheel);
            	addEvent("mousedown", mousedown);
            	addEvent("load", init);
            }

        }
    });
})(jQuery);
/* Theme Name: The Project - Responsive Website Template
 * Author:HtmlCoder
 * Author URI:http://www.htmlcoder.me
 * Author e-mail:htmlcoder.me@gmail.com
 * Version:1.3.0
 * Created:March 2015
 * License URI:http://support.wrapbootstrap.com/
 * File Description: Initializations of plugins
 */

(function ($) {
    $(document).ready(function () {

        function syncPosition(el) {
            var current = this.currentItem;
            $(".owl-carousel.content-slider-thumbs")
            .find(".owl-item")
            .removeClass("synced")
            .eq(current)
            .addClass("synced");
            if ($(".owl-carousel.content-slider-thumbs").data("owlCarousel") !== undefined) {
                center(current);
            }
        }

        function center(number) {
            var sync2visible = sync2.data("owlCarousel").owl.visibleItems;
            var num = number;
            var found = false;
            for (var i in sync2visible) {
                if (num === sync2visible[i]) {
                    found = true;
                }
            }

            if (found === false) {
                if (num > sync2visible[sync2visible.length - 1]) {
                    sync2.trigger("owl.goTo", num - sync2visible.length + 2);
                } else {
                    if (num - 1 === -1) {
                        num = 0;
                    }
                    sync2.trigger("owl.goTo", num);
                }
            } else if (num === sync2visible[sync2visible.length - 1]) {
                sync2.trigger("owl.goTo", sync2visible[1]);
            } else if (num === sync2visible[0]) {
                sync2.trigger("owl.goTo", num - 1);
            }

        }

        if ($('.boxed .fullscreen-bg').length > 0) {
            $("body").addClass("transparent-page-wrapper");
        }

        $(window).load(function () {
            $("body").removeClass("no-trans");
        });
        // Enable Smooth Scroll only on Chrome and only on Win and Linux Systems
        var platform = navigator.platform.toLowerCase();
        if ((platform.indexOf('win') === 0 || platform.indexOf('linux') === 0) && !Modernizr.touch) {
            if ($.browser.webkit) {
                $.webkitSmoothScroll();
                console.log("hello webkit");
            }
        }
        //Show dropdown on hover only for desktop devices
        //-----------------------------------------------
        var delay = 0, setTimeoutConst;
        if (Modernizr.mq('only all and (min-width: 768px)') && !Modernizr.touch || $("html.ie8").length > 0) {
            $('.main-navigation:not(.onclick) .navbar-nav>li.dropdown, .main-navigation:not(.onclick) li.dropdown>ul>li.dropdown').hover(
            function () {
                var $this = $(this);
                setTimeoutConst = setTimeout(function () {
                    $this.addClass('open').slideDown();
                    $this.find('.dropdown-toggle').addClass('disabled');
                }, delay);

            }, function () {
                clearTimeout(setTimeoutConst);
                $(this).removeClass('open');
                $(this).find('.dropdown-toggle').removeClass('disabled');
            });
        }

        //Show dropdown on click only for mobile devices
        //-----------------------------------------------
        if (Modernizr.mq('only all and (max-width: 767px)') || Modernizr.touch || $(".main-navigation.onclick").length > 0) {
            $('.main-navigation [data-toggle=dropdown], .header-top [data-toggle=dropdown]').on('click', function (event) {
                // Avoid following the href location when clicking
                event.preventDefault();
                // Avoid having the menu to close when clicking
                event.stopPropagation();
                // close all the siblings
                $(this).parent().siblings().removeClass('open');
                // close all the submenus of siblings
                $(this).parent().siblings().find('[data-toggle=dropdown]').parent().removeClass('open');
                // opening the one you clicked on
                $(this).parent().toggleClass('open');
            });
        }

        //Transparent Header Calculations
        var timer_tr;
        if ($(".transparent-header").length > 0) {
            $(window).load(function () {
                trHeaderHeight = $("header.header").outerHeight();
                $(".transparent-header .tp-bannertimer").css("marginTop", trHeaderHeight + "px");
            });
            $(window).resize(function () {
                if ($(this).scrollTop() < headerTopHeight + headerHeight - 5) {
                    trHeaderHeight = $("header.header").outerHeight();
                    $(".transparent-header .tp-bannertimer").css("marginTop", trHeaderHeight + "px");
                }
            });
            $(window).scroll(function () {
                if ($(this).scrollTop() === 0) {
                    if (timer_tr) {
                        window.clearTimeout(timer_tr);
                    }
                    timer_tr = window.setTimeout(function () {
                        trHeaderHeight = $("header.header").outerHeight();
                        $(".transparent-header .tp-bannertimer").css("marginTop", trHeaderHeight + "px");
                    }, 300);
                }
            });
        }

        if ($(".transparent-header .slideshow").length > 0) {
            $(".header-container header.header").addClass("transparent-header-on");
        } else {
            $(".header-container header.header").removeClass("transparent-header-on");
        }

        //Full Width Slider with Transparent Header Calculations
        if ($(".transparent-header .slider-banner-fullwidth-big-height").length > 0) {
            if (Modernizr.mq('only all and (max-width: 991px)')) {
                $("body").removeClass("transparent-header");
                $(".header-container header.header").removeClass("transparent-header-on");
                $(".tp-bannertimer").css("marginTop", "0px");
                $("body").addClass("slider-banner-fullwidth-big-height-removed");
            } else {
                $("body").addClass("transparent-header");
                $(".header-container header.header").addClass("transparent-header-on");
                $("body").removeClass("slider-banner-fullwidth-big-height-removed");
            }
        }

        if ($(".transparent-header .slider-banner-fullwidth-big-height").length > 0 || $(".slider-banner-fullwidth-big-height-removed").length > 0) {
            $(window).resize(function () {
                if (Modernizr.mq('only all and (max-width: 991px)')) {
                    $("body").removeClass("transparent-header");
                    $(".header-container header.header").removeClass("transparent-header-on");
                    $(".tp-bannertimer").css("marginTop", "0px");
                } else {
                    $("body").addClass("transparent-header");
                    $(".header-container header.header").addClass("transparent-header-on");
                }
            });
        }

        //Revolution Slider 4
        if ($(".slider-banner-container").length > 0) {

            $(".tp-bannertimer").show();

            $('body:not(.transparent-header) .slider-banner-container .slider-banner-fullscreen').show().revolution({
                delay: 8000,
                startwidth: 1140,
                startheight: 520,
                fullWidth: "off",
                fullScreen: "on",
                fullScreenOffsetContainer: ".header-container",
                fullScreenOffset: "0",

                navigationArrows: "solo",

                navigationStyle: "preview2",
                navigationHAlign: "center",
                navigationVAlign: "bottom",
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 0,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 0,
                soloArrowRightVOffset: 0,

                spinner: "spinner2",

                stopLoop: "off",
                stopAfterLoops: -1,
                stopAtSlide: -1,
                onHoverStop: "off",

                shuffle: "off",
                hideTimerBar: "off",

                autoHeight: "off",
                forceFullWidth: "off",

                hideThumbsOnMobile: "off",
                hideNavDelayOnMobile: 1500,
                hideBulletsOnMobile: "off",
                hideArrowsOnMobile: "off",
                hideThumbsUnderResolution: 0,

                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                startWithSlide: 0
            });
            $('.transparent-header .slider-banner-container .slider-banner-fullscreen').show().revolution({
                delay: 8000,
                startwidth: 1140,
                startheight: 520,
                fullWidth: "off",
                fullScreen: "on",
                fullScreenOffsetContainer: ".header-top",
                fullScreenOffset: "",

                navigationArrows: "solo",

                navigationStyle: "preview2",
                navigationHAlign: "center",
                navigationVAlign: "bottom",
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 0,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 0,
                soloArrowRightVOffset: 0,

                spinner: "spinner2",

                stopLoop: "off",
                stopAfterLoops: -1,
                stopAtSlide: -1,
                onHoverStop: "off",

                shuffle: "off",
                hideTimerBar: "off",

                autoHeight: "off",
                forceFullWidth: "off",

                hideThumbsOnMobile: "off",
                hideNavDelayOnMobile: 1500,
                hideBulletsOnMobile: "off",
                hideArrowsOnMobile: "off",
                hideThumbsUnderResolution: 0,

                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                startWithSlide: 0
            });

            $('.slider-banner-container .slider-banner-fullwidth').show().revolution({
                delay: 8000,
                startwidth: 1140,
                startheight: 450,

                navigationArrows: "solo",

                navigationStyle: "preview2",
                navigationHAlign: "center",
                navigationVAlign: "bottom",
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 0,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 0,
                soloArrowRightVOffset: 0,

                fullWidth: "on",

                spinner: "spinner2",

                stopLoop: "off",
                stopAfterLoops: -1,
                stopAtSlide: -1,
                onHoverStop: "off",

                shuffle: "off",

                autoHeight: "off",
                forceFullWidth: "off",

                hideThumbsOnMobile: "off",
                hideNavDelayOnMobile: 1500,
                hideBulletsOnMobile: "off",
                hideArrowsOnMobile: "off",
                hideThumbsUnderResolution: 0,

                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                startWithSlide: 0
            });

            $('.slider-banner-container .slider-banner-fullwidth-big-height').show().revolution({
                delay: 8000,
                startwidth: 1140,
                startheight: 650,

                navigationArrows: "solo",

                navigationStyle: "preview2",
                navigationHAlign: "center",
                navigationVAlign: "bottom",
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 0,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 0,
                soloArrowRightVOffset: 0,

                fullWidth: "on",

                spinner: "spinner2",

                stopLoop: "off",
                stopAfterLoops: -1,
                stopAtSlide: -1,
                onHoverStop: "off",

                shuffle: "off",

                autoHeight: "off",
                forceFullWidth: "off",

                hideThumbsOnMobile: "off",
                hideNavDelayOnMobile: 1500,
                hideBulletsOnMobile: "off",
                hideArrowsOnMobile: "off",
                hideThumbsUnderResolution: 0,

                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                startWithSlide: 0
            });

            $('.banner:not(.dark-bg) .slider-banner-container .slider-banner-boxedwidth').show().revolution({
                delay: 8000,
                startwidth: 1140,
                startheight: 450,

                navigationArrows: "solo",

                navigationStyle: "preview2",
                navigationHAlign: "center",
                navigationVAlign: "bottom",
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 0,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 0,
                soloArrowRightVOffset: 0,

                fullWidth: "off",

                spinner: "spinner2",
                shadow: 1,

                stopLoop: "off",
                stopAfterLoops: -1,
                stopAtSlide: -1,
                onHoverStop: "off",

                shuffle: "off",

                autoHeight: "off",
                forceFullWidth: "off",

                hideThumbsOnMobile: "off",
                hideNavDelayOnMobile: 1500,
                hideBulletsOnMobile: "off",
                hideArrowsOnMobile: "off",
                hideThumbsUnderResolution: 0,

                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                startWithSlide: 0
            });

            $('.banner.dark-bg .slider-banner-container .slider-banner-boxedwidth').show().revolution({
                delay: 8000,
                startwidth: 1140,
                startheight: 450,

                navigationArrows: "solo",

                navigationStyle: "preview2",
                navigationHAlign: "center",
                navigationVAlign: "bottom",
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 0,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 0,
                soloArrowRightVOffset: 0,

                fullWidth: "off",

                spinner: "spinner2",
                shadow: 3,

                stopLoop: "off",
                stopAfterLoops: -1,
                stopAtSlide: -1,
                onHoverStop: "off",

                shuffle: "off",

                autoHeight: "off",
                forceFullWidth: "off",

                hideThumbsOnMobile: "off",
                hideNavDelayOnMobile: 1500,
                hideBulletsOnMobile: "off",
                hideArrowsOnMobile: "off",
                hideThumbsUnderResolution: 0,

                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                startWithSlide: 0
            });

            $('.slider-banner-container .slider-banner-boxedwidth-no-shadow').show().revolution({
                delay: 8000,
                startwidth: 1140,
                startheight: 450,

                navigationArrows: "solo",

                navigationStyle: "preview2",
                navigationHAlign: "center",
                navigationVAlign: "bottom",
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 0,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 0,
                soloArrowRightVOffset: 0,

                fullWidth: "off",

                spinner: "spinner2",
                shadow: 0,

                stopLoop: "off",
                stopAfterLoops: -1,
                stopAtSlide: -1,
                onHoverStop: "off",

                shuffle: "off",

                autoHeight: "off",
                forceFullWidth: "off",

                hideThumbsOnMobile: "off",
                hideNavDelayOnMobile: 1500,
                hideBulletsOnMobile: "off",
                hideArrowsOnMobile: "off",
                hideThumbsUnderResolution: 0,

                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                startWithSlide: 0
            });

            $('.banner:not(.dark-bg) .slider-banner-container .slider-banner-boxedwidth-stopped').show().revolution({
                delay: 8000,
                startwidth: 1140,
                startheight: 450,

                navigationArrows: "solo",

                navigationStyle: "preview2",
                navigationHAlign: "center",
                navigationVAlign: "bottom",
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 0,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 0,
                soloArrowRightVOffset: 0,

                fullWidth: "off",

                spinner: "spinner2",
                shadow: 1,

                stopLoop: "off",
                stopAfterLoops: 0,
                stopAtSlide: 1,
                onHoverStop: "off",

                shuffle: "off",

                autoHeight: "off",
                forceFullWidth: "off",

                hideThumbsOnMobile: "off",
                hideNavDelayOnMobile: 1500,
                hideBulletsOnMobile: "off",
                hideArrowsOnMobile: "off",
                hideThumbsUnderResolution: 0,

                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                startWithSlide: 0
            });

            $('.banner.dark-bg .slider-banner-container .slider-banner-boxedwidth-stopped').show().revolution({
                delay: 8000,
                startwidth: 1140,
                startheight: 450,

                navigationArrows: "solo",

                navigationStyle: "preview2",
                navigationHAlign: "center",
                navigationVAlign: "bottom",
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 0,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 0,
                soloArrowRightVOffset: 0,

                fullWidth: "off",

                spinner: "spinner2",
                shadow: 3,

                stopLoop: "off",
                stopAfterLoops: 0,
                stopAtSlide: 1,
                onHoverStop: "off",

                shuffle: "off",

                autoHeight: "off",
                forceFullWidth: "off",

                hideThumbsOnMobile: "off",
                hideNavDelayOnMobile: 1500,
                hideBulletsOnMobile: "off",
                hideArrowsOnMobile: "off",
                hideThumbsUnderResolution: 0,

                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                startWithSlide: 0
            });

        }

        //Revolution Slider 5
        if ($(".slider-revolution-5-container").length > 0) {
            $(".tp-bannertimer").show();

            $('body:not(.transparent-header) .slider-revolution-5-container .slider-banner-fullscreen').revolution({
                sliderType: "standard",
                sliderLayout: "fullscreen",
                delay: 9000,
                autoHeight: "on",
                responsiveLevels: [1199, 991, 767, 480],
                fullScreenOffsetContainer: ".header-container, .offset-container",
                navigation: {
                    onHoverStop: "off",
                    arrows: {
                        style: "hebe",
                        enable: true,
                        tmp: '<div class="tp-title-wrap"><span class="tp-arr-titleholder">{{title}}</span></div>',
                        left: {
                            h_align: "left",
                            v_align: "center",
                            h_offset: 0,
                            v_offset: 0
                        },
                        right: {
                            h_align: "right",
                            v_align: "center",
                            h_offset: 0,
                            v_offset: 0
                        }
                    },
                    bullets: {
                        style: "",
                        enable: true,
                        hide_onleave: true,
                        direction: "horizontal",
                        space: 3,
                        h_align: "center",
                        v_align: "bottom",
                        h_offset: 0,
                        v_offset: 20
                    }
                },
                gridwidth: 1140,
                gridheight: 750
            });
            $('.transparent-header .slider-revolution-5-container .slider-banner-fullscreen').revolution({
                sliderType: "standard",
                sliderLayout: "fullscreen",
                delay: 9000,
                autoHeight: "on",
                responsiveLevels: [1199, 991, 767, 480],
                fullScreenOffsetContainer: ".header-top, .offset-container",
                navigation: {
                    onHoverStop: "off",
                    arrows: {
                        style: "hebe",
                        enable: true,
                        tmp: '<div class="tp-title-wrap"><span class="tp-arr-titleholder">{{title}}</span></div>',
                        left: {
                            h_align: "left",
                            v_align: "center",
                            h_offset: 0,
                            v_offset: 0
                        },
                        right: {
                            h_align: "right",
                            v_align: "center",
                            h_offset: 0,
                            v_offset: 0
                        }
                    },
                    bullets: {
                        style: "",
                        enable: true,
                        hide_onleave: true,
                        direction: "horizontal",
                        space: 3,
                        h_align: "center",
                        v_align: "bottom",
                        h_offset: 0,
                        v_offset: 20
                    }
                },
                gridwidth: 1140,
                gridheight: 750
            });
            $('.slider-revolution-5-container .slider-banner-fullwidth').revolution({
                sliderType: "standard",
                sliderLayout: "fullwidth",
                delay: 8000,
                gridwidth: 1140,
                gridheight: 450,
                responsiveLevels: [1199, 991, 767, 480],
                navigation: {
                    onHoverStop: "off",
                    arrows: {
                        style: "hebe",
                        enable: true,
                        tmp: '<div class="tp-title-wrap"><span class="tp-arr-titleholder">{{title}}</span></div>',
                        left: {
                            h_align: "left",
                            v_align: "center",
                            h_offset: 0,
                            v_offset: 0
                        },
                        right: {
                            h_align: "right",
                            v_align: "center",
                            h_offset: 0,
                            v_offset: 0
                        }
                    },
                    bullets: {
                        style: "",
                        enable: true,
                        hide_onleave: true,
                        direction: "horizontal",
                        space: 3,
                        h_align: "center",
                        v_align: "bottom",
                        h_offset: 0,
                        v_offset: 20
                    }
                }
            });
            $('.slider-revolution-5-container .slider-banner-fullwidth-big-height').revolution({
                sliderType: "standard",
                sliderLayout: "fullwidth",
                delay: 8000,
                gridwidth: 1140,
                gridheight: 650,
                responsiveLevels: [1199, 991, 767, 480],
                navigation: {
                    onHoverStop: "off",
                    arrows: {
                        style: "hebe",
                        enable: true,
                        tmp: '<div class="tp-title-wrap"><span class="tp-arr-titleholder">{{title}}</span></div>',
                        left: {
                            h_align: "left",
                            v_align: "center",
                            h_offset: 0,
                            v_offset: 0
                        },
                        right: {
                            h_align: "right",
                            v_align: "center",
                            h_offset: 0,
                            v_offset: 0
                        }
                    },
                    bullets: {
                        style: "",
                        enable: true,
                        hide_onleave: true,
                        direction: "horizontal",
                        space: 3,
                        h_align: "center",
                        v_align: "bottom",
                        h_offset: 0,
                        v_offset: 20
                    }
                }
            });
            $('.slider-revolution-5-container .slider-banner-boxedwidth').revolution({
                sliderType: "standard",
                sliderLayout: "auto",
                delay: 8000,
                gridwidth: 1140,
                gridheight: 450,
                responsiveLevels: [1199, 991, 767, 480],
                shadow: 1,
                navigation: {
                    onHoverStop: "off",
                    arrows: {
                        style: "hebe",
                        enable: true,
                        tmp: '<div class="tp-title-wrap"><span class="tp-arr-titleholder">{{title}}</span></div>',
                        left: {
                            h_align: "left",
                            v_align: "center",
                            h_offset: 0,
                            v_offset: 0
                        },
                        right: {
                            h_align: "right",
                            v_align: "center",
                            h_offset: 0,
                            v_offset: 0
                        }
                    },
                    bullets: {
                        style: "",
                        enable: true,
                        hide_onleave: true,
                        direction: "horizontal",
                        space: 3,
                        h_align: "center",
                        v_align: "bottom",
                        h_offset: 0,
                        v_offset: 20
                    }
                }
            });
            $('.slider-revolution-5-container .slider-banner-fullscreen-hero:not(.dotted)').revolution({
                sliderType: "hero",
                sliderLayout: "fullscreen",
                autoHeight: "on",
                gridwidth: 1140,
                gridheight: 650,
                responsiveLevels: [1199, 991, 767, 480],
                delay: 9000,
                fullScreenOffsetContainer: ".header-top, .offset-container"
            });
            $('.slider-revolution-5-container .slider-banner-fullscreen-hero.dotted').revolution({
                sliderType: "hero",
                sliderLayout: "fullscreen",
                autoHeight: "on",
                gridwidth: 1140,
                gridheight: 650,
                dottedOverlay: "twoxtwo",
                delay: 9000,
                responsiveLevels: [1199, 991, 767, 480],
                fullScreenOffsetContainer: ".header-top, .offset-container"
            });
            $('.slider-revolution-5-container .slider-banner-fullwidth-hero:not(.dotted)').revolution({
                sliderType: "hero",
                sliderLayout: "fullwidth",
                gridwidth: 1140,
                gridheight: 650,
                responsiveLevels: [1199, 991, 767, 480],
                delay: 9000
            });
            $('.slider-revolution-5-container .slider-banner-fullwidth-hero.dotted').revolution({
                sliderType: "hero",
                sliderLayout: "fullwidth",
                gridwidth: 1140,
                gridheight: 650,
                responsiveLevels: [1199, 991, 767, 480],
                delay: 9000,
                dottedOverlay: "twoxtwo"
            });
        }

        //Full Page
        if ($(".fullpage-site").length > 0 || $(".fullpage-site-with-menu").length > 0) {
            $('.fullpage-site').fullpage({
                anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'fifthPage'],
                navigation: true,
                navigationPosition: 'right',
                navigationTooltips: ['Intro', 'About', 'Portfolio', 'Clients', 'Contact Us'],
                fixedElements: '.header-container, .subfooter',
                responsiveWidth: 992,
                responsiveHeight: 600
            });
            $('.fullpage-site-with-menu').fullpage({
                anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'fifthPage'],
                navigation: true,
                navigationPosition: 'right',
                navigationTooltips: ['Intro', 'About', 'Menu', 'Reviews', 'Contact Us'],
                fixedElements: '.header-container, .subfooter',
                responsiveWidth: 992,
                responsiveHeight: 600,
                menu: '#fullpage-menu'
            });
        }

        //Owl carousel
        //-----------------------------------------------
        if ($('.owl-carousel').length > 0) {
            $(".owl-carousel.carousel").owlCarousel({
                items: 4,
                pagination: false,
                navigation: true,
                navigationText: false
            });
            $(".owl-carousel.carousel-autoplay").owlCarousel({
                items: 4,
                autoPlay: 5000,
                pagination: false,
                navigation: true,
                navigationText: false
            });
            $(".owl-carousel.clients").owlCarousel({
                items: 6,
                autoPlay: true,
                pagination: false,
                itemsDesktopSmall: [992, 4],
                itemsTablet: [768, 4],
                itemsMobile: [479, 3]
            });
            $(".owl-carousel.content-slider").owlCarousel({
                singleItem: true,
                autoPlay: 5000,
                navigation: false,
                navigationText: false,
                pagination: false
            });
            $(".owl-carousel.content-slider-with-controls").owlCarousel({
                singleItem: true,
                autoPlay: false,
                navigation: true,
                pagination: true
            });
            $(".owl-carousel.content-slider-with-large-controls").owlCarousel({
                singleItem: true,
                autoPlay: false,
                navigation: true,
                pagination: true
            });
            $(".owl-carousel.content-slider-with-controls-autoplay").owlCarousel({
                singleItem: true,
                autoPlay: 5000,
                navigation: true,
                pagination: true
            });
            $(".owl-carousel.content-slider-with-large-controls-autoplay").owlCarousel({
                singleItem: true,
                autoPlay: 5000,
                navigation: true,
                pagination: true
            });
            $(".owl-carousel.content-slider-with-controls-autoplay-hover-stop").owlCarousel({
                singleItem: true,
                autoPlay: 5000,
                navigation: true,
                pagination: true,
                stopOnHover: true
            });

            //Synched carousel see shop-product-2.html page
            var sync1 = $(".owl-carousel.content-slider-with-thumbs");
            var sync2 = $(".owl-carousel.content-slider-thumbs");

            sync1.owlCarousel({
                singleItem: true,
                slideSpeed: 1000,
                navigation: true,
                pagination: false,
                afterAction: syncPosition,
                responsiveRefreshRate: 200
            });

            sync2.owlCarousel({
                items: 4,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [979, 4],
                itemsTablet: [768, 4],
                itemsMobile: [479, 4],
                pagination: false,
                responsiveRefreshRate: 100,
                afterInit: function (el) {
                    el.find(".owl-item").eq(0).addClass("synced");
                }
            });


            $(".owl-carousel.content-slider-thumbs").on("click", ".owl-item", function (e) {
                e.preventDefault();
                var number = $(this).data("owlItem");
                sync1.trigger("owl.goTo", number);
            });
        }

        // Fixed header
        //-----------------------------------------------
        headerTopHeight = $(".header-top").outerHeight(),
        headerHeight = $("header.header.fixed").outerHeight();
        $(window).resize(function () {
            if ($(this).scrollTop() < headerTopHeight + headerHeight - 5 && $(window).width() > 767) {
                headerTopHeight = $(".header-top").outerHeight(),
                headerHeight = $("header.header.fixed").outerHeight();
            }
        });

        $(window).scroll(function () {
            if ($(".header.fixed:not(.fixed-before)").length > 0 && !($(".transparent-header .slideshow").length > 0)) {
                if ($(this).scrollTop() > headerTopHeight + headerHeight && $(window).width() > 767) {
                    $("body").addClass("fixed-header-on");
                    $(".header.fixed:not(.fixed-before)").addClass('animated object-visible fadeInDown');
                    $(".header-container").css("paddingBottom", headerHeight + "px");
                } else {
                    $("body").removeClass("fixed-header-on");
                    $(".header-container").css("paddingBottom", 0 + "px");
                    $(".header.fixed:not(.fixed-before)").removeClass('animated object-visible fadeInDown');
                }
            } else if ($(".header.fixed:not(.fixed-before)").length > 0) {
                if ($(this).scrollTop() > headerTopHeight + headerHeight && $(window).width() > 767) {
                    $("body").addClass("fixed-header-on");
                    $(".header.fixed:not(.fixed-before)").addClass('animated object-visible fadeInDown');
                } else {
                    $("body").removeClass("fixed-header-on");
                    $(".header.fixed:not(.fixed-before)").removeClass('animated object-visible fadeInDown');
                }
            }
        });

        $(window).scroll(function () {
            if ($(".header.fixed.fixed-before").length > 0 && !($(".transparent-header .slideshow").length > 0)) {
                if ($(this).scrollTop() > headerTopHeight && $(window).width() > 767) {
                    $("body").addClass("fixed-header-on");
                    $(".header.fixed.fixed-before").addClass('object-visible');
                    $(".header-container").css("paddingBottom", headerHeight + "px");
                } else {
                    $("body").removeClass("fixed-header-on");
                    $(".header-container").css("paddingBottom", 0 + "px");
                    $(".header.fixed.fixed-before").removeClass('object-visible');
                }
            } else if ($(".header.fixed.fixed-before").length > 0) {
                if ($(this).scrollTop() > headerTopHeight && $(window).width() > 767) {
                    $("body").addClass("fixed-header-on");
                    $(".header.fixed.fixed-before").addClass('object-visible');
                } else {
                    $("body").removeClass("fixed-header-on");
                    $(".header.fixed.fixed-before").removeClass('object-visible');
                }
            }
        });

        // Charts
        //-----------------------------------------------
        if ($(".graph").length > 0) {
            // Creates random numbers you don't need this for real graphs
            var randomScalingFactor = function () { return Math.round(Math.random() * 500); };

            if ($(".graph.line").length > 0) {
                // Data for line charts
                var lineChartData = {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [
                    {
                        label: "First dataset",
                        fillColor: "rgba(188,188,188,0.2)",
                        strokeColor: "rgba(188,188,188,1)",
                        pointColor: "rgba(188,188,188,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(188,188,188,1)",
                        data: [250, 300, 250, 200, 250, 300, 250]
                    },
                    {
                        label: "Second dataset",
                        fillColor: "rgba(126,187,205,0.2)",
                        strokeColor: "rgba(126,187,205,1)",
                        pointColor: "rgba(126,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(126,187,205,1)",
                        data: [300, 250, 200, 250, 300, 250, 200]
                    },
                    {
                        label: "Third dataset",
                        fillColor: "rgba(98,187,205,0.2)",
                        strokeColor: "rgba(98,187,205,1)",
                        pointColor: "rgba(98,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(98,187,205,1)",
                        data: [0, 100, 200, 300, 400, 500, 400]
                    }
                    ]
                };

                // Line Charts Initialization
                $(window).load(function () {
                    var ctx = document.getElementById("lines-graph").getContext("2d");
                    window.newLine = new Chart(ctx).Line(lineChartData, {
                        responsive: true,
                        bezierCurve: false
                    });
                });
            }
            if ($(".graph.bar").length > 0) {
                // Data for bar charts
                var barChartData = {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [
                        {
                            fillColor: "rgba(188,188,188,0.5)",
                            strokeColor: "rgba(188,188,188,0.8)",
                            highlightFill: "rgba(188,188,188,0.75)",
                            highlightStroke: "rgba(188,188,188,1)",
                            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                        },
                        {
                            fillColor: "rgba(168,187,205,0.5)",
                            strokeColor: "rgba(168,187,205,0.8)",
                            highlightFill: "rgba(168,187,205,0.75)",
                            highlightStroke: "rgba(168,187,205,1)",
                            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                        }
                    ]
                };

                // Bar Charts Initialization
                $(window).load(function () {
                    var ctx = document.getElementById("bars-graph").getContext("2d");
                    window.myBar = new Chart(ctx).Bar(barChartData, {
                        responsive: true
                    });
                });
            }
            if ($(".graph.pie").length > 0) {
                // Data for pie chart
                var pieData = [
                    {
                        value: 120,
                        color: "#09afdf",
                        highlight: "#6BD5F4",
                        label: "Blue"
                    },
                    {
                        value: 120,
                        color: "#FDB45C",
                        highlight: "#FFC870",
                        label: "Yellow"
                    },
                    {
                        value: 120,
                        color: "#4D5360",
                        highlight: "#616774",
                        label: "Dark Grey"
                    }
                ];

                // Pie Chart Initialization
                $(window).load(function () {
                    var ctx = document.getElementById("pie-graph").getContext("2d");
                    window.myPie = new Chart(ctx).Pie(pieData);
                });
            }
            if ($(".graph.doughnut").length > 0) {
                // Data for doughnut chart
                var doughnutData = [
                    {
                        value: 120,
                        color: "#09afdf",
                        highlight: "#6BD5F4",
                        label: "Blue"
                    },
                    {
                        value: 120,
                        color: "#FDB45C",
                        highlight: "#FFC870",
                        label: "Yellow"
                    },
                    {
                        value: 120,
                        color: "#4D5360",
                        highlight: "#616774",
                        label: "Dark Grey"
                    }
                ];

                // Doughnut Chart Initialization
                $(window).load(function () {
                    var ctx = document.getElementById("doughnut-graph").getContext("2d");
                    window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, { responsive: true });
                });
            }
        }

        // Magnific popup
        //-----------------------------------------------
        if ($(".popup-img").length > 0 || $(".popup-iframe").length > 0 || $(".popup-img-single").length > 0) {
            $(".popup-img").magnificPopup({
                type: "image",
                gallery: {
                    enabled: true
                }
            });
            $(".popup-img-single").magnificPopup({
                type: "image",
                gallery: {
                    enabled: false
                }
            });
            $('.popup-iframe').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                preloader: false,
                fixedContentPos: false
            });
        }

        // Animations
        //-----------------------------------------------
        if ($("[data-animation-effect]").length > 0) {
            $("[data-animation-effect]").each(function () {
                if (Modernizr.csstransitions) {
                    var waypoints = $(this).waypoint(function (direction) {
                        var appearDelay = $(this.element).attr("data-effect-delay"),
                        animatedObject = $(this.element);
                        setTimeout(function () {
                            animatedObject.addClass('animated object-visible ' + animatedObject.attr("data-animation-effect"));
                        }, appearDelay);
                        this.destroy();
                    }, {
                        offset: '95%'
                    });
                } else {
                    $(this).addClass('object-visible');
                }
            });
        }

        // Text Rotators
        //-----------------------------------------------
        if ($(".text-rotator").length > 0) {
            $(".text-rotator").each(function () {
                var tr_animationEffect = $(this).attr("data-rotator-animation-effect");
                $(this).Morphext({
                    animation: "" + tr_animationEffect + "", // Overrides default "bounceIn"
                    separator: ",", // Overrides default ","
                    speed: 3000 // Overrides default 2000
                });
            });
        }

        // Stats Count To
        //-----------------------------------------------
        if ($(".stats [data-to]").length > 0) {
            $(".stats [data-to]").each(function () {
                var stat_item = $(this),
                offset = stat_item.offset().top;
                if ($(window).scrollTop() > offset - 800 && !stat_item.hasClass('counting')) {
                    stat_item.addClass('counting');
                    stat_item.countTo();
                }
                $(window).scroll(function () {
                    if ($(window).scrollTop() > offset - 800 && !stat_item.hasClass('counting')) {
                        stat_item.addClass('counting');
                        stat_item.countTo();
                    }
                });
            });
        }

        // Isotope filters
        //-----------------------------------------------
        if ($('.isotope-container').length > 0 || $('.masonry-grid').length > 0 || $('.masonry-grid-fitrows').length > 0 || $('.isotope-container-fitrows').length > 0) {
            $(window).load(function () {
                $('.masonry-grid').isotope({
                    itemSelector: '.masonry-grid-item',
                    layoutMode: 'masonry'
                });
                $('.masonry-grid-fitrows').isotope({
                    itemSelector: '.masonry-grid-item',
                    layoutMode: 'fitRows'
                });
                $('.isotope-container').fadeIn();
                var $container = $('.isotope-container').isotope({
                    itemSelector: '.isotope-item',
                    layoutMode: 'masonry',
                    transitionDuration: '0.6s',
                    filter: "*"
                });
                $('.isotope-container-fitrows').fadeIn();
                var $container_fitrows = $('.isotope-container-fitrows').isotope({
                    itemSelector: '.isotope-item',
                    layoutMode: 'fitRows',
                    transitionDuration: '0.6s',
                    filter: "*"
                });
                // filter items on button click
                $('.filters').on('click', 'ul.nav li a', function () {
                    var filterValue = $(this).attr('data-filter');
                    $(".filters").find("li.active").removeClass("active");
                    $(this).parent().addClass("active");
                    $container.isotope({ filter: filterValue });
                    $container_fitrows.isotope({ filter: filterValue });
                    return false;
                });
            });
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                $('.tab-pane .masonry-grid-fitrows').isotope({
                    itemSelector: '.masonry-grid-item',
                    layoutMode: 'fitRows'
                });
            });
        }

        // Animated Progress Bars
        //-----------------------------------------------
        if ($("[data-animate-width]").length > 0) {
            $("[data-animate-width]").each(function () {
                if (Modernizr.touch || !Modernizr.csstransitions) {
                    $(this).find("span").hide();
                }
                var waypoints = $(this).waypoint(function (direction) {
                    $(this.element).animate({ width: $(this.element).attr("data-animate-width") }, 800);
                    this.destroy();
                    if (Modernizr.touch || !Modernizr.csstransitions) {
                        $(this.element).find("span").show('slow');
                    }
                }, {
                    offset: '90%'
                });
            });
        }

        // Animated Circular Progress Bars
        //-----------------------------------------------
        if ($(".knob").length > 0) {

            $(".knob").knob();
            $(".knob").each(function () {
                var animateVal = $(this).attr("data-animate-value");
                $(this).animate({ animatedVal: animateVal }, {
                    duration: 2000,
                    step: function () {
                        $(this).val(Math.ceil(this.animatedVal)).trigger("change");
                    }
                });
            });
        }

        //Video Background
        //-----------------------------------------------
        if ($(".video-background").length > 0) {
            if (Modernizr.touch) {
                $(".video-background").vide({
                    mp4: "videos/background-video.mp4",
                    webm: "videos/background-video.webm",
                    poster: "videos/video-fallback.jpg"
                }, {
                    volume: 1,
                    playbackRate: 1,
                    muted: true,
                    loop: true,
                    autoplay: true,
                    position: "50% 100%", // Similar to the CSS `background-position` property.
                    posterType: "jpg", // Poster image type. "detect" — auto-detection; "none" — no poster; "jpg", "png", "gif",... - extensions.
                    resizing: true
                });
            } else {
                $(".video-background").vide({
                    mp4: "videos/background-video.mp4",
                    webm: "videos/background-video.webm",
                    poster: "videos/video-poster.jpg"
                }, {
                    volume: 1,
                    playbackRate: 1,
                    muted: true,
                    loop: true,
                    autoplay: true,
                    position: "50% 100%", // Similar to the CSS `background-position` property.
                    posterType: "jpg", // Poster image type. "detect" — auto-detection; "none" — no poster; "jpg", "png", "gif",... - extensions.
                    resizing: true
                });
            }

        }
        if ($(".video-background-banner").length > 0) {
            if (Modernizr.touch) {
                $(".video-background-banner").vide({
                    mp4: "videos/background-video-banner.mp4",
                    webm: "videos/background-video-banner.webm",
                    poster: "videos/video-fallback.jpg"
                }, {
                    volume: 1,
                    playbackRate: 1,
                    muted: true,
                    loop: true,
                    autoplay: true,
                    position: "50% 50%", // Similar to the CSS `background-position` property.
                    posterType: "jpg", // Poster image type. "detect" — auto-detection; "none" — no poster; "jpg", "png", "gif",... - extensions.
                    resizing: true
                });
            } else {
                $(".video-background-banner").vide({
                    mp4: "videos/background-video-banner.mp4",
                    webm: "videos/background-video-banner.webm",
                    poster: "videos/video-banner-poster.jpg"
                }, {
                    volume: 1,
                    playbackRate: 1,
                    muted: true,
                    loop: true,
                    autoplay: true,
                    position: "50% 50%", // Similar to the CSS `background-position` property.
                    posterType: "jpg", // Poster image type. "detect" — auto-detection; "none" — no poster; "jpg", "png", "gif",... - extensions.
                    resizing: true
                });
            }
        }
        //Scroll totop
        //-----------------------------------------------
        $(window).scroll(function () {
            if ($(this).scrollTop() !== 0) {
                $(".scrollToTop").fadeIn();
            } else {
                $(".scrollToTop").fadeOut();
            }
        });

        $(".scrollToTop").click(function () {
            $("body,html").animate({ scrollTop: 0 }, 800);
        });

        //Modal
        //-----------------------------------------------
        if ($(".modal").length > 0) {
            $(".modal").each(function () {
                $(".modal").prependTo("body");
            });
        }

        // Pricing tables popovers
        //-----------------------------------------------
        if ($(".pricing-tables").length > 0) {
            $(".plan .pt-popover").popover({
                trigger: 'hover',
                container: 'body'
            });
        }

        // Contact forms validation
        //-----------------------------------------------
        if ($("#contact-form").length > 0) {
            $("#contact-form").validate({
                submitHandler: function (form) {
                    $('.submit-button').button("loading");
                    $.ajax({
                        type: "POST",
                        url: "php/email-sender.php",
                        data: {
                            "name": $("#contact-form #name").val(),
                            "email": $("#contact-form #email").val(),
                            "subject": $("#contact-form #subject").val(),
                            "message": $("#contact-form #message").val()
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.sent === "yes") {
                                $("#MessageSent").removeClass("hidden");
                                $("#MessageNotSent").addClass("hidden");
                                $(".submit-button").removeClass("btn-default").addClass("btn-success").prop('value', 'Message Sent');
                                $("#contact-form .form-control").each(function () {
                                    $(this).prop('value', '').parent().removeClass("has-success").removeClass("has-error");
                                });
                            } else {
                                $("#MessageNotSent").removeClass("hidden");
                                $("#MessageSent").addClass("hidden");
                            }
                        }
                    });
                },
                errorPlacement: function (error, element) {
                    error.insertBefore(element);
                },
                onkeyup: false,
                onclick: false,
                rules: {
                    name: {
                        required: true,
                        minlength: 2
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    subject: {
                        required: true
                    },
                    message: {
                        required: true,
                        minlength: 10
                    }
                },
                messages: {
                    name: {
                        required: "Please specify your name",
                        minlength: "Your name must be longer than 2 characters"
                    },
                    email: {
                        required: "We need your email address to contact you",
                        email: "Please enter a valid email address e.g. name@domain.com"
                    },
                    subject: {
                        required: "Please enter a subject"
                    },
                    message: {
                        required: "Please enter a message",
                        minlength: "Your message must be longer than 10 characters"
                    }
                },
                errorElement: "span",
                highlight: function (element) {
                    $(element).parent().removeClass("has-success").addClass("has-error");
                    $(element).siblings("label").addClass("hide");
                },
                success: function (element) {
                    $(element).parent().removeClass("has-error").addClass("has-success");
                    $(element).siblings("label").removeClass("hide");
                }
            });
        }

        if ($("#contact-form-with-recaptcha").length > 0) {
            $("#contact-form-with-recaptcha").validate({
                submitHandler: function (form) {
                    $('.submit-button').button("loading");
                    $.ajax({
                        type: "POST",
                        url: "php/email-sender-recaptcha.php",
                        data: {
                            "name": $("#contact-form-with-recaptcha #name").val(),
                            "email": $("#contact-form-with-recaptcha #email").val(),
                            "subject": $("#contact-form-with-recaptcha #subject").val(),
                            "message": $("#contact-form-with-recaptcha #message").val(),
                            "g-recaptcha-response": $("#g-recaptcha-response").val()
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.sent === "yes") {
                                $("#MessageSent").removeClass("hidden");
                                $("#MessageNotSent").addClass("hidden");
                                $(".submit-button").removeClass("btn-default").addClass("btn-success").prop('value', 'Message Sent');
                                $("#contact-form-with-recaptcha .form-control").each(function () {
                                    $(this).prop('value', '').parent().removeClass("has-success").removeClass("has-error");
                                });
                            } else {
                                $("#MessageNotSent").removeClass("hidden");
                                $("#MessageSent").addClass("hidden");
                            }
                        }
                    });
                },
                errorPlacement: function (error, element) {
                    error.insertBefore(element);
                },
                onkeyup: false,
                onclick: false,
                rules: {
                    name: {
                        required: true,
                        minlength: 2
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    subject: {
                        required: true
                    },
                    message: {
                        required: true,
                        minlength: 10
                    }
                },
                messages: {
                    name: {
                        required: "Please specify your name",
                        minlength: "Your name must be longer than 2 characters"
                    },
                    email: {
                        required: "We need your email address to contact you",
                        email: "Please enter a valid email address e.g. name@domain.com"
                    },
                    subject: {
                        required: "Please enter a subject"
                    },
                    message: {
                        required: "Please enter a message",
                        minlength: "Your message must be longer than 10 characters"
                    }
                },
                errorElement: "span",
                highlight: function (element) {
                    $(element).parent().removeClass("has-success").addClass("has-error");
                    $(element).siblings("label").addClass("hide");
                },
                success: function (element) {
                    $(element).parent().removeClass("has-error").addClass("has-success");
                    $(element).siblings("label").removeClass("hide");
                }
            });
        }

        if ($("#footer-form").length > 0) {
            $("#footer-form").validate({
                submitHandler: function (form) {
                    $('.submit-button').button("loading");
                    $.ajax({
                        type: "POST",
                        url: "php/email-sender.php",
                        data: {
                            "name": $("#footer-form #name2").val(),
                            "email": $("#footer-form #email2").val(),
                            "subject": "Message from contact form",
                            "message": $("#footer-form #message2").val()
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.sent === "yes") {
                                $("#MessageSent2").removeClass("hidden");
                                $("#MessageNotSent2").addClass("hidden");
                                $(".submit-button").removeClass("btn-default").addClass("btn-success").prop('value', 'Message Sent');
                                $("#footer-form .form-control").each(function () {
                                    $(this).prop('value', '').parent().removeClass("has-success").removeClass("has-error");
                                });
                            } else {
                                $("#MessageNotSent2").removeClass("hidden");
                                $("#MessageSent2").addClass("hidden");
                            }
                        }
                    });
                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element);
                },
                onkeyup: false,
                onclick: false,
                rules: {
                    name2: {
                        required: true,
                        minlength: 2
                    },
                    email2: {
                        required: true,
                        email: true
                    },
                    message2: {
                        required: true,
                        minlength: 10
                    }
                },
                messages: {
                    name2: {
                        required: "Please specify your name",
                        minlength: "Your name must be longer than 2 characters"
                    },
                    email2: {
                        required: "We need your email address to contact you",
                        email: "Please enter a valid email address e.g. name@domain.com"
                    },
                    message2: {
                        required: "Please enter a message",
                        minlength: "Your message must be longer than 10 characters"
                    }
                },
                errorElement: "span",
                highlight: function (element) {
                    $(element).parent().removeClass("has-success").addClass("has-error");
                    $(element).siblings("label").addClass("hide");
                },
                success: function (element) {
                    $(element).parent().removeClass("has-error").addClass("has-success");
                    $(element).siblings("label").removeClass("hide");
                }
            });
        }

        if ($("#sidebar-form").length > 0) {

            $("#sidebar-form").validate({
                submitHandler: function (form) {
                    $('.submit-button').button("loading");
                    $.ajax({
                        type: "POST",
                        url: "php/email-sender.php",
                        data: {
                            "name": $("#sidebar-form #name3").val(),
                            "email": $("#sidebar-form #email3").val(),
                            "subject": "Message from FAQ page",
                            "category": $("#sidebar-form #category").val(),
                            "message": $("#sidebar-form #message3").val()
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.sent === "yes") {
                                $("#MessageSent3").removeClass("hidden");
                                $("#MessageNotSent3").addClass("hidden");
                                $(".submit-button").removeClass("btn-default").addClass("btn-success").prop('value', 'Message Sent');
                                $("#sidebar-form .form-control").each(function () {
                                    $(this).prop('value', '').parent().removeClass("has-success").removeClass("has-error");
                                });
                            } else {
                                $("#MessageNotSent3").removeClass("hidden");
                                $("#MessageSent3").addClass("hidden");
                            }
                        }
                    });
                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element);
                },
                onkeyup: false,
                onclick: false,
                rules: {
                    name3: {
                        required: true,
                        minlength: 2
                    },
                    email3: {
                        required: true,
                        email: true
                    },
                    message3: {
                        required: true,
                        minlength: 10
                    }
                },
                messages: {
                    name3: {
                        required: "Please specify your name",
                        minlength: "Your name must be longer than 2 characters"
                    },
                    email3: {
                        required: "We need your email address to contact you",
                        email: "Please enter a valid email address e.g. name@domain.com"
                    },
                    message3: {
                        required: "Please enter a message",
                        minlength: "Your message must be longer than 10 characters"
                    }
                },
                errorElement: "span",
                highlight: function (element) {
                    $(element).parent().removeClass("has-success").addClass("has-error");
                },
                success: function (element) {
                    $(element).parent().removeClass("has-error").addClass("has-success");
                }
            });

        }

        if ($("#rsvp").length > 0) {
            $("#rsvp").validate({
                submitHandler: function (form) {
                    $('.submit-button').button("loading");
                    $.ajax({
                        type: "POST",
                        url: "php/email-sender.php",
                        data: {
                            "name": $("#rsvp #name").val(),
                            "email": $("#rsvp #email").val(),
                            "guests": $("#rsvp #guests").val(),
                            "subject": "RSVP",
                            "events": $("#rsvp #events").val()
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.sent === "yes") {
                                $("#MessageSent").removeClass("hidden");
                                $("#MessageNotSent").addClass("hidden");
                                $(".submit-button").removeClass("btn-default").addClass("btn-success").prop('value', 'Message Sent');
                                $("#rsvp .form-control").each(function () {
                                    $(this).prop('value', '').parent().removeClass("has-success").removeClass("has-error");
                                });
                            } else {
                                $("#MessageNotSent").removeClass("hidden");
                                $("#MessageSent").addClass("hidden");
                            }
                        }
                    });
                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element);
                },
                onkeyup: false,
                onclick: false,
                rules: {
                    name: {
                        required: true,
                        minlength: 2
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    guests: {
                        required: true
                    },
                    events: {
                        required: true
                    }
                },
                messages: {
                    name: {
                        required: "Please specify your name",
                        minlength: "Your name must be longer than 2 characters"
                    },
                    email: {
                        required: "We need your email address to contact you",
                        email: "Please enter a valid email address e.g. name@domain.com"
                    }
                },
                errorElement: "span",
                highlight: function (element) {
                    $(element).parent().removeClass("has-success").addClass("has-error");
                    $(element).siblings("label").addClass("hide");
                },
                success: function (element) {
                    $(element).parent().removeClass("has-error").addClass("has-success");
                    $(element).siblings("label").removeClass("hide");
                }
            });
        }


        // Affix Menu
        //-----------------------------------------------
        if ($(".affix-menu").length > 0) {
            setTimeout(function () {
                var $sideBar = $('.sidebar');

                $sideBar.affix({
                    offset: {
                        top: function () {
                            var offsetTop = $sideBar.offset().top;
                            return this.top = offsetTop - 65;
                        },
                        bottom: function () {
                            var affixBottom = $(".footer").outerHeight(true) + $(".subfooter").outerHeight(true);
                            if ($(".footer-top").length > 0) {
                                affixBottom = affixBottom + $(".footer-top").outerHeight(true);
                            }
                            return this.bottom = affixBottom + 50;
                        }
                    }
                });
            }, 100);
        }

        //Scroll Spy
        //-----------------------------------------------
        if ($(".scrollspy").length > 0) {
            $("body").addClass("scroll-spy");
            if ($(".fixed.header").length > 0) {
                $('body').scrollspy({
                    target: '.scrollspy',
                    offset: 85
                });
            } else {
                $('body').scrollspy({
                    target: '.scrollspy',
                    offset: 20
                });
            }
        }

        //Smooth Scroll
        //-----------------------------------------------
        if ($(".smooth-scroll").length > 0) {
            if ($(".header.fixed").length > 0 && Modernizr.mq('only all and (min-width: 768px)')) {
                $('.smooth-scroll a, a.smooth-scroll').click(function () {
                    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                        if (target.length) {
                            $('html,body').animate({
                                scrollTop: target.offset().top - 63
                            }, 1000);
                            return false;
                        }
                    }
                });
            } else {
                $('.smooth-scroll a, a.smooth-scroll').click(function () {
                    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                        if (target.length) {
                            $('html,body').animate({
                                scrollTop: target.offset().top
                            }, 1000);
                            return false;
                        }
                    }
                });
            }
        }

        // Offcanvas side navbar
        //-----------------------------------------------
        if ($("#offcanvas").length > 0) {
            $('#offcanvas').offcanvas({
                canvas: "body",
                disableScrolling: false,
                toggle: false
            });
        }

        if ($("#offcanvas").length > 0) {
            $('#offcanvas [data-toggle=dropdown]').on('click', function (event) {
                // Avoid following the href location when clicking
                event.preventDefault();
                // Avoid having the menu to close when clicking
                event.stopPropagation();
                // close all the siblings
                $(this).parent().siblings().removeClass('open');
                // close all the submenus of siblings
                $(this).parent().siblings().find('[data-toggle=dropdown]').parent().removeClass('open');
                // opening the one you clicked on
                $(this).parent().toggleClass('open');
            });
        }

        // Parallax section
        //-----------------------------------------------
        if ($(".parallax").length > 0 && !Modernizr.touch) {
            $(".parallax").parallax("50%", 0.2);
        }
        if ($(".parallax-2").length > 0 && !Modernizr.touch) {
            $(".parallax-2").parallax("50%", 0.3);
        }
        if ($(".parallax-3").length > 0 && !Modernizr.touch) {
            $(".parallax-3").parallax("50%", 0.4);
        }

        // Notify Plugin
        //-----------------------------------------------
        if ($(".btn-alert").length > 0) {
            $(".btn-alert").on('click', function (event) {
                $.notify({
                    // options
                    message: 'Great! you have just created this message :-) you can configure this into the template.js file'
                }, {
                    // settings
                    type: 'info',
                    delay: 4000,
                    offset: {
                        y: 100,
                        x: 20
                    }
                });
                return false;
            });
        }

        // Remove Button
        //-----------------------------------------------
        $(".btn-remove").click(function () {
            $(this).closest(".remove-data").remove();
        });

        // Shipping Checkbox
        //-----------------------------------------------
        if ($("#shipping-info-check").is(':checked')) {
            $("#shipping-information").hide();
        }
        $("#shipping-info-check").change(function () {
            if ($(this).is(':checked')) {
                $("#shipping-information").slideToggle();
            } else {
                $("#shipping-information").slideToggle();
            }
        });

        // Full Width Image Overlay
        //-----------------------------------------------
        if ($(".full-image-overlay").length > 0) {
            overlayHeight = $(".full-image-overlay").outerHeight();
            $(".full-image-overlay").css("marginTop", -overlayHeight / 2);
        }

        //This will prevent the event from bubbling up and close the dropdown when you type/click on text boxes (Header Top).
        //-----------------------------------------------
        $('.header-top .dropdown-menu input').click(function (e) {
            e.stopPropagation();
        });

    }); // End document ready

})(this.jQuery);
function print_window() {
    var mywindow = window;
    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
}
if (jQuery(".btn-print").length > 0) {
    print_window();
}
/*! pace 1.0.0 */
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X=[].slice,Y={}.hasOwnProperty,Z=function(a,b){function c(){this.constructor=a}for(var d in b)Y.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},$=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};for(u={catchupTime:100,initialRate:.03,minTime:250,ghostTime:100,maxProgressPerFrame:20,easeFactor:1.25,startOnPageLoad:!0,restartOnPushState:!0,restartOnRequestAfter:500,target:"body",elements:{checkInterval:100,selectors:["body"]},eventLag:{minSamples:10,sampleCount:3,lagThreshold:3},ajax:{trackMethods:["GET"],trackWebSockets:!0,ignoreURLs:[]}},C=function(){var a;return null!=(a="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance.now():void 0)?a:+new Date},E=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,t=window.cancelAnimationFrame||window.mozCancelAnimationFrame,null==E&&(E=function(a){return setTimeout(a,50)},t=function(a){return clearTimeout(a)}),G=function(a){var b,c;return b=C(),(c=function(){var d;return d=C()-b,d>=33?(b=C(),a(d,function(){return E(c)})):setTimeout(c,33-d)})()},F=function(){var a,b,c;return c=arguments[0],b=arguments[1],a=3<=arguments.length?X.call(arguments,2):[],"function"==typeof c[b]?c[b].apply(c,a):c[b]},v=function(){var a,b,c,d,e,f,g;for(b=arguments[0],d=2<=arguments.length?X.call(arguments,1):[],f=0,g=d.length;g>f;f++)if(c=d[f])for(a in c)Y.call(c,a)&&(e=c[a],null!=b[a]&&"object"==typeof b[a]&&null!=e&&"object"==typeof e?v(b[a],e):b[a]=e);return b},q=function(a){var b,c,d,e,f;for(c=b=0,e=0,f=a.length;f>e;e++)d=a[e],c+=Math.abs(d),b++;return c/b},x=function(a,b){var c,d,e;if(null==a&&(a="options"),null==b&&(b=!0),e=document.querySelector("[data-pace-"+a+"]")){if(c=e.getAttribute("data-pace-"+a),!b)return c;try{return JSON.parse(c)}catch(f){return d=f,"undefined"!=typeof console&&null!==console?console.error("Error parsing inline pace options",d):void 0}}},g=function(){function a(){}return a.prototype.on=function(a,b,c,d){var e;return null==d&&(d=!1),null==this.bindings&&(this.bindings={}),null==(e=this.bindings)[a]&&(e[a]=[]),this.bindings[a].push({handler:b,ctx:c,once:d})},a.prototype.once=function(a,b,c){return this.on(a,b,c,!0)},a.prototype.off=function(a,b){var c,d,e;if(null!=(null!=(d=this.bindings)?d[a]:void 0)){if(null==b)return delete this.bindings[a];for(c=0,e=[];c<this.bindings[a].length;)e.push(this.bindings[a][c].handler===b?this.bindings[a].splice(c,1):c++);return e}},a.prototype.trigger=function(){var a,b,c,d,e,f,g,h,i;if(c=arguments[0],a=2<=arguments.length?X.call(arguments,1):[],null!=(g=this.bindings)?g[c]:void 0){for(e=0,i=[];e<this.bindings[c].length;)h=this.bindings[c][e],d=h.handler,b=h.ctx,f=h.once,d.apply(null!=b?b:this,a),i.push(f?this.bindings[c].splice(e,1):e++);return i}},a}(),j=window.Pace||{},window.Pace=j,v(j,g.prototype),D=j.options=v({},u,window.paceOptions,x()),U=["ajax","document","eventLag","elements"],Q=0,S=U.length;S>Q;Q++)K=U[Q],D[K]===!0&&(D[K]=u[K]);i=function(a){function b(){return V=b.__super__.constructor.apply(this,arguments)}return Z(b,a),b}(Error),b=function(){function a(){this.progress=0}return a.prototype.getElement=function(){var a;if(null==this.el){if(a=document.querySelector(D.target),!a)throw new i;this.el=document.createElement("div"),this.el.className="pace pace-active",document.body.className=document.body.className.replace(/pace-done/g,""),document.body.className+=" pace-running",this.el.innerHTML='<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>',null!=a.firstChild?a.insertBefore(this.el,a.firstChild):a.appendChild(this.el)}return this.el},a.prototype.finish=function(){var a;return a=this.getElement(),a.className=a.className.replace("pace-active",""),a.className+=" pace-inactive",document.body.className=document.body.className.replace("pace-running",""),document.body.className+=" pace-done"},a.prototype.update=function(a){return this.progress=a,this.render()},a.prototype.destroy=function(){try{this.getElement().parentNode.removeChild(this.getElement())}catch(a){i=a}return this.el=void 0},a.prototype.render=function(){var a,b,c,d,e,f,g;if(null==document.querySelector(D.target))return!1;for(a=this.getElement(),d="translate3d("+this.progress+"%, 0, 0)",g=["webkitTransform","msTransform","transform"],e=0,f=g.length;f>e;e++)b=g[e],a.children[0].style[b]=d;return(!this.lastRenderedProgress||this.lastRenderedProgress|0!==this.progress|0)&&(a.children[0].setAttribute("data-progress-text",""+(0|this.progress)+"%"),this.progress>=100?c="99":(c=this.progress<10?"0":"",c+=0|this.progress),a.children[0].setAttribute("data-progress",""+c)),this.lastRenderedProgress=this.progress},a.prototype.done=function(){return this.progress>=100},a}(),h=function(){function a(){this.bindings={}}return a.prototype.trigger=function(a,b){var c,d,e,f,g;if(null!=this.bindings[a]){for(f=this.bindings[a],g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.call(this,b));return g}},a.prototype.on=function(a,b){var c;return null==(c=this.bindings)[a]&&(c[a]=[]),this.bindings[a].push(b)},a}(),P=window.XMLHttpRequest,O=window.XDomainRequest,N=window.WebSocket,w=function(a,b){var c,d,e,f;f=[];for(d in b.prototype)try{e=b.prototype[d],f.push(null==a[d]&&"function"!=typeof e?a[d]=e:void 0)}catch(g){c=g}return f},A=[],j.ignore=function(){var a,b,c;return b=arguments[0],a=2<=arguments.length?X.call(arguments,1):[],A.unshift("ignore"),c=b.apply(null,a),A.shift(),c},j.track=function(){var a,b,c;return b=arguments[0],a=2<=arguments.length?X.call(arguments,1):[],A.unshift("track"),c=b.apply(null,a),A.shift(),c},J=function(a){var b;if(null==a&&(a="GET"),"track"===A[0])return"force";if(!A.length&&D.ajax){if("socket"===a&&D.ajax.trackWebSockets)return!0;if(b=a.toUpperCase(),$.call(D.ajax.trackMethods,b)>=0)return!0}return!1},k=function(a){function b(){var a,c=this;b.__super__.constructor.apply(this,arguments),a=function(a){var b;return b=a.open,a.open=function(d,e){return J(d)&&c.trigger("request",{type:d,url:e,request:a}),b.apply(a,arguments)}},window.XMLHttpRequest=function(b){var c;return c=new P(b),a(c),c};try{w(window.XMLHttpRequest,P)}catch(d){}if(null!=O){window.XDomainRequest=function(){var b;return b=new O,a(b),b};try{w(window.XDomainRequest,O)}catch(d){}}if(null!=N&&D.ajax.trackWebSockets){window.WebSocket=function(a,b){var d;return d=null!=b?new N(a,b):new N(a),J("socket")&&c.trigger("request",{type:"socket",url:a,protocols:b,request:d}),d};try{w(window.WebSocket,N)}catch(d){}}}return Z(b,a),b}(h),R=null,y=function(){return null==R&&(R=new k),R},I=function(a){var b,c,d,e;for(e=D.ajax.ignoreURLs,c=0,d=e.length;d>c;c++)if(b=e[c],"string"==typeof b){if(-1!==a.indexOf(b))return!0}else if(b.test(a))return!0;return!1},y().on("request",function(b){var c,d,e,f,g;return f=b.type,e=b.request,g=b.url,I(g)?void 0:j.running||D.restartOnRequestAfter===!1&&"force"!==J(f)?void 0:(d=arguments,c=D.restartOnRequestAfter||0,"boolean"==typeof c&&(c=0),setTimeout(function(){var b,c,g,h,i,k;if(b="socket"===f?e.readyState<2:0<(h=e.readyState)&&4>h){for(j.restart(),i=j.sources,k=[],c=0,g=i.length;g>c;c++){if(K=i[c],K instanceof a){K.watch.apply(K,d);break}k.push(void 0)}return k}},c))}),a=function(){function a(){var a=this;this.elements=[],y().on("request",function(){return a.watch.apply(a,arguments)})}return a.prototype.watch=function(a){var b,c,d,e;return d=a.type,b=a.request,e=a.url,I(e)?void 0:(c="socket"===d?new n(b):new o(b),this.elements.push(c))},a}(),o=function(){function a(a){var b,c,d,e,f,g,h=this;if(this.progress=0,null!=window.ProgressEvent)for(c=null,a.addEventListener("progress",function(a){return h.progress=a.lengthComputable?100*a.loaded/a.total:h.progress+(100-h.progress)/2},!1),g=["load","abort","timeout","error"],d=0,e=g.length;e>d;d++)b=g[d],a.addEventListener(b,function(){return h.progress=100},!1);else f=a.onreadystatechange,a.onreadystatechange=function(){var b;return 0===(b=a.readyState)||4===b?h.progress=100:3===a.readyState&&(h.progress=50),"function"==typeof f?f.apply(null,arguments):void 0}}return a}(),n=function(){function a(a){var b,c,d,e,f=this;for(this.progress=0,e=["error","open"],c=0,d=e.length;d>c;c++)b=e[c],a.addEventListener(b,function(){return f.progress=100},!1)}return a}(),d=function(){function a(a){var b,c,d,f;for(null==a&&(a={}),this.elements=[],null==a.selectors&&(a.selectors=[]),f=a.selectors,c=0,d=f.length;d>c;c++)b=f[c],this.elements.push(new e(b))}return a}(),e=function(){function a(a){this.selector=a,this.progress=0,this.check()}return a.prototype.check=function(){var a=this;return document.querySelector(this.selector)?this.done():setTimeout(function(){return a.check()},D.elements.checkInterval)},a.prototype.done=function(){return this.progress=100},a}(),c=function(){function a(){var a,b,c=this;this.progress=null!=(b=this.states[document.readyState])?b:100,a=document.onreadystatechange,document.onreadystatechange=function(){return null!=c.states[document.readyState]&&(c.progress=c.states[document.readyState]),"function"==typeof a?a.apply(null,arguments):void 0}}return a.prototype.states={loading:0,interactive:50,complete:100},a}(),f=function(){function a(){var a,b,c,d,e,f=this;this.progress=0,a=0,e=[],d=0,c=C(),b=setInterval(function(){var g;return g=C()-c-50,c=C(),e.push(g),e.length>D.eventLag.sampleCount&&e.shift(),a=q(e),++d>=D.eventLag.minSamples&&a<D.eventLag.lagThreshold?(f.progress=100,clearInterval(b)):f.progress=100*(3/(a+3))},50)}return a}(),m=function(){function a(a){this.source=a,this.last=this.sinceLastUpdate=0,this.rate=D.initialRate,this.catchup=0,this.progress=this.lastProgress=0,null!=this.source&&(this.progress=F(this.source,"progress"))}return a.prototype.tick=function(a,b){var c;return null==b&&(b=F(this.source,"progress")),b>=100&&(this.done=!0),b===this.last?this.sinceLastUpdate+=a:(this.sinceLastUpdate&&(this.rate=(b-this.last)/this.sinceLastUpdate),this.catchup=(b-this.progress)/D.catchupTime,this.sinceLastUpdate=0,this.last=b),b>this.progress&&(this.progress+=this.catchup*a),c=1-Math.pow(this.progress/100,D.easeFactor),this.progress+=c*this.rate*a,this.progress=Math.min(this.lastProgress+D.maxProgressPerFrame,this.progress),this.progress=Math.max(0,this.progress),this.progress=Math.min(100,this.progress),this.lastProgress=this.progress,this.progress},a}(),L=null,H=null,r=null,M=null,p=null,s=null,j.running=!1,z=function(){return D.restartOnPushState?j.restart():void 0},null!=window.history.pushState&&(T=window.history.pushState,window.history.pushState=function(){return z(),T.apply(window.history,arguments)}),null!=window.history.replaceState&&(W=window.history.replaceState,window.history.replaceState=function(){return z(),W.apply(window.history,arguments)}),l={ajax:a,elements:d,document:c,eventLag:f},(B=function(){var a,c,d,e,f,g,h,i;for(j.sources=L=[],g=["ajax","elements","document","eventLag"],c=0,e=g.length;e>c;c++)a=g[c],D[a]!==!1&&L.push(new l[a](D[a]));for(i=null!=(h=D.extraSources)?h:[],d=0,f=i.length;f>d;d++)K=i[d],L.push(new K(D));return j.bar=r=new b,H=[],M=new m})(),j.stop=function(){return j.trigger("stop"),j.running=!1,r.destroy(),s=!0,null!=p&&("function"==typeof t&&t(p),p=null),B()},j.restart=function(){return j.trigger("restart"),j.stop(),j.start()},j.go=function(){var a;return j.running=!0,r.render(),a=C(),s=!1,p=G(function(b,c){var d,e,f,g,h,i,k,l,n,o,p,q,t,u,v,w;for(l=100-r.progress,e=p=0,f=!0,i=q=0,u=L.length;u>q;i=++q)for(K=L[i],o=null!=H[i]?H[i]:H[i]=[],h=null!=(w=K.elements)?w:[K],k=t=0,v=h.length;v>t;k=++t)g=h[k],n=null!=o[k]?o[k]:o[k]=new m(g),f&=n.done,n.done||(e++,p+=n.tick(b));return d=p/e,r.update(M.tick(b,d)),r.done()||f||s?(r.update(100),j.trigger("done"),setTimeout(function(){return r.finish(),j.running=!1,j.trigger("hide")},Math.max(D.ghostTime,Math.max(D.minTime-(C()-a),0)))):c()})},j.start=function(a){v(D,a),j.running=!0;try{r.render()}catch(b){i=b}return document.querySelector(".pace")?(j.trigger("start"),j.go()):setTimeout(j.start,50)},"function"==typeof define&&define.amd?define(function(){return j}):"object"==typeof exports?module.exports=j:D.startOnPageLoad&&j.start()}).call(this);
/**
 * jquery.mask.js
 * @version: v1.14.0
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at http://blog.igorescobar.com
 *
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* jshint laxbreak: true */
/* global define, jQuery, Zepto */

'use strict';

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function (factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function ($) {

    var Mask = function (el, mask, options) {

        var p = {
            invalid: [],
            getCaret: function () {
                try {
                    var sel,
                        pos = 0,
                        ctrl = el.get(0),
                        dSel = document.selection,
                        cSelStart = ctrl.selectionStart;

                    // IE Support
                    if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                        sel = dSel.createRange();
                        sel.moveStart('character', -p.val().length);
                        pos = sel.text.length;
                    }
                    // Firefox support
                    else if (cSelStart || cSelStart === '0') {
                        pos = cSelStart;
                    }

                    return pos;
                } catch (e) {}
            },
            setCaret: function(pos) {
                try {
                    if (el.is(':focus')) {
                        var range, ctrl = el.get(0);

                        // Firefox, WebKit, etc..
                        if (ctrl.setSelectionRange) {
                            ctrl.focus();
                            ctrl.setSelectionRange(pos, pos);
                        } else { // IE
                            range = ctrl.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }
                } catch (e) {}
            },
            events: function() {
                el
                .on('keydown.mask', function(e) {
                    el.data('mask-keycode', e.keyCode || e.which);
                })
                .on($.jMaskGlobals.useInput ? 'input.mask' : 'keyup.mask', p.behaviour)
                .on('paste.mask drop.mask', function() {
                    setTimeout(function() {
                        el.keydown().keyup();
                    }, 100);
                })
                .on('change.mask', function(){
                    el.data('changed', true);
                })
                .on('blur.mask', function(){
                    if (oldValue !== p.val() && !el.data('changed')) {
                        el.trigger('change');
                    }
                    el.data('changed', false);
                })
                // it's very important that this callback remains in this position
                // otherwhise oldValue it's going to work buggy
                .on('blur.mask', function() {
                    oldValue = p.val();
                })
                // select all text on focus
                .on('focus.mask', function (e) {
                    if (options.selectOnFocus === true) {
                        $(e.target).select();
                    }
                })
                // clear the value if it not complete the mask
                .on('focusout.mask', function() {
                    if (options.clearIfNotMatch && !regexMask.test(p.val())) {
                       p.val('');
                   }
                });
            },
            getRegexMask: function() {
                var maskChunks = [], translation, pattern, optional, recursive, oRecursive, r;

                for (var i = 0; i < mask.length; i++) {
                    translation = jMask.translation[mask.charAt(i)];

                    if (translation) {

                        pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                        optional = translation.optional;
                        recursive = translation.recursive;

                        if (recursive) {
                            maskChunks.push(mask.charAt(i));
                            oRecursive = {digit: mask.charAt(i), pattern: pattern};
                        } else {
                            maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                        }

                    } else {
                        maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                    }
                }

                r = maskChunks.join('');

                if (oRecursive) {
                    r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                         .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                }

                return new RegExp(r);
            },
            destroyEvents: function() {
                el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
            },
            val: function(v) {
                var isInput = el.is('input'),
                    method = isInput ? 'val' : 'text',
                    r;

                if (arguments.length > 0) {
                    if (el[method]() !== v) {
                        el[method](v);
                    }
                    r = el;
                } else {
                    r = el[method]();
                }

                return r;
            },
            getMCharsBeforeCount: function(index, onCleanVal) {
                for (var count = 0, i = 0, maskL = mask.length; i < maskL && i < index; i++) {
                    if (!jMask.translation[mask.charAt(i)]) {
                        index = onCleanVal ? index + 1 : index;
                        count++;
                    }
                }
                return count;
            },
            caretPos: function (originalCaretPos, oldLength, newLength, maskDif) {
                var translation = jMask.translation[mask.charAt(Math.min(originalCaretPos - 1, mask.length - 1))];

                return !translation ? p.caretPos(originalCaretPos + 1, oldLength, newLength, maskDif)
                                    : Math.min(originalCaretPos + newLength - oldLength - maskDif, newLength);
            },
            behaviour: function(e) {
                e = e || window.event;
                p.invalid = [];

                var keyCode = el.data('mask-keycode');

                if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
                    var caretPos    = p.getCaret(),
                        currVal     = p.val(),
                        currValL    = currVal.length,
                        newVal      = p.getMasked(),
                        newValL     = newVal.length,
                        maskDif     = p.getMCharsBeforeCount(newValL - 1) - p.getMCharsBeforeCount(currValL - 1),
                        changeCaret = caretPos < currValL;

                    p.val(newVal);

                    if (changeCaret) {
                        // Avoid adjusting caret on backspace or delete
                        if (!(keyCode === 8 || keyCode === 46)) {
                            caretPos = p.caretPos(caretPos, currValL, newValL, maskDif);
                        }
                        p.setCaret(caretPos);
                    }

                    return p.callbacks(e);
                }
            },
            getMasked: function(skipMaskChars, val) {
                var buf = [],
                    value = val === undefined ? p.val() : val + '',
                    m = 0, maskLen = mask.length,
                    v = 0, valLen = value.length,
                    offset = 1, addMethod = 'push',
                    resetPos = -1,
                    lastMaskChar,
                    check;

                if (options.reverse) {
                    addMethod = 'unshift';
                    offset = -1;
                    lastMaskChar = 0;
                    m = maskLen - 1;
                    v = valLen - 1;
                    check = function () {
                        return m > -1 && v > -1;
                    };
                } else {
                    lastMaskChar = maskLen - 1;
                    check = function () {
                        return m < maskLen && v < valLen;
                    };
                }

                while (check()) {
                    var maskDigit = mask.charAt(m),
                        valDigit = value.charAt(v),
                        translation = jMask.translation[maskDigit];

                    if (translation) {
                        if (valDigit.match(translation.pattern)) {
                            buf[addMethod](valDigit);
                             if (translation.recursive) {
                                if (resetPos === -1) {
                                    resetPos = m;
                                } else if (m === lastMaskChar) {
                                    m = resetPos - offset;
                                }

                                if (lastMaskChar === resetPos) {
                                    m -= offset;
                                }
                            }
                            m += offset;
                        } else if (translation.optional) {
                            m += offset;
                            v -= offset;
                        } else if (translation.fallback) {
                            buf[addMethod](translation.fallback);
                            m += offset;
                            v -= offset;
                        } else {
                          p.invalid.push({p: v, v: valDigit, e: translation.pattern});
                        }
                        v += offset;
                    } else {
                        if (!skipMaskChars) {
                            buf[addMethod](maskDigit);
                        }

                        if (valDigit === maskDigit) {
                            v += offset;
                        }

                        m += offset;
                    }
                }

                var lastMaskCharDigit = mask.charAt(lastMaskChar);
                if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                    buf.push(lastMaskCharDigit);
                }

                return buf.join('');
            },
            callbacks: function (e) {
                var val = p.val(),
                    changed = val !== oldValue,
                    defaultArgs = [val, e, el, options],
                    callback = function(name, criteria, args) {
                        if (typeof options[name] === 'function' && criteria) {
                            options[name].apply(this, args);
                        }
                    };

                callback('onChange', changed === true, defaultArgs);
                callback('onKeyPress', changed === true, defaultArgs);
                callback('onComplete', val.length === mask.length, defaultArgs);
                callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
            }
        };

        el = $(el);
        var jMask = this, oldValue = p.val(), regexMask;

        mask = typeof mask === 'function' ? mask(p.val(), undefined, el,  options) : mask;


        // public methods
        jMask.mask = mask;
        jMask.options = options;
        jMask.remove = function() {
            var caret = p.getCaret();
            p.destroyEvents();
            p.val(jMask.getCleanVal());
            p.setCaret(caret - p.getMCharsBeforeCount(caret));
            return el;
        };

        // get value without mask
        jMask.getCleanVal = function() {
           return p.getMasked(true);
        };

        // get masked value without the value being in the input or element
        jMask.getMaskedVal = function(val) {
           return p.getMasked(false, val);
        };

       jMask.init = function(onlyMask) {
            onlyMask = onlyMask || false;
            options = options || {};

            jMask.clearIfNotMatch  = $.jMaskGlobals.clearIfNotMatch;
            jMask.byPassKeys       = $.jMaskGlobals.byPassKeys;
            jMask.translation      = $.extend({}, $.jMaskGlobals.translation, options.translation);

            jMask = $.extend(true, {}, jMask, options);

            regexMask = p.getRegexMask();

            if (onlyMask === false) {

                if (options.placeholder) {
                    el.attr('placeholder' , options.placeholder);
                }

                // this is necessary, otherwise if the user submit the form
                // and then press the "back" button, the autocomplete will erase
                // the data. Works fine on IE9+, FF, Opera, Safari.
                if (el.data('mask')) {
                  el.attr('autocomplete', 'off');
                }

                p.destroyEvents();
                p.events();

                var caret = p.getCaret();
                p.val(p.getMasked());
                p.setCaret(caret + p.getMCharsBeforeCount(caret, true));

            } else {
                p.events();
                p.val(p.getMasked());
            }
        };

        jMask.init(!el.is('input'));
    };

    $.maskWatchers = {};
    var HTMLAttributes = function () {
        var input = $(this),
            options = {},
            prefix = 'data-mask-',
            mask = input.attr('data-mask');

        if (input.attr(prefix + 'reverse')) {
            options.reverse = true;
        }

        if (input.attr(prefix + 'clearifnotmatch')) {
            options.clearIfNotMatch = true;
        }

        if (input.attr(prefix + 'selectonfocus') === 'true') {
           options.selectOnFocus = true;
        }

        if (notSameMaskObject(input, mask, options)) {
            return input.data('mask', new Mask(this, mask, options));
        }
    },
    notSameMaskObject = function(field, mask, options) {
        options = options || {};
        var maskObject = $(field).data('mask'),
            stringify = JSON.stringify,
            value = $(field).val() || $(field).text();
        try {
            if (typeof mask === 'function') {
                mask = mask(value);
            }
            return typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
        } catch (e) {}
    },
    eventSupported = function(eventName) {
        var el = document.createElement('div'), isSupported;

        eventName = 'on' + eventName;
        isSupported = (eventName in el);

        if ( !isSupported ) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] === 'function';
        }
        el = null;

        return isSupported;
    };

    $.fn.mask = function(mask, options) {
        options = options || {};
        var selector = this.selector,
            globals = $.jMaskGlobals,
            interval = globals.watchInterval,
            watchInputs = options.watchInputs || globals.watchInputs,
            maskFunction = function() {
                if (notSameMaskObject(this, mask, options)) {
                    return $(this).data('mask', new Mask(this, mask, options));
                }
            };

        $(this).each(maskFunction);

        if (selector && selector !== '' && watchInputs) {
            clearInterval($.maskWatchers[selector]);
            $.maskWatchers[selector] = setInterval(function(){
                $(document).find(selector).each(maskFunction);
            }, interval);
        }
        return this;
    };

    $.fn.masked = function(val) {
        return this.data('mask').getMaskedVal(val);
    };

    $.fn.unmask = function() {
        clearInterval($.maskWatchers[this.selector]);
        delete $.maskWatchers[this.selector];
        return this.each(function() {
            var dataMask = $(this).data('mask');
            if (dataMask) {
                dataMask.remove().removeData('mask');
            }
        });
    };

    $.fn.cleanVal = function() {
        return this.data('mask').getCleanVal();
    };

    $.applyDataMask = function(selector) {
        selector = selector || $.jMaskGlobals.maskElements;
        var $selector = (selector instanceof $) ? selector : $(selector);
        $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
    };

    var globals = {
        maskElements: 'input,td,span,div',
        dataMaskAttr: '*[data-mask]',
        dataMask: true,
        watchInterval: 300,
        watchInputs: true,
        useInput: eventSupported('input'),
        watchDataMask: false,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            '0': {pattern: /\d/},
            '9': {pattern: /\d/, optional: true},
            '#': {pattern: /\d/, recursive: true},
            'A': {pattern: /[a-zA-Z0-9]/},
            'S': {pattern: /[a-zA-Z]/}
        }
    };

    $.jMaskGlobals = $.jMaskGlobals || {};
    globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

    // looking for inputs with data-mask attribute
    if (globals.dataMask) {
        $.applyDataMask();
    }

    setInterval(function() {
        if ($.jMaskGlobals.watchDataMask) {
            $.applyDataMask();
        }
    }, globals.watchInterval);
}));