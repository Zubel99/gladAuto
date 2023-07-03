// ==UserScript==
// @name         Gladiatus: Auction house notification tool
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Scipio
// @include      *s*-*.gladiatus.gameforge.com/game/index.php?mod=auction*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let auctionType = ''
    if (location.href.includes('ttype=3')) auctionType = '_mercenary'
    else auctionType = '_gladiator'

    const shortStr = "short";
    const keyShort = "time_short" + auctionType;
    const veryShortStr = "very short";
    const keyVeryShort = "time_very_short" + auctionType;
    const timeExpires = 90;

    const timeShort = null;
    const timeVeryShort = null;
    let statusAuction = document.querySelector(".description_span_right b").innerHTML.toLowerCase();


    function main() {
        let shortTimeRefresh = localStorage.getItem('short_time_refresh' + auctionType); //currently both of short and very short? //i save it as 1-6(depends on auc length + auctionType since parseInt removes chars anyway and leaves numbers only

        let localStorageShortTime = localStorage.getItem(keyShort);
        let localStorageVeryShortTime = localStorage.getItem(keyVeryShort);

        let containerElement = document.querySelector("#content article");

        let titleElement = document.createElement("h2");
        titleElement.setAttribute("class", "section-header");
        titleElement.innerHTML="Time auction";

        let contentElement = document.createElement("section");
        contentElement.style.display="block";
        contentElement.style.textAlign = "left";

        if (statusAuction !== shortStr && statusAuction !== veryShortStr) {
            if (localStorageShortTime) {
                localStorage.removeItem(keyShort);
                localStorageShortTime = null;
            }

            if (localStorageVeryShortTime) {
                localStorage.removeItem(keyVeryShort);
                localStorageVeryShortTime = null;
            }
        }

        if (statusAuction === shortStr) {
            //new Audio('https://freesound.org/data/previews/91/91926_7037-lq.mp3').play(); //play every time on short
            if (!localStorageShortTime) { //if doesnt exist in localstorage - means short status just came up, play sound only once
                new Audio('https://freesound.org/data/previews/91/91926_7037-lq.mp3').play();
                localStorage.setItem(keyShort, getCurrentTime());
                //location.reload();
            }
        } else if (statusAuction === veryShortStr) {
            //new Audio('http://soundbible.com/grab.php?id=2155&type=mp3').play(); //play every time on  very short
            if (!localStorageVeryShortTime) {//if doesnt exist in localstorage - means very short status just came up, play sound twice
                new Audio('http://soundbible.com/grab.php?id=2155&type=mp3').play();
                new Audio('http://soundbible.com/grab.php?id=2155&type=mp3').play();
                localStorage.setItem(keyVeryShort, getCurrentTime());
                //location.reload();
            }
        }

        let content = "<b>Your current time:</b> <span id='my-timer'></span>" + "</br>";

        if (localStorageShortTime) {
            content += "<b>Short: </b>" + localStorageShortTime + "(<span id='diff-short-time'></span>)" + "</br>";
        }

        if (localStorageVeryShortTime) {
            content += "<b>Very Short: </b>" + localStorageVeryShortTime + "(<span id='diff-very-short-time'></span>)" + "</br>";
        }

        content += "<p><b>Time refresh:</b><span id='container_short_time_refrest'></span></p>";

        contentElement.innerHTML = content;
        containerElement.appendChild(titleElement);
        containerElement.appendChild(contentElement);

        let refreshTimeSelectElement = createSelectShortTimeRefresh();
        document.getElementById("container_short_time_refrest").appendChild(refreshTimeSelectElement);

        let myVar = setInterval(myTimer ,1000); //cos tu zmienic potem


        if (shortTimeRefresh && (statusAuction.includes('short') || statusAuction.includes('very short'))){
            console.log('auction type: ', auctionType)
            console.log('short or very short')
            if (parseInt(shortTimeRefresh) == 1) refresh(1/4); //15secs
            else if (parseInt(shortTimeRefresh) == 2) refresh(1/2); //30secs
            else if (parseInt(shortTimeRefresh) == 3) refresh(1); //1min
            else if (parseInt(shortTimeRefresh) == 4) refresh(2); //2min
            else if (parseInt(shortTimeRefresh) == 5) refresh(5); //5min
        } else {
            console.log('medium, long or very long (refresh 1 min)')
            refresh(1);
        }
    }

    function getCurrentTime() {
        var currentdate = new Date();
        var month = currentdate.getUTCMonth() + 1; //months from 1-12
        var day = currentdate.getUTCDate();
        var year = currentdate.getUTCFullYear();
        var h = currentdate.getHours();
        var m = currentdate.getMinutes();
        var s = currentdate.getSeconds();

        return year + "/" + month + "/" + day + " " + h + ":" + m + ":" + s;
    }

    function getDiffMinutes(a, b) {
        var diff = Math.abs(a - b);
        return Math.floor((diff/1000)/60);
    }

    function refresh(time) {
        let randomDelay = (Math.random() * (1000 - 1) + 1)
        if (time !== 0) {
            setTimeout(function() { location.reload(); }, (time * 60 * 1000) + randomDelay);
        }
    }

    function setLocalStorageItem(name, value, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes*60*1000));
        localStorage.setItem(name, value);
    }

    function getLocalStorageItem(name) {
        return localStorage.getItem(name);
    }

    function removeLocalStorageItem(name) {
        localStorage.removeItem(name);
    }

    function diffMinutest(a, b) {
        var diff = Math.abs(new Date(a) - new Date(b));
        var minutes = Math.floor((diff/1000)/60);
        var second = diff/1000%60;

        return {
            minutes: minutes,
            second: second
        };
    }

    function myTimer() {
        document.getElementById("my-timer").innerHTML = getCurrentTime();
        let localStorageShortTime = getLocalStorageItem(keyShort);
        let localStorageVeryShortTime = getLocalStorageItem(keyVeryShort);

        if (localStorageShortTime && !localStorageVeryShortTime) {
            let diffObj = diffMinutest(getCurrentTime(), localStorageShortTime);

            document.getElementById("diff-short-time").innerHTML = diffObj.minutes + " minutes, " + diffObj.second + " second";
        }

        if (localStorageVeryShortTime) {
            let diffObj = diffMinutest(getCurrentTime(), localStorageVeryShortTime);
            document.getElementById("diff-very-short-time").innerHTML = diffObj.minutes + " minutes, " + diffObj.second + " second";
        }
    }

    function createSelectShortTimeRefresh() {
        var refreshTimeSelect = document.createElement('select');
        refreshTimeSelect.id = 'refresh_time';

        refreshTimeSelect.options[0] = new Option('None', 0);
        refreshTimeSelect.options[1] = new Option('15s', 1);
        refreshTimeSelect.options[2] = new Option('30s', 2);
        refreshTimeSelect.options[3] = new Option('1min', 3);
        refreshTimeSelect.options[4] = new Option('2min', 4);
        refreshTimeSelect.options[5] = new Option('5min', 5);

        let shortTimeRefresh = getLocalStorageItem('short_time_refresh' + auctionType);
        console.log('storage time: ', parseInt(shortTimeRefresh))
        if (shortTimeRefresh) refreshTimeSelect.options[parseInt(shortTimeRefresh)].selected = 'selected';
        else refreshTimeSelect.options[3].selected = 'selected';


        refreshTimeSelect.addEventListener(
            'change',
            function() {
                var value = this.value;
                setLocalStorageItem('short_time_refresh' + auctionType, value, 999999);
                location.reload();
            },
            false
        );
        return refreshTimeSelect;
    }


    //change auction icon
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    if (location.href.includes('ttype=3')) link.href = 'https://icons.iconarchive.com/icons/yusuke-kamiyamane/fugue/16/auction-hammer-plus-icon.png';
    else link.href = 'https://icons.iconarchive.com/icons/yusuke-kamiyamane/fugue/16/auction-hammer-icon.png';


    //fix automatic sorting on page enter and make it possible to filter on different pages by different thigs **********************************************************************


    window.addEventListener("load", (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('sortBy')) sortBy.value = urlParams.get('sortBy');
        if (urlParams.get('orderBy')) orderBy.value = urlParams.get('orderBy');
        let sortBy = document.getElementById('gca-auction-sort-select');
        let orderBy = document.getElementById('gca-auction-sort-order-select');
        let sortButton = document.querySelector('button.awesome-button.gca-auction-sort-button');
        sortButton.click();

        sortBy.addEventListener('change', function() {
            console.log(sortBy.value);
            sortButton.click();
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            params.set('sortBy', sortBy.value);
            params.set('orderBy', orderBy.value);
            url.search = params.toString();
            window.history.pushState({}, '', url.href);
        });

        orderBy.addEventListener('change', function() {
            console.log(orderBy.value);
            sortButton.click();
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            params.set('sortBy', sortBy.value);
            params.set('orderBy', orderBy.value);
            url.search = params.toString();
            window.history.pushState({}, '', url.href);
        });
    });

    let aucionsInfo = [];
    let auctions = document.querySelectorAll('div#auction_table div.section-header form');

    /*
    auctions.forEach(auction => {
        console.log(auction);
        console.log(auction.querySelector('input[name="auctionid"]').value);
        console.log(auction.querySelector('div.auction_bid_div div span').innerHTML);
        console.log(auction.querySelector('div.auction_bid_div div').innerHTML);
    });
    */
    //console.log(auctions)

    main();
})();
