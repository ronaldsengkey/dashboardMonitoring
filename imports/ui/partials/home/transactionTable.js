import { Meteor } from 'meteor/meteor';
import { dataTableGlobal, addRow, loadingActivated, loadingDeactivated } from '../../../../lib/functions.js';

export const transactionTable = (param) => {
    console.log('open transactionTable');
    loadingActivated();

    Meteor.call('getLogs', param, function(err, results) {
        console.log('call getLogs', results.data);
        if (!results.data) { // Undefined
            $('#tableLogs tbody tr td p').html('Data not found');
        } else { // Success
            dataTableGlobal('#tableLogs');
            $.each(results.data, function(key, val) {
                addRow('#tableLogs', val);
            });
        }
        loadingDeactivated();
    });
}