import { Meteor } from 'meteor/meteor';

export const login = (param) => {
    console.log('post to login');
    loadingActivated();

    Meteor.call('login', param, function(err, results) {
        console.log(results);
    });
}