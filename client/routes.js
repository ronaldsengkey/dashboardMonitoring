FlowRouter.route('/', {
    triggersEnter: [function (context, redirect) {
        redirect('/login');
    }],
    action: function (_params) {
        throw new Error("this should not get called");
    }
});

FlowRouter.route('/login', {
    name: 'login',
    triggersEnter: [
        (context, redirect) => {
            const userData = Meteor._localStorage.getItem('userData');
            if (userData) {
                redirect('/admin');
            }
        }
    ],
    action() {
        BlazeLayout.render('layout', {
            main: 'login'
        });
    }
});

const adminRoutes = FlowRouter.group({
    prefix: '/admin',
    triggersEnter: [
        (context, redirect) => {
            const userData = Meteor._localStorage.getItem('userData');
            console.log('userData', userData);
            if (!userData) {
                redirect('/login');
            }
        }
    ]
});

adminRoutes.route('/', {
    action() {
        BlazeLayout.render('layout', {
            main: 'home'
        });
    }
});