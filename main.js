/**
 * @file Main function of this user script
 */

// Arguments correspond to the dependency references.
// @see {@link bootstrap} for further information.
var main = function ( $, _, sql_table ) {
    // Is this a sql problem
    if ( $( '*[ng-switch-when=mysql]' ).length === 0 ) {
        return;
    }

    // load sql_table module
    sql_table = sql_table( $, _ );

    // get json from these elements
    var input_id = '#result_wa_testcase_input';
    var output_id = '#result_wa_testcase_output';
    var expected_id = '#result_wa_testcase_expected';

    // styles for table
    var table_classes = [ 'pure-table', 'pure-table-bordered', 'pure-table-striped' ];

    /**
     * Create table element from "input" field
     * @param {jQuery} el
     * @return {jQuery[]} Array of table element
     */
    var get_input_tables = function ( el ) {
        // workaround: leetcode is replacing ',' with '\n'
        var json = JSON.parse( el.text().replace( /\n/g, ', ' ) );
        return _( sql_table.split_input_table( json ) ).map( function ( table ) {
            return sql_table.create_table_elem( table )
                .addClass( table_classes.join( ' ' ) );
        } );
    };

    /**
     * Create table element from "output" or "expected" field
     * @param {jQuery} el
     * @return {jQuery} The table element
     */
    var get_output_table = function ( el ) {
        var json = JSON.parse( el.text() );
        return sql_table.create_table_elem( json )
            .addClass( table_classes.join( ' ' ) );
    };

    var show_table = function () {
        var table_ctn = $( '<div>' )
            .append( '<hr>' )
            .append( $( '<div>' ).text( 'Inputs:' ) )
            .append( get_input_tables( $( input_id ) ) )

            .append( '<hr>' )
            .append( $( '<div class="pure-g">' )
                .append( $( '<div class="pure-u-1-2">' )
                    .css( { color: 'red' } )
                    .append( $( '<div>' ).text( 'Output:' ) )
                    .append( get_output_table( $( output_id ) ) ) )
                .append( $( '<div class="pure-u-1-2">' )
                    .css( { color: 'green' } )
                    .append( $( '<div>' ).text( 'Expected:' ) )
                    .append( get_output_table( $( expected_id ) ) ) ) );

        var wa_output = $( '#wa_output' );
        // remove prevous tables
        wa_output.children().first().nextAll().remove();
        wa_output.append( table_ctn );
    };

    var create_show_table_btn = function () {
        var btn = $( '<button>' )
            .text( 'Tablize!' )
            .addClass( 'pure-button' )
            .css( { 'margin-left': '16px' } )
            .click( function () {
                show_table();
            } );
        $( '#more-details' ).after( btn );
    };

    // create_show_table_btn();

    var setup_wa_observer = function () {
        var wa_output = $( '#wa_output' );
        var observer = new MutationObserver( function ( mutations ) {
            if ( wa_output.css( 'display' ) !== 'none' ) {
                show_table();
            }
        } );

        //observe changes
        observer.observe( wa_output.get( 0 ), { attributes: true } );
    };

    var setup_wa_poller = function () {
        var wa_output = $( '#wa_output' );
        var is_showing = false;
        var check_wa = function () {
            if ( wa_output.is( ':visible' ) ) {
                if ( !is_showing ) {
                    show_table();
                }
            } else {
                is_showing = false;
            }
        };

        window.setInterval( check_wa, 500 );
    };

    // show table after wrong answer appeared
    if ( MutationObserver ) {
        setup_wa_observer();
    } else {
        setup_wa_poller();
    }
};
