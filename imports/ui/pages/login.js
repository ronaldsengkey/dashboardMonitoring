import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './login.html';

Template.login.onRendered(function() {
    console.log('userToken', Meteor._localStorage.getItem('userData'));
});

Template.login.events({
    'click .test'(event) {
        // Meteor.call('login', function(err, results) {
        //     console.log('call login', results);
        // });
        Meteor._localStorage.setItem('userData', '123');
        FlowRouter.go('/admin');
        console.log('userToken', Meteor._localStorage.getItem('userData'));
    }
});