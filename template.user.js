// ==UserScript==
// @name            Tool for leetcode.com
// @match           https://leetcode.com/problems/*
// @description     This tool shows tables on database problems after you submit a wrong answer, so you don't need to read their unreadable JSON representation of tables.
// @version         1.0
// ==/UserScript==


(function () {

    // dependancies inserted here
    //# @include sql_table.js
    //# @include bootstrap.js
    //# @include main.js

    bootstrap( main, {
        modules: [ {
            url: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js',
            has: function () {
                return window.jQuery;
            },
            get: function () {
                return window.$.noConflict();
            }
        }, {
            url: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
            has: function () {
                return undefined;
            },
            get: function () {
                return window._.noConflict();
            }
        }, {
            has: function () {
                return sql_table;   // direct reference
            }
        } ],
        css: [
            '//cdnjs.cloudflare.com/ajax/libs/pure/0.6.0/pure-min.css'
        ]
    } );

})();
