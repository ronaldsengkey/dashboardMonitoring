import Chart from 'chart.js';
import moment from 'moment';

export const dataTableGlobal = (id) => {
    $(id).find('tbody tr.loading').remove();
    var table = $(id).DataTable({
        "retrieve": true,
        "searching": false,
        "processing": false,
        "bLengthChange": false,
        "scrollY": "320px",
        "bAutoWidth": false,
        "pageLength": 10,
        "order": [[ 0, "asc" ]],
        "bInfo" : false,
        dom: 'r<"table-responsive"t><"px-5 pt-3"p>',
        "drawCallback": function () {
            $('.dataTables_paginate').addClass('pagination');
            $('.dataTables_paginate span').addClass('pagination');
            $('.dataTables_paginate .previous').addClass('rounded-left');
            $('.dataTables_paginate .next').addClass('rounded-right');
            $('.dataTables_paginate a').addClass('page-link cursor-pointer text-body');
            $('.dataTables_paginate span span.ellipsis.pagination').addClass('px-2 text-white');
        }
    });

    table.clear().draw();
    table.on('order.dt search.dt', function() {
        table.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
            cell.innerHTML = i+1;
        })
    }).draw();
}

export const addRow = (id, data) => {
    let result = `<tr>
        <td></td>
        <td>${data.status}</td>
        <td>${data.accessor}</td>
        <td>${data.accessorAddress}</td>
        <td>${data.accessorCategory}</td>
        <td>${moment(data.createdDate).format('DD/MM/YYYY')}</td>
        <td class="text-nowrap text-center">
            <button class="btn btn-success my-0 px-3 btn-sm"><i class="fa fa-eye" aria-hidden="true"></i></button>
        </td>
    </tr>`;

    var table = $(id).DataTable();
    table.row.add($(result)).draw();
}

export const logout = () => {
    console.log('Logout');
    Meteor._localStorage.removeItem('userData');
    FlowRouter.go('/login');
}

export const loadingActivated = () => {
    const loading = `<div id="loadingWrap">
        <div class="d-flex align-items-center justify-content-center contentLoadingWrap">
            <div class="lds-ripple"><div></div><div></div></div>
        </div>
    </div>`;
    $('body').append(loading);
    $('#loadingWrap').fadeIn('slow');
}

export const loadingDeactivated = () => {
    $('#loadingWrap').fadeOut('slow', function () {
        $('#loadingWrap').remove();
    });
}

export const lineChart = (canvas, dataLabels, varDatasets) => {
    const transCanvas = $(canvas);
    
    Chart.defaults.global.defaultFontSize = 13;
    Chart.defaults.global.defaultFontColor = '#dee2e6';

    const transData = {
        labels: dataLabels,
        datasets: varDatasets
    };

    new Chart(transCanvas, {
        type: 'line',
        data: transData,
        options: {
            responsive: true,
            layout: {
                padding: {
                    top: 10,
                }
            },
            // tooltips: {
            //     mode: 'label',
            //     position: 'cursor',
            //     intersect: true,
            // },
            scales: {
                yAxes: [
                    {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis-1',
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 5
                        },
                        gridLines: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    }
                ],
                xAxes: [
                    {
                        gridLines: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        },
                    },
                ]
            },
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 14,
                    padding: 20
                }
            }
        }
    })
}