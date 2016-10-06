/**
 * @file This module works with leetcode's json representable of tables.
 */

var sql_table = (function ( factory ) {
    var modulize = function ( factory, args ) {
        var callable = function () {
            return modulize( factory, arguments );
        };

        var obj = factory.apply( null, args );
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                callable[prop] = obj[prop];
            }
        }

        return callable;
    };

    return function () {
        return modulize( factory, arguments );
    }
})( function ( $, _ ) {

    /**
     @typedef {Object} Table
     @property {string}     name    The name of table
     @property {string[]}   headers List of headers
     @property {Array[]}    values  Rows of table
     */


    /**
     * Create table element from a leetcode json
     * @param {Table} obj   Parsed json from "output" or "expected" field
     * @returns {jQuery}    The table object
     */
    var create_table_elem = function ( obj ) {
        /**
         * Wrap a list of text with tag
         * @param {string[]}    arr
         * @param {string}      tag
         * @returns {jQuery[]}  Array of wrapping element
         */
        var wrap_text = function ( arr, tag ) {
            return _( arr ).map( function ( txt ) {
                return $( tag ).text( txt );
            } );
        };

        return $( '<table>' )
            .append( $( '<caption>' ).text( obj.name ) )
            .append( $( '<thead>' )
                .append( $( '<tr>' ).append( wrap_text( obj.headers, '<th>' ) ) ) )
            .append( $( '<tbody>' )
                .append( _( obj.values ).map( function ( row ) {
                    return $( '<tr>' ).append( wrap_text( row, '<td>' ) );
                } ) ) );
    };


    /**
     * Split the input json from leetcode to multiple table objects
     * @param {Object}                    obj           Parsed json from "input" field
     * @param {Object.<string, string[]>} obj.headers   Table name -> list of headers
     * @param {Object.<string, Array>}    obj.rows      Table name -> list of rows
     * @returns {Object.<string, Table>}                Table name -> table object
     */
    var split_input_table = function ( obj ) {
        var tables = {};
        _( obj.headers ).each( function ( headers, table_name ) {
            var table = {};
            table.name = table_name;
            table.headers = headers;
            table.values = obj.rows[ table_name ];
            tables[ table_name ] = table;
        } );

        return tables;
    };


    return {
        create_table_elem: create_table_elem,
        split_input_table: split_input_table
    };
} );
