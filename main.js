/**
 * @file Main function of this user script
 */

// Arguments correspond to the dependency references.
// @see {@link bootstrap} for further information.
var main = function ( $, _, sql_table ) {
    // Is this a sql problem or sql submission
    var has_sql = $( '*[ng-switch-when=mysql]' ).length > 0 // sql problem
        || (window.pageData && window.pageData.getLangDisplay === 'mysql'); // sql submission
    if ( !has_sql ) {
        return;
    }

    // load sql_table module
    sql_table = sql_table( $, _ );

    // get json from these elements
    var input_id = '#result_wa_testcase_input';
    var output_id = '#result_wa_testcase_output';
    var expected_id = '#result_wa_testcase_expected';
    var last_exe_id = '#last_executed_testcase_output';

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

    /**
     * Render tables after "Wrong Answer" encountered.
     */
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

    /**
     * Render tables after "Runtime Error" encountered.
     */
    var show_le_table = function () {
        var table_ctn = $( '<div>' )
            .append( '<hr>' )
            .append( $( '<div>' ).text( 'Inputs:' ) )
            .append( get_input_tables( $( last_exe_id ) ) );

        var last_exe = $( '#last_executed_testcase_output_row' );
        // remove prevous tables
        last_exe.children().first().nextAll().remove();
        last_exe.append( table_ctn );
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

    /**
     * Invoke callback when element is visible. Using MutationObserver
     * @param {jQuery} elem
     * @param {function} func
     */
    var setup_observer = function ( elem, func ) {
        // already visible
        if ( elem.is( ':visible' ) ) {
            func();
        }

        var observer = new MutationObserver( function () {
            if ( elem.css( 'display' ) !== 'none' ) {
                func();
            }
        } );
        // observe style attribute changes
        observer.observe( elem.get( 0 ), { attributes: true } );
    };

    /**
     * Invoke callback when element is visible. Using setInterval()
     * @param {jQuery} elem
     * @param {function} func
     */
    var setup_poller = function ( elem, func ) {
        var is_showing = false;
        var check = function () {
            if ( elem.is( ':visible' ) ) {
                if ( !is_showing ) {
                    func();
                    is_showing = true;
                }
            } else {
                is_showing = false;
            }
        };

        window.setInterval( check, 500 );
    };

    var setup;
    if ( !window.MutationObserver ) {
        setup = setup_poller;
    } else {
        setup = setup_observer;
    }

    // show tables after wrong answer appeared
    setup( $( '#wa_output' ), show_table );
    // show tables after a runtime errer
    setup( $( '#last_executed_testcase_output_row' ), show_le_table );
};
