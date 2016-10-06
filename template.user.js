// ==UserScript==
// @name            Tool for leetcode.com
// @match           https://leetcode.com/problems/*
// @match           https://leetcode.com/submissions/detail/*
// @description     This tool shows tables on database problems after you submit a wrong answer, so you don't need to read their unreadable JSON representation of tables.
// @version         1.3
// @git             <commit>
// ==/UserScript==

// @todo table sorting, diff functionality


(function () {

    // dependancies inserted here
    //# @include sql_table.js
    //# @include bootstrap.js
    //# @include main.js

    bootstrap( main, {
        modules: [ {
            // jQuery
            url: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js',
            has: function () {
                return window.jQuery;
            },
            get: function () {
                return window.$.noConflict();
            }
        }, {
            // underscore
            url: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
            has: function () {
                return undefined;
            },
            get: function () {
                return window._.noConflict();
            }
        }, {
            // sql_table
            has: function () {
                return sql_table;   // direct reference
            }
        } ],
        css: [
            // pure.css
            '//cdnjs.cloudflare.com/ajax/libs/pure/0.6.0/pure-min.css'
        ]
    } );

})();
