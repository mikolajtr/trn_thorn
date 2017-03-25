var firefox = false;
if(typeof browser !== "undefined") {
    firefox = true;
}
else
{
    browser = chrome;
}

var main = new Vue({
    el: '#main',
    data: {
        backend: true,
        authenticated: false,
        credentials: {
            login: '',
            password: '',
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
            "server": "http://127.0.0.1:5000",
            "allegro": "https://api.natelefon.pl",
            "oferty": "https://allegroapi.io"
        },
        auctions: [
        ],
        options: {
            alarm: 60,
            refresh: 30
        }
    },
    methods: {
        alarmClock: function(){
            setTimeout(function(){
                jQuery.each(main.auctions, function(index, auction){
                    var startTime = moment();
                    var endTime = moment(auction.end);
                    var duration = endTime.diff(startTime, 'seconds');
                    auction.diff = duration;

                });
            },1);
        },
        submitForm: function(){
            main.form.sent = true;
            setTimeout(function(){
                jQuery.ajax({
                    url: main.api.server + "/auth/login",
                    method: 'POST',
                    data: JSON.stringify({
                        username: main.credentials.login,
                        password: main.credentials.password
                    }),
                    contentType: 'application/json; charset=UTF-8'
                }).done(function(data){
                    data=jQuery.parseJSON(data);
                    main.setCredentials(data.access_token, data.user_id);
                }).fail(function(jqXHR,textStatus){
                    console.log(jqXHR, textStatus);
                    if (jqXHR.responseText) {
                        main.form.error = 'Błąd: ' + jqXHR.responseText + '. Spróbuj ponownie.';
                    }
                    main.form.sent = false;
                });
            },1);
        },
        setCredentials: function(token, userid){
            chrome.storage.local.set({
                token:token, 
                userid:userid
            },function(){
                main.checkCredentials();
            });
        },
        checkCredentials: function(firstTime){
            console.log('checkCredentials');
            browser.storage.local.get(['token','userid'], function(items){
                console.log('storage callback');
                try{
                    if(jQuery.trim(items['token']) != '' && jQuery.trim(items['userid']) != ''){
                        main.credentials.token = items['token'];
                        main.credentials.userid = items['userid'];
                        main.authenticated = true;

                        setTimeout(function(){
                            jQuery('ul.tabs').tabs();
                        },1);

                        if(firstTime){
                            main.fetchData();
                        }
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
            console.log('fetchData');
            if(main.authenticated)
            {
                browser.storage.local.get('lastUpdate', function(items){
                    if(items['lastUpdate']){
                        var lastUpdate = moment(items['lastUpdate']).valueOf();
                    }
                    else
                    {
                        lastUpdate = 0;
                    }

                    var momentNow = moment().valueOf();
                    console.log(momentNow, lastUpdate);

                    if((momentNow - lastUpdate) >= (main.options.refresh * 1000)){
                        browser.storage.local.set({'lastUpdate': momentNow}, function(){

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
            console.log(fromStorage);
            if(fromStorage){
                browser.storage.local.get('auctions', function(items){
                    main.auctions = items['auctions'];
                    setTimeout(function(){
                        jQuery.each(main.auctions, function(index, auction){
                            main.createAlarm(auction.id, auction.end - main.options.alarm*1000); 
                        });
                    },1);
                });
            }
            else
            {
                setTimeout(function(){
                    console.log('jakis tam timeout');
                    var ajax_1 = function(){
                        return jQuery.ajax({
                            url: main.api.server + "/watched/active",
                            data: JSON.stringify({
                                access_token: main.credentials.token
                            }),
                            method: 'POST',
                            contentType: 'application/json; charset=UTF-8'
                        })
                    };

                    var ajax_2 = function(){
                        return jQuery.ajax({
                            url: main.api.server + "/bids/active",
                            data: JSON.stringify({
                                access_token: main.credentials.token
                            }),
                            method: 'POST',
                            contentType: 'application/json; charset=UTF-8'
                        })
                    };

                    jQuery.when(ajax_1(), ajax_2()).done(function(a1,a2){
                        var data = jQuery.parseJSON(a1[0]);
                        var auctions = [];

                        for(var i = 0; i < data.count; i++){
                            var offer = data.offers[i];

                            if(parseInt(offer.bids.count)==0){
                                auctions.push({
                                    title: new String(offer.name).substr(0, 24),
                                    img: offer.thumbnail ? offer.thumbnail : offer.mainImage.small,
                                    price:  Number(offer.prices.bid) >= 0.01 ? (Number(offer.prices.bid).toFixed(2) + " PLN") : "",
                                    buyNow: Number(offer.prices.buyNow) >= 0.01  ? (Number(offer.prices.buyNow).toFixed(2) + " PLN") : "",
                                    id: offer.id,
                                    watched: true,
                                    bidded: false,
                                    date: moment(offer.endingTime).format('YYYY.MM.DD HH:mm:ss'),
                                    end: offer.endingTime,
                                    diff: moment(offer.endingTime).diff(moment(), 'seconds'),
                                    url: "http://allegro.pl/show_item.php?item=" + offer.id
                                });
                            }

                            main.createAlarm(offer.id, offer.endingTime - main.options.alarm*1000);
                        }

                        data = jQuery.parseJSON(a2[0]);
                        for(var i = 0; i < data.count; i++){
                            var offer = data.offers[i];

                            auctions.push({
                                title: new String(offer.name).substr(0, 24),
                                img: offer.thumbnail ? offer.thumbnail : offer.mainImage.small,
                                price:  Number(offer.prices.bid) >= 0.01 ? (Number(offer.prices.bid).toFixed(2) + " PLN") : "",
                                buyNow: Number(offer.prices.buyNow) >= 0.01  ? (Number(offer.prices.buyNow).toFixed(2) + " PLN") : "",
                                id: offer.id,
                                watched: false,
                                bidded: true,
                                date: moment(offer.endingTime).format('YYYY.MM.DD HH:mm:ss'),
                                end: offer.endingTime,
                                diff: moment(offer.endingTime).diff(moment(), 'seconds'),
                                url: "http://allegro.pl/show_item.php?item=" + offer.id
                            });

                            main.createAlarm(offer.id, offer.endingTime - main.options.alarm*1000);
                        }

                        main.auctions = auctions;
                        browser.storage.local.set({auctions: auctions}, function(){

                        });
                    });
                },1);
            }
        },
        createAlarm: function(id, time){
            id = Number(id).toString();
            browser.alarms.get(id, function(alarm){
                if(alarm){

                }
                else {
                    browser.alarms.create(id, {
                        when: time
                    });
                }
            });
        }
    },
    mounted: function(){
        console.log('mounted');
        this.checkCredentials(true);
        setInterval(function(){
            main.fetchData();
        }, this.options.refresh * 1000);
        setInterval(function(){
            main.alarmClock(); 
        }, 1000); 
    }
})

browser.alarms.onAlarm.addListener(function(alarm){
    var auction = _.find(main.auctions, { "id": alarm.name});
    if(auction){
        browser.notifications.create(alarm.name, {
            type: "basic",
            iconUrl: auction.img,
            title: auction.title,
            message: 
            "Aukcja " + (auction.bidded ? "w której licytujesz" : "którą obserwujesz") + " dobiega końca!"
            + (auction.price != "" ? ("Cena w licytacji: " + auction.price) : "")
            + (auction.buyNow != "" ? ('Cena "kup teraz": ' + auction.buyNow) : ""),
            eventTime: auction.end,
            buttons: [
                {
                    title: "Otwórz stronę aukcji"
                },
                {
                    title: "Zignoruj"
                }
            ]
        }, function(notificationId){

        });
    }
});


if(!firefox){
    browser.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex){
        var auction = _.find(main.auctions, { 'id': notificationId });
        if(buttonIndex == 0){
            browser.tabs.create({url: auction.url});
            browser.notifications.clear(notificationId);
        }
        else
        {
            browser.notifications.clear(notificationId);
        }
    });
}
else
{
    browser.notifications.onClicked.addListener(function(notificationId) {
        var auction = _.find(main.auctions, { 'id': notificationId });
        browser.tabs.create({url: auction.url});
        browser.notifications.clear(notificationId);
    });
}
