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
        authenticated: false,
        page: {
            list: true,
            details: false,
            options: false
        },
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
        options_alarm:  60,
        options_refresh: 30,
        mainInterval: 0,
        fetchInterval: 0
    },
    watch: {
        options_alarm: function () {
            console.log('watch alarm');
            if(parseInt(main.options_alarm) <= 0){
                main.options_alarm = 60;
            }
            if(parseInt(main.options_refresh) <= 0){
                main.options_refresh = 30;
            }
            main.saveOptions();
        },
        options_refresh: function () {
            console.log('watch refresh');
            if(parseInt(main.options_alarm) <= 0){
                main.options_alarm = 60;
            }
            if(parseInt(main.options_refresh) <= 0){
                main.options_refresh = 30;
            }
            main.saveOptions();
        }
    },
    methods: {
        logout: function(){
            main.form.error = '';
            main.credentials.login = '';
            main.credentials.password = '';
            main.setCredentials(null, null);
        },
        switchPage: function(page){
            console.log('switchPage');
            console.log('page');

            main.page.list = false;
            main.page.details = false;
            main.page.options = false;

            switch(page)   {
                case 'options':
                    main.page.options = true;
                    setTimeout(function(){
                        Materialize.updateTextFields();
                    },1);
                    break;
                case 'details':
                    main.page.details = true;
                    break;
                default:
                case 'list':
                    main.page.list = true;
                    setTimeout(function(){
                        jQuery('ul.tabs').tabs();
                    },1);
                       }
        },
        loadOptions: function(){
            chrome.storage.local.get(['refresh','alarm'],function(items){
                if(items['refresh']){
                    if(items['refresh'] == '' || items['refresh'] < 30){
                        main.options_refresh = 30;
                    }
                    else
                    {
                        main.options_refresh = items['refresh'];
                    }
                }
                if(items['alarm']){
                    if(items['alarm'] == '' || items['alarm'] < 60){
                        main.options_alarm = 60;
                    }
                    else
                    {
                        main.options_alarm = items['alarm'];
                    }
                }
            });
        },
        saveOptions: function(){
            console.log('save');
            chrome.storage.local.set({
                refresh: main.options_refresh, 
                alarm: main.options_alarm
            },function(){

            });
        },
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
                    else
                    {
                        throw "logged out";
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

                    if((momentNow - lastUpdate) >= (main.options_refresh * 1000)){
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
                            main.createAlarm(auction.id, auction.end - main.options_alarm*1000); 
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
                                    id: Number(offer.id).toString(),
                                    watched: true,
                                    bidded: false,
                                    date: moment(offer.endingTime).format('YYYY.MM.DD HH:mm:ss'),
                                    end: offer.endingTime,
                                    diff: moment(offer.endingTime).diff(moment(), 'seconds'),
                                    url: "http://allegro.pl/show_item.php?item=" + offer.id
                                });
                            }

                            main.createAlarm(offer.id, offer.endingTime - main.options_alarm*1000);
                        }

                        data = jQuery.parseJSON(a2[0]);
                        for(var i = 0; i < data.count; i++){
                            var offer = data.offers[i];

                            auctions.push({
                                title: new String(offer.name).substr(0, 24),
                                img: offer.thumbnail ? offer.thumbnail : offer.mainImage.small,
                                price:  Number(offer.prices.bid) >= 0.01 ? (Number(offer.prices.bid).toFixed(2) + " PLN") : "",
                                buyNow: Number(offer.prices.buyNow) >= 0.01  ? (Number(offer.prices.buyNow).toFixed(2) + " PLN") : "",
                                id: Number(offer.id).toString(),
                                watched: false,
                                bidded: true,
                                date: moment(offer.endingTime).format('YYYY.MM.DD HH:mm:ss'),
                                end: offer.endingTime,
                                diff: moment(offer.endingTime).diff(moment(), 'seconds'),
                                url: "http://allegro.pl/show_item.php?item=" + offer.id
                            });

                            main.createAlarm(offer.id, offer.endingTime - main.options_alarm*1000);
                        }



                        main.auctions = auctions;
                        browser.storage.local.set({auctions: auctions}, function(){

                        });
                    });
                },1);
            }
        },
        createAlarm: function(id, time){

            browser.alarms.get(id, function(alarm){
                if(alarm){
                    console.log('znaleziono alarm');
                }
                else {
                    console.log('dodano alarm');
                    browser.alarms.create(id, {
                        when: time
                    });
                }
            });
        },
        testAuction: function(time){
            browser.alarms.clear("1337");
            clearInterval(main.fetchInterval);
            var testMoment = moment().valueOf() + (time*1000);
            main.auctions.push({
                title: "Testowa aukcja",
                img: "http://placehold.it/100x100",
                price: "100 PLN",
                buyNow: "200 PLN",
                id: "1337",
                watched: true,
                bidded: false,
                date: moment(testMoment).format('YYYY.MM.DD HH:mm:ss'),
                end: testMoment,
                diff: moment(testMoment).diff(moment(), 'seconds'),
                url: "http://onet.pl"
            });
            var timeAlarm = testMoment - main.options_alarm*1000;
            console.log(timeAlarm)
            console.log(moment(timeAlarm).format('YYYY.MM.DD HH:mm:ss'));
            main.createAlarm("1337",timeAlarm);
        }
    },
    mounted: function(){
        console.log('mounted');
        this.loadOptions();
        this.checkCredentials(true);
        this.fetchInterval = setInterval(function(){
            main.fetchData();
        }, this.options_refresh * 1000);
        this.alarmInterval = setInterval(function(){
            main.alarmClock(); 
        }, 1000); 
    }
})

browser.alarms.onAlarm.addListener(function(alarm){
    console.log('odpalono alarm: ', alarm.name);
    var auction = _.find(main.auctions, { "id": alarm.name});
    if(auction){
        var notificationConfig =  {
            type: "basic",
            iconUrl: auction.img,
            title: auction.title,
            message: 
            "Aukcja " + (auction.bidded ? "w której licytujesz" : "którą obserwujesz") + " dobiega końca!"
            + (auction.price != "" ? ("\nCena w licytacji: " + auction.price) : "")
            + (auction.buyNow != "" ? ("\n" + 'Cena "kup teraz": ' + auction.buyNow) : ""),
            eventTime: auction.end
        };
        if(!firefox){
            notificationConfig.buttons= [
                {
                    title: "Otwórz stronę aukcji"
                },
                {
                    title: "Zignoruj"
                }
            ];
        }
        browser.notifications.create(alarm.name, notificationConfig, function(notificationId){
            console.log('Zdefiniowano notyfiakcje', notificationId);
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
