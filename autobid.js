// ==UserScript==
// @name         autobid
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  
// @author       You
// @include      *s*-*.gladiatus.gameforge.com/game/index.php?mod=auction*&zubab=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameforge.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let navBar = document.querySelector('ul#mainnav li table tr')
    let gladiatorAutobidButton=document.createElement('button');
    gladiatorAutobidButton.id='gladiatorAB'
    gladiatorAutobidButton.setAttribute("style","position:absolute; left:-30px; padding: 3px; cursor:pointer")
    gladiatorAutobidButton.classList.add('awesome-tabs');
    gladiatorAutobidButton.innerHTML = 'AB'
    navBar.children[0].appendChild(gladiatorAutobidButton)

    let mercenaryAutobidButton=document.createElement('button');
    mercenaryAutobidButton.id='gladiatorAB'
    mercenaryAutobidButton.setAttribute("style","position:absolute; left:100; padding: 3px; cursor:pointer")
    mercenaryAutobidButton.classList.add('awesome-tabs');
    mercenaryAutobidButton.innerHTML = 'AB'
    navBar.children[1].appendChild(mercenaryAutobidButton)

    function changePageInfo(){
        document.getElementById("wrapper_game").style.fontWeight = "600";
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = 'https://cdn.iconscout.com/icon/free/png-256/free-ab-button-blood-type-37809.png';

    }


    function setSearchParameters(){
        //filter options
        let minLvl = document.querySelector('select[name="itemLevel"]');
        minLvl.value = minLvl.children[0].getAttribute('value');
        let itemType = document.querySelector('select[name="itemType"]');
        itemType.value = 0;
        let itemQuality = document.querySelector('select[name="itemQuality"]');
        itemQuality.value = -1;

        //sort
        let sortBy = document.querySelector('select#gca-auction-sort-select');
        sortBy.value = 'level';
        let order = document.querySelector('select#gca-auction-sort-order-select');
        order.value = 'asc';
    }

    function createNotRdyUrl(type){
        let url = ''
        const menu1 = document.querySelectorAll('div#submenu1 div.advanced_menu_entry')
        menu1.forEach(item => {
            if (item.children[0].innerHTML == 'Auction building'){
                url = item.children[0].href
            }
        })
        if (type == 'gladiator') url = url.replace('mod=auction&', 'mod=auction&zubab=notrdyg&')
        else if (type == 'mercenary') url = url.replace('mod=auction&', 'mod=auction&zubab=notrdym&ttype=3&')
        return url
    }
    function createRdyUrl(){
        let url = location.href
        url = url.replace('zubab=notrdy', 'zubab=rdy')
        return url
    }


    gladiatorAutobidButton.addEventListener('click', function() {
        location.href = createNotRdyUrl('gladiator')
    })
    mercenaryAutobidButton.addEventListener('click', function() {
        location.href = createNotRdyUrl('mercenary')
    })







    const MINIMUM_PRICE = 10000
    let STOP_BUYING = false
    const REFRESH_TIME = 600 //seconds

    const url = location.href;
    const HOUR = 1000 * 60 * 60;

    
    window.addEventListener("load", (event) => {
        if (!url.includes('&zubab=')){ // exit if on regural auctions
            return
        }

        if (url.includes('&zubab=notrdy')){//redirected from button
            setSearchParameters();
            history.pushState(null, "", createRdyUrl());
            document.querySelector('div#main_inner div#content article section form table tbody tr td input[type="submit"]').click(); //filter button

        }
        else if (url.includes('&zubab=rdy')){ //ready to keep refreshing
            //if (location.href.
            let remainingAuctionTime = document.querySelector('article span.description_span_right b').innerHTML.toLowerCase(); //short, very short etc
            //if (remainingAuctionTime != 'very short') {return} //later delete short

            let auctionItemsData = []
            const auctionElements = document.querySelectorAll('div#main_inner div#content div#auction_table table tbody tr td div.section-header form');
            auctionElements.forEach(element => {
                const auctionBidDiv = element.querySelector('div.auction_bid_div')
                const itemType = parseInt(element.querySelector('div.auction_item_div div div').getAttribute('data-content-type'));
                // 1 = helmet, 2 = weapon, 4 = shield, 8 = body armor, 48 = ring, 64 = usables
                // 256 = gloves, 512 = shoes, 1024 = amulets, 4096 = upgrade, 16384 = mercenary

                const percent = auctionBidDiv.querySelector('span.gca-auction-price-value-percent').innerHTML;
                const price = parseInt(auctionBidDiv.querySelector('input[type="text"]').getAttribute('value'));
                const button = auctionBidDiv.querySelector('input[type="button"]');

                if(percent == '(100%)' && price > MINIMUM_PRICE){
                    //console.log('auctionBidDiv: ', auctionBidDiv)
                    //console.log('price: ', price)
                    //console.log('item type: ', itemType)
                    //console.log('button: ', button)
                    if ((itemType == 64) || (itemType == 4096) || (itemType == 16384)) return
                    auctionItemsData.push([price, itemType, button])
                }
            })
            var compareHelper = {}

            compareHelper[1] = 2; // helmet
            compareHelper[2] = 3; // weapon
            compareHelper[4] = 2; // shield
            compareHelper[8] = 3; // body armor
            compareHelper[48] = 1; // ring
            compareHelper[256] = 2; // gloves
            compareHelper[512] = 2; // shoes
            compareHelper[1024] = 1; //amulets


            auctionItemsData.sort(function(a, b) {
                if (compareHelper[a[1]] === compareHelper[b[1]]) {
                    return (a[0] > b[0]) ? -1 : 1;
                }
                else {
                    return (compareHelper[a[1]] < compareHelper[b[1]]) ? -1 : 1;
                }
            })

            console.log(auctionItemsData)
            console.log(auctionItemsData.length)

            function checkNoMoreGold(){
                const notificationError = document.querySelector('div.notification-area div.notification-error')
                if (notificationError){
                    if((notificationError.innerHTML).includes("have enough gold")){
                        console.log(notificationError.innerHTML);
                        STOP_BUYING = true;
                    }
                }
            }


            var interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?
            auctionItemsData.forEach(function (el, index) {
                setTimeout(function () {
                    //console.log(el);
                    checkNoMoreGold()
                    if (STOP_BUYING == false) {
                        el[2].click();
                        console.log('click: ', el);
                    }
                }, index * interval);
            });







            let storageName = '_auction'
            if (location.href.includes('&ttype=3')){
                storageName += 'MercenaryItemIds'
            }
            else {
                storageName += 'GladiatorItemIds'
            }
            console.log(storageName)

        }


    });








    setTimeout(function () {
        location.reload()
    }, REFRESH_TIME * 1000);

    changePageInfo();


})();
