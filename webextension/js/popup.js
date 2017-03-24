var main = new Vue({
    el: '#main',
    data: {
        authenticated: false,
        credentials: {
            login: '',
            password: '',
            token: ''
        },
        form: {
            sent: false,
            error: ''
        }
    },
    methods: {
        submit: function(){
            this.form.sent = true;

            axios.post('https://', {
                login: this.credentials.login,
                password: this.credentials.password
            }).then(function (response) {
                console.log(response);

                response = JSON.parse(response);
                main.credentials.token = response.token;
                main.authenticated = true;
            }).catch(function (error) {
                console.log(error);

                
            });
        },
        check: function(){
            chrome.storage.sync.get('token', function(items){
                if(items.length > 0){
                    main.credentials.token = items[0];
                    main.authenticated = true;
                }
                else
                {
                    
                }
            });
        }
    }
})

var auctionsList = new Vue({
    el: '#auctionsList',
    data: {
        auctions: [
            { 
                img: 'http://placehold.it/48x48', 
                title: 'title 1'
            },
            { 
                img: 'http://placehold.it/48x48', 
                title: 'title 2'
            },
        ]
    }
})


