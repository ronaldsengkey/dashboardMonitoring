import { Template } from 'meteor/templating';
import { logout } from '../../../lib/functions';

import './header.html';

Template.header.events({
    'click .logout'(event) {
        logout();
    }
});