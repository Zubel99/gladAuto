// ==UserScript==
// @name         Gladiatusik
// @namespace    http://tampermonkey.net/
// @version      1.3.3.7
// @description  Better than p2w bobs
// @author       You
// @include      *s*-*.gladiatus.gameforge.com/game/index.php?*
// @exclude      *s*-*.gladiatus.gameforge.com/game/index.php?mod=auction*
// @icon         https://lens-storage.storage.googleapis.com/png/0bee43cb65064cfb9707760f648e737b
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
    //let autoturmaok=localStorage.getItem('_autoturmaok') === 'true';
    let autoworkok=localStorage.getItem('_autoworkok') === 'true';

    let autoquestok=localStorage.getItem('_autoquestok') === 'true';


    let arenaquestok=localStorage.getItem('_arenaquestok') === 'true';
    let arenaquesttimedok=localStorage.getItem('_arenaquesttimedok') === 'true';
    let arenaquestsuccessionok=localStorage.getItem('_arenaquestsuccessionok') === 'true';

    let circusquestok=localStorage.getItem('_circusquestok') === 'true';
    let circusquesttimedok=localStorage.getItem('_circusquesttimedok') === 'true';
    let circusquestsuccessionok=localStorage.getItem('_circusquestsuccessionok') === 'true';

    let combatquestok=localStorage.getItem('_combatquestok') === 'true';
    let combatquesttimedok=localStorage.getItem('_combatquesttimedok') === 'true';
    let combatquestsuccessionok=localStorage.getItem('_combatquestsuccessionok') === 'true';

    let expeditionquestok=localStorage.getItem('_expeditionquestok') === 'true';
    let expeditionquesttimedok=localStorage.getItem('_expeditionquesttimedok') === 'true';
    let expeditionquestsuccessionok=localStorage.getItem('_expeditionquestsuccessionok') === 'true';

    let expeditionSliderOk = localStorage.getItem('_expeditionSliderOk') === 'true';
    let dungeonSliderOk = localStorage.getItem('_dungeonSliderOk') === 'true';
    let circusSliderOk = localStorage.getItem('_circusSliderOk') === 'true';
    let arenaSliderOk = localStorage.getItem('_arenaSliderOk') === 'true';
    let questSliderOk = localStorage.getItem('_questSliderOk') === 'true';
    let workSliderOk = localStorage.getItem('_workSliderOk') === 'true';


    //additional functionalities handle the same way
    let autoeventok=true

    let menujuego=document.querySelector('#mainmenu');
    let menubotfooter=document.createElement('div');
    menubotfooter.id="submenufooter";
    let menubot=document.createElement('div');
    menubot.classList.add('submenu');
    let botOptionOn='0px 0px 15px green,0px 0px 15px green,0px 0px 15px green,0px 0px 15px green';
    let botOptionOff='0px 0px 15px red,0px 0px 15px red'
    let smallButtonBotOptionOn= '0px 0px 15px green,0px 0px 15px green,0px 0px 15px green,0px 0px 15px green,0px 0px 15px green,0px 0px 15px green,0px 0px 15px green';
    let smallButtonBotOptionOff= '0px 0px 15px red,0px 0px 15px red '
    let botTab=document.querySelector('a#botboton')




    function existevent(){
        let captureeventbutton=document.evaluate(".//div[contains(@id,'submenu2')]/a[contains(@class,'eyecatcher')]", document.body, null, 9, null).singleNodeValue;
        if (captureeventbutton){
            return true;
        }else{
            return false;
        }}

    function createMenuItemSlider(id){
        let isOnByDefault = localStorage.getItem('_' + id + 'Ok') === 'true';

        let arrowImg = document.createElement('img')
        if (isOnByDefault) arrowImg.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')
        else arrowImg.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        arrowImg.setAttribute('height', 18);
        arrowImg.setAttribute('width', 18);
        arrowImg.id = id
        arrowImg.setAttribute('style', 'position: absolute; cursor: pointer; filter: brightness(4); padding: 4.5px; left: 36px; background-image: linear-gradient(to right, rgba(0,0,0,1), 80%, rgba(255,0,0,0));')//position: absolute; cursor: pointer; top: 0px; left:10px; filter: brightness(4); padding: 4.5px; background-image: linear-gradient(to right, rgba(0,0,0,1), 80%, rgba(255,0,0,0));
        return arrowImg
    }

    if (boton==true) {
        menubot.setAttribute("style","display:none");
        //botTab.style.textShadow = botOptionOn
    }else{
        menubot.setAttribute("style","display:block");
        //botTab.style.textShadow = botOptionOff
    }
    menubot.id="bot";
    menubot.setAttribute("style","display:block; ");//position: relative;


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
    let expeditionSlider = createMenuItemSlider('expeditionSlider')
    if (expeditionSliderOk){
        selectexpeditionmap.setAttribute("style","display:block;margin-left:10px;");
        selectexpeditiontarget.setAttribute("style","display:block;margin-left:10px;");
        expeditionhp.setAttribute("style","display:block;margin-left:10px;");
        expdatalabel.setAttribute("style","display:block;margin-left:10px;color:yellow;");
    }else{
        selectexpeditionmap.setAttribute("style","display:none;margin-left:10px;");
        selectexpeditiontarget.setAttribute("style","display:none;margin-left:10px;");
        expeditionhp.setAttribute("style","display:none;margin-left:10px;");
        expdatalabel.setAttribute("style","display:none;margin-left:10px;color:yellow;");
    }
    if (autoexpeditionok==true){
        expeditionboton.innerHTML="EXPEDITION ON";
        expeditionboton.style.textShadow = botOptionOn

    }else{
        expeditionboton.innerHTML="EXPEDITION OFF";
        expeditionboton.style.textShadow = botOptionOff
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
    let dungeonSlider = createMenuItemSlider('dungeonSlider')
    if (dungeonSliderOk){
        selectdungeonmap.setAttribute("style","display:block;margin-left:10px;");
        advanced.setAttribute("style","display:block;margin-left:10px;");
        skipboss.setAttribute("style","display:block;margin-left:10px;");
        fulldungclear.setAttribute("style","display:block;margin-left:10px;");
    }else{
        selectdungeonmap.setAttribute("style","display:none;margin-left:10px;");
        advanced.setAttribute("style","display:none;margin-left:10px;");
        skipboss.setAttribute("style","display:none;margin-left:10px;");
        fulldungclear.setAttribute("style","display:none;margin-left:10px;");
    }

    if (autodungeonok==true){
        dungeonboton.innerHTML="DUNGEON ON";
        dungeonboton.style.textShadow = botOptionOn

    }else{
        dungeonboton.innerHTML="DUNGEON OFF";
        dungeonboton.style.textShadow = botOptionOff
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
    let circusSlider = createMenuItemSlider('circusSlider')
    if (circusSliderOk){
        selectcircusprovinciariummode.setAttribute("style","display:block;margin-left:10px;");
    }else{
        selectcircusprovinciariummode.setAttribute("style","display:none;margin-left:10px;");
    }

    if (autocircusprovinciariumok==true){
        circusprovinciariumboton.innerHTML="CIRCUS PROV ON";
        circusprovinciariumboton.style.textShadow = botOptionOn
    }else{
        circusprovinciariumboton.innerHTML="CIRCUS PROV OFF";
        circusprovinciariumboton.style.textShadow = botOptionOff
    }
    selectcircusprovinciariummode.innerHTML='<option value="1" selected>10%+ weaker</option><option value="2">20%+ weaker</option><option value="3">30%+ weaker</option>';//if need more options just add <option value="4">40%+ weaker</option> etc...
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

    let arenaSlider = createMenuItemSlider('arenaSlider')
    if (arenaSliderOk){
        selectarenaprovinciariummode.setAttribute("style","display:block;margin-left:10px;");
        arenahp.setAttribute("style","display:block;margin-left:10px;");
        arenadatalabel.setAttribute("style","display:block;margin-left:10px;color:yellow;");
    }else{
        selectarenaprovinciariummode.setAttribute("style","display:none;margin-left:10px;");
        arenahp.setAttribute("style","display:none;margin-left:10px;");
        arenadatalabel.setAttribute("style","display:none;margin-left:10px;color:yellow;");
    }
    if (autoarenaprovinciariumok==true){
        arenaprovinciariumboton.innerHTML="ARENA PROV ON";
        arenaprovinciariumboton.style.textShadow = botOptionOn
    }else{
        arenaprovinciariumboton.innerHTML="ARENA PROV OFF";
        arenaprovinciariumboton.style.textShadow = botOptionOff
    }
    selectarenaprovinciariummode.innerHTML='<option value="1" selected>10%+ weaker</option><option value="2">20%+ weaker</option><option value="3">30%+ weaker</option>';//if need more options just add <option value="4">40%+ weaker</option> etc...
    selectarenaprovinciariummode.id="selectarenaprovinciariummode";
    selectarenaprovinciariummode.value=localStorage.getItem('_selectarenaprovinciariummode') || 1;

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
    let workSlider = createMenuItemSlider('workSlider')
    if (workSliderOk){
        autoworktype.setAttribute("style","display:block;margin-left:10px;");
    }else{
        autoworktype.setAttribute("style","display:none;margin-left:10px;");
    }
    if (autoworkok==true){
        autoworkboton.innerHTML="WORK ON";
        autoworkboton.style.textShadow = botOptionOn;
    }else{
        autoworkboton.innerHTML="WORK OFF";
        autoworkboton.style.textShadow = botOptionOff;
    }

    // QUESTS ON
    let autoquestboton=document.createElement('a');
    autoquestboton.classList.add('menuitem');
    autoquestboton.style.cursor = "pointer";

    let arenaqueston=document.createElement('a'); //arena
    arenaqueston.id="arenaqueston";
    arenaqueston.setAttribute("style","display:block; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
    arenaqueston.setAttribute('value', localStorage.getItem('_arenaquestok') || 0);
    let arenaquesttimedon=document.createElement('select');
    arenaquesttimedon.id="arenaquesttimedon";
    arenaquesttimedon.innerHTML='<option value="0" selected>No timer</option><option value="1">Timer</option>';
    arenaquesttimedon.value=localStorage.getItem('_arenaquesttimedon') || 0;
    arenaquesttimedon.setAttribute("style","display:block;margin-left:10px;");
    let arenaquestsuccessionon=document.createElement('select');
    arenaquestsuccessionon.id="arenaquestsuccessionon";
    arenaquestsuccessionon.innerHTML='<option value="0" selected>No succession</option><option value="1">Succession</option>';
    arenaquestsuccessionon.value=localStorage.getItem('_arenaquestsuccessionon') || 0;
    arenaquestsuccessionon.setAttribute("style","display:block;margin-left:10px;");

    let circusqueston=document.createElement('a');//circus
    circusqueston.id="circusqueston";
    circusqueston.setAttribute("style","display:block; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
    circusqueston.setAttribute('value', localStorage.getItem('_circusquestok') || 0);
    let circusquesttimedon=document.createElement('select');
    circusquesttimedon.id="circusquesttimedon";
    circusquesttimedon.innerHTML='<option value="0" selected>No timer</option><option value="1">Timer</option>';
    circusquesttimedon.value=localStorage.getItem('_circusquesttimedon') || 0;
    circusquesttimedon.setAttribute("style","display:block;margin-left:10px;");
    let circusquestsuccessionon=document.createElement('select');
    circusquestsuccessionon.id="circusquestsuccessionon";
    circusquestsuccessionon.innerHTML='<option value="0" selected>No succession</option><option value="1">Succession</option>';
    circusquestsuccessionon.value=localStorage.getItem('_circusquestsuccessionon') || 0;
    circusquestsuccessionon.setAttribute("style","display:block;margin-left:10px;");

    let combatqueston=document.createElement('a');//combat
    combatqueston.id="combatqueston";
    combatqueston.setAttribute("style","display:block; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
    combatqueston.setAttribute('value', localStorage.getItem('_combatquestok') || 0);
    let combatquesttimedon=document.createElement('select');
    combatquesttimedon.id="combatquesttimedon";
    combatquesttimedon.innerHTML='<option value="0" selected>No timer</option><option value="1">Timer</option>';
    combatquesttimedon.value=localStorage.getItem('_combatquesttimedon') || 0;
    combatquesttimedon.setAttribute("style","display:block;margin-left:10px;");
    let combatquestsuccessionon=document.createElement('select');
    combatquestsuccessionon.id="combatquestsuccessionon";
    combatquestsuccessionon.innerHTML='<option value="0" selected>No succession</option><option value="1">Succession</option>';
    combatquestsuccessionon.value=localStorage.getItem('_combatquestsuccessionon') || 0;
    combatquestsuccessionon.setAttribute("style","display:block;margin-left:10px;");

    let expeditionqueston=document.createElement('a');//expedition
    expeditionqueston.id="expeditionqueston";
    expeditionqueston.setAttribute("style","display:block; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
    expeditionqueston.setAttribute('value', localStorage.getItem('_expeditionquestok') || 0);
    let expeditionquesttimedon=document.createElement('select');
    expeditionquesttimedon.id="expeditionquesttimedon";
    expeditionquesttimedon.innerHTML='<option value="0" selected>No timer</option><option value="1">Timer</option>';
    expeditionquesttimedon.value=localStorage.getItem('_expeditionquesttimedon') || 0;
    expeditionquesttimedon.setAttribute("style","display:block;margin-left:10px;");
    let expeditionquestsuccessionon=document.createElement('select');
    expeditionquestsuccessionon.id="expeditionquestsuccessionon";
    expeditionquestsuccessionon.innerHTML='<option value="0" selected>No succession</option><option value="1">Succession</option>';
    expeditionquestsuccessionon.value=localStorage.getItem('_expeditionquestsuccessionon') || 0;
    expeditionquestsuccessionon.setAttribute("style","display:block;margin-left:10px;");


    let expeditionquestmaplabel = document.createElement('span');
    expeditionquestmaplabel.innerHTML='Expedition map name'
    let expeditionquestmap=document.createElement('input');
    expeditionquestmap.id="expeditionquestmap";
    expeditionquestmap.value= localStorage.getItem('_expeditionquestmap') || '';

    let expeditionquestenemylabel = document.createElement('span');
    expeditionquestenemylabel.innerHTML='Expedition enemy name'
    let expeditionquestenemy=document.createElement('input');
    expeditionquestenemy.id="expeditionquestenemy";
    expeditionquestenemy.value= localStorage.getItem('_expeditionquestenemy') || '';

    let questSlider = createMenuItemSlider('questSlider')
    if (questSliderOk){
        arenaqueston.setAttribute("style","display:block; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
        arenaquesttimedon.setAttribute("style","display:block;margin-left:10px;");
        arenaquestsuccessionon.setAttribute("style","display:block;margin-left:10px;");

        circusqueston.setAttribute("style","display:block; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
        circusquesttimedon.setAttribute("style","display:block;margin-left:10px;");
        circusquestsuccessionon.setAttribute("style","display:block;margin-left:10px;");

        combatqueston.setAttribute("style","display:block; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
        combatquesttimedon.setAttribute("style","display:block;margin-left:10px;");
        combatquestsuccessionon.setAttribute("style","display:block;margin-left:10px;");

        expeditionqueston.setAttribute("style","display:block; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
        expeditionquesttimedon.setAttribute("style","display:block;margin-left:10px;");
        expeditionquestsuccessionon.setAttribute("style","display:block;margin-left:10px;");

        expeditionquestmaplabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        expeditionquestmap.setAttribute("style","display:block;margin-left:10px;max-width: 130px");
        expeditionquestenemylabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        expeditionquestenemy.setAttribute("style","display:block;margin-left:10px;max-width: 130px");
    }else{
        arenaqueston.setAttribute("style","display:none; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
        arenaquesttimedon.setAttribute("style","display:none;margin-left:10px;");
        arenaquestsuccessionon.setAttribute("style","display:none;margin-left:10px;");

        circusqueston.setAttribute("style","display:none; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
        circusquesttimedon.setAttribute("style","display:none;margin-left:10px;");
        circusquestsuccessionon.setAttribute("style","display:none;margin-left:10px;");

        combatqueston.setAttribute("style","display:none; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
        combatquesttimedon.setAttribute("style","display:none;margin-left:10px;");
        combatquestsuccessionon.setAttribute("style","display:none;margin-left:10px;");

        expeditionqueston.setAttribute("style","display:none; cursor:pointer; width: 120px; margin-left:auto; margin-right: auto; border: 1px solid #FAA540; text-align: center; border-radius: 10px; margin-top: 10px; margin-bottom: 2px");
        expeditionquesttimedon.setAttribute("style","display:none;margin-left:10px;");
        expeditionquestsuccessionon.setAttribute("style","display:none;margin-left:10px;");

        expeditionquestmaplabel.setAttribute("style","display:none;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        expeditionquestmap.setAttribute("style","display:none;margin-left:10px;max-width: 130px");
        expeditionquestenemylabel.setAttribute("style","display:none;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        expeditionquestenemy.setAttribute("style","display:none;margin-left:10px;max-width: 130px");
    }

    if (autoquestok==true){//global for quests
        autoquestboton.innerHTML="QUESTS ON";
        autoquestboton.style.textShadow = botOptionOn;
        if(arenaquestok){
            arenaqueston.innerHTML = 'ARENA ON'
            arenaqueston.style.textShadow = smallButtonBotOptionOn;
        }else{
            arenaqueston.innerHTML = 'ARENA OFF'
            arenaqueston.style.textShadow = smallButtonBotOptionOff;
        }

        if(circusquestok){
            circusqueston.innerHTML = 'CIRCUS ON'
            circusqueston.style.textShadow = smallButtonBotOptionOn;
        }else{
            circusqueston.innerHTML = 'CIRCUS OFF'
            circusqueston.style.textShadow = smallButtonBotOptionOff;
        }

        if(combatquestok){
            combatqueston.innerHTML = 'COMBAT ON'
            combatqueston.style.textShadow = smallButtonBotOptionOn;
        }else{
            combatqueston.innerHTML = 'COMBAT OFF'
            combatqueston.style.textShadow = smallButtonBotOptionOff;
        }

        if(expeditionquestok){
            expeditionqueston.innerHTML = 'EXPEDITION ON'

            expeditionqueston.style.textShadow = smallButtonBotOptionOn;
        }else{
            expeditionqueston.innerHTML = 'EXPEDITION OFF'
            expeditionqueston.style.textShadow = smallButtonBotOptionOff;
        }
    }else{
        autoquestboton.innerHTML="QUESTS OFF";
        autoquestboton.style.textShadow = botOptionOff;

        if(arenaquestok){
            arenaqueston.innerHTML = 'ARENA ON'
            arenaqueston.style.textShadow = smallButtonBotOptionOn;
        }else{
            arenaqueston.innerHTML = 'ARENA OFF'
            arenaqueston.style.textShadow = smallButtonBotOptionOff;
        }

        if(circusquestok){
            circusqueston.innerHTML = 'CIRCUS ON'
            circusqueston.style.textShadow = smallButtonBotOptionOn;
        }else{
            circusqueston.innerHTML = 'CIRCUS OFF'
            circusqueston.style.textShadow = smallButtonBotOptionOff;
        }

        if(combatquestok){
            combatqueston.innerHTML = 'COMBAT ON'
            combatqueston.style.textShadow = smallButtonBotOptionOn;
        }else{
            combatqueston.innerHTML = 'COMBAT OFF'
            combatqueston.style.textShadow = smallButtonBotOptionOff;
        }

        if(expeditionquestok){
            expeditionqueston.innerHTML = 'EXPEDITION ON'
            expeditionqueston.style.textShadow = smallButtonBotOptionOn;
        }else{
            expeditionqueston.innerHTML = 'EXPEDITION OFF'
            expeditionqueston.style.textShadow = smallButtonBotOptionOff;
        }

        expeditionquestmaplabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow;white-space: nowrap;");
        expeditionquestmap.setAttribute("style","display:block;margin-left:10px;max-width: 100px");
        expeditionquestenemylabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        expeditionquestenemy.setAttribute("style","display:block;margin-left:10px;max-width: 100px");
    }

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

    document.addEventListener('DOMContentLoaded', function() {
        var element = document.getElementById('dungeonSlider');

        if (element) {
            var currentTop = parseFloat(element.style.top);
            var newTop = currentTop - 10;
            element.style.top = newTop + 'px';
        }
        console.log('loaded')
    });



    menubotboton.id="botboton";
    //menubotboton.href="#";
    //APPENDCHILLD
    menubot.appendChild(expeditionSlider) //slider
    menubot.appendChild(expeditionboton);
    menubot.appendChild(selectexpeditionmap);
    menubot.appendChild(selectexpeditiontarget);
    menubot.appendChild(expdatalabel);
    menubot.appendChild(expeditionhp);
    menubot.appendChild(expdatalist);
    menubot.appendChild(dungeonSlider); //slider
    menubot.appendChild(dungeonboton);
    menubot.appendChild(selectdungeonmap);
    menubot.appendChild(advanced);
    menubot.appendChild(skipboss);
    menubot.appendChild(fulldungclear);
    menubot.appendChild(circusSlider); //slider
    menubot.appendChild(circusprovinciariumboton)
    menubot.appendChild(selectcircusprovinciariummode)
    menubot.appendChild(arenaSlider); //slider
    menubot.appendChild(arenaprovinciariumboton)
    menubot.appendChild(selectarenaprovinciariummode)
    menubot.appendChild(arenadatalabel);
    menubot.appendChild(arenahp);
    menubot.appendChild(arenadatalist);
    menubot.appendChild(questSlider); //slider
    menubot.appendChild(autoquestboton);

    menubot.appendChild(arenaqueston)
    menubot.appendChild(arenaquesttimedon)
    menubot.appendChild(arenaquestsuccessionon)
    menubot.appendChild(circusqueston)
    menubot.appendChild(circusquesttimedon)
    menubot.appendChild(circusquestsuccessionon)
    menubot.appendChild(combatqueston)
    menubot.appendChild(combatquesttimedon)
    menubot.appendChild(combatquestsuccessionon)
    menubot.appendChild(expeditionqueston)
    menubot.appendChild(expeditionquesttimedon)
    menubot.appendChild(expeditionquestsuccessionon)

    menubot.appendChild(expeditionquestmaplabel);
    menubot.appendChild(expeditionquestmap);
    menubot.appendChild(expeditionquestenemylabel);
    menubot.appendChild(expeditionquestenemy);
    menubot.appendChild(workSlider); //slider
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
        if (autoexpeditionok==true){
            autoexpeditionok=false;
            expeditionboton.innerHTML="EXPEDITION OFF";
            expeditionboton.style.textShadow = botOptionOff
        }else{
            autoexpeditionok=true;
            expeditionboton.innerHTML="EXPEDITION ON";
            expeditionboton.style.textShadow = botOptionOn
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
    expeditionSlider.addEventListener('click', function(){
        let selectedexpeditionmap=document.querySelector('#expeditionmap');
        let selectedexpeditiontarget=document.querySelector('#expeditiontarget');
        let expdatalabel=document.querySelector('#expdatalabel');
        let expeditionhp=document.querySelector('#expeditionhp');
        if (expeditionSliderOk==true){
            expeditionSliderOk = false;
            selectedexpeditionmap.style.display="none";
            selectedexpeditiontarget.style.display="none";
            expdatalabel.style.display="none";
            expeditionhp.style.display="none";
            expeditionSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        }else{
            expeditionSliderOk = true;
            selectedexpeditionmap.style.display="block";
            selectedexpeditiontarget.style.display="block";
            expdatalabel.style.display="block";
            expeditionhp.style.display="block";
            expeditionSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')

        }
        localStorage.setItem('_expeditionSliderOk', expeditionSliderOk);
    })

    //   DUNGEON LOGIC

    dungeonboton.addEventListener("click",function(){
        if (autodungeonok==true){
            autodungeonok=false;
            dungeonboton.innerHTML="DUNGEON OFF";
            dungeonboton.style.textShadow = botOptionOff
        }else{
            autodungeonok=true;
            dungeonboton.innerHTML="DUNGEON ON";
            dungeonboton.style.textShadow = botOptionOn
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
    dungeonSlider.addEventListener('click', function(){
        let selecteddungeonmap=document.querySelector('#dungeonmap');
        let advanced=document.querySelector('#advanced');
        let skipboss=document.querySelector('#skipboss');
        let fulldungclear=document.querySelector('#fulldungclear');
        if (dungeonSliderOk==true){
            dungeonSliderOk = false;
            advanced.style.display="none";
            selecteddungeonmap.style.display="none";
            skipboss.style.display="none";
            fulldungclear.style.display="none";
            dungeonSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        }else{
            dungeonSliderOk = true;
            advanced.style.display="block";
            selecteddungeonmap.style.display="block";
            skipboss.style.display="block";
            fulldungclear.style.display="block";
            dungeonSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')

        }
        localStorage.setItem('_dungeonSliderOk', dungeonSliderOk);
    })


    // CIRCUS LOGIC
    circusprovinciariumboton.addEventListener('click', function(){
        if (autocircusprovinciariumok==true){
            autocircusprovinciariumok=false;
            circusprovinciariumboton.innerHTML="CIRCUS PROV OFF";
            circusprovinciariumboton.style.textShadow = botOptionOff
        }else{
            autocircusprovinciariumok=true;
            circusprovinciariumboton.innerHTML="CIRCUS PROV ON";
            circusprovinciariumboton.style.textShadow = botOptionOn
        }
        localStorage.setItem('_autocircusprovinciariumok', autocircusprovinciariumok);
    })
    selectcircusprovinciariummode.addEventListener('change', function(){
        localStorage.setItem('_selectcircusprovinciariummode', selectcircusprovinciariummode.value);
    })
    circusSlider.addEventListener('click', function(){
        let selectcircusprovinciariummode=document.querySelector('#selectcircusprovinciariummode');
        if (circusSliderOk==true){
            circusSliderOk = false;
            selectcircusprovinciariummode.style.display="none";
            circusSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        }else{
            circusSliderOk = true;
            selectcircusprovinciariummode.style.display="block";
            circusSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')

        }
        localStorage.setItem('_circusSliderOk', circusSliderOk);
    })

    // ARENA LOGIC
    arenaprovinciariumboton.addEventListener('click', function(){
        if (autoarenaprovinciariumok==true){
            autoarenaprovinciariumok=false;
            arenaprovinciariumboton.innerHTML="ARENA PROV OFF";
            arenaprovinciariumboton.style.textShadow = botOptionOff
        }else{
            autoarenaprovinciariumok=true;
            arenaprovinciariumboton.innerHTML="ARENA PROV ON";
            arenaprovinciariumboton.style.textShadow = botOptionOn
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
    arenaSlider.addEventListener('click', function(){
        let selectarenaprovinciariummode=document.querySelector('#selectarenaprovinciariummode');
        let arenadatalabel=document.querySelector('#arenadatalabel');
        let arenahp=document.querySelector('#arenahp');
        if (arenaSliderOk==true){
            arenaSliderOk = false;
            selectarenaprovinciariummode.style.display="none";
            arenadatalabel.style.display="none";
            arenahp.style.display="none";
            arenaSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        }else{
            arenaSliderOk = true;
            selectarenaprovinciariummode.style.display="block";
            arenadatalabel.style.display="block";
            arenahp.style.display="block";
            arenaSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')

        }
        localStorage.setItem('_arenaSliderOk', arenaSliderOk);
    })

    //QUEST LOGIC
    autoquestboton.addEventListener('click', function(){ //main quests button
        let expeditionquestmap=document.querySelector('#expeditionquestmap');
        let expeditionquestenemy=document.querySelector('#expeditionquestenemy');
        if (autoquestok==true){
            autoquestok=false;
            autoquestboton.innerHTML="QUESTS OFF";
            autoquestboton.style.textShadow = botOptionOff;
            //expeditionquestmap.setAttribute("style","display:block;margin-left:10px;max-width: 100px");
            //expeditionquestenemy.setAttribute("style","display:block;margin-left:10px;max-width: 100px");
        }else{
            autoquestok=true;
            autoquestboton.innerHTML="QUESTS ON";
            autoquestboton.style.textShadow = botOptionOn;
            //expeditionquestmap.setAttribute("style","display:block;margin-left:10px;max-width: 100px");
            //expeditionquestenemy.setAttribute("style","display:block;margin-left:10px;max-width: 100px");
        }
        localStorage.setItem('_autoquestok', autoquestok);
    })

    arenaqueston.addEventListener('click', function(){ // arena quests button
        if (arenaquestok==true){
            arenaquestok=false;
            arenaqueston.setAttribute('value', false);
            arenaqueston.innerHTML="ARENA OFF";
            arenaqueston.style.textShadow = smallButtonBotOptionOff;

        }else{
            arenaquestok=true;
            arenaqueston.setAttribute('value', true);
            arenaqueston.innerHTML="ARENA ON";
            arenaqueston.style.textShadow = smallButtonBotOptionOn;
        }
        localStorage.setItem('_arenaquestok', arenaquestok);
    })
    arenaquesttimedon.addEventListener('change', function(){
        console.log('arenaquesttimedon: ', arenaquesttimedon.value)
        localStorage.setItem('_arenaquesttimedon', arenaquesttimedon.value);
    })
    arenaquestsuccessionon.addEventListener('change', function(){
        console.log('arenaquestsuccessionon: ', arenaquestsuccessionon.value)
        localStorage.setItem('_arenaquestsuccessionon', arenaquestsuccessionon.value);
    })
    circusqueston.addEventListener('click', function(){ // circus quests button
        if (circusquestok==true){
            circusquestok=false;
            circusqueston.setAttribute('value', false);
            circusqueston.innerHTML="CIRCUS OFF";
            circusqueston.style.textShadow = smallButtonBotOptionOff;
            circusqueston.value='true'

        }else{
            circusquestok=true;
            circusqueston.setAttribute('value', false);
            circusqueston.innerHTML="CIRCUS ON";
            circusqueston.style.textShadow = smallButtonBotOptionOn;
            circusqueston.value='false'
        }
        localStorage.setItem('_circusquestok', circusquestok);
    })
    circusquesttimedon.addEventListener('change', function(){
        console.log('circusquesttimedon: ', circusquesttimedon.value)
        localStorage.setItem('_circusquesttimedon', circusquesttimedon.value);
    })
    circusquestsuccessionon.addEventListener('change', function(){
        console.log('circusquestsuccessionon: ', circusquestsuccessionon.value)
        localStorage.setItem('_circusquestsuccessionon', circusquestsuccessionon.value);
    })
    combatqueston.addEventListener('click', function(){// combat quests button
        if (combatquestok==true){
            combatquestok=false;
            combatqueston.setAttribute('value', false);
            combatqueston.innerHTML="COMBAT OFF";
            combatqueston.style.textShadow = smallButtonBotOptionOff;

        }else{
            combatquestok=true;
            combatqueston.setAttribute('value', false);
            combatqueston.innerHTML="COMBAT ON";
            combatqueston.style.textShadow = smallButtonBotOptionOn;
        }
        localStorage.setItem('_combatquestok', combatquestok);
    })
    combatquesttimedon.addEventListener('change', function(){
        console.log('combatquesttimedon: ', combatquesttimedon.value)
        localStorage.setItem('_combatquesttimedon', combatquesttimedon.value);
    })
    combatquestsuccessionon.addEventListener('change', function(){
        console.log('combatquestsuccessionon: ', combatquestsuccessionon.value)
        localStorage.setItem('_combatquestsuccessionon', combatquestsuccessionon.value);
    })
    expeditionqueston.addEventListener('click', function(){// expedition quests button
        if (expeditionquestok==true){
            expeditionquestok=false;
            expeditionqueston.setAttribute('value', false);
            expeditionqueston.innerHTML="EXPEDITION OFF";
            expeditionqueston.style.textShadow = smallButtonBotOptionOff;

        }else{
            expeditionquestok=true;
            expeditionqueston.setAttribute('value', false);
            expeditionqueston.innerHTML="EXPEDITION ON";
            expeditionqueston.style.textShadow = smallButtonBotOptionOn;
        }
        localStorage.setItem('_expeditionquestok', expeditionquestok);
    })
    expeditionquesttimedon.addEventListener('change', function(){
        console.log('expeditionquesttimedon: ', expeditionquesttimedon.value)
        localStorage.setItem('_expeditionquesttimedon', expeditionquesttimedon.value);
    })
    expeditionquestsuccessionon.addEventListener('change', function(){
        console.log('expeditionquestsuccessionon: ', expeditionquestsuccessionon.value)
        localStorage.setItem('_expeditionquestsuccessionon', expeditionquestsuccessionon.value);
    })
    expeditionquestmap.addEventListener('input', function(){
        localStorage.setItem('_expeditionquestmap', expeditionquestmap.value);
        console.log(expeditionquestmap.value)
    })
    expeditionquestenemy.addEventListener('input', function(){
        localStorage.setItem('_expeditionquestenemy', expeditionquestenemy.value);
        console.log(expeditionquestenemy.value)
    })
    questSlider.addEventListener('click', function(){
        arenaqueston.getElementById('arenaqueston')
        arenaquesttimedon.getElementById('arenaquesttimedon')
        arenaquestsuccessionon.getElementById('arenaquestsuccessionon')
        circusqueston.getElementById('circusqueston')
        circusquesttimedon.getElementById('circusquesttimedon')
        circusquestsuccessionon.getElementById('circusquestsuccessionon')
        combatqueston.getElementById('combatqueston')
        combatquesttimedon.getElementById('combatquesttimedon')
        combatquestsuccessionon.getElementById('combatquestsuccessionon')
        expeditionqueston.getElementById('expeditionqueston')
        expeditionquesttimedon.getElementById('expeditionquesttimedon')
        expeditionquestsuccessionon.getElementById('expeditionquestsuccessionon')
        expeditionquestmaplabel.getElementById('expeditionquestmaplabel')
        expeditionquestmap.getElementById('expeditionquestmap')
        expeditionquestenemylabel.getElementById('expeditionquestenemylabel')
        expeditionquestenemy.getElementById('expeditionquestenemy')
        if (questSliderOk==true){
            questSliderOk = false;
            arenaqueston.style.display = 'none'
            arenaquesttimedon.style.display = 'none'
            arenaquestsuccessionon.style.display = 'none'
            circusqueston.style.display = 'none'
            circusquesttimedon.style.display = 'none'
            circusquestsuccessionon.style.display = 'none'
            combatqueston.style.display = 'none'
            combatquesttimedon.style.display = 'none'
            combatquestsuccessionon.style.display = 'none'
            expeditionqueston.style.display = 'none'
            expeditionquesttimedon.style.display = 'none'
            expeditionquestsuccessionon.style.display = 'none'
            expeditionquestmaplabel.style.display = 'none'
            expeditionquestmap.style.display = 'none'
            expeditionquestenemylabel.style.display = 'none'
            expeditionquestenemy.style.display = 'none'
            questSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        }else{
            questSliderOk = true;
            arenaqueston.style.display = 'block'
            arenaquesttimedon.style.display = 'block'
            arenaquestsuccessionon.style.display = 'block'
            circusqueston.style.display = 'block'
            circusquesttimedon.style.display = 'block'
            circusquestsuccessionon.style.display = 'block'
            combatqueston.style.display = 'block'
            combatquesttimedon.style.display = 'block'
            combatquestsuccessionon.style.display = 'block'
            expeditionqueston.style.display = 'block'
            expeditionquesttimedon.style.display = 'block'
            expeditionquestsuccessionon.style.display = 'block'
            expeditionquestmaplabel.style.display = 'block'
            expeditionquestmap.style.display = 'block'
            expeditionquestenemylabel.style.display = 'block'
            expeditionquestenemy.style.display = 'block'
            questSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')
        }
        localStorage.setItem('_questSliderOk', questSliderOk);
    })


    // WORK LOGIC
    autoworkboton.addEventListener('click', function(){
        if (autoworkok==true){
            autoworkok=false;
            autoworkboton.innerHTML="WORK OFF";
            autoworkboton.style.textShadow = botOptionOff
        }else{
            autoworkok=true;
            autoworkboton.innerHTML="WORK ON";
            autoworkboton.style.textShadow = botOptionOn
        }
        localStorage.setItem('_autoworkok', autoworkok);
    })
    autoworktype.addEventListener('change', function(){
        localStorage.setItem('_worktype', autoworktype.value);
    })
    workSlider.addEventListener('click', function(){
        let autoworktype=document.querySelector('#autoworktype');

        if (workSliderOk==true){
            workSliderOk = false;
            autoworktype.style.display="none";
            workSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        }else{
            workSliderOk = true;
            autoworktype.style.display="block";
            workSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')

        }
        localStorage.setItem('_workSliderOk', workSliderOk);
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


    async function checkExpedition(selectexpeditionmap, selectexpeditiontarget, expeditionhp){
        console.log('expedition')
        let currentHpPercentage = parseInt(document.getElementById('header_values_hp_percent').innerHTML);
        if (currentHpPercentage < expeditionhp) return;
        let content = document.getElementById('cooldown_bar_text_expedition').innerHTML;
        //alert(content);

        if(content == 'Go to expedition'){
            location.href = expeditionLocations[selectexpeditionmap];
            document.getElementById('expedition_list').children[selectexpeditiontarget].children[1].children[0].click();
        }
    }


    async function checkDungeon(_selectdungeonmap, _advanced, _skipboss, _fulldungclear){ //TODO advanced //TODO boss skiping
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

    function scrapStats(statsDiv, type, arenaOrCircus){
        let stats = {}

        let stringFix = type === 'enemy' ? 'Chance of avoiding critical hits:' : 'Chance for avoiding critical hits:' // XD !!!
        //console.log('scraping stats for: ', statsDiv)
        let armorInfo = statsDiv.getElementById('char_panzer_tt').getAttribute('data-tooltip')
        let avoidCritChanceAnchor = armorInfo.indexOf(stringFix)
        let blockChanceAnchor = armorInfo.indexOf('Chance to block a hit:')
        let dmgReductionAnchor = armorInfo.indexOf('Absorbs damage:')
        let blockValueAnchor = armorInfo.indexOf('Blocking value:')

        let dmgInfo = statsDiv.getElementById('char_schaden_tt').getAttribute('data-tooltip')
        let critChanceAnchor = dmgInfo.indexOf('Chance for critical damage:')

        let dmgString = filterStringToNumbers(statsDiv.getElementById('char_schaden').innerHTML).toString()
        let dmgMin = 0
        let dmgMax = 0
        if ((dmgString.length % 2) == 0){
            dmgMin = parseInt(dmgString.substring(0, dmgString.length/2))
            dmgMax = parseInt(dmgString.substring(dmgString.length/2))
        }
        else{
            if (dmgString.length == 1){//has to be bc when someone has 0 armor parseInt parses 0 - 0 into 0 and not 00
                dmgMin = 0
                dmgMax = 0
            }
            else{
                dmgMin = parseInt(dmgString.substring(0, parseInt(dmgString.length/2)))
                dmgMax = parseInt(dmgString.substring(parseInt(dmgString.length/2)))
            }
        }



        let level = statsDiv.querySelector('div#char_level_tt span#char_level').innerHTML
        let currentHealth = statsDiv.querySelector('div#char_leben_tt span#char_leben').innerHTML
        let strength = statsDiv.querySelector('div#char_f0_tt span#char_f0').innerHTML
        let dexterity = statsDiv.querySelector('div#char_f1_tt span#char_f1').innerHTML
        let agility = statsDiv.querySelector('div#char_f2_tt span#char_f2').innerHTML
        let constitution = statsDiv.querySelector('div#char_f3_tt span#char_f3').innerHTML
        let charisma = statsDiv.querySelector('div#char_f4_tt span#char_f4').innerHTML
        let intelligence = statsDiv.querySelector('div#char_f5_tt span#char_f5').innerHTML
        let avoidCritChance = filterStringToNumbers(armorInfo.substring(avoidCritChanceAnchor+35, avoidCritChanceAnchor+42))
        let blockChance = filterStringToNumbers(armorInfo.substring(blockChanceAnchor+24, blockChanceAnchor+32))
        let critChance = filterStringToNumbers(dmgInfo.substring(critChanceAnchor+28, critChanceAnchor+35))
        let blockValue = filterStringToNumbers(armorInfo.substring(blockValueAnchor+14, blockValueAnchor+24))


        let dmgReductionStringCombined = filterStringToNumbers(armorInfo.substring(dmgReductionAnchor+10, dmgReductionAnchor+30)).toString()
        //console.log('dmgReductionStringCombined: ', dmgReductionStringCombined)
        //console.log('armorInfo.substring(dmgReductionAnchor+10, dmgReductionAnchor+30): ', armorInfo.substring(dmgReductionAnchor+10, dmgReductionAnchor+30))
        let dmgLength = dmgReductionStringCombined.length
        let dmgReductionMin = 0
        let dmgReductionMax = 0
        if ((dmgReductionStringCombined.toString().length % 2) == 0){
            dmgReductionMin = parseInt(dmgReductionStringCombined.substring(0, dmgLength/2))
            dmgReductionMax = parseInt(dmgReductionStringCombined.substring(dmgLength/2))
        }
        else{
            if(dmgReductionStringCombined.toString().length == 1){//has to be bc when someone has 0 armor parseInt parses 0 - 0 into 0 and not 00
                dmgReductionMin = 0
                dmgReductionMax = 0
            }
            else{
                dmgReductionMin = parseInt(dmgReductionStringCombined.substring(0, parseInt(dmgLength/2)))
                dmgReductionMax = parseInt(dmgReductionStringCombined.substring(parseInt(dmgLength/2)))
            }
        }

        let returnStats = {
            //'name':
            'level': parseInt(level),
            'currentHealth': parseInt(currentHealth),
            'strength': parseInt(strength),
            'dexterity': parseInt(dexterity),
            'agility': parseInt(agility),
            'constitution': parseInt(constitution),
            'charisma': parseInt(charisma),
            'intelligence': parseInt(intelligence),
            'avoidCritChance': avoidCritChance,
            'blockChance': blockChance,
            'blockValue': blockValue,
            'critChance': critChance,
            'dmgReductionMin': dmgReductionMin,
            'dmgReductionMax': dmgReductionMax,
            'dmgMin': dmgMin,
            'dmgMax': dmgMax,
        }

        if (arenaOrCircus == 'circus'){
            let threat = statsDiv.querySelector('div#char_threat_tt span#char_threat').innerHTML
            let healing = statsDiv.querySelector('div#char_healing_tt span#char_healing').innerHTML
            returnStats = {
                ...returnStats,
                'threat': parseInt(threat),
                'healing': parseInt(healing),
            }
        }
        //console.log(returnStats)
        return returnStats

    }


    function performRequest(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    resolve(response.responseText);
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }


    function calculateStrength(player, enemy){ //player perspective
        let blockMultiplier = 0.5 //idk how much does block block, assuming 50%

        let avgDmg = (player.dmgMin + player.dmgMax) / 2
        //console.log('avgDmg: ', avgDmg)
        let avgEnemyDmgReduction = (enemy.dmgReductionMin + enemy.dmgReductionMax) / 2
        let hitChance = ((player.dexterity) / (player.dexterity + enemy.agility)) * 100
        let doubleHitChance = (((player.charisma * player.dexterity) / enemy.intelligence) / enemy.agility) * 10

        let totalPower = avgDmg
        let additionalCritDamage = (avgDmg * 1.5) * ((player.critChance / 100) * (1 - (enemy.avoidCritChance / 100)))
        totalPower += additionalCritDamage // add avg crit value
        totalPower -= avgEnemyDmgReduction // substract avg enemy block value, idk how much does block block XD // assuming 50%
        let enemyBlockedDamage = (totalPower * (enemy.blockChance / 100)) * blockMultiplier
        totalPower -= enemyBlockedDamage // substract avg block chance with block value
        totalPower *= hitChance / 100
        totalPower += totalPower*(doubleHitChance / 100)



        //console.log('player :', player)
        //console.log('enemy  :', enemy)
        //console.log(totalPower)
        //console.log('avgDmg :', avgDmg)
        //console.log('avgDmgReduction :', avgDmgReduction)
        //console.log('hitChance :', hitChance)
        //console.log('doubleHitChance :', doubleHitChance)

        //console.log('doubleHitChance :', doubleHitChance)

        return totalPower
    }
    function filterStringToNumbers(text){
        return parseInt(text.replace(/\D+/g, ''))
    }


    function isEqual(obj1, obj2) {
        // Compare the properties of the objects
        for (let key in obj1) {
            if (obj1.hasOwnProperty(key)) {
                if (obj1[key] !== obj2[key]) {
                    return false;
                }
            }
        }
        return true;
    }


    async function fetchCircusEnemyCharacters(){

        let enemyElements = document.querySelectorAll('section#own3 table tbody tr');
        let promises = [];
        let validCharacterUrls = [];
        let arrIndex = 0
        enemyElements.forEach(enemy => {
            let check = enemy.querySelector('td a[target="_blank"]'); // get profile refs
            let enemyButtonFight = enemy.querySelector('td div.attack');
            if (!check) return; // checks for the first element which is column name
            let enemyPromise = performRequest(check.href).then(responseText => {
                let dummyDiv = document.createElement('div');
                dummyDiv.innerHTML = responseText;
                let allCharacters = dummyDiv.querySelectorAll(' div.charmercsel[onclick]'); // all characters from single profile - cuz in loop

                let urlArrBuffer = []
                for (let i = 0; i < allCharacters.length; i++) {
                    let onClickRef = allCharacters[i].getAttribute('onclick');
                    if (onClickRef.includes('&doll=1')) continue; // ignore arena character
                    let onClickRefLeftAnchor = onClickRef.indexOf('index.php?');
                    let onClickRefRightAnchor = onClickRef.length - 2;

                    let validUrlAnchor = check.href.indexOf('index.php?')
                    let validUrl = check.href.substring(0, validUrlAnchor) + onClickRef.substring(onClickRefLeftAnchor, onClickRefRightAnchor)
                    //console.log('valid URL ?? :', validUrl)
                    urlArrBuffer.push(validUrl);
                }
                //console.log('buffer: ', urlArrBuffer)
                if (!validCharacterUrls[arrIndex]) {
                    validCharacterUrls[arrIndex] = [];
                }
                validCharacterUrls[arrIndex].push([urlArrBuffer, enemyButtonFight])
                //console.log('validCharacterUrls state: ',validCharacterUrls)
                //console.log('outsideValues :', validCharacterUrls)
            })
            .catch(error => {
                console.error("Error occurred:", error);
            });

            promises.push(enemyPromise);
        });
        //return validCharacterUrls
        //console.log('promises length: ', promises.length)
        await Promise.all(promises).then(() => {
            //console.log('validCharacterUrls state: ',validCharacterUrls)
        }).catch((error) => {
            console.error("Error occurred:", error);
        });
        return validCharacterUrls
    }

    async function fetchCircusPlayerCharacters(){

        let enemyElements = document.querySelectorAll('section#own3 table tbody tr');
        let promises = [];
        let validCharacterUrls = [];
        let arrIndex = 0
        let playerCharacters = []

        let overViewLink = 'index.php?mod=overview&sh=' + sessionHash;
        let playerPromise = performRequest(overViewLink).then(responseText => {
            let dummyDiv = document.createElement('div');
            dummyDiv.innerHTML = responseText;
            let allCharacters = dummyDiv.querySelectorAll(' div.charmercsel[onclick]'); // all characters from single profile - cuz in loop
            for (let i = 0; i < allCharacters.length; i++) {
                let onClickRef = allCharacters[i].getAttribute('onclick');
                if (onClickRef.includes('&doll=1')) continue; // ignore arena character
                let onClickRefLeftAnchor = onClickRef.indexOf('index.php?');
                let onClickRefRightAnchor = onClickRef.length - 2;

                let validUrlAnchor = overViewLink.indexOf('index.php?')
                let validUrl = overViewLink.substring(0, validUrlAnchor) + onClickRef.substring(onClickRefLeftAnchor, onClickRefRightAnchor)
                //console.log('valid URL ?? :', validUrl)
                playerCharacters.push(validUrl);
            }
        }).catch(error => {
            console.error("Error occurred:", error);
        });
        promises.push(playerPromise);

        await Promise.all([Promise.resolve(playerPromise)]).then(() => {
            //console.log('validCharacterUrls state: ',validCharacterUrls)
        }).catch((error) => {
            console.error("Error occurred:", error);
        });
        return playerCharacters

    }

    async function delayFetch(millisec) {
        return new Promise(resolve => {
            setTimeout(() => { resolve('') }, millisec);
        })
    }


    async function checkCircusProvinciarium(_percentCap) {

        let percentCap = parseInt(_percentCap);
        let content = document.getElementById('cooldown_bar_text_ct').innerHTML;
        let circusLink = 'index.php?mod=arena&submod=serverArena&aType=3&sh=' + sessionHash;
        console.log('circus')

        if (content == 'To Circus Turma') {
            if (!location.href.includes('index.php?mod=arena&submod=serverArena&aType=3&sh=')) {
                location.href = circusLink;
            }
            let loopBugCheck = document.getElementById('errorText').innerHTML;
            if (loopBugCheck) {
                if (loopBugCheck.includes('can only challenge an opponent in the arena every')) {
                    console.log('bug detected');
                    location.href = circusLink;
                    return
                } else {
                    console.log('lil bro just fought, reroll enemies');
                    document.querySelector('input.button1[name="actionButton"]').click();
                }
            }


            let validEnemyCharacterUrls = await fetchCircusEnemyCharacters();
            //console.log("validEnemyCharacterUrls: ", validEnemyCharacterUrls)
            let validPlayerCharacterUrls = await fetchCircusPlayerCharacters();
            //console.log("validPlayerCharacterUrls: ", validPlayerCharacterUrls)


            let playerCharactersStats = []
            let enemyCharactersStats = []


            //XD BEDIZE SIE DZIALO
            let enemyStats = [];
            let promises = [];

            validEnemyCharacterUrls.forEach(urlAndButton => {
                urlAndButton.forEach(hm => { // hm[0] = links array, hm[1] = buttons array
                    let statsBuffer = []
                    let index = 0;
                    hm[0].forEach(link => {
                        index++;
                       // console.log('link: ', link)

                        promises.push(
                            new Promise((resolve, reject) => {
                                setTimeout(() => { //timeout
                                    performRequest(link)
                                        .then(responseText => {
                                        let dummyDiv = document.createElement('div');
                                        dummyDiv.innerHTML = responseText;
                                        //console.log("text: \n\n\n", responseText);
                                        let scrappedEnemyCharacterStats = scrapStats(dummyDiv.getElementById('charstats'), 'enemy', 'circus');
                                        statsBuffer.push(scrappedEnemyCharacterStats);
                                        resolve();
                                    })
                                        .catch(error => {
                                        console.error("Error occurred:", error);
                                        reject();
                                    });
                                }, index * 300);
                            })
                        );


                    })
                    enemyCharactersStats.push([statsBuffer, hm[1]])
                })
            });


            validPlayerCharacterUrls.forEach(link => {
                //console.log('player: ', link)
                promises.push(
                    performRequest(link)
                    .then(responseText => {
                        let dummyDiv = document.createElement('div');
                        dummyDiv.innerHTML = responseText;
                        let scrappedPlayerCharacterStats = scrapStats(dummyDiv.getElementById('charstats'), 'user', 'circus');
                        playerCharactersStats.push(scrappedPlayerCharacterStats);
                    })
                    .catch(error => {
                        console.error("Error occurred:", error);
                    })
                );
            })


            await Promise.all(promises)
                .then(() => {
                //console.log('enemyCharactersStats :', enemyCharactersStats)
                //console.log('playerCharactersStats :', playerCharactersStats)
                // Calculate enemy strengths and perform further actions

                //player info
                let playerMedic = playerCharactersStats[0]//assuming people usually play with 1 medic
                let highestHealingValue = playerCharactersStats[0].healing

                let playerTank = playerCharactersStats[0]//same here
                let highestThreatValue = playerCharactersStats[0].threat

                playerCharactersStats.forEach(character => {
                    if (character.healing > highestHealingValue){
                        highestHealingValue = character.healing
                        playerMedic = character
                    }
                    if (character.threat > highestThreatValue){
                        highestThreatValue = character.threat
                        playerTank = character
                    }
                })

                //console.log('playerMedic: ', playerMedic)
                //console.log('playerTank: ', playerTank)

                let playerAttackers = playerCharactersStats.filter(obj => !isEqual(obj, playerMedic)); //characters that are not medic nor tank
                playerAttackers = playerAttackers.filter(obj => !isEqual(obj, playerTank));
                //console.log(playerAttackers)


                let strengthArray = []
                let powerArray = []
                enemyCharactersStats.forEach(charactersAndButton => { //charactersAndButton[0] = characters array, charactersAndButton[1] = fight button
                    let enemyMedic = charactersAndButton[0][0]//assuming people usually play with 1 medic
                    let highestEnemyHealingValue = charactersAndButton[0][0].healing
                    let enemyTank = charactersAndButton[0][0]//same here
                    let highestEnemyThreatValue = charactersAndButton[0][0].threat

                    charactersAndButton[0].forEach(character => {
                        if (character.healing > highestEnemyHealingValue){
                            highestEnemyHealingValue = character.healing
                            enemyMedic = character
                        }
                        if (character.threat > highestEnemyThreatValue){
                            highestEnemyThreatValue = character.threat
                            enemyTank = character
                        }
                    })
                    let enemyAttackers = charactersAndButton[0].filter(obj => !isEqual(obj, enemyMedic)); //characters that are not medic nor tank
                    enemyAttackers = enemyAttackers.filter(obj => !isEqual(obj, enemyTank));
                    //console.log('enemyMedic: ',enemyMedic)
                    //console.log('enemyTank: ',enemyTank)
                    //console.log('enemy dps: ',enemyAttackers)
                    //console.log('next enemy')

                    let playerStrength = 0
                    playerAttackers.forEach(character => {
                        playerStrength += calculateStrength(character, enemyTank)
                    })
                    let attackerStrength = 0
                    enemyAttackers.forEach(character => {
                        attackerStrength += calculateStrength(character, playerTank)
                    })
                    //if someone wants here is a good place to take into consideration medic healing, i dont want to do that :D
                    //nvm ill add something i came up with :D :D:D:D:D:D
                    let healDifference = (playerMedic.healing - enemyMedic.healing) / 10 // idk how much to divide by !!! IMPORTANT TO CHECK IF IT FIRST AND CORRECT
                    powerArray.push([playerStrength + healDifference, attackerStrength - healDifference, charactersAndButton[1]])

                    //strengthArray.push([playerStrength, attackerStrength, charactersAndButton[1]])

                })

                let weakerEnemies = []

                powerArray.forEach(powerData => { //[0] = my power, [1] = enemy power, [2] = attack button
                    let powerAmount = powerData[0] - powerData[1] - powerData[0] * (percentCap / 10)
                    if((powerAmount > 0)){
                        weakerEnemies.push([powerData[2], powerAmount])
                    }
                })
                console.log('powerArray: ', powerArray)

                if(weakerEnemies.length == 0){
                    console.log('no valid enemies to fight, rerolling')
                    document.querySelector('input.button1[name="actionButton"]').click()
                    return
                }
                let weakestEnemy = weakerEnemies[0]
                weakerEnemies.forEach(enemy => {
                    if (enemy[1] > weakestEnemy[1]){
                        weakestEnemy = enemy
                    }
                })
                console.log('weakerEnemies: ', weakerEnemies)
                console.log('weakestEnemy: ', weakestEnemy)
                weakestEnemy[0].click()
                return


            })
                .catch(error => {
                console.error("Error occurred.");
            });

        }
    }
















    async function checkArenaProvinciarium(_percentCap, arenahp){
        //var arenahp = parseInt(_arenahp);
        console.log('arena');
        let currentHpPercentage = parseInt(document.getElementById('header_values_hp_percent').innerHTML);
        //console.log('current and cap hp: ', currentHpPercentage , ' < ', arenahp, ' = ', currentHpPercentage < arenahp)
        if (currentHpPercentage < arenahp) return;
        let percentCap = parseInt(_percentCap) // percent of power difference fro menemy (1 = 10%, 2 = 20% etc)
        let content = document.getElementById('cooldown_bar_text_arena').innerHTML;
        let arenaLink = 'index.php?mod=arena&submod=serverArena&aType=2&sh=' + sessionHash;

        if(content == 'Go to the arena'){
            if (!location.href.includes('index.php?mod=arena&submod=serverArena&aType=2&sh=')) {
                location.href = arenaLink;
            }
            let loopBugCheck = document.getElementById('errorText').innerHTML
            if(loopBugCheck.includes('can only challenge an opponent in the arena every')){
                console.log('bug detected')
                location.href = arenaLink;
            }


            let enemyElements = document.querySelectorAll('section#own2 table tbody tr');
            let enemyStats = [];
            let promises = [];

            enemyElements.forEach(enemy => {
                let check = enemy.querySelector('td a[target="_blank"]')
                let enemyButtonFight = enemy.querySelector('td div.attack'); //.click()
                if (!check) return // checks for the first element which is column name

                promises.push(
                    performRequest(check.href)
                    .then(responseText => {
                        let dummyDiv = document.createElement('div');
                        dummyDiv.innerHTML = responseText;
                        let scrappedEnemyStats = scrapStats(dummyDiv.getElementById('charstats'), 'enemy', 'arena');
                        enemyStats.push([scrappedEnemyStats, enemyButtonFight]);
                    })
                    .catch(error => {
                        console.error("Error occurred:", error);
                    })
                );
            });

            let playerOverviewLink = '/game/index.php?mod=overview&doll=1&sh='+sessionHash;
            let userStats = []
            promises.push(
                performRequest(playerOverviewLink)
                .then(responseText => {
                    let dummyDiv = document.createElement('div');
                    dummyDiv.innerHTML = responseText;
                    let scrappedUserStats = scrapStats(dummyDiv.getElementById('charstats'), 'user', 'arena');
                    userStats.push(scrappedUserStats);
                })
                .catch(error => {
                    console.error("Error occurred:", error);
                })
            );




            console.log('promises length: ', promises.length)
            await Promise.all(promises)
                .then(() => {
                //console.log(enemyStats);
                let powerArray = []
                //console.log(userStats[0])
                console.log('promise');

                enemyStats.forEach(enemy => {
                    //console.log(enemy)//[0] - stats, [1] .click() fight event
                    console.log('enemyPromise')
                    powerArray.push( [enemy[0], enemy[1], calculateStrength( userStats[0], enemy[0] ), calculateStrength( enemy[0], userStats[0] )])//idx 2&3 = myStr&enemyStr
                })

                console.log('enemy strengths: ', powerArray)

                let weakerEnemies = []

                powerArray.forEach(enemy => {
                    let powerAmount = enemy[2] - enemy[3] - enemy[2] * (percentCap / 10)
                    if((powerAmount > 0)){
                        weakerEnemies.push([enemy[1], powerAmount])
                    }
                })
                console.log('enemy strengths: ',powerArray)

                if(weakerEnemies.length == 0){
                    console.log('no valid enemies to fight, rerolling')
                    document.querySelector('input.button1[name="actionButton"]').click()
                    return
                }
                let weakestEnemy = weakerEnemies[0]
                weakerEnemies.forEach(enemy => {
                    if (enemy[1] > weakestEnemy[1]){
                        weakestEnemy = enemy
                    }
                })
                console.log('weakerEnemies: ', weakerEnemies)
                console.log('weakestEnemy: ', weakestEnemy)
                weakestEnemy[0].click()
                return
            })
                .catch(error => {
                console.error("Error occurred:", error);
            });
        }

    }



    async function checkWork(_autoworktype){
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

    function stringToBool(string){
        if (string==='true' || string==='1') return true
        else return false
    }

    function checkQuests(_arenaon, _arenatimedon, _arenasuccessionon, _circuson, _circustimedon, _circussuccessionon, _combaton, _combattimedon,
                          _combatsuccessionon, _expeditionon, _expeditiontimedon, _expeditionsuccessionon, expeditionmap, expeditionenemy){

        let arenaon = stringToBool(_arenaon)
        let arenatimedon = stringToBool(_arenatimedon)
        let arenasuccessionon = stringToBool(_arenasuccessionon)

        let circuson = stringToBool(_circuson)
        let circustimedon = stringToBool(_circustimedon)
        let circussuccessionon = stringToBool(_circussuccessionon)

        let combaton = stringToBool(_combaton)
        let combattimedon = stringToBool(_combattimedon)
        let combatsuccessionon = stringToBool(_combatsuccessionon)

        let expeditionon = stringToBool(_expeditionon)
        let expeditiontimedon = stringToBool(_expeditiontimedon)
        let expeditionsuccessionon = stringToBool(_expeditionsuccessionon)

        /*
        console.log('arenaon :',arenaon)
        console.log('arenatimedon :',arenatimedon)
        console.log('arenasuccessionon :',arenasuccessionon)

        console.log('circuson :',circuson)
        console.log('circustimedon :',circustimedon)
        console.log('circussuccessionon :',circussuccessionon)

        console.log('combaton :',combaton)
        console.log('combattimedon :',combattimedon)
        console.log('combatsuccessionon :',combatsuccessionon)

        console.log('expeditionon :',expeditionon)
        console.log('expeditiontimedon :',expeditiontimedon)
        console.log('expeditionsuccessionon :',expeditionsuccessionon)
        */

        console.log("QUESTS")
        //console.log('looking for: ', expeditionenemy, ' in ', expeditionmap)
        let randomNumber = Math.random() * (100 - 0) + 0; //additional refresh cuz quests dont refresha s often as they should
        if (randomNumber < 10){ //15% for refresh per loop (loop itself has couple seconds of delay)
            location.reload();
        }

        let rerollQuestsButton = document.querySelector('input[type="button"][value="New quests"]');
        let completedQuests = document.querySelectorAll('div#qcategory_finished div.contentboard_slot.contentboard_slot_active a.quest_slot_button_finish')
        let failedQuests = document.querySelectorAll('div#qcategory_restart div.contentboard_slot.contentboard_slot_active a.quest_slot_button_restart') //restart all

        let arenaQuests = document.querySelectorAll('div#qcategory_arena div.contentboard_slot.contentboard_slot_inactive');

        let circusQuests = document.querySelectorAll('div#qcategory_grouparena div.contentboard_slot.contentboard_slot_inactive');
        let combatQuests = document.querySelectorAll('div#qcategory_combat div.contentboard_slot.contentboard_slot_inactive');
        let expeditionQuests = document.querySelectorAll('div#qcategory_expedition div.contentboard_slot.contentboard_slot_inactive');
        let validQuests = 0;

        //let itemQuests = document.querySelectorAll('div#qcategory_items div.contentboard_slot.contentboard_slot_inactive')
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


        if (circuson){
            circusQuests.forEach(quest => {
                if (quest.querySelector('.quest_slot_time') && !circustimedon){ //if quest is timed and user specifies he doesnt want it
                    //console.log('TIMED YUCK')
                    return
                }
                let questText = quest.children[1].innerHTML;
                if (!questText.includes('succession')){
                    console.log('valid: ', questText)
                    validQuests += 1
                }
                else if (questText.includes('succession') && circussuccessionon){
                    console.log('valid: ', questText)
                    validQuests += 1
                }
                else {
                    //console.log('NIE AKCEPTUJ: ', questText)
                }
            })
        }
        if (arenaon){
            arenaQuests.forEach(quest =>{
                if (quest.querySelector('.quest_slot_time') && !arenatimedon){
                    //console.log('czasowka')
                    return
                }
                let questText = quest.children[1].innerHTML;
                if (!questText.includes('succession')){
                    console.log('valid: ',questText)
                    validQuests += 1
                }
                else if (questText.includes('succession') && arenasuccessionon){
                    console.log('valid: ',questText)
                    validQuests += 1
                }
                else {
                    return
                }
            })
        }
        if (combaton){
            combatQuests.forEach(quest => {
                if (quest.querySelector('.quest_slot_time') && !combattimedon){ //if quest is timed and user specifies he doesnt want it
                    //console.log('TIMED YUCK')
                    return
                }
                let questText = quest.children[1].innerHTML;
                if (!questText.includes('succession')){
                    console.log('valid: ',questText)
                    validQuests += 1
                }
                else if (questText.includes('succession') && combatsuccessionon){
                    console.log('valid: ',questText)
                    validQuests += 1
                }
                else {
                    return
                }
            })
        }
        if (expeditionon){
            expeditionQuests.forEach(quest => {
                if (quest.querySelector('.quest_slot_time') && !expeditiontimedon){ //if quest is timed and user specifies he doesnt want it
                    //console.log('TIMED YUCK')
                    return
                }
                let questText = quest.children[1].innerHTML;
                if (!questText.includes('succession')){
                    if (questText.toLowerCase().includes(expeditionenemy.toLowerCase())){
                        console.log('valid: ',questText)
                        validQuests += 1
                    }
                    if (questText.includes('opponents of your choice') && questText.toLowerCase().includes(expeditionmap.toLowerCase())){
                        console.log('valid: ',questText)
                        validQuests += 1
                    }
                }
                else if (questText.includes('succession') && expeditionsuccessionon){
                    if (questText.toLowerCase().includes(expeditionenemy.toLowerCase())){
                        console.log('valid: ',questText)
                        validQuests += 1
                    }
                    if (questText.includes('opponents of your choice') && questText.toLowerCase().includes(expeditionmap)){
                        console.log('valid: ',questText)
                        validQuests += 1
                    }
                }
                else {
                    return
                }
            })
        }


        let activeQuests = document.querySelectorAll('div.contentboard_start div div.contentboard_slot_active');
        console.log('valid quests to take: ',validQuests )
        if (validQuests == 0){ //done like a retard but idc :D:D:D:D:D
            rerollQuestsButton.click()
            console.log("no quests to take, reroll")
        }
        //console.log('number of active quests: ', activeQuests.length)

        let isQuestCooldown = document.getElementById('quest_header_cooldown')
        if (isQuestCooldown || (activeQuests.length == 5)){
            console.log('cooldown/max quests')
            return
        }


        if (circuson){
            circusQuests.forEach(quest => {
                if (quest.querySelector('.quest_slot_time') && !circustimedon){ //if quest is timed and user specifies he doesnt want it
                    //console.log('TIMED YUCK')
                    return
                }
                let questText = quest.children[1].innerHTML;
                if (!questText.includes('succession')){
                    //console.log('AKCEPTUJ: ', questText)
                    quest.children[3].click()
                }
                else if (questText.includes('succession') && circussuccessionon){
                    //console.log('[S]AKCEPTUJ: ', questText)
                    quest.children[3].click()
                }
                else {
                    //console.log('NIE AKCEPTUJ: ', questText)
                }
            })
        }
        if (arenaon){
            arenaQuests.forEach(quest => {
                if (quest.querySelector('.quest_slot_time') && !arenatimedon){ //if quest is timed and user specifies he doesnt want it
                    //console.log('TIMED YUCK')
                    return
                }
                let questText = quest.children[1].innerHTML;
                if (!questText.includes('succession')){
                    //console.log('AKCEPTUJ: ', quest)
                    quest.children[3].click()
                }
                else if (questText.includes('succession') && arenasuccessionon){
                    //console.log('[S]AKCEPTUJ: ', quest)
                    quest.children[3].click()
                }
                else {
                    //console.log('NIE AKCEPTUJ: ', questText)
                }
            })
        }
        if (combaton){
            combatQuests.forEach(quest => {
                if (quest.querySelector('.quest_slot_time') && !combattimedon){ //if quest is timed and user specifies he doesnt want it
                    //console.log('TIMED YUCK')
                    return
                }
                let questText = quest.children[1].innerHTML;
                if (!questText.includes('succession')){
                    //console.log('AKCEPTUJ: ', questText)
                    quest.children[3].click()
                }
                else if (questText.includes('succession') && combatsuccessionon){
                    //console.log('[S]AKCEPTUJ: ', questText)
                    quest.children[3].click()
                    //console.log(quest)
                }
                else {
                    //console.log('NIE AKCEPTUJ: ', questText)
                }
            })
        }


        if (expeditionon){
            expeditionQuests.forEach(quest => {
                if (quest.querySelector('.quest_slot_time') && !expeditiontimedon){ //if quest is timed and user specifies he doesnt want it
                    //console.log('TIMED YUCK')
                    return
                }
                let questText = quest.children[1].innerHTML;
                if (!questText.includes('succession')){
                    if (questText.toLowerCase().includes(expeditionenemy.toLowerCase())){
                        quest.children[3].click()
                    }
                    if (questText.includes('opponents of your choice') && questText.toLowerCase().includes(expeditionmap.toLowerCase())){
                        quest.children[3].click()
                    }
                }
                else if (questText.includes('succession') && expeditionsuccessionon){
                    if (questText.toLowerCase().includes(expeditionenemy.toLowerCase())){
                        quest.children[3].click()
                    }
                    if (questText.includes('opponents of your choice') && questText.toLowerCase().includes(expeditionmap.toLowerCase())){
                        quest.children[3].click()
                    }
                }
                else {
                    return
                }
            })
        }
    }

    function checkNotification(){//like you lvled up or daily reward
        let notificationCancelButton = document.querySelector('td#buttonrightnotification')
        if(notificationCancelButton){
            if (notificationCancelButton.getAttribute('style')){
                document.querySelector('td#buttonrightnotification input').click()
            }
        }
        let collectBonusButton = document.getElementById('blackoutDialogLoginBonus')
        if (collectBonusButton){
            if (collectBonusButton.getAttribute('style').includes('display: block')){
                document.querySelector('div.loginbonus_buttons input[value="Collect Bonus"]').click()
            }
        }

    }




    async function eventChecker() {
        checkNotification();
        if (boton) {
            if (!location.href.includes('index.php?mod=quests')) {
                if (autoexpeditionok) await checkExpedition(selectexpeditionmap.value, selectexpeditiontarget.value, expeditionhp.value);
                if (autodungeonok) await checkDungeon(selectdungeonmap.value, advanced.value, skipboss.value, fulldungclear.value);
                if (autocircusprovinciariumok) await checkCircusProvinciarium(selectcircusprovinciariummode.value);
                if (autoarenaprovinciariumok) await checkArenaProvinciarium(selectarenaprovinciariummode.value, arenahp.value);
                if (autoworkok) await checkWork(autoworktype.value);
            }

            if (location.href.includes('index.php?mod=quests')) {
                if (autoquestok) {
                    checkQuests(arenaqueston.getAttribute('value'), arenaquesttimedon.value, arenaquestsuccessionon.value,
                                circusqueston.getAttribute('value'), circusquesttimedon.value, circusquestsuccessionon.value,
                                combatqueston.getAttribute('value'), combatquesttimedon.value, combatquestsuccessionon.value,
                                expeditionqueston.getAttribute('value'), expeditionquesttimedon.value, expeditionquestsuccessionon.value,
                                expeditionquestmap.value, expeditionquestenemy.value);
                }
            }
        }
    }

    async function loop() {
        let rand = Math.round(Math.random() * (5000 - 1500)) + 1500;
        await new Promise((resolve) => {
            setTimeout(() => {
                eventChecker();
                resolve();
            }, rand);
        });
        loop();
    }

    let refreshPageCounter = 0
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
