"use strict";
$(document).ready(function(){
    $('#keytable').DataTable( {
        keys: true,
        autoFill: true
    } );
    $('#column-selector').DataTable( {
        columnDefs: [ {
            orderable: false,
            className: 'select-checkbox',
            targets:   0
        } ],
        select: {
            style:    'os',
            selector: 'td:first-child'
        },
        order: [[ 1, 'asc' ]],
        autoFill: {
            columns: ':not(:first-child)'
        }
    } );
    var table = $('#scrolling-datatable').dataTable( {
        scrollY: 400,
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        autoFill: true
    } );
    var table = $('#basic-row-reorder').DataTable( {
        rowReorder: true
    } );
//full row selection
    var table = $('#full-row').DataTable( {
        rowReorder: {
            selector: 'tr'
        },
        columnDefs: [
            { targets: 0, visible: false }
        ]
    } );


// Restricted column ordering

    $('#export-button').DataTable( {
        dom: 'Bfrtip',
        retrieve: true,
        buttons: [
            // 'copyHtml5',
            'excelHtml5',
            // 'csvHtml5',
            'pdfHtml5'
        ]
    } );

    $('#export-button').on('draw.dt', function() {
        currency()
        thousands_separators()
    });
    

    $('#multilevel-btn').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'collection',
                text: 'Table control',
                buttons: [
                    {
                        text: 'Toggle Due date',
                        action: function ( e, dt, node, config ) {
                            dt.column( -2 ).visible( ! dt.column( -2 ).visible() );
                        }
                    },
                    {
                        text: 'Toggle Review',
                        action: function ( e, dt, node, config ) {
                            dt.column( -1 ).visible( ! dt.column( -1 ).visible() );
                        }
                    },
                    'colvis'
                ]
            }
        ]
    } );
    var table = $('#fixed-header-footer').DataTable( {
        fixedHeader: {
            header: true,
            footer: true
        }
    } );
});


