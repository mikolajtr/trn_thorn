var main = new Vue({
    el: '#main',
    data: {
        authenticated: false,
        backend: false,
        credentials: {
            login: '',
            password: '',
            token: ''
        },
        form: {
            sent: false,
            error: ''
        },
        refresh: 30000,
        counter: 0,
        auctions: [

        ],
    },
    methods: {
        submitForm: function(){
            this.form.sent = true;

            if(this.backend){
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
            }
            else
            {
                this.authenticated = true;
                $(document).ready(function(){
                    $('ul.tabs').tabs();
                });
            }
        },
        checkAuth: function(){
            chrome.storage.sync.get('token', function(items){
                if(items.length > 0){
                    this.credentials.token = items[0];
                    this.authenticated = true;

                    $(document).ready(function(){
                        $('ul.tabs').tabs();
                    });
                }
                else
                {

                }
            }.bind(this));
        },
        loadData: function(){
            console.log('loadData');
            if(this.authenticated)
            {
                if(this.backend){

                }
                else
                {
                    this.auctions.push({ 
                        img: 'http://placehold.it/48x48', 
                        title: 'title' + (this.counter++)
                    });
                }
            }
        }
    },
    mounted: function(){
        console.log('mounted');
        this.checkAuth();
        this.loadData();
        setInterval(function(){
            main.loadData();
        }, this.refresh); 
    }
})
