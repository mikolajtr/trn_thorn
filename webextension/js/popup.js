var main = new Vue({
    el: '#main',
    data: {
        backend: true,
        authenticated: false,
        token: '',
        api: {
            "url": "https://ssl.allegro.pl/auth/oauth/authorize",
            "response_type": "code",
            "client_id": "a41f5b2a-8e87-4b8b-b6fe-74cc763720d7",
            "api-key": "eyJjbGllbnRJZCI6ImE0MWY1YjJhLThlODctNGI4Yi1iNmZlLTc0Y2M3NjM3MjBkNyJ9.ogVV_a9RUOMa1OWFZOTmgTkdk-U37vTliDCBUQ1YySU=",
            "redirect_uri": ""
        },
        refresh: 30000,
        counter: 0,
        auctions: [

        ],
    },
    computed: {
        url: {
            get: function() {
                return this.api.url + '?response_type=' + this.api.response_type + '&client_id=' + this.api.client_id + '&api-key='+this.api["api-key"] + "&redirect_uri=" + this.api.redirect_uri
            },
        }
    },
    methods: {
        setToken: function(token){
            chrome.storage.sync.set({token:token},function(){
                main.checkAuth();
            });  
        },
        checkAuth: function(){
            if(!this.backend){
                this.authenticated = true;
                $(document).ready(function(){
                    $('ul.tabs').tabs();
                });
            }
            else
            {
                chrome.storage.sync.get('token', function(items){
                    if(items.length > 0){
                        this.token = items[0];
                        this.authenticated = true;

                        $(document).ready(function(){
                            $('ul.tabs').tabs();
                        });
                    }
                    else
                    {

                    }
                }.bind(this));
            }
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
                        title: 'title' + (this.counter++),
                        price: Math.floor(Math.random()*899+100),
                        date: '2017-25-03 4:00',
                        limit: 0
                    });
                }
            }
        },
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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.token){
            main.setToken(request.token);
        }
    }
);
