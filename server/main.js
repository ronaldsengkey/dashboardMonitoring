import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.startup(() => {
    // code to run on server at startup
    console.log('Run on server');
});

const httpGetAsync = (url, options) => new Promise((resolve, reject) => {
    HTTP.get(url, options, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    })
})

const httpPostAsync = (url, options) => new Promise((resolve, reject) => {
    HTTP.post(url, options, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    })
})

Meteor.methods({
    async getLogs(param) { //getLogs
        console.log('Getting getLogs', param);
        console.log('Getting getLogs2', JSON.stringify(param));
        try {
            if(param != 'all') {
                param = JSON.stringify(param);
            }
            const response = await httpGetAsync('http://192.168.0.96:8208/log/log', {
                'headers': {
                    'Content-Type': 'application/json',
                    'signature': 'signature',
                    'token': 'token',
                    'param': param
                }
            });
            console.log('response getLogs', response.data);
            return response.data;
        } catch (ex) {
            throw new Meteor.Error('some-error', ex);
        }
    },
    async login() { //login
        console.log('Getting login');
        try {
            const response = await httpPostAsync('http://192.168.0.96:8443/authentication/login/employee', {
                'headers': {
                    'Content-Type': 'application/json',
                    'signature' : 'Dfc5j2ptdXsT87ZmgrUFikzXt77IH3jRbN/whtHXs4E+ZH3iCOIFNONHHbc10Ym5QGlNvgWS0O8vLBq556hK7N6M4CzVCQncniMRBDkY6vITP9EvK084BmImN/ES8bv/c16mftYF7ioOiSHrMePm6ulp16yMJbRQKK+t3dQTu7YGegoI7Bpg+spMOI6HVfviHjbMobicp2tUuZNcNMmFLqqCTbggQkeuvnHcQsVxsRZ4oWUM4xXtNjhZsf6jXBOCPA4zFXAPyTsjyeGJa9SP5UycmF5ttQmMFNvR7doeDDy/LDEPzxqPQUzfjhlmkZ9Ln9TVukUIoZBawYkHSPa8XjHmIP20HU4bA4USykq6wZUZVP+X9OhTsAiC6WxXJ6cB1CGzEjR8ICZSiG4j1TWjyoXyfLi5ynoFT2VszYC5GZNhLrWGw0Eytm+XLNoY/02fzrr081MFBhFnCrEVn4rJYYVX21nX9uyMk3gKQAb/SOPUVa4nYBSw1N9IW66PI+K5L3ICmzhBM7dPC9LUSVO38xRPNXaFw5j9TFSoWYClXY3YV109RDY6v5EcXyqAMonDFa4Vpf1vAHP1r41RCEoMQ/7/FjFyO5V1L4zRlKsRXGZapTOUpiY4t9l3wr4y4LSNf0sFneVgJouRlexwO6AXPZZ7SLxxczrhVbzQr0iQV7yo/Uqbp1hTPaoxInG8dLK4+iDwjXio8titmdTNfYoCQTNUtCTKysRqPQRrsJx0gKfvLUEmRL4RoSq6i3pLJK+S',
                    'clientKey' : '5QnNeLmYyweViavQTc3iDe6V4EVPApBs+YGJZNFLCYJD6lNKM0j4W7P6rrQLaLfpUJUlXcMYY12dLQ0lfiyluC3DyQ1ed5+TPH0tjmFmFjt8xxxexbeMeCUaXGBg6xnSl5MxRc6YyZ6w5muibIscH4Vtn78W1GwZCOy689SpGaUbFA0vB0Ed12JSXUO1hTGEAGz3ResPqrKGzXPK82dHsNwZCdLth9z0Jt+ydxQ6+JOOGCAffI3vkSw+f+SmKR0ovSZcOIFdes/sKwPiaqolmu1dATHNlG7HutbFiwYKsxUPFCQdxcA+H3rJbirBvgAL+7tr7aAEtpwYxjfqKZ1NWg==',
                    'aes' : 'QdJuUj2z7zcH/Lc4G2yewwiS2jzRonIHRKOJn/nYiLTaUVCzjTenWw6qIioOGnEwxun0G459e60eCqKLsBNor2W1sRJkyBhTKjT6dJCGVwm0BXRvvrEr7N5bDiSRCjlqXHkvoJdU45xx1fQsGE7oP/meX4KXFA41GS4VjK/5DXU='
        
                },
                body: '{"params":{"email":"email","password":"password"}}'
            });
            console.log('response getLogs', response.data);
            return response.data;
        } catch (ex) {
            throw new Meteor.Error('some-error', ex);
        }
    },
});