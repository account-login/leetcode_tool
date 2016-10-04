/**
 * @file Dependancy loader for user scripts.
 */


// ref: https://gist.github.com/cyranix/6180495

/**
 * @typedef {Object}    JSModule
 * @property {string}   url
 * @property {Function} has
 * @property {Function} get
 */

/**
 * Dependancy loader for user scripts.
 * @param {Function}    main                Main function of a user script,
 *                                              call with loaded js modules
 * @param {Object}      opts                Required JS, CSS
 * @param {JSModule[]}  [opts.modules=[]]   Array of JS module specifiers
 * @param {string[]}    [opts.css=[]]       Array of URLs to CSS dependencies
 */
var bootstrap = function ( main, opts ) {
    /**
     * Load a js url and invoke callback
     * @param {string}      url
     * @param {function}    callback
     */
    var load_js = function ( url, callback ) {
        var script = document.createElement( 'script' );
        script.src = url;
        script.addEventListener( 'load', callback );
        document.body.appendChild( script );
    };

    /**
     * Load a list of css urls
     * @param {string[]} url_list
     */
    var load_css_multi = function ( url_list ) {
        while ( url_list.length > 0 ) {
            var head = document.getElementsByTagName( 'head' )[ 0 ];
            var link = document.createElement( 'link' );
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url_list.shift();
            link.media = 'all';
            head.appendChild( link );
        }
    };

    /**
     * Load a list of JS modules and invoke callback with a list of loaded module objects
     * @param {JSModule[]}  mod_list
     * @param {Function}    done
     * @param {Object[]}    [loaded]
     */
    var load_js_modules = function ( mod_list, done, loaded ) {
        loaded = loaded || [];
        if ( mod_list.length > 0 ) {
            var mod_specifier = mod_list.shift();
            var existed = mod_specifier.has();
            if ( existed ) {
                loaded.push( existed );
                load_js_modules( mod_list, done, loaded );
            } else {
                load_js( mod_specifier.url, function () {
                    loaded.push( mod_specifier.get() );
                    load_js_modules( mod_list, done, loaded );
                } );
            }
        } else {
            done( loaded );
        }
    };

    var load_all = function () {
        var css_urls = opts.css || {};
        var modules = opts.modules || [];

        load_css_multi( css_urls );
        load_js_modules( modules, function ( mod_objs ) {
            // start main function
            main.apply( null, mod_objs );
        } );
    };

    load_all();
};
