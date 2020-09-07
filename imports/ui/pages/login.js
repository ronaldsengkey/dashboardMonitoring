import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Swal } from "sweetalert";
// import { Swal2 } from 'sweetalert2/dist/sweetalert2.js';
// import 'sweetalert2/src/sweetalert2.scss';

// import { LoginModel } from '../partials/home/transactionTable.js';
import { dataTableGlobal, addRow, loadingActivated, loadingDeactivated } from '../../../lib/functions.js';
import './login.html';

Template.login.onRendered(function() {
    console.log('userToken onRendered =>', Meteor._localStorage.getItem('userData'));
});

Template.login.events({
    'click .test'(event) {
        console.log('login ye')
        // Meteor.call('login', function(err, results) {
        //     console.log('call login', results);
        // });
        Meteor._localStorage.setItem('userData', '123');
        FlowRouter.go('/admin');
        console.log('userToken events =>', Meteor._localStorage.getItem('userData'));
    },
    'click .btnLogin'(event) {
        var email = $('#email').val();
        var password = $('#password').val();

        let param = {
            email: email,
            password: password
        }
        LoginModel(param);
    }
});

const LoginModel = (param) => {
    console.log('open LoginModel');
    loadingActivated();

    Meteor.call('login', param, function(err, results) {
        console.log('call getLogs =>', results);
        if (!results.data) { // Undefined
            console.log('login fail')
            swal(results.responseMessage);
            FlowRouter.go('/login');

        } else { // Success
            swal(results.responseMessage);
            console.log('login Success')
            Meteor._localStorage.setItem('userData', results.data);
            console.log('userData =>',results.data);
            FlowRouter.go('/admin');
        }
        loadingDeactivated();
    });
}