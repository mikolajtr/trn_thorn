var main = new Vue({
    el: '#main',
    data: {
        backend: true,
        authenticated: false,
        credentials: {
            login: '',
            password_hash: '',
            token: '',
            userid: ''
        },
        form: {
            sent: false,
            error: ''
        },
        api: {
            "client_id": "a41f5b2a-8e87-4b8b-b6fe-74cc763720d7",
            "api-key": "eyJjbGllbnRJZCI6ImE0MWY1YjJhLThlODctNGI4Yi1iNmZlLTc0Y2M3NjM3MjBkNyJ9.ogVV_a9RUOMa1OWFZOTmgTkdk-U37vTliDCBUQ1YySU=",
            "server": "http://allegroreminderapi20170325014922.azurewebsites.net",
            "allegro": "https://api.natelefon.pl",
            "oferty": "https://allegroapi.io/"
        },
        refresh: 30000,
        counter: 0,
        auctions: [
        ],
    },
    computed: {
        password: {
            get: function () {
                return this.password_hash
            },
            set: function (newValue) {
                this.password_hash = btoa(sha256(newValue));
            }
        }
    },
    methods: {
        submitForm: function(){
            this.form.sent = true;

            $.ajax({
                url: this.api.server + "/auth/login",
                method: 'POST',
                data: {
                    username: this.credentials.login,
                    password: this.credentials.password
                }
            }).done(function(data){
                console.log(data);
                main.setCredentials(data.AccessToken, data.UserId);
            }).fail(function(jqXHR,textStatus){
                console.log(jqXHR, textStatus);
                if (jqXHR.responseText) {
                    main.form.error = 'Błąd: ' + jqXHR.responseText + '. Spróbuj ponownie.';
                }
                main.form.sent = false;
            });
        },
        setCredentials: function(token, userid){
            chrome.storage.local.set({token:token, userid: userid},function(){
                main.checkCredentials();
            });
        },
        checkCredentials: function(){
            chrome.storage.local.get(['token','userid'], function(items){
                try{
                    if($.trim(items['token']) != '' && $.trim(items['userid']) != ''){
                        main.credentials.token = items['token'];
                        main.credentials.userid = items['userid'];
                        main.authenticated = true;

                        $(document).ready(function(){
                            $('ul.tabs').tabs();
                        });
                    }
                }
                catch(ex){
                    main.credentials.token = '';
                    main.credentials.userid = '';
                    main.authenticated = false;
                }

            });
        },
        fetchData: function(){
            if(this.authenticated)
            {
                chrome.storage.local.get('lastUpdate', function(items){
                    if(items['lastUpdate']){
                        var lastUpdate = moment(items['lastUpdate']).valueOf();
                    }
                    else
                    {
                        lastUpdate = 0;
                    }
                    if((moment().valueOf() - lastUpdate) >= main.refresh){
                        chrome.storage.local.set({'lastUpdate': moment().valueOf()}, function(){

                        });
                        main.fetchAuctions(false);
                    }
                    else
                    {
                        main.fetchAuctions(true);
                    }
                });
            }
        },
        fetchAuctions: function(fromStorage){
            console.log('fetchAuctions');
            if(fromStorage){
                chrome.storage.local.get('auctions', function(items){
                    main.auctions = items[0];
                });
            }
            else
            {
                /*
                var ajax_1 = function(){
                    return $.ajax({
                        url: main.api.allegro + "/v1/allegro/my/watched/active",
                        data: {
                            access_token: main.credentials.token
                        },
                        headers: {
                            "authorization":"Bearer " + main.credentials.token,
                            // "api-key": main.api["api-key"]
                        },
                        method: 'GET'
                    })
                };

                var ajax_2 = function(){
                    return $.ajax({
                        url: main.api.allegro + "/v1/allegro/my/bids/active",
                        data: {
                            access_token: main.credentials.token
                        },
                        headers: {
                            "authorization":"Bearer " + main.credentials.token,
                            // "api-key": main.api["api-key"]
                        },
                        method: 'GET'
                    })
                };

                $.when(ajax_1(), ajax_2()).done(function(a1,a2){
                    console.log(a1, a2);
                    for(var i = 0; i < data.count; i++){
                        var offer = data.offers[i];

                        if(parseInt(offer.bids.count)==0){
                            main.auctions.push({
                                title: new String(offer.name).substr(0, 16),
                                img: offer.thumbnail,
                                price: 'LIC: ' + offer.prices.bid + 'zł KT: ' + prices.buyNow + 'zł',
                                id: offer.id,
                                watched: true,
                                bidded: false
                            });
                        }
                    }
                    for(var i = 0; i < data.count; i++){
                        var offer = data.offers[i];

                        main.auctions.push({
                            title: new String(offer.name).substr(0, 16),
                            img: offer.thumbnail,
                            price: 'LIC: ' + offer.prices.bid + 'zł KT: ' + prices.buyNow + 'zł',
                            id: offer.id,
                            watched: false,
                            bidded: true
                        });
                    }
                    chrome.storage.local.set({auctions: main.auctions}, function(){

                    });
                
                });
                
                */
            
            }
        }
    },
    mounted: function(){
        this.checkCredentials();
        this.fetchData();
        setInterval(function(){
            main.fetchData();
        }, this.refresh); 
    }
})
