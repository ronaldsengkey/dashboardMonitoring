import { Meteor } from 'meteor/meteor';
import { lineChart } from '../../../../lib/functions.js';
import './transactionChart.html';

export const transactionChart = () => {
    const dates = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
    const varDatasets = [{
        label: 'Approved',
        borderColor: '#20a8d8',
        backgroundColor: '#20a8d8',
        fill: false,
        pointHoverRadius: 5,
        data: [12, 19, 3, 5, 2, 3],
        yAxisID: 'y-axis-1',
    }];
    lineChart('#myChart', dates, varDatasets);
}