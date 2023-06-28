// ==UserScript==
// @name         Gladiatusik
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Better than p2w bobs
// @author       You
// @match        https://s303-en.gladiatus.gameforge.com/game*
// @match        https://lobby.gladiatus.gameforge.com/*
// @exclude      *s*-*.gladiatus.gameforge.com/game/index.php?mod=auction*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameforge.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    let urlWithHash = document.querySelector('div#mainmenu a.menuitem[title="Overview"]').href;
    let hashIndex = urlWithHash.indexOf('&sh=');
    let sessionHash = urlWithHash.substring(hashIndex+4)
    console.log('current hash: ', sessionHash)


    let expeditionLocations = [];
    let dungeonLocations = [];
    let expeditionLocationsUnfiltered=document.querySelectorAll('div#submenu2.submenu a');
    for (let i=1; i < expeditionLocationsUnfiltered.length; i++) {
        let leftAnchor = expeditionLocationsUnfiltered[i].href.indexOf('index.php?');
        let rightAnchor = expeditionLocationsUnfiltered[i].href.indexOf('&sh=');
        let locationLink = expeditionLocationsUnfiltered[i].href.substring(leftAnchor, rightAnchor+4)+sessionHash;
        expeditionLocations.push(locationLink);
        let dungeonLink = locationLink.replace('=location&', '=dungeon&');
        dungeonLocations.push(dungeonLink);
    }

    let boton=localStorage.getItem('_boton') === 'true';
    let autoexpeditionok=localStorage.getItem('_autoexpeditionok') === 'true';
    let autodungeonok=localStorage.getItem('_autodungeonok') === 'true';
    let autoarenaok=localStorage.getItem('_autoarenaok') === 'true';
    let autocircusprovinciariumok=localStorage.getItem('_autocircusprovinciariumok') === 'true';
    let autoarenaprovinciariumok=localStorage.getItem('_autoarenaprovinciariumok') === 'true';
    let autoturmaok=localStorage.getItem('_autoturmaok') === 'true';
    let autoworkok=localStorage.getItem('_autoworkok') === 'true';
    //additional functionalities handle the same way
    let autoeventok=true

    let menujuego=document.querySelector('#mainmenu');
    let menubotfooter=document.createElement('div');
    menubotfooter.id="submenufooter";
    let menubot=document.createElement('div');
    menubot.classList.add('submenu');
    let botOptionOn='0px 0px 15px green,0px 0px 15px green,0px 0px 15px green,0px 0px 15px green';
    let botOptionOff='0px 0px 15px red,0px 0px 15px red'
    let botTab=document.querySelector('a#botboton')




    function existevent(){
        let captureeventbutton=document.evaluate(".//div[contains(@id,'submenu2')]/a[contains(@class,'eyecatcher')]", document.body, null, 9, null).singleNodeValue;
        if (captureeventbutton){
            return true;
        }else{
            return false;
        }}

    if (boton==true) {
        menubot.setAttribute("style","display:none");
        //botTab.style.textShadow = botOptionOn
    }else{
        menubot.setAttribute("style","display:block");
        //botTab.style.textShadow = botOptionOff
    }
    menubot.id="bot";
    menubot.setAttribute("style","display:block");

    // WORKON
    let autoworkboton=document.createElement('a');
    autoworkboton.classList.add('menuitem');
    autoworkboton.style.cursor = "pointer";
    let autoworktype=document.createElement('select');
    autoworktype.id="autoworktype";
    autoworktype.innerHTML='<option value="0">Senator -3♦</div></option><option value="1">Jeweller -3♦</div></option><option value="2" selected>Stable boy</option><option value="3">Farmer</option><option value="4">Butcher</option><option value="5">Fisherman</option><option value="6">Baker</option><option value="7">Blacksmith</option><option value="8">Master blacksmith -3♦</option>';
    autoworktype.value= localStorage.getItem('_worktype') || 2
    //let autoworktime=document.createElement('select');
    //autoworktime.id="autoworktime";
    //autoworktime.innerHTML='<option value="1">1 HOUR</option><option value="2">2 HOURS</option><option value="3">3 HOURS</option><option value="4">4 HOURS</option><option value="5">5 HOURS</option><option value="6">6 HOURS</option><option value="7">7 HOURS</option><option value="8" selected>8 HOURS</option>';
    //autoworkboton.href="#";
    if (autoworkok==true){
        autoworkboton.innerHTML="AUTO WORK ON";
        //autoworktype.setAttribute("style","display:none;margin-left:10px;"); //previously was dissapearing on active
        autoworkboton.style.textShadow = botOptionOn
        autoworktype.setAttribute("style","display:block;margin-left:10px;");
    }else{
        autoworkboton.innerHTML="AUTO WORK OFF";
        autoworkboton.style.textShadow = botOptionOff
        autoworktype.setAttribute("style","display:block;margin-left:10px;");
    }

    // BOTON EXPEDICION
    let expeditionboton=document.createElement('a');
    let selectexpeditionmap=document.createElement('select');
    let selectexpeditiontarget=document.createElement('select');
    expeditionboton.classList.add('menuitem');
    expeditionboton.style.cursor = "pointer";
    //expeditionboton.href="#";
    let expeditionhp=document.createElement('input');
    expeditionhp.setAttribute("type","range");
    expeditionhp.value=localStorage.getItem('_expeditionhp') || 50;
    expeditionhp.setAttribute("list","expdatalist");
    expeditionhp.id="expeditionhp";
    let expdatalist=document.createElement('datalist');
    expdatalist.id="expdatalist";
    expdatalist.innerHTML='<option value="5"></option><option value="10"></option><option value="15"></option><option value="20"></option><option value="25"></option><option value="30"></option><option value="35"></option><option value="40"></option><option value="45"></option><option value="50"></option><option value="55"></option><option value="60"></option><option value="65"></option><option value="70"></option><option value="75"></option><option value="80"></option><option value="85"></option><option value="90"></option><option value="95"></option><option value="100"></option>';
    let expdatalabel=document.createElement('span');
    expdatalabel.innerHTML="NOT ATTACK HP < " + (localStorage.getItem('_expeditionhp') || 50) +"%";
    expdatalabel.id="expdatalabel";
    if (autoexpeditionok==true){
        expeditionboton.innerHTML="AUTO EXPEDITION ON";
        expeditionboton.style.textShadow = botOptionOn
        //selectexpeditionmap.setAttribute("style","display:none;margin-left:10px;");
        //selectexpeditiontarget.setAttribute("style","display:none;margin-left:10px;");
        //expeditionhp.setAttribute("style","display:none;margin-left:10px;");
        //expdatalabel.setAttribute("style","display:none;margin-left:10px;color:yellow;");
        selectexpeditionmap.setAttribute("style","display:block;margin-left:10px;");
        selectexpeditiontarget.setAttribute("style","display:block;margin-left:10px;");
        expeditionhp.setAttribute("style","display:block;margin-left:10px;");
        expdatalabel.setAttribute("style","display:block;margin-left:10px;color:yellow;");
    }else{
        expeditionboton.innerHTML="AUTO EXPEDITION OFF";
        expeditionboton.style.textShadow = botOptionOff
        selectexpeditionmap.setAttribute("style","display:block;margin-left:10px;");
        selectexpeditiontarget.setAttribute("style","display:block;margin-left:10px;");
        expeditionhp.setAttribute("style","display:block;margin-left:10px;");
        expdatalabel.setAttribute("style","display:block;margin-left:10px;color:yellow;");
    }
    selectexpeditionmap.id="expeditionmap";
    let zonas= document.querySelectorAll("div#submenu2 a.menuitem");
    let zona;
    for (let i=1; i<zonas.length; i++){
        if (!zonas[i].classList.contains("eyecatcher")) {
            zona=document.createElement('option');
            zona.innerHTML = zonas[i].innerHTML;
            zona.setAttribute("value",i-1);
            selectexpeditionmap.appendChild(zona);
        }
    }
    selectexpeditiontarget.innerHTML = '<option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option>';
    selectexpeditiontarget.id="expeditiontarget";
    selectexpeditionmap.value=localStorage.getItem('_selectedexpeditionmap') || 0;
    selectexpeditiontarget.value=localStorage.getItem('_selectedexpeditiontarget') || 0;

    //BOTON DUNGEON
    let dungeonboton=document.createElement('a');
    let selectdungeonmap=document.createElement('select');
    let advanced=document.createElement('select');
    advanced.id="advanced";
    advanced.innerHTML='<option value="false">Normal</option><option value="true">Advanced</option>';
    advanced.value=localStorage.getItem('_advanced') || false;
    let skipboss=document.createElement('select');
    skipboss.id="skipboss";
    skipboss.innerHTML='<option value="false">Kill boss</option><option value="true">Skip boss</option>';
    skipboss.value=localStorage.getItem('_skipboss') || false;
    let fulldungclear=document.createElement('select');
    fulldungclear.id="fulldungclear";
    fulldungclear.innerHTML='<option value="false">Quickest boss</option><option value="true">Full clear</option>';
    fulldungclear.value=localStorage.getItem('_fulldungclear') || false;
    dungeonboton.classList.add('menuitem');
    dungeonboton.style.cursor = "pointer";
    if (autodungeonok==true){
        dungeonboton.innerHTML="AUTO DUNGEON ON";
        dungeonboton.style.textShadow = botOptionOn
        //selectdungeonmap.setAttribute("style","display:none;margin-left:10px;");
        //avdanced.setAttribute("style","display:none;margin-left:10px;");
        //skipboss.setAttribute("style","display:none;margin-left:10px;");
        selectdungeonmap.setAttribute("style","display:block;margin-left:10px;");
        advanced.setAttribute("style","display:block;margin-left:10px;");
        skipboss.setAttribute("style","display:block;margin-left:10px;");
        fulldungclear.setAttribute("style","display:block;margin-left:10px;");
    }else{
        dungeonboton.innerHTML="AUTO DUNGEON OFF";
        dungeonboton.style.textShadow = botOptionOff
        selectdungeonmap.setAttribute("style","display:block;margin-left:10px;");
        advanced.setAttribute("style","display:block;margin-left:10px;");
        skipboss.setAttribute("style","display:block;margin-left:10px;");
        fulldungclear.setAttribute("style","display:block;margin-left:10px;");
    }
    selectdungeonmap.id="dungeonmap";
    let zonas2= document.querySelectorAll("div#submenu2 a.menuitem");
    let zona2;
    for (let i=1; i<zonas2.length; i++){
        if (!zonas2[i].classList.contains("eyecatcher")) {
            zona2=document.createElement('option');
            zona2.innerHTML = zonas2[i].innerHTML;
            zona2.setAttribute("value",i-1);
            selectdungeonmap.appendChild(zona2);
        }
    }
    selectdungeonmap.value=localStorage.getItem('_selecteddungeonmap') || 0;
    //dungeonboton.href="#";

    //BOTON CIRCUS PROVINCIARIUM
    let circusprovinciariumboton=document.createElement('a');//turmaboton
    let selectcircusprovinciariummode=document.createElement('select');//selectturmatarget
    circusprovinciariumboton.classList.add('menuitem');
    circusprovinciariumboton.style.cursor = "pointer";
    //circusprovinciariumboton.href="#";
    if (autocircusprovinciariumok==true){
        circusprovinciariumboton.innerHTML="AUTO CIRCUS PROV ON";
        circusprovinciariumboton.style.textShadow = botOptionOn
        //selectcircusprovinciariummode.setAttribute("style","display:none;margin-left:10px;");
        selectcircusprovinciariummode.setAttribute("style","display:block;margin-left:10px;");
    }else{
        circusprovinciariumboton.innerHTML="AUTO CIRCUS PROV OFF";
        circusprovinciariumboton.style.textShadow = botOptionOff
        selectcircusprovinciariummode.setAttribute("style","display:block;margin-left:10px;");
    }
    selectcircusprovinciariummode.innerHTML='<option value="0" selected>All lvls</option><option value="1">Lowest lvl</option><option value="2">Highest lvl</option>';
    selectcircusprovinciariummode.id="selectcircusprovinciariummode";
    selectcircusprovinciariummode.value=localStorage.getItem('_selectcircusprovinciariummode') || 0;

    // BOTON ARENA PROVINCIARIUM
    let arenaprovinciariumboton=document.createElement('a');//turmaboton
    let selectarenaprovinciariummode=document.createElement('select');//selectturmatarget
    arenaprovinciariumboton.classList.add('menuitem');
    arenaprovinciariumboton.style.cursor = "pointer";
    //arenaprovinciariumboton.href="#";
    let arenahp=document.createElement('input');
    arenahp.setAttribute("type","range");
    arenahp.value=localStorage.getItem('_arenahp') || 50;
    arenahp.setAttribute("list","arenadatalist");
    arenahp.id="arenahp";
    let arenadatalist=document.createElement('datalist');
    arenadatalist.id="arenadatalist";
    arenadatalist.innerHTML='<option value="5"></option><option value="10"></option><option value="15"></option><option value="20"></option><option value="25"></option><option value="30"></option><option value="35"></option><option value="40"></option><option value="45"></option><option value="50"></option><option value="55"></option><option value="60"></option><option value="65"></option><option value="70"></option><option value="75"></option><option value="80"></option><option value="85"></option><option value="90"></option><option value="95"></option><option value="100"></option>';
    let arenadatalabel=document.createElement('span');
    arenadatalabel.innerHTML="NOT ATTACK HP < " + (localStorage.getItem('_arenahp') || 50) +"%";
    arenadatalabel.id="arenadatalabel";
    if (autoarenaprovinciariumok==true){
        arenaprovinciariumboton.innerHTML="AUTO ARENA PROV ON";
        arenaprovinciariumboton.style.textShadow = botOptionOn
        //selectarenaprovinciariummode.setAttribute("style","display:none;margin-left:10px;");
        selectarenaprovinciariummode.setAttribute("style","display:block;margin-left:10px;");
        arenahp.setAttribute("style","display:block;margin-left:10px;");
        arenadatalabel.setAttribute("style","display:block;margin-left:10px;color:yellow;");
    }else{
        arenaprovinciariumboton.innerHTML="AUTO ARENA PROV OFF";
        arenaprovinciariumboton.style.textShadow = botOptionOff
        selectarenaprovinciariummode.setAttribute("style","display:block;margin-left:10px;");
        arenahp.setAttribute("style","display:block;margin-left:10px;");
        arenadatalabel.setAttribute("style","display:block;margin-left:10px;color:yellow;");
    }
    selectarenaprovinciariummode.innerHTML='<option value="0" selected>All lvls</option><option value="1">Lowest lvl</option><option value="2">Highest lvl</option>';
    selectarenaprovinciariummode.id="selectarenaprovinciariummode";
    selectarenaprovinciariummode.value=localStorage.getItem('_selectarenaprovinciariummode') || 0;


    //BOTON EVENTON
    let eventboton=document.createElement('a');
    let selecteventtarget=document.createElement('select');
    eventboton.classList.add('menuitem');
    eventboton.style.cursor = "pointer";
    //eventboton.href="#";
    let eventhp=document.createElement('input');
    eventhp.setAttribute("type","range");
    eventhp.setAttribute("list","eventdatalist");
    eventhp.id="eventhp";
    let eventdatalist=document.createElement('datalist');
    eventdatalist.id="eventdatalist";
    eventdatalist.innerHTML='<option value="5"></option><option value="10"></option><option value="15"></option><option value="20"></option><option value="25"></option><option value="30"></option><option value="35"></option><option value="40"></option><option value="45"></option><option value="50"></option><option value="55"></option><option value="60"></option><option value="65"></option><option value="70"></option><option value="75"></option><option value="80"></option><option value="85"></option><option value="90"></option><option value="95"></option><option value="100"></option>';
    let eventdatalabel=document.createElement('span');
    eventdatalabel.innerHTML="NOT ATTACK HP < 50%";
    eventdatalabel.id="eventdatalabel";
    if (autoeventok){
        eventboton.innerHTML="AUTO EVENT ON";
        selecteventtarget.setAttribute("style","display:none;margin-left:10px;");
        eventhp.setAttribute("style","display:none;margin-left:10px;");
        eventdatalabel.setAttribute("style","display:none;margin-left:10px;color:yellow;");
    }else{
        eventboton.innerHTML="AUTO EVENT OFF";
        selecteventtarget.setAttribute("style","display:block;margin-left:10px;");
        eventhp.setAttribute("style","display:block;margin-left:10px;");
        eventdatalabel.setAttribute("style","display:block;margin-left:10px;color:yellow;");
    }
    selecteventtarget.innerHTML = '<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>';
    selecteventtarget.id="eventtarget";

    let menubotboton=document.createElement('a');
    menubotboton.classList.add('menuitem');
    menubotboton.classList.add('active');
    menubotboton.style.cursor = "pointer";
    //menubotboton.classList.add('glow');
    //menubotboton.classList.add('eyecatcher');
    if (boton){
        menubotboton.innerHTML="BOT ON";
        menubotboton.style.textShadow = botOptionOn;
    }else{
        menubotboton.innerHTML="BOT OFF";
        menubotboton.style.textShadow = botOptionOff;
    }
    menubotboton.id="botboton";
    //menubotboton.href="#";
    //APPENDCHILLD
    menubot.appendChild(expeditionboton);
    menubot.appendChild(selectexpeditionmap);
    menubot.appendChild(selectexpeditiontarget);
    menubot.appendChild(expdatalabel);
    menubot.appendChild(expeditionhp);
    menubot.appendChild(expdatalist);
    menubot.appendChild(dungeonboton);
    menubot.appendChild(selectdungeonmap);
    menubot.appendChild(advanced);
    menubot.appendChild(skipboss);
    menubot.appendChild(fulldungclear);
    menubot.appendChild(circusprovinciariumboton)
    menubot.appendChild(selectcircusprovinciariummode)
    menubot.appendChild(arenaprovinciariumboton)
    menubot.appendChild(selectarenaprovinciariummode)
    menubot.appendChild(arenadatalabel);
    menubot.appendChild(arenahp);
    menubot.appendChild(arenadatalist);
    menubot.appendChild(autoworkboton);
    menubot.appendChild(autoworktype);
    //menubot.appendChild(autoworktime);
    if (existevent()){
        menubot.appendChild(eventboton);
        menubot.appendChild(selecteventtarget);
        menubot.appendChild(eventdatalabel);
        menubot.appendChild(eventhp);
        menubot.appendChild(eventdatalist);
    }
    menubot.appendChild(menubotfooter);
    menujuego.appendChild(menubotboton);
    menujuego.appendChild(menubot);
    menubotboton=document.querySelector('#botboton');
    //--- autoworktype.addEventListener("change",function(){
    //---     createworkselect(autoworktype.value);
    //--- });
    //EVENTS
    //   EXPEDITION LOGIC

    expeditionboton.addEventListener("click",function(){
        let selectedexpeditionmap=document.querySelector('#expeditionmap');
        let selectedexpeditiontarget=document.querySelector('#expeditiontarget');
        let expdatalabel=document.querySelector('#expdatalabel');
        let expeditionhp=document.querySelector('#expeditionhp');
        if (autoexpeditionok==true){
            autoexpeditionok=false;
            expeditionboton.innerHTML="AUTO EXPEDITION OFF";
            expeditionboton.style.textShadow = botOptionOff
            selectedexpeditionmap.style.display="block";
            selectedexpeditiontarget.style.display="block";
            expdatalabel.style.display="block";
            expeditionhp.style.display="block";
        }else{
            autoexpeditionok=true;
            expeditionboton.innerHTML="AUTO EXPEDITION ON";
            expeditionboton.style.textShadow = botOptionOn
            //selectedexpeditionmap.style.display="none";
            //selectedexpeditiontarget.style.display="none";
            //expdatalabel.style.display="none";
            //expeditionhp.style.display="none";
            selectedexpeditionmap.style.display="block";
            selectedexpeditiontarget.style.display="block";
            expdatalabel.style.display="block";
            expeditionhp.style.display="block";
        }
        localStorage.setItem('_autoexpeditionok', autoexpeditionok)
    });
    expeditionhp.addEventListener("change",function(){
        let expdatalabel=document.querySelector('#expdatalabel');
        expdatalabel.innerHTML="NOT ATTACK HP < "+expeditionhp.value+"%";
        localStorage.setItem('_expeditionhp', expeditionhp.value);
    });
    selectexpeditionmap.addEventListener("change", function(){
        localStorage.setItem('_selectedexpeditionmap', selectexpeditionmap.value);
    })
    selectexpeditiontarget.addEventListener("change", function(){
        localStorage.setItem('_selectedexpeditiontarget', selectexpeditiontarget.value);
    })

    //   DUNGEON LOGIC

    dungeonboton.addEventListener("click",function(){
        let selecteddungeonmap=document.querySelector('#dungeonmap');
        let advanced=document.querySelector('#advanced');
        let skipboss=document.querySelector('#skipboss');
        let fulldungclear=document.querySelector('#fulldungclear');
        //localStorage.setItem('_selecteddungeonmap', selecteddungeonmap.value);
        //localStorage.setItem('_advanced', advanced.value);
        //localStorage.setItem('_skipboss', skipboss.value);
        if (autodungeonok==true){
            autodungeonok=false;
            dungeonboton.innerHTML="AUTO DUNGEON OFF";
            dungeonboton.style.textShadow = botOptionOff
            advanced.style.display="block";
            selecteddungeonmap.style.display="block";
            skipboss.style.display="block";
            fulldungclear.style.display="block";
        }else{
            autodungeonok=true;
            dungeonboton.innerHTML="AUTO DUNGEON ON";
            dungeonboton.style.textShadow = botOptionOn
            //selecteddungeonmap.style.display="none";
            //advanced.style.display="none";
            //skipboss.style.display="none";
            advanced.style.display="block";
            selecteddungeonmap.style.display="block";
            skipboss.style.display="block";
            fulldungclear.style.display="block";
        }
        localStorage.setItem('_autodungeonok', autodungeonok)
    });
    selectdungeonmap.addEventListener("change", function(){
        localStorage.setItem('_selecteddungeonmap', selectdungeonmap.value);
    })
    advanced.addEventListener("change", function(){
        localStorage.setItem('_advanced', advanced.value);
    })
    skipboss.addEventListener("change", function(){
        localStorage.setItem('_skipboss', skipboss.value);
    })
    fulldungclear.addEventListener("change", function(){
        localStorage.setItem('_fulldungclear', fulldungclear.value);
    })


    // CIRCUS PROV LOGIC
    circusprovinciariumboton.addEventListener('click', function(){
        let selectcircusprovinciariummode=document.querySelector('#selectcircusprovinciariummode');
        if (autocircusprovinciariumok==true){
            autocircusprovinciariumok=false;
            circusprovinciariumboton.innerHTML="AUTO CIRCUS PROV OFF";
            circusprovinciariumboton.style.textShadow = botOptionOff
            selectcircusprovinciariummode.style.display="block";
        }else{
            autocircusprovinciariumok=true;
            circusprovinciariumboton.innerHTML="AUTO CIRCUS PROV ON";
            circusprovinciariumboton.style.textShadow = botOptionOn
            //selectcircusprovinciariummode.style.display="none";
            selectcircusprovinciariummode.style.display="block";
        }
        localStorage.setItem('_autocircusprovinciariumok', autocircusprovinciariumok);
    })
    selectcircusprovinciariummode.addEventListener('change', function(){
        localStorage.setItem('_selectcircusprovinciariummode', selectcircusprovinciariummode.value);
    })

    // ARENA PROV LOGIC
        arenaprovinciariumboton.addEventListener('click', function(){
        let selectarenaprovinciariummode=document.querySelector('#selectarenaprovinciariummode');
        if (autoarenaprovinciariumok==true){
            autoarenaprovinciariumok=false;
            arenaprovinciariumboton.innerHTML="AUTO ARENA PROV OFF";
            arenaprovinciariumboton.style.textShadow = botOptionOff
            selectarenaprovinciariummode.style.display="block";
        }else{
            autoarenaprovinciariumok=true;
            arenaprovinciariumboton.innerHTML="AUTO ARENA PROV ON";
            arenaprovinciariumboton.style.textShadow = botOptionOn
            //selectarenaprovinciariummode.style.display="none";
            selectarenaprovinciariummode.style.display="block";
        }
        localStorage.setItem('_autoarenaprovinciariumok', autoarenaprovinciariumok);
    })
    selectarenaprovinciariummode.addEventListener('change', function(){
        localStorage.setItem('_selectarenaprovinciariummode', selectarenaprovinciariummode.value);
    })
    arenahp.addEventListener("change",function(){
        let arenadatalabel=document.querySelector('#arenadatalabel');
        arenadatalabel.innerHTML="NOT ATTACK HP < "+arenahp.value+"%";
        localStorage.setItem('_arenahp', arenahp.value);
    });

    // WORKON
    autoworkboton.addEventListener('click', function(){
        let autoworktype=document.querySelector('#autoworktype');
        if (autoworkok==true){
            autoworkok=false;
            autoworkboton.innerHTML="AUTO WORK OFF";
            autoworkboton.style.textShadow = botOptionOff
            autoworktype.style.display="block";
        }else{
            autoworkok=true;
            autoworkboton.innerHTML="AUTO WORK ON";
            autoworkboton.style.textShadow = botOptionOn
            //toworktype.style.display="none";
            autoworktype.style.display="block";
        }
        localStorage.setItem('_autoworkok', autoworkok);
    })
    autoworktype.addEventListener('change', function(){
        localStorage.setItem('_worktype', autoworktype.value);
    })

    // EVENT IDK LEAVE FOR NOW
    if (existevent()){
        eventhp.addEventListener("change",function(){
            let eventdatalabel=document.querySelector('#eventdatalabel');
            eventdatalabel.innerHTML="NOT ATTACK HP < "+eventhp.value+"%";
        });
        eventboton.addEventListener("click",function(){
            let selectedeventtarget=document.querySelector('#eventtarget');
            if (autoeventok){
                autoeventok=false;
                eventboton.innerHTML="AUTO EVENT OFF";
                eventboton.style.textShadow = botOptionOff
                selectedeventtarget.style.display="block";
                eventdatalabel.style.display="block";
                eventhp.style.display="block";
            }else{
                autoeventok=true;
                eventboton.innerHTML="AUTO EVENT ON";
                eventboton.style.textShadow = botOptionOn
                //lectedeventtarget.style.display="none";
                //entdatalabel.style.display="none";
                //enthp.style.display="none";
                selectedeventtarget.style.display="block";
                eventdatalabel.style.display="block";
                eventhp.style.display="block";
            }
            //setCookie("autoevent", autoeventok, 10080);
        });
    }
    menubotboton.addEventListener("click",function(){
        let menubot = document.querySelector('#bot');
        if (boton==true){
            menubot.style.display="block";
            menubotboton.innerHTML="BOT OFF";
            menubotboton.style.textShadow = botOptionOff;
            boton=false;
        }else{
            //menubot.style.display="none";
            menubot.style.display="block";
            menubotboton.innerHTML="BOT ON";
            menubotboton.style.textShadow = botOptionOn;
            boton=true;
        }
        console.log('boton: ', boton)
        localStorage.setItem('_boton', boton)
    });



   // FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS

    function changePageIcon(){
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        let url = location.href
        if (url.includes('index.php?mod=quests')){
            link.href = 'https://icons.iconarchive.com/icons/tatice/cristal-intense/256/Help-icon.png';
        }
        else {
            link.href = 'https://i.kym-cdn.com/photos/images/original/001/882/131/c6e.png'
        }

    }


    function checkExpedition(selectexpeditionmap, selectexpeditiontarget, expeditionhp){
        let currentHpPercentage = parseInt(document.getElementById('header_values_hp_percent').innerHTML);
        if (currentHpPercentage < expeditionhp) return;
        console.log('expedition')
        let content = document.getElementById('cooldown_bar_text_expedition').innerHTML;
        //alert(content);

        if(content == 'Go to expedition'){
            location.href = expeditionLocations[selectexpeditionmap];
            document.getElementById('expedition_list').children[selectexpeditiontarget].children[1].children[0].click();

        }
    }


    function checkDungeon(_selectdungeonmap, _advanced, _skipboss, _fulldungclear){ //TODO advanced //TODO boss skiping
        let selectdungeonmap = parseInt(_selectdungeonmap)
        let advanced = _advanced === 'true'
        let skipboss = _skipboss === 'true'
        let fulldungclear = _fulldungclear === 'true'
        console.log('dungeon');
        let content = document.getElementById('cooldown_bar_text_dungeon').innerHTML;
        if(content == 'Go to dungeon'){
            location.href = dungeonLocations[selectdungeonmap];


            if (document.querySelector('div#content div.contentItem h3').innerHTML == "Description"){
                if (advanced){
                    document.querySelector('input.button1[value="Advanced"]').click();
                }
                else{
                    document.querySelector('input.button1[value="Normal"]').click();
                }
            }

            let enemiesImgs = document.querySelectorAll('div#content div[style="margin:1px"] img[onClick]');
            let furthestEnemyIndex = 0;
            let furthestEnemy = '';
            let closestEnemyIndex = 0;
            let closestEnemy = '';
            let firstLoop = true;
            for (var i = 0; i < enemiesImgs.length; i++) {
                let enemyMapIndex = parseInt(enemiesImgs[i].getAttribute('onClick').substring(12,15).replace(/\D/g, ""));
                if (firstLoop){
                    firstLoop = false;
                    closestEnemyIndex = enemyMapIndex;
                    furthestEnemyIndex = enemyMapIndex;
                    closestEnemy = enemiesImgs[i];
                    furthestEnemy = enemiesImgs[i];
                }
                if (enemyMapIndex > furthestEnemyIndex){
                    furthestEnemyIndex = enemyMapIndex;
                    furthestEnemy = enemiesImgs[i]
                }
                if (enemyMapIndex < closestEnemyIndex){
                    closestEnemyIndex = enemyMapIndex;
                    closestEnemy = enemiesImgs[i]
                }
            }
            let compareObject = {}
            let enemiesDivs = document.querySelectorAll('div#content div[style="margin:1px"] div[onClick]');
            enemiesDivs.forEach(enemy => {
                let enemyMapIndex = parseInt(enemy.getAttribute('onClick').substring(12,15).replace(/\D/g, ""));
                compareObject={
                    ...compareObject,
                    [enemyMapIndex]: enemy.innerHTML,
                }
            })
            let cancelBtn = document.querySelector('input.button1[value="Cancel dungeon"]')
            if (fulldungclear){
                if (skipboss && compareObject[closestEnemyIndex] == 'Boss'){
                    cancelBtn.click()
                }
                else{
                    closestEnemy.click();
                }
            }
            else{
                if (skipboss && compareObject[furthestEnemyIndex] == 'Boss'){
                    cancelBtn.click()
                }
                else{
                    furthestEnemy.click();
                }
            }
        }
    }


    function checkCircusProvinciarium(_selectcircusprovinciariummode){
        let selectcircusprovinciariummode = parseInt(_selectcircusprovinciariummode)
        console.log('circus');
        let content = document.getElementById('cooldown_bar_text_ct').innerHTML;
        let circusLink = 'index.php?mod=arena&submod=serverArena&aType=3&sh=' + sessionHash;

        if(content == 'To Circus Turma'){

            location.href = circusLink;
            let enemies = document.querySelectorAll('section#own3 table tbody tr td div.attack');
            if (selectcircusprovinciariummode == 0){
                let randomEnemy = Math.floor(Math.random() * ((enemies.length-1) - 0 + 1) + 0);
                enemies[randomEnemy].click();
            }
            else if (selectcircusprovinciariummode == 1){//attack lowest lvl available
                enemies[0].click();
            }
            else if (selectcircusprovinciariummode == 2){ //attack highest lvl available
                enemies[enemies.length-1].click();
            }
        }
    }

    function checkArenaProvinciarium(_selectarenaprovinciariummode, arenahp){
        //var arenahp = parseInt(_arenahp);
        console.log('arena');
        let currentHpPercentage = parseInt(document.getElementById('header_values_hp_percent').innerHTML);
        //console.log('current and cap hp: ', currentHpPercentage , ' < ', arenahp, ' = ', currentHpPercentage < arenahp)
        if (currentHpPercentage < arenahp) return;
        let selectarenaprovinciariummode = parseInt(_selectarenaprovinciariummode)
        let content = document.getElementById('cooldown_bar_text_arena').innerHTML;
        let arenaLink = 'index.php?mod=arena&submod=serverArena&aType=2&sh=' + sessionHash;

        if(content == 'Go to the arena'){
            location.href = arenaLink;
            let enemies = document.querySelectorAll('section#own2 table tbody tr td div.attack');
            if (selectarenaprovinciariummode == 0){
                let randomEnemy = Math.floor(Math.random() * ((enemies.length-1) - 0 + 1) + 0);
                enemies[randomEnemy].click();
            }
            else if (selectarenaprovinciariummode == 1){//attack lowest lvl available
                enemies[0].click();
            }
            else if (selectarenaprovinciariummode == 2){ //attack highest lvl available
                enemies[enemies.length-1].click();
            }
        }
    }



    function checkWork(_autoworktype){
        let autoworktype = parseInt(_autoworktype);
        console.log('work')
        let expeditionsLeft = document.getElementById('expeditionpoints_value_point').innerHTML;
        let dungeonsLeft = document.getElementById('dungeonpoints_value_point').innerHTML;
        let isWorking = document.querySelector('div#content.show-item-quality.show-item-level h1');
        if (expeditionsLeft == '0' && dungeonsLeft == '0' && !isWorking){
            let workTabLink = document.getElementById('submenu1').children[0].href;
            location.href = workTabLink;
            console.log('work index: ', autoworktype)
            document.querySelectorAll('div#select table.section-like.select_work_table tbody tr[id]')[autoworktype].click();
            document.getElementById('doWork').click();
        }
    }



    function checkHealth(){ //not using atm
        let currentHealth = document.getElementById('header_values_hp_bar').getAttribute('data-value');
        let maxHealth = document.getElementById('header_values_hp_bar').getAttribute('data-max-value');
        let currentHealthInPercentage = currentHealth / maxHealth;
        console.log('health: ', currentHealthInPercentage);
        if (currentHealthInPercentage < 0.90){ //health percentage, for example 0.4 = 40%
            let overviewLink = document.querySelector('div#mainmenu a.menuitem[title="Overview"]').href
            // zamienic pozniej na
            // location.href = overviewLink

            if (document.querySelectorAll("div[data-content-type='64']").length){
                console.log('dziala 1');
            }
        }
    }



    let questCounter=document.createElement('button');//selectturmatarget
    questCounter.classList.add('awesome-tabs');
    questCounter.setAttribute("style"," position:absolute; padding:2px; left: -25px; font-size: 14px; min-width: 25px; min-height: 25px;");
    let questNavTab = document.querySelector('ul#mainnav li table tbody tr td');
    questNavTab.appendChild(questCounter)
    let qc = parseInt(localStorage.getItem('_questCounter')) || 0
    questCounter.innerHTML = qc;

    function questChecker(){
        console.log("QUESTS")
        let randomNumber = Math.random() * (100 - 0) + 0; //additional refresh cuz quests dont refresha s often as they should
        if (randomNumber < 10){ //10% for refresh per loop (loop itself has couple seconds of delay)
            location.reload();
        }


        let rerollQuestsButton = document.querySelector('input[type="button"][value="New quests"]');
        let completedQuests = document.querySelectorAll('div#qcategory_finished div.contentboard_slot.contentboard_slot_active a.quest_slot_button_finish')
        let failedQuests = document.querySelectorAll('div#qcategory_restart div.contentboard_slot.contentboard_slot_active a.quest_slot_button_restart') //restart all

        let arenaQuests = document.querySelectorAll('div#qcategory_arena div.contentboard_slot.contentboard_slot_inactive');

        let circusQuests = document.querySelectorAll('div#qcategory_grouparena div.contentboard_slot.contentboard_slot_inactive');
        let combatQuests = document.querySelectorAll('div#qcategory_combat div.contentboard_slot.contentboard_slot_inactive');
        let expeditionQuests = document.querySelectorAll('div#qcategory_expedition div.contentboard_slot.contentboard_slot_inactive');
        //let itemQuests = document.querySelectorAll('div#qcategory_items div.contentboard_slot.contentboard_slot_inactive')
        let succession = true //later set on input



        completedQuests.forEach(quest => {
            console.log('completedQuests: ', quest)
            quest.click()
            qc += 1;
            localStorage.setItem('_questCounter', qc)
            questCounter.innerHTML = qc;
        })
        failedQuests.forEach(quest => {
            console.log('failedQuests: ', quest)
            quest.click()
        })

        let isQuestCooldown = document.getElementById('quest_header_cooldown')
        if (isQuestCooldown){
            console.log('cooldown')
            return
        }



        arenaQuests.forEach(quest => {
            if (quest.querySelector('.quest_slot_time')){ //if quest is timed - dont count it
                //console.log('TIMED YUCK')
                return
            }
            let questText = quest.children[1].innerHTML;
            if (!questText.includes('succession')){
                //console.log('AKCEPTUJ: ', quest)
                quest.children[3].click()
            }
            else if (questText.includes('succession') && succession){
                //console.log('[S]AKCEPTUJ: ', quest)
                quest.children[3].click()
            }
            else {
                //console.log('NIE AKCEPTUJ: ', questText)
            }
        })

        circusQuests.forEach(quest => {
            let questText = quest.children[1].innerHTML;
            if (!questText.includes('succession')){
                //console.log('AKCEPTUJ: ', questText)
                quest.children[3].click()
            }
            else if (questText.includes('succession') && succession){
                //console.log('[S]AKCEPTUJ: ', questText)
                quest.children[3].click()
            }
            else {
                //console.log('NIE AKCEPTUJ: ', questText)
            }
        })
        combatQuests.forEach(quest => {
            let questText = quest.children[1].innerHTML;
            if (!questText.includes('succession')){
                //console.log('AKCEPTUJ: ', questText)
                quest.children[3].click()
            }
            else if (questText.includes('succession') && succession){
                //console.log('[S]AKCEPTUJ: ', questText)
                quest.children[3].click()
            }
            else {
                //console.log('NIE AKCEPTUJ: ', questText)
            }
        })
        expeditionQuests.forEach(quest => {
            let questText = quest.children[1].innerHTML;
            if (questText.includes('Awakened Mummy')){
                quest.children[3].click()
            }
        })


        //itemQuests.forEach(quest => {
        //    console.log('itemQuests: ', quest)
        //    //quest.click()
        //})  //idk, low gold and takes quest slot



        //count valid quests *********
        let validQuests = 0;
        arenaQuests.forEach(quest =>{
            if (quest.querySelector('.quest_slot_time')){
                console.log('czasowka')
                return
            }
            let questText = quest.children[1].innerHTML;
            if (!questText.includes('succession')){
                console.log('valid: ',quest)
                validQuests += 1
            }
            else if (questText.includes('succession') && succession){
                console.log('valid: ',quest)
                validQuests += 1
            }
            else {
                return
            }
        })
        circusQuests.forEach(quest => {
            console.log('valid: ',quest)
            validQuests += 1 // all circus are valid
        })
        combatQuests.forEach(quest => {
            let questText = quest.children[1].innerHTML;
            if (!questText.includes('succession')){
                console.log('valid: ',quest)
                validQuests += 1
            }
            else if (questText.includes('succession') && succession){
                console.log('valid: ',quest)
                validQuests += 1
            }
            else {
                return
            }
        })
        expeditionQuests.forEach(quest => {
            let questText = quest.children[1].innerHTML;
            if (questText.includes('Awakened Mummy')){
                console.log('valid: ',quest)
                validQuests += 1
            }
        })
        //count valid quests
        console.log('number of valid quests to take: ', validQuests)


        let activeQuests = document.querySelectorAll('div.contentboard_start div div.contentboard_slot_active');
        console.log('number of active quests: ', activeQuests.length)
        if (validQuests == 0){ //done like a retard but idc :D:D:D:D:D
            rerollQuestsButton.click()
        }

    }







    function eventChecker(){
        if (boton){
            if (autoexpeditionok) checkExpedition(selectexpeditionmap.value, selectexpeditiontarget.value, expeditionhp.value)//console.log('autoexpeditionok: ',selectexpeditionmap.value , selectexpeditiontarget.value, expeditionhp.value ) //checkExpedition()
            if (autodungeonok) checkDungeon(selectdungeonmap.value, advanced.value, skipboss.value, fulldungclear.value) //console.log('autodungeonok: ', selectdungeonmap.value, advanced.value, skipboss.value ) //checkDungeon()
            if (autocircusprovinciariumok) checkCircusProvinciarium(selectcircusprovinciariummode.value) //console.log('autocircusprovinciariumok: ', selectcircusprovinciariummode.value ) //checkCircusProvinciarium()
            if (autoarenaprovinciariumok) checkArenaProvinciarium(selectarenaprovinciariummode.value, arenahp.value)
            if (autoworkok) checkWork(autoworktype.value)//console.log('autowork: ', autoworktype.value)//checkWork()
        }
    }


    function main(){ // here include further functionalities
        if (!location.href.includes('index.php?mod=quests')){ //set main bots
            eventChecker()
        }

        if (location.href.includes('index.php?mod=quests')){ // quest bot
            questChecker()
        }
    }


    let refreshPageCounter = 0
    //dont touch these 2 :)
    function loop() {
        let rand = Math.round(Math.random() * (5000 - 1500)) + 1500;
        setTimeout(function() {
            main();
            loop();
        }, rand);
    }

    setInterval(function(){
        refreshPageCounter += 1
        console.log(refreshPageCounter)
        if (refreshPageCounter > 180){
            let resetLink = ''
            if (location.href.includes('index.php?mod=quests')){
                resetLink = 'index.php?mod=quests&sh=' + sessionHash;
            }
            else {
                resetLink = 'index.php?mod=overview&sh=' + sessionHash;
            }
            location.href = resetLink;
        }
    }, 1000)





    changePageIcon()
    loop()
})();
