import { Template } from 'meteor/templating';
import datatables from 'datatables.net';
import { Session } from 'meteor/session';
import { transactionChart } from '../partials/home/transactionChart.js';
import { transactionTable } from '../partials/home/transactionTable.js';
import './home.html';
import 'bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

Template.home.created = function () {
    datatables(window, $);
};

Template.home.onRendered(function() {
    transactionChart();

    $('#timeRange').daterangepicker({
        "showDropdowns": true,
        "autoApply": true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "showCustomRangeLabel": false,
        "alwaysShowCalendars": true,
        "startDate": moment().subtract(6, 'days'),
        "endDate": moment(),
        "opens": "left",
        "drops": "auto"
    }, function(start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
        Session.set('startDate', start.format('YYYY-MM-DD'));
        Session.set('endDate', end.format('YYYY-MM-DD'));
        const statusValue = Session.get('status');
        const startDateValue = Session.get('startDate');
        const endDateValue = Session.get('endDate');
        let param = {
            status: statusValue,
            dateStart: startDateValue,
            dateEnd: endDateValue
        }
        console.log('param', param);
        transactionTable(param);
    });
});

Template.home.events({
    'click #tableTabBtn'(e) {
        $('#dataFilter').data('filter', 'table-filter');
        $('#'+ e.currentTarget.id).hide();
        $('#chartTabBtn').show();
        $('#chartTab').hide();
        $('#tableTab').show();

        let param = {
            startDate: moment().subtract(6, 'days').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD')
        }
        console.log('dataFilter', $('#dataFilter').data('filter'));
        transactionTable(param);
    }, 
    'click #chartTabBtn'(e) {
        $('#'+ e.currentTarget.id).hide();
        $('#tableTabBtn').show();
        $('#tableTab').hide();
        $('#chartTab').show();
    },
    'click #filterBtn'(e) {
        $(e.currentTarget).siblings().removeClass('active');
        $(e.currentTarget).addClass('active');
        
        const dataValue = e.currentTarget.dataset.value;
        const dataFilter = e.currentTarget.dataset.filter;
        Session.set(dataFilter, dataValue);
        console.log('Session_'+ dataFilter, Session.get(dataFilter));

        const statusValue = Session.get(dataFilter);
        const startDateValue = Session.get('startDate');
        const endDateValue = Session.get('endDate');
        let param = {
            status: statusValue,
            dateStart: startDateValue,
            dateEnd: endDateValue
        }
        transactionTable(param);
    }
});
