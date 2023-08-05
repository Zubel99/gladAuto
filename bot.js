// ==UserScript==
// @name         Gladiatusik
// @namespace    http://tampermonkey.net/
// @version      1.3.3.7
// @description  Better than p2w bobs
// @author       You
// @include      *s*-*.gladiatus.gameforge.com/game/index.php?*
// @icon         https://lens-storage.storage.googleapis.com/png/0bee43cb65064cfb9707760f648e737b
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    let urlWithHash = document.querySelector('div#mainmenu a.menuitem[title="Overview"]').href;
    let hashIndex = urlWithHash.indexOf('&sh=');
    let sessionHash = urlWithHash.substring(hashIndex+4)
    console.log('current hash: ', sessionHash)
    let serverNumber = (window.location.href.substring(0,16)).replace(/\D/g, '')
    console.log('serverNumber: ', serverNumber)
    let currentDate = Date.now()


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

    let quickSellButton = document.createElement('button')
    let quickGetPackages = document.createElement('button')
    if (location.href.includes('mod=inventory')){
        quickSellButton.innerText = 'Quick sell'
        quickSellButton.classList.add('awesome-button')
        quickSellButton.style = 'width: 50px; height: 30px; position: absolute; left: 125px; top: 230px'
        quickSellButton.addEventListener('click', sellTabItems)

        let inventoryMenu = document.querySelector('div.inventoryBox')
        inventoryMenu.appendChild(quickSellButton)
    }
    else if (location.href.includes('mod=packages')){
        quickGetPackages.innerText = 'Get packages'
        quickGetPackages.classList.add('awesome-button')
        quickGetPackages.style = 'width: 65px; height: 30px; position: absolute; left:320px; top: 523px'
        quickGetPackages.addEventListener('click', getPackages)

        //let packageMenu = document.querySelector('div.pagination')
        let packageMenu = document.querySelector('div#content')
        packageMenu.appendChild(quickGetPackages)
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
    let autoMarketOk = localStorage.getItem('_autoMarketOk') === 'true';
    let autoHealOk = localStorage.getItem('_autoHealOk') === 'true'


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
    let marketSliderOk = localStorage.getItem('_marketSliderOk') === 'true';
    let autoHealSliderOk = localStorage.getItem('_autoHealSlider') === 'true'
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


    //let targetWidth = document.querySelector('a.menuitem[target="_self"]').clientWidth*0.1;
    //let targetHeight = document.querySelector('a.menuitem[target="_self"]').clientHeight*0.65;
    function createMenuItemSlider(id){
        let isOnByDefault = localStorage.getItem('_' + id + 'Ok') === 'true';
        let arrowImg = document.createElement('img')
        if (isOnByDefault) arrowImg.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')
        else arrowImg.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        arrowImg.setAttribute('width', '18px');
        arrowImg.setAttribute('height', '18px');//18px
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


    // ********************************************************************************************** BotOn EXPEDITION
    let expeditionboton=document.createElement('a');
    let selectexpeditionmap=document.createElement('select');
    let selectexpeditiontarget=document.createElement('select');
    expeditionboton.classList.add('menuitem');
    expeditionboton.style = "cursor: pointer; margin-bottom: 5px";

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
    expdatalabel.innerHTML="Not attack hp < " + (localStorage.getItem('_expeditionhp') || 50) +"%";
    expdatalabel.id="expdatalabel";
    let expeditionSlider = createMenuItemSlider('expeditionSlider')
    if (expeditionSliderOk){
        selectexpeditionmap.setAttribute("style","display:block;margin-left:10px;");
        selectexpeditiontarget.setAttribute("style","display:block;margin-left:10px;");
        expeditionhp.setAttribute("style","display:block;margin-left:10px; margin-bottom: 12px");
        expdatalabel.setAttribute("style","display:block;margin-left:10px;color:yellow;");
    }else{
        selectexpeditionmap.setAttribute("style","display:none;margin-left:10px;");
        selectexpeditiontarget.setAttribute("style","display:none;margin-left:10px;");
        expeditionhp.setAttribute("style","display:none;margin-left:10px; margin-bottom: 12px");
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
        expdatalabel.innerHTML="Not attack hp < "+expeditionhp.value+"%";
        localStorage.setItem('_expeditionhp', expeditionhp.value);
    });
    selectexpeditionmap.addEventListener("change", function(){
        localStorage.setItem('_selectedexpeditionmap', selectexpeditionmap.value);
    })
    selectexpeditiontarget.addEventListener("change", function(){
        localStorage.setItem('_selectedexpeditiontarget', selectexpeditiontarget.value);
    })
    function handleExpeditionSlider(){
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
    }
    expeditionSlider.addEventListener('click', handleExpeditionSlider)
    expeditionSlider.addEventListener('touchend', handleExpeditionSlider) //for mobile


    // ********************************************************************************************** BotOn DUNGEON
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
    dungeonboton.style = "cursor: pointer; margin-bottom: 5px";
    let dungeonSlider = createMenuItemSlider('dungeonSlider')
    if (dungeonSliderOk){
        selectdungeonmap.setAttribute("style","display:block;margin-left:10px;");
        advanced.setAttribute("style","display:block;margin-left:10px;");
        skipboss.setAttribute("style","display:block;margin-left:10px;");
        fulldungclear.setAttribute("style","display:block;margin-left:10px; margin-bottom: 12px");
    }else{
        selectdungeonmap.setAttribute("style","display:none;margin-left:10px;");
        advanced.setAttribute("style","display:none;margin-left:10px;");
        skipboss.setAttribute("style","display:none;margin-left:10px;");
        fulldungclear.setAttribute("style","display:none;margin-left:10px; margin-bottom: 12px");
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
    function handleDungeonSlider(){
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
    }
    dungeonSlider.addEventListener('click', handleDungeonSlider)
    dungeonSlider.addEventListener('touchend', handleDungeonSlider) //for mobile


    // ********************************************************************************************** BotOn CIRCUS PROV
    let circusprovinciariumboton=document.createElement('a');//turmaboton
    let selectcircusprovinciariummode=document.createElement('select');//selectturmatarget
    circusprovinciariumboton.classList.add('menuitem');
    circusprovinciariumboton.style = "cursor: pointer; margin-bottom: 5px";
    //circusprovinciariumboton.href="#";
    let circusSlider = createMenuItemSlider('circusSlider')
    if (circusSliderOk){
        selectcircusprovinciariummode.setAttribute("style","display:block;margin-left:10px; margin-bottom: 12px");
    }else{
        selectcircusprovinciariummode.setAttribute("style","display:none;margin-left:10px; margin-bottom: 12px");
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
    selectcircusprovinciariummode.value=localStorage.getItem('_selectcircusprovinciariummode') || 1;

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
    function handleCircusSlider(){
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
    }
    circusSlider.addEventListener('click', handleCircusSlider)
    circusSlider.addEventListener('touchend', handleCircusSlider) //for mobile



    // ********************************************************************************************** BotOn ARENA PROV
    let arenaprovinciariumboton=document.createElement('a');//turmaboton
    let selectarenaprovinciariummode=document.createElement('select');//selectturmatarget
    arenaprovinciariumboton.classList.add('menuitem');
    arenaprovinciariumboton.style = "cursor: pointer; margin-bottom: 5px";
    //arenaprovinciariumboton.href="#";
    let arenahp=document.createElement('input');
    arenahp.setAttribute("type","range");
    arenahp.value=localStorage.getItem('_arenahp') || 50;
    arenahp.setAttribute("list","arenadatalist");
    arenahp.id="arenahp";

    let arenaMaxEnemyAttacksLabel = document.createElement('span');
    arenaMaxEnemyAttacksLabel.innerHTML='Max enemy attacks in 24h'

    let arenaMaxEnemyAttacks=document.createElement('select');
    arenaMaxEnemyAttacks.innerHTML = '<option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option><option value="4">5</option>';
    arenaMaxEnemyAttacks.id="arenaMaxEnemyAttacks";
    arenaMaxEnemyAttacks.value=localStorage.getItem('_arenaMaxEnemyAttacks') || 4;

    let arenadatalist=document.createElement('datalist');
    arenadatalist.id="arenadatalist";
    arenadatalist.innerHTML='<option value="5"></option><option value="10"></option><option value="15"></option><option value="20"></option><option value="25"></option><option value="30"></option><option value="35"></option><option value="40"></option><option value="45"></option><option value="50"></option><option value="55"></option><option value="60"></option><option value="65"></option><option value="70"></option><option value="75"></option><option value="80"></option><option value="85"></option><option value="90"></option><option value="95"></option><option value="100"></option>';
    let arenadatalabel=document.createElement('span');
    arenadatalabel.innerHTML="Not attack hp < " + (localStorage.getItem('_arenahp') || 50) +"%";
    arenadatalabel.id="arenadatalabel";

    let arenaSlider = createMenuItemSlider('arenaSlider')
    if (arenaSliderOk){
        selectarenaprovinciariummode.setAttribute("style","display:block;margin-left:10px;");
        arenahp.setAttribute("style","display:block;margin-left:10px; margin-bottom: 12px");
        arenadatalabel.setAttribute("style","display:block;margin-left:10px;color:yellow;");
        arenaMaxEnemyAttacksLabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        arenaMaxEnemyAttacks.setAttribute("style","display:block;margin-left:10px;");
    }else{
        selectarenaprovinciariummode.setAttribute("style","display:none;margin-left:10px;");
        arenahp.setAttribute("style","display:none;margin-left:10px; margin-bottom: 12px");
        arenadatalabel.setAttribute("style","display:none;margin-left:10px;color:yellow;");
        arenaMaxEnemyAttacksLabel.setAttribute("style","display:none;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        arenaMaxEnemyAttacks.setAttribute("style","display:none;margin-left:10px;");
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
        arenadatalabel.innerHTML="Not attack hp < "+arenahp.value+"%";
        localStorage.setItem('_arenahp', arenahp.value);
    });
    arenaMaxEnemyAttacks.addEventListener("change", function(){
        localStorage.setItem('_arenaMaxEnemyAttacks', arenaMaxEnemyAttacks.value);
    })
    function handleArenaSlider(){
        let selectarenaprovinciariummode=document.querySelector('#selectarenaprovinciariummode');
        let arenadatalabel=document.querySelector('#arenadatalabel');
        let arenahp=document.querySelector('#arenahp');
        if (arenaSliderOk==true){
            arenaSliderOk = false;
            selectarenaprovinciariummode.style.display="none";
            arenadatalabel.style.display="none";
            arenahp.style.display="none";
            arenaMaxEnemyAttacksLabel.style.display="none";
            arenaMaxEnemyAttacks.style.display="none";
            arenaSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        }else{
            arenaSliderOk = true;
            selectarenaprovinciariummode.style.display="block";
            arenadatalabel.style.display="block";
            arenahp.style.display="block";
            arenaMaxEnemyAttacksLabel.style.display="block";
            arenaMaxEnemyAttacks.style.display="block";
            arenaSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')

        }
        localStorage.setItem('_arenaSliderOk', arenaSliderOk);
    }
    arenaSlider.addEventListener('click', handleArenaSlider)
    arenaSlider.addEventListener('touchend', handleArenaSlider) //for mobile


    // ********************************************************************************************** BotOn QUESTS
    let autoquestboton=document.createElement('a');
    autoquestboton.classList.add('menuitem');
    autoquestboton.style = "cursor: pointer; margin-bottom: 5px";

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
        expeditionquestenemy.setAttribute("style","display:block;margin-left:10px;max-width: 130px; margin-bottom: 12px");
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
        expeditionquestenemy.setAttribute("style","display:none;margin-left:10px;max-width: 130px; margin-bottom: 12px");
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
    }

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
    function handleQuestSlider(){
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
    }
    questSlider.addEventListener('click', handleQuestSlider)
    questSlider.addEventListener('touchend', handleQuestSlider) //for mobile



    // ********************************************************************************************** BotOn MARKET

    let autoMarketBotOn=document.createElement('a');
    autoMarketBotOn.classList.add('menuitem');
    autoMarketBotOn.style = "cursor: pointer; margin-bottom: 5px";

    let marketType=document.createElement('select');
    marketType.id="marketType";
    marketType.innerHTML='<option value="0" selected>Gladiator</option><option value="1">Mercenary</option>';
    marketType.value=localStorage.getItem('_marketType') || 0;
    marketType.setAttribute("style","display:block;margin-left:10px;");

    let marketMinValueLabel = document.createElement('span');
    marketMinValueLabel.innerHTML='Minimum item value'
    let marketMinValue=document.createElement('input');
    marketMinValue.id="marketMinValue";
    marketMinValue.value= localStorage.getItem('_marketMinValue') || 10000;

    let marketIntervalLabel = document.createElement('span');
    marketIntervalLabel.innerHTML='Market interval(min)'
    let marketInterval=document.createElement('input');
    marketInterval.id="marketInterval";
    marketInterval.value= localStorage.getItem('_marketInterval') || 7;

    let marketSlider = createMenuItemSlider('marketSlider')

    if (marketSliderOk){
        marketType.setAttribute("style","display:block;margin-left:10px;max-width: 130px;");
        marketIntervalLabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        marketInterval.setAttribute("style","display:block;margin-left:10px;max-width: 130px; margin-bottom: 12px");
        marketMinValueLabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        marketMinValue.setAttribute("style","display:block;margin-left:10px;max-width: 130px");
    }else{
        marketType.setAttribute("style","display:none;margin-left:10px;max-width: 130px");
        marketIntervalLabel.setAttribute("style","display:none;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        marketInterval.setAttribute("style","display:none;margin-left:10px;max-width: 130px; margin-bottom: 12px");
        marketMinValueLabel.setAttribute("style","display:none;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        marketMinValue.setAttribute("style","display:none;margin-left:10px;max-width: 130px");
    }

    if (autoMarketOk==true){
        autoMarketBotOn.innerHTML="MARKET ON";
        autoMarketBotOn.style.textShadow = botOptionOn;
    }else{
        autoMarketBotOn.innerHTML="MARKET OFF";
        autoMarketBotOn.style.textShadow = botOptionOff;
    }



    autoMarketBotOn.addEventListener('click', function(){ //main quests button
        if (autoMarketOk==true){
            autoMarketOk=false;
            autoMarketBotOn.innerHTML="MARKET OFF";
            autoMarketBotOn.style.textShadow = botOptionOff;
        }else{
            autoMarketOk=true;
            autoMarketBotOn.innerHTML="MARKET ON";
            autoMarketBotOn.style.textShadow = botOptionOn;
        }
        localStorage.setItem('_autoMarketOk', autoMarketOk);
    })

    marketMinValue.addEventListener('change', function(){
        localStorage.setItem('_marketMinValue', marketMinValue.value);
    })

    marketInterval.addEventListener('change', function(){
        localStorage.setItem('_marketInterval', marketInterval.value);
    })

    marketType.addEventListener('change', function(){
        localStorage.setItem('_marketType', marketType.value);
    })

    function handleMarketSlider(){
        if (marketSliderOk==true){
            marketSliderOk = false;
            marketType.style.display = 'none'
            marketMinValueLabel.style.display = 'none'
            marketMinValue.style.display = 'none'
            marketIntervalLabel.style.display = 'none'
            marketInterval.style.display = 'none'


            marketSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        }else{
            marketSliderOk = true;
            marketType.style.display = 'block'
            marketMinValueLabel.style.display = 'block'
            marketMinValue.style.display = 'block'
            marketIntervalLabel.style.display = 'block'
            marketInterval.style.display = 'block'


            marketSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')
        }
        localStorage.setItem('_marketSliderOk', marketSliderOk);
    }
    marketSlider.addEventListener('click', handleMarketSlider)
    marketSlider.addEventListener('touchend', handleMarketSlider) //for mobile



    // ********************************************************************************************** BotOn AUTOHEAL

    let autoHealBotOn=document.createElement('a');
    autoHealBotOn.classList.add('menuitem');
    autoHealBotOn.style = "cursor: pointer; margin-bottom: 5px";

    let autoHealBelowLabel=document.createElement('span');
    autoHealBelowLabel.innerHTML="Heal below < " + (localStorage.getItem('_autoHealBelowHpPerc') || 50) +"%";
    autoHealBelowLabel.id="autoHealBelowLabel";
    let autoHealBelowData=document.createElement('datalist');
    autoHealBelowData.id="autoHealBelowData";
    autoHealBelowData.innerHTML='<option value="5"></option><option value="10"></option><option value="15"></option><option value="20"></option><option value="25"></option><option value="30"></option><option value="35"></option><option value="40"></option><option value="45"></option><option value="50"></option><option value="55"></option><option value="60"></option><option value="65"></option><option value="70"></option><option value="75"></option><option value="80"></option><option value="85"></option><option value="90"></option><option value="95"></option><option value="100"></option>';
    let autoHealBelowHpPerc=document.createElement('input');
    autoHealBelowHpPerc.setAttribute("type","range");
    autoHealBelowHpPerc.value=localStorage.getItem('_autoHealBelowHpPerc') || 50;
    autoHealBelowHpPerc.setAttribute("list","autoHealBelowData");
    autoHealBelowHpPerc.id="autoHealBelowHpPerc";

    let autoHealFoodValueLeniencyLabel=document.createElement('span');
    autoHealFoodValueLeniencyLabel.innerHTML="Food healing surplus < " + (localStorage.getItem('_autoHealFoodValueLeniencyPerc') || 30) +"%";
    autoHealFoodValueLeniencyLabel.id="autoHealFoodValueLeniencyLabel";
    let autoHealFoodValueLeniencyData=document.createElement('datalist');
    autoHealFoodValueLeniencyData.id="autoHealFoodValueLeniencyData";
    autoHealFoodValueLeniencyData.innerHTML='<option value="5"></option><option value="10"></option><option value="15"></option><option value="20"></option><option value="25"></option><option value="30"></option><option value="35"></option><option value="40"></option><option value="45"></option><option value="50"></option><option value="55"></option><option value="60"></option><option value="65"></option><option value="70"></option><option value="75"></option><option value="80"></option><option value="85"></option><option value="90"></option><option value="95"></option><option value="100"></option>';
    let autoHealFoodValueLeniencyPerc=document.createElement('input');
    autoHealFoodValueLeniencyPerc.setAttribute("type","range");
    autoHealFoodValueLeniencyPerc.value=localStorage.getItem('_autoHealFoodValueLeniencyPerc') || 30;
    autoHealFoodValueLeniencyPerc.setAttribute("list","autoHealFoodValueLeniencyData");
    autoHealFoodValueLeniencyPerc.id="autoHealFoodValueLeniencyPerc";

    let autoHealFoodTabLabel=document.createElement('span');
    autoHealFoodTabLabel.innerHTML="Food tab";
    autoHealFoodTabLabel.id="autoHealFoodTabLabel";
    let autoHealFoodTab=document.createElement('select');
    autoHealFoodTab.innerHTML='<option value="0" selected>I</option><option value="1">II</option><option value="2">III</option><option value="3" selected>IV</option><option value="4" selected>V</option><option value="5" selected>VI</option><option value="6" selected>VII</option><option value="7" selected>VIII</option>';
    autoHealFoodTab.id="autoHealFoodTab";
    autoHealFoodTab.value=localStorage.getItem('_autoHealFoodTab') || 0;

    let autoHealTimeoutLabel = document.createElement('span');
    autoHealTimeoutLabel.innerHTML='No food timeout(min)'
    let autoHealTimeout=document.createElement('input');
    autoHealTimeout.id="autoHealTimeout";
    autoHealTimeout.value= localStorage.getItem('_autoHealTimeout') || 10;

    let autoHealSlider = createMenuItemSlider('autoHealSlider')

    if (autoHealSliderOk){
        autoHealBelowLabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        autoHealBelowHpPerc.setAttribute("style","display:block;margin-left:10px;");
        autoHealFoodValueLeniencyLabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        autoHealFoodValueLeniencyPerc.setAttribute("style","display:block;margin-left:10px;");
        autoHealFoodTabLabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        autoHealFoodTab.setAttribute("style","display:block;margin-left:10px;");
        autoHealTimeoutLabel.setAttribute("style","display:block;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        autoHealTimeout.setAttribute("style","display:block;margin-left:10px;max-width: 130px; margin-bottom: 12px");
    }else{
        autoHealBelowLabel.setAttribute("style","display:none;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        autoHealBelowHpPerc.setAttribute("style","display:none;margin-left:10px;");
        autoHealFoodValueLeniencyLabel.setAttribute("style","display:none;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        autoHealFoodValueLeniencyPerc.setAttribute("style","display:none;margin-left:10px;");
        autoHealFoodTabLabel.setAttribute("style","display:none;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        autoHealFoodTab.setAttribute("style","display:none;margin-left:10px;");
        autoHealTimeoutLabel.setAttribute("style","display:none;margin-left:10px;max-width: 100px; color:yellow; white-space: nowrap;");
        autoHealTimeout.setAttribute("style","display:none;margin-left:10px;max-width: 130px; margin-bottom: 12px");
    }

    if (autoHealOk==true){
        autoHealBotOn.innerHTML="AUTOHEAL ON";
        autoHealBotOn.style.textShadow = botOptionOn;
    }else{
        autoHealBotOn.innerHTML="AUTOHEAL OFF";
        autoHealBotOn.style.textShadow = botOptionOff;
    }

    autoHealBotOn.addEventListener('click', function(){ //main quests button
        if (autoHealOk==true){
            autoHealOk=false;
            autoHealBotOn.innerHTML="AUTOHEAL OFF";
            autoHealBotOn.style.textShadow = botOptionOff;
        }else{
            autoHealOk=true;
            autoHealBotOn.innerHTML="AUTOHEAL ON";
            autoHealBotOn.style.textShadow = botOptionOn;
        }
        console.log('autoHealOk', autoHealOk)
        localStorage.setItem('_autoHealOk', autoHealOk);
    })
    function handleAutoHealSlider(){
        if (autoHealSliderOk==true){
            autoHealSliderOk = false;
            autoHealBelowLabel.style.display = 'none'
            autoHealBelowHpPerc.style.display = 'none'
            autoHealFoodValueLeniencyLabel.style.display = 'none'
            autoHealFoodValueLeniencyPerc.style.display = 'none'
            autoHealFoodTabLabel.style.display = 'none'
            autoHealFoodTab.style.display = 'none'
            autoHealTimeoutLabel.style.display = 'none'
            autoHealTimeout.style.display = 'none'

            autoHealSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/down-icon.png')
        }else{
            autoHealSliderOk = true;
            autoHealBelowLabel.style.display = 'block'
            autoHealBelowHpPerc.style.display = 'block'
            autoHealFoodValueLeniencyLabel.style.display = 'block'
            autoHealFoodValueLeniencyPerc.style.display = 'block'
            autoHealFoodTabLabel.style.display = 'block'
            autoHealFoodTab.style.display = 'block'
            autoHealTimeoutLabel.style.display = 'block'
            autoHealTimeout.style.display = 'block'

            autoHealSlider.setAttribute('src', 'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/up-icon.png')
        }
        console.log('autoHealSlider', autoHealSliderOk)
        localStorage.setItem('_autoHealSlider', autoHealSliderOk);
    }
    autoHealSlider.addEventListener('click', handleAutoHealSlider)
    autoHealSlider.addEventListener('touchend', handleAutoHealSlider) //for mobile

    autoHealBelowHpPerc.addEventListener("change",function(){
        autoHealBelowLabel.innerHTML="Heal below < "+autoHealBelowHpPerc.value+"%";
        localStorage.setItem('_autoHealBelowHpPerc', autoHealBelowHpPerc.value);
        console.log('autoHealBelowHpPerc.value',autoHealBelowHpPerc.value)
    });
    autoHealFoodValueLeniencyPerc.addEventListener("change",function(){
        autoHealFoodValueLeniencyLabel.innerHTML="Food healing surplus < "+autoHealFoodValueLeniencyPerc.value+"%";
        localStorage.setItem('_autoHealFoodValueLeniencyPerc', autoHealFoodValueLeniencyPerc.value);
        console.log('autoHealFoodValueLeniencyPerc.value',autoHealFoodValueLeniencyPerc.value)
    });
    autoHealFoodTab.addEventListener('change', function(){
        localStorage.setItem('_autoHealFoodTab', autoHealFoodTab.value);
        console.log('autoHealFoodTab.value', autoHealFoodTab.value)
    })
    autoHealTimeout.addEventListener('change', function(){
        localStorage.setItem('_autoHealTimeout', autoHealTimeout.value)
        console.log('autoHealTimeout.value', autoHealTimeout.value)
    })


    // ********************************************************************************************** BotOn WORK

    let autoworkboton=document.createElement('a');
    autoworkboton.classList.add('menuitem');
    autoworkboton.style = "cursor: pointer; margin-bottom: 5px";
    let autoworktype=document.createElement('select');
    autoworktype.id="autoworktype";
    autoworktype.innerHTML='<option value="0">Senator -3♦</div></option><option value="1">Jeweller -3♦</div></option><option value="2" selected>Stable boy</option><option value="3">Farmer</option><option value="4">Butcher</option><option value="5">Fisherman</option><option value="6">Baker</option><option value="7">Blacksmith</option><option value="8">Master blacksmith -3♦</option>';
    autoworktype.value= localStorage.getItem('_worktype') || 2

    let workSlider = createMenuItemSlider('workSlider')
    if (workSliderOk){
        autoworktype.setAttribute("style","display:block;margin-left:10px; margin-bottom: 12px");
    }else{
        autoworktype.setAttribute("style","display:none;margin-left:10px; margin-bottom: 12px");
    }
    if (autoworkok==true){
        autoworkboton.innerHTML="WORK ON";
        autoworkboton.style.textShadow = botOptionOn;
    }else{
        autoworkboton.innerHTML="WORK OFF";
        autoworkboton.style.textShadow = botOptionOff;
    }

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
    function handleWorkSlider(){
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
    }
    workSlider.addEventListener('click', handleWorkSlider)
    workSlider.addEventListener('touchend', handleWorkSlider) //for mobile


    // ********************************************************************************************** MENU BOT ON


    let menubotboton=document.createElement('a');
    menubotboton.classList.add('menuitem');
    menubotboton.classList.add('active');
    menubotboton.style = "cursor: pointer";

    if (boton){
        menubotboton.innerHTML="BOT ON";
        menubotboton.style.textShadow = botOptionOn;
    }else{
        menubotboton.innerHTML="BOT OFF";
        menubotboton.style.textShadow = botOptionOff;
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
    menubot.appendChild(arenaMaxEnemyAttacksLabel)
    menubot.appendChild(arenaMaxEnemyAttacks)
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

    menubot.appendChild(marketSlider);
    menubot.appendChild(autoMarketBotOn);
    menubot.appendChild(marketType);
    menubot.appendChild(marketMinValueLabel);
    menubot.appendChild(marketMinValue);
    menubot.appendChild(marketIntervalLabel);
    menubot.appendChild(marketInterval);

    menubot.appendChild(autoHealSlider);
    menubot.appendChild(autoHealBotOn);
    menubot.appendChild(autoHealBelowLabel);
    menubot.appendChild(autoHealBelowHpPerc);
    menubot.appendChild(autoHealBelowData);
    menubot.appendChild(autoHealFoodValueLeniencyLabel);
    menubot.appendChild(autoHealFoodValueLeniencyPerc);
    menubot.appendChild(autoHealFoodValueLeniencyData);
    menubot.appendChild(autoHealFoodTabLabel);
    menubot.appendChild(autoHealFoodTab);
    menubot.appendChild(autoHealTimeoutLabel);
    menubot.appendChild(autoHealTimeout);

    menubot.appendChild(workSlider); //slider
    menubot.appendChild(autoworkboton);
    menubot.appendChild(autoworktype);
    //menubot.appendChild(autoworktime);
    menubot.appendChild(menubotfooter);
    menujuego.appendChild(menubotboton);
    menujuego.appendChild(menubot);
    menubotboton=document.querySelector('#botboton');



   // FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS

    function changePageInfo(){
        document.getElementById("wrapper_game").style.fontWeight = "600";
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

    function checkExpedition(selectexpeditionmap, selectexpeditiontarget){
        location.href = expeditionLocations[selectexpeditionmap];
        document.getElementById('expedition_list').children[selectexpeditiontarget].children[1].children[0].click();
    }

    function checkExpeditionCondition(autoexpeditionok, expeditionhp){
        if (!autoexpeditionok) return 0
        console.log('expedition')
        let currentHpPercentage = parseInt(document.getElementById('header_values_hp_percent').innerHTML);
        //console.log('currentHpPercentage < expeditionhp: ', currentHpPercentage < expeditionhp)
        if (currentHpPercentage < expeditionhp) return 0;
        let content = document.getElementById('cooldown_bar_text_expedition').innerHTML;
        //console.log('content != "Go to expedition"', content != 'Go to expedition')
        if(content != 'Go to expedition') return 0
        return 1
    }


    function checkDungeon(_selectdungeonmap, _advanced, _skipboss, _fulldungclear){
        let selectdungeonmap = parseInt(_selectdungeonmap)
        let advanced = _advanced === 'true'
        let skipboss = _skipboss === 'true'
        let fulldungclear = _fulldungclear === 'true'

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
        console.log('compareObject: ', compareObject)
        let cancelBtn = document.querySelector('input.button1[value="Cancel dungeon"]')
        if (fulldungclear){
            if (skipboss && compareObject[closestEnemyIndex] == 'Boss'){
                console.log('CLICK1')
                cancelBtn.click()
            }
            else{
                closestEnemy.click();
            }
        }
        else{
            if (skipboss && compareObject[furthestEnemyIndex] == 'Boss'){
                console.log('CLICK2')
                cancelBtn.click()
            }
            else{
                furthestEnemy.click();
            }
        }
    }

    function checkDungeonCondition(autodungeonok){
        if (!autodungeonok) return 0
        console.log('dungeon');
        let content = document.getElementById('cooldown_bar_text_dungeon').innerHTML;
        if(content != 'Go to dungeon') return 0
        return 1
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

        let overViewLink = 'index.php?mod=overview&doll=1&sh=' + sessionHash;
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

        let circusLink = 'index.php?mod=arena&submod=serverArena&aType=3&sh=' + sessionHash;

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

        let enemyStats = [];
        let promises = [];

        validEnemyCharacterUrls.forEach(urlAndButton => {
            urlAndButton.forEach(hm => { // hm[0] = links array, hm[1] = buttons array
                let statsBuffer = []
                let index = 0;
                hm[0].forEach(link => {
                    index++;
                    // console.log('link: ', link)

                    let randDelay = Math.round(Math.random() * (200 - 50)) + 50;
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
                                    console.log('FETCH: ', index)
                                    resolve();
                                })
                                    .catch(error => {
                                    console.error("Error occurred:", error);
                                    reject();
                                });
                            }, (index * 300) + randDelay);
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
            //localStorage.setItem('_enemyCharactersStatsCircus', JSON.stringify(enemyCharactersStats))
            //localStorage.setItem('_weakerEnemiesCircus', JSON.stringify(weakerEnemies))
            //localStorage.setItem('_weakestEnemyCircus', JSON.stringify(weakestEnemy))
            weakestEnemy[0].click()
            return
        })
            .catch(error => {
            console.error("Error occurred.");
        });
    }

    function checkCircusProvinciariumCondition(autocircusprovinciariumok){
        if (!autocircusprovinciariumok) return 0
        console.log('circus')
        let content = document.getElementById('cooldown_bar_text_ct').innerHTML;
        if (content != 'To Circus Turma') return 0
        return 1
    }


    let dfc = parseInt(localStorage.getItem('_dfCounter')) || 0
    let dfCounter=document.createElement('button');//selectturmatarget
    if (location.href.includes('index.php?mod=arena') && location.href.includes('&aType=2')){
        dfCounter.classList.add('awesome-tabs');
        dfCounter.setAttribute("style"," position:absolute; padding:2px; left: -45px; font-size: 14px; min-width: 25px; min-height: 25px;");
        let questNavTab = document.querySelector('ul#mainnav li table tbody tr td');
        questNavTab.appendChild(dfCounter)
        dfCounter.innerHTML = dfc;
    }


    function appendItemToObjectOfObjects(obj, key, newItem) {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = {}; // Create the object if it doesn't exist
        }
        Object.assign(obj[key], newItem);
    }
    function removeItemFromObjectOfObjects(obj, key) {
        if (obj.hasOwnProperty(key)) {
            delete obj[key];
        }
    }
    function sortWeakestEnemiesDesc(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] > b[1]) ? -1 : 1;
        }
    }

    async function checkArenaProvinciarium(_percentCap){
        let percentCap = parseInt(_percentCap) // percent of power difference fro menemy (1 = 10%, 2 = 20% etc)
        let arenaLink = 'index.php?mod=arena&submod=serverArena&aType=2&sh=' + sessionHash;

        if (!location.href.includes('index.php?mod=arena&submod=serverArena&aType=2&sh=')) {
            location.href = arenaLink;
        }
        let loopBugCheck = document.getElementById('errorText').innerHTML
        if(loopBugCheck.includes('can only challenge an opponent in the arena every')){
            console.log('bug detected')
            location.href = arenaLink;
        }

        let dishonorableNotification = document.querySelector('div#blackoutDialogbod[class="cancel_confirm"]')
        if (dishonorableNotification.getAttribute('display') == 'block'){
            dfc += 1;
            localStorage.setItem('_dfCounter', dfc)
            dfCounter.innerHTML = dfc;

            dishonorableNotification.querySelector('input[type="submit"][value="Cancel"]').click()
            document.querySelector('input.button1[name="actionButton"]').click()
        }

        let enemyElements = document.querySelectorAll('section#own2 table tbody tr');
        let enemyStats = [];
        let promises = [];

        enemyElements.forEach(enemy => {
            let check = enemy.querySelector('td a[target="_blank"]')
            let enemyButtonFight = enemy.querySelector('td div.attack'); //.click()
            if (!check) return // checks for the first element which is column name

            promises.push(
                performRequest(check.href + '&doll=1')//fix cuz sometimes fetches wrong data idk ..
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

        let playerOverviewLink = 'index.php?mod=overview&doll=1&sh='+sessionHash;
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
            //console.log('promise');

            enemyStats.forEach(enemy => {
                //console.log('enemy :', enemy)//[0] - stats, [1] .click() fight event
                //console.log('enemyPromise')
                powerArray.push( [enemy[0], enemy[1], calculateStrength( userStats[0], enemy[0] ), calculateStrength( enemy[0], userStats[0] )])//idx 2&3 = myStr&enemyStr
            })

            let weakerEnemies = []

            powerArray.forEach(enemy => {
                let powerAmount = enemy[2] - enemy[3] - enemy[2] * (percentCap / 10)
                if((powerAmount > 0)){
                    weakerEnemies.push([enemy[1], powerAmount])
                }
            })
            //console.log('enemy strengths: ',powerArray)
            //console.log('weaker enemies: ', weakerEnemies)

            if(weakerEnemies.length == 0){
                console.log('no valid enemies to fight, rerolling')
                document.querySelector('input.button1[name="actionButton"]').click()
                return
            }
            //let weakestEnemy = weakerEnemies[0]
            /*weakerEnemies.forEach(enemy => {
                if (enemy[1] > weakestEnemy[1]){
                    weakestEnemy = enemy
                }
            })
            */
            weakerEnemies.sort(sortWeakestEnemiesDesc)
            //let weakestEnemy = weakerEnemies[0]

            console.log('weakerEnemies: ', weakerEnemies)
            //console.log('weakestEnemy: ', weakestEnemy)
            //localStorage.setItem('_enemyStatsArena', JSON.stringify(enemyStats))
            //localStorage.setItem('_weakerEnemiesArena', JSON.stringify(weakerEnemies))
            //localStorage.setItem('_weakestEnemyArena', JSON.stringify(weakestEnemy))
            //console.log('Weakest button:', weakestEnemy[0])
            //weakestEnemy[0].click();

            //for nicknames
            let enemyRows = document.querySelectorAll('section#own2 tbody tr');
            //console.log('enemyRows', enemyRows)
            let enemyRowData = []
            enemyRows.forEach(enemy => {
                if (!enemy.querySelector('td div[class="attack"]')) return
                let enemyNickname = enemy.querySelector('a[target="_blank"]').innerText
                //console.log('enemyNickname', enemyNickname)
                let attackButton = enemy.querySelector('td div[class="attack"]')
                //console.log('attackButton',attackButton)

                enemyRowData.push([enemyNickname, attackButton])
            })
            let savedPlayers = JSON.parse(localStorage.getItem('_' + serverNumber + '_arenaProvSavedPlayers')) || {}
            console.log('enemyRowData',enemyRowData)
            console.log('savedPlayers: ', savedPlayers)
            let shouldPlayerFight = false;
            let currentDate = Date.now()
            let MAX_NUMBER_OF_FIGHTS = parseInt(arenaMaxEnemyAttacks.value) + 1
            console.log('MAX_NUMBER_OF_FIGHTS', MAX_NUMBER_OF_FIGHTS)

            for (let i = 0; i < weakerEnemies.length; i++){
                let targetPlayerNickname
                enemyRowData.forEach(enemy => {
                    if (enemy[1] == weakerEnemies[i][0]) targetPlayerNickname = enemy[0]
                })

                console.log('checking: ', weakerEnemies[i])
                console.log('nickname: ', targetPlayerNickname)

                shouldPlayerFight = false;

                if (targetPlayerNickname){
                    if (savedPlayers[targetPlayerNickname]){
                        console.log('istnieje')

                        let interval = 1440 // 24h to reset bashing
                        interval *= 60000
                        if ((currentDate - savedPlayers[targetPlayerNickname][1]) > interval){ // more than 24h passed
                            //removeItemFromObjectOfObjects(savedPlayers, targetPlayerNickname) //remove item if its there for more than 24h
                            savedPlayers[targetPlayerNickname][0] = 1
                            savedPlayers[targetPlayerNickname][1] = currentDate
                            console.log('minal czas')
                            //console.log("XD", savedPlayers[targetPlayerNickname][1])
                            shouldPlayerFight = true;
                            //console.log('ilosc bic: ', savedPlayers[targetPlayerNickname][0])
                        }
                        else{ // less than 24h passed
                            console.log('nie minal czas')
                            if (savedPlayers[targetPlayerNickname][0] < MAX_NUMBER_OF_FIGHTS) {// jeli gracz bil  przeciwnika mniej razy niz maksymalna ilosc
                                savedPlayers[targetPlayerNickname][0]++;
                                //console.log("XD", savedPlayers[targetPlayerNickname][1])
                                shouldPlayerFight = true;
                                //console.log('ilosc bic: ', savedPlayers[targetPlayerNickname][0])
                            }
                            else { //jesli gracz bil przeciwnika za duzo razy
                                shouldPlayerFight = false;
                            }
                        }
                    }

                    else {
                        console.log('nie istnieje')
                        appendItemToObjectOfObjects(savedPlayers, targetPlayerNickname, [1, Date.now()])
                        shouldPlayerFight = true;
                    }

                    localStorage.setItem('_' + serverNumber + '_arenaProvSavedPlayers', JSON.stringify(savedPlayers))
                }

                if (shouldPlayerFight){
                    setTimeout(function(){
                        console.log('ATTACK CLICK')
                        weakerEnemies[i][0].click();
                    }, 500)
                    break;
                }
                else{
                    console.log('checking next enemy')
                }

            }
            if (!shouldPlayerFight){
                console.log('reroll')
                document.querySelector('input.button1[name="actionButton"]').click()
            }
            return
        })
            .catch(error => {
            console.error("Error occurred:", error);
        });
    }

    function checkArenaProvinciariumCondition(autoarenaprovinciariumok, arenahp){
        //var arenahp = parseInt(_arenahp);
        if (!autoarenaprovinciariumok) return 0;
        console.log('arena');
        let currentHpPercentage = parseInt(document.getElementById('header_values_hp_percent').innerHTML);
        //console.log('current and cap hp: ', currentHpPercentage , ' < ', arenahp, ' = ', currentHpPercentage < arenahp)
        if (currentHpPercentage < arenahp) return 0;
        let content = document.getElementById('cooldown_bar_text_arena').innerHTML;
        if (content != 'Go to the arena') return 0
        return 1
    }

    async function checkWork(_autoworktype){
        let autoworktype = parseInt(_autoworktype);

        let workTabLink = document.getElementById('submenu1').children[0].href;
        location.href = workTabLink;
        console.log('work index: ', autoworktype)
        document.querySelectorAll('div#select table.section-like.select_work_table tbody tr[id]')[autoworktype].click();
        document.getElementById('doWork').click();
    }

    function checkWorkCondition(){
        if (!autoworkok) return 0
        console.log('work')
        let expeditionsLeft = document.getElementById('expeditionpoints_value_point').innerHTML;
        let dungeonsLeft = document.getElementById('dungeonpoints_value_point').innerHTML;
        let isWorking = document.querySelector('div#content.show-item-quality.show-item-level h1');
        if (expeditionsLeft == '0' && dungeonsLeft == '0' && !isWorking){
            return 1
        }
        return 0
    }

    function stringToBool(string){
        if (string==='true' || string==='1') return true
        else return false
    }

    let qc = parseInt(localStorage.getItem('_questCounter')) || 0
    let questCounter=document.createElement('button');
    if (location.href.includes('index.php?mod=quests')){
        //selectturmatarget
        questCounter.classList.add('awesome-tabs');
        questCounter.setAttribute("style"," position:absolute; padding:2px; left: -45px; font-size: 14px; min-width: 25px; min-height: 25px;");
        let questNavTab = document.querySelector('ul#mainnav li table tbody tr td');
        questNavTab.appendChild(questCounter)
        questCounter.innerHTML = qc;
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
            if (completedQuests.length == 0 && failedQuests.length == 0){
                location.href = 'index.php?mod=overview&doll=1&sh=' + sessionHash; //exit when no more quests to take
            }
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

    function checkQuestsCondition(autoquestok){
        if (!autoquestok) return 0;
        console.log('quests')

        let pantheonInfo = document.querySelectorAll('a.menuitem[title="Pantheon"] font') // 'New', '1', '2', 'Full' etc
        let enterQuests = false
        pantheonInfo.forEach(infoNode => {
            if (infoNode.innerText.includes('New')) enterQuests = true
            else if (infoNode.innerText.includes('N/A')) enterQuests = true
            else if (infoNode.innerText == '1' || infoNode.innerText == '2' || infoNode.innerText == '3' || infoNode.innerText == '4' || infoNode.innerText == '5') enterQuests = true
        })
        if (enterQuests) return 1
        return 0
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

    function setSearchParameters(){
        //filter options
        let itemName = document.querySelector('input[type="text"][name="qry"]')
        itemName.value = '';
        let minLvl = document.querySelector('select[name="itemLevel"]');
        minLvl.value = minLvl.children[0].getAttribute('value');
        let itemType = document.querySelector('select[name="itemType"]');
        itemType.value = 0;
        let itemQuality = document.querySelector('select[name="itemQuality"]');
        itemQuality.value = -1;
    }

    function createRdyUrl(){
        let url = location.href
        url = url.replace('zubab=notrdy', 'zubab=rdy')
        return url
    }

    function buyItems(){
        let STOP_BUYING = false
        const url = location.href;
        const filterButton = document.querySelector('div#main_inner div#content article section form table tbody tr td input[type="submit"]')

        if (url.includes('&zubab=notrdy')){//redirected from button
            setSearchParameters();
            history.pushState(null, "", createRdyUrl());
            filterButton.click(); //filter button

        }
        else if (url.includes('&zubab=rdy') && autoMarketOk && !STOP_BUYING){ //ready to keep refreshing
            //if (location.href.
            let remainingAuctionTime = document.querySelector('article span.description_span_right b').innerHTML.toLowerCase(); //short, very short etc
            //if (remainingAuctionTime != 'very short') {return} //later delete short

            let auctionItemsData = []
            const auctionElements = document.querySelectorAll('div#main_inner div#content div#auction_table table tbody tr td div.section-header form');
            const clearedValue = parseInt(marketMinValue.value.replace(/\D/g, ''))
            auctionElements.forEach(element => {
                const auctionBidDiv = element.querySelector('div.auction_bid_div')
                const itemType = parseInt(element.querySelector('div.auction_item_div div div').getAttribute('data-content-type'));
                // 1 = helmet, 2 = weapon, 4 = shield, 8 = body armor, 48 = ring, 64 = usables
                // 256 = gloves, 512 = shoes, 1024 = amulets, 4096 = upgrade, 16384 = mercenary

                const percent = auctionBidDiv.querySelector('span.gca-auction-price-value-percent').innerHTML;
                const price = parseInt(auctionBidDiv.querySelector('input[type="text"]').getAttribute('value'));
                const button = auctionBidDiv.querySelector('input[type="button"]');

                if(percent == '(100%)' && price > clearedValue){
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
                    if((notificationError.innerHTML).includes("have enough gold") || (notificationError.innerHTML).includes("is closing") || (notificationError.innerHTML).includes("ot possible")){
                        console.log(notificationError.innerHTML);
                        STOP_BUYING = true;
                        location.href = 'index.php?mod=overview&doll=1&sh=' + sessionHash;
                    }
                    else if((notificationError.innerHTML).includes("too low")){
                        filterButton.click()
                    }
                }
            }
            function checkNoMoreAuctions(length, iter){
                if (iter == length){
                    STOP_BUYING = true;
                    location.href = 'index.php?mod=overview&doll=1&sh=' + sessionHash;
                }
            }

            var interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?
            let iter = 0;
            checkNoMoreAuctions(auctionItemsData.length, iter);
            auctionItemsData.forEach(function (el, index) {
                const randomDelay = Math.random() * (1000 - 0) + 0;
                setTimeout(function () {
                    //console.log(el);
                    checkNoMoreGold()
                    if (STOP_BUYING == false && autoMarketOk) {
                        el[2].click();
                        console.log('click: ', el);
                    }
                    iter++;
                    checkNoMoreAuctions(auctionItemsData.length, iter)
                }, (index * interval) + randomDelay);
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
    }

    let lastMarketDate = localStorage.getItem('_lastMarketCheck') || 0

    function checkMarketAutoBuyCondition(autoMarketOk){
        if (!autoMarketOk) return 0
        console.log('market')
        let interval = parseFloat(marketInterval.value.replace(/[^0-9.]/g, '')) // check auction every x minutes
        interval *= 60000

        let currentDate = Date.now()
        if ((currentDate - lastMarketDate) > interval){
            localStorage.setItem('_lastMarketCheck', currentDate)
            //console.log('GO ON MARKET')
            return 1
        }
        return 0;
    }

    function stringContainsAnyItemFromArray(str, arr) {
        return arr.some(item => str.includes(item));
    }

    function simulateDoubleClick(element) {
        const event = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
        });
        element.dispatchEvent(event);
    }

    function checkAutoHeal(){
        if (!location.href.includes('index.php?mod=overview&doll=1&sh=')) location.href = 'index.php?mod=overview&doll=1&sh=' + sessionHash;
        document.querySelectorAll('div#inventory_nav a')[parseInt(autoHealFoodTab.value)].click()
        //let currentHealthPercentage = parseInt(document.getElementById('char_leben').innerHTML)// important to compare this whe healing up instead of other
        let currentHealth = document.getElementById('header_values_hp_bar').getAttribute('data-value');
        let maxHealth = document.getElementById('header_values_hp_bar').getAttribute('data-max-value');
        let missingHealth = maxHealth - currentHealth
        console.log('missingHealth:', missingHealth)


        let allowedFoods = ['Apple', 'Bananas', 'Cheese', 'Bread rolls', 'Bread', 'Fish', 'Meat haunch', 'Steak', 'Chicken', 'Health potion', 'Healing potion', 'Fish sandwich', 'Banana sandwich', 'Steak sandwich',
                            'Cheese sandwich', 'Banana roll', 'Cheese roll', 'Steak roll', 'Fish roll', 'Fruit bowl', 'Cake', 'Feast']
        let consumables = document.querySelectorAll('div#inv div[data-content-type="64"]')
        let filteredFood = []
        consumables.forEach(item => {
            let tooltip = item.getAttribute('data-tooltip');
            let leftAnchor = tooltip.indexOf('"Using: ')
            let rightAnchor = tooltip.indexOf(' of life"')
            if (leftAnchor == -1 || rightAnchor == -1) return
            let foodName = tooltip.substring(3, tooltip.indexOf(','))
            if (!stringContainsAnyItemFromArray(foodName, allowedFoods)) return // name
            let healthAmount = parseInt(tooltip.substring(leftAnchor+14, rightAnchor))
            filteredFood.push([healthAmount, item])

        })
        filteredFood = filteredFood.sort((a, b) => a[0] - b[0])
        console.log(filteredFood)
        let bestFood;
        if (filteredFood.length == 0){
            console.log('no food found')
            localStorage.setItem('_lastAutoHealTimeout', Date.now())
            return
        }
        if (filteredFood[0][0] < missingHealth){
            bestFood = filteredFood[0]
        }
        if (bestFood){
            console.log('best food found: ', bestFood)
            simulateDoubleClick(bestFood[1])
            //return
            setTimeout(function(){
                location.href = 'index.php?mod=overview&doll=1&sh=' + sessionHash;
            }, 1500)
            //checkAutoHeal()
        }
        else{
            console.log('best food NOT found')
            console.log('applying 30% leniency cap')

            let afterLeniencyCap;
            let healingValueLeniency = (parseInt(autoHealFoodValueLeniencyPerc.value))/100
            if (filteredFood[0][0] < missingHealth * (1 + healingValueLeniency)){
                afterLeniencyCap = filteredFood[0]
            }
            if (afterLeniencyCap){
                console.log('food after leniancy found: ', afterLeniencyCap)
                simulateDoubleClick(afterLeniencyCap[1])
                //return
                setTimeout(function(){
                    location.href = 'index.php?mod=overview&doll=1&sh=' + sessionHash;
                }, 1500)
                //checkAutoHeal()
            }
            else{
                console.log('food after leniancy NOT found')
                //cant find any usefull food, apply timeout
                localStorage.setItem('_lastAutoHealTimeout', Date.now())
                location.href = 'index.php?mod=overview&doll=1&sh=' + sessionHash;
            }
        }

    }

    let lastAutoHealTimeout = localStorage.getItem('_lastAutoHealTimeout') || 0

    function checkAutoHealCondition(autoHealOk){
        if (!autoHealOk) return 0
        console.log('autoheal')
        let interval = parseFloat(autoHealTimeout.value.replace(/[^0-9.]/g, ''))// check every x minutes for new food
        interval *= 60000
        if ((Date.now() - lastAutoHealTimeout) < interval) return 0

        let currentHealth = document.getElementById('header_values_hp_bar').getAttribute('data-value');
        let maxHealth = document.getElementById('header_values_hp_bar').getAttribute('data-max-value');
        let currentHealthInPercentage = (currentHealth / maxHealth) * 100;
        //console.log('health: ', currentHealthInPercentage);

        if (currentHealthInPercentage >= parseInt(autoHealBelowHpPerc.value)) return 0
        return 1
    }

    function sellTabItems(){
        quickSellButton.disabled = true;
        let tabItems = document.querySelectorAll('div#inv div[data-content-type]')
        let index = 0;
        tabItems.forEach(item => {
            index++;
            let randomDelay = Math.round(Math.random() * (100 - 10)) + 10
            setTimeout(function(){
                simulateDoubleClick(item)
                if(document.querySelector('div#blackoutDialogdestackConfirm').style.display == 'block'){
                    document.querySelector('input#linkdestackConfirm').click()
                }
            }, index*200 + randomDelay)
        })
        setTimeout(function(){
            quickSellButton.disabled = false;
        }, index* 200 + 500)
    }

    function getPackages(){
        quickGetPackages.disabled = true;
        let packageItems = document.querySelectorAll('div#packages div.packageItem div[style]')
        let index = 0;
        packageItems.forEach(item => {
            index++;
            let randomDelay = Math.round(Math.random() * (100 - 10)) + 10
            setTimeout(function(){
                simulateDoubleClick(item)
            }, index*200 + randomDelay)
        })
        setTimeout(function(){
            quickGetPackages.disabled = false;
        }, index* 200 + 500)
    }

    function backgroundOperations(){
        console.log('background tasks')
        let backgroundTimers = JSON.parse(localStorage.getItem('_' + serverNumber + '_backgroundTimers')) || {}
        if(backgroundTimers.lastArenaCheck){
            //console.log('last arena check exists, value = ', backgroundTimers.lastArenaCheck)
            let interval = 360 // check for old data every 360 minutes
            interval *= 60000

            if ((currentDate - backgroundTimers.lastArenaCheck) > interval){ // more than 24h passed
                let compareInterval = 1440 //24h
                compareInterval *= 60000
                let arenaEnemiesData = JSON.parse(localStorage.getItem('_' + serverNumber + '_arenaProvSavedPlayers')) || {}

                for (const key in arenaEnemiesData) {
                    if (arenaEnemiesData.hasOwnProperty(key)) {
                        if (currentDate - arenaEnemiesData[key][1] > compareInterval){
                            console.log('wiecej niz 24h, usun')
                            removeItemFromObjectOfObjects(arenaEnemiesData, key)
                        }
                        else console.log('mniej niz 24, zostaw')
                    }
                }
                console.log('PO USUWANIACH')
                console.log('zmodyfikowany obiekt: ', arenaEnemiesData)
                localStorage.setItem('_' + serverNumber + '_arenaProvSavedPlayers', JSON.stringify(arenaEnemiesData))
                backgroundTimers.lastArenaCheck = currentDate
                localStorage.setItem('_' + serverNumber + '_backgroundTimers', JSON.stringify(backgroundTimers))
            }
            else{ // less than 24h passed
                //console.log('do nothing')
            }
        }
        else{
            console.log('last arena check DOESN"T exists')
            backgroundTimers.lastArenaCheck = currentDate
            localStorage.setItem('_' + serverNumber + '_backgroundTimers', JSON.stringify(backgroundTimers))
        }
    }

    function pickAction(){
        if (checkQuestsCondition(autoquestok) == 1){
            return 10
        }
        else if (checkMarketAutoBuyCondition(autoMarketOk) == 1){
            return 20 //exp
        }
        else if (checkAutoHealCondition(autoHealOk) == 1){//autoHealOk
            return 21
        }
        else if (checkExpeditionCondition(autoexpeditionok, expeditionhp.value) == 1){ // if exp is true
            return 30 //exp
        }
        else if (checkDungeonCondition(autodungeonok) == 1){
            return 40 //dung
        }
        else if (checkCircusProvinciariumCondition(autocircusprovinciariumok) == 1){
            return 50
        }
        else if (checkArenaProvinciariumCondition(autoarenaprovinciariumok, arenahp.value) == 1){
            return 60
        }
        else if (checkWorkCondition(autoworkok) == 1){
            return 70
        }
        else {
            return 0
        }
    }

    function eventChecker() {
        //checkAutoHeal();
        //console.log('_enemyCharactersStatsCircus: ', arr1);
        //console.log('_weakerEnemiesCircus: ', arr2);
        //console.log('_weakestEnemyCircus: ', arr3);
        //console.log('_enemyStatsArena: ', arr4);
        //console.log('_weakerEnemiesArena: ', arr5);
        //console.log('_weakestEnemyArena: ', arr6);
        if (boton) {
            checkNotification();
            if (location.href.includes('mod=quests')){
                console.log('quests')
                checkQuests(arenaqueston.getAttribute('value'), arenaquesttimedon.value, arenaquestsuccessionon.value,
                            circusqueston.getAttribute('value'), circusquesttimedon.value, circusquestsuccessionon.value,
                            combatqueston.getAttribute('value'), combatquesttimedon.value, combatquestsuccessionon.value,
                            expeditionqueston.getAttribute('value'), expeditionquesttimedon.value, expeditionquestsuccessionon.value,
                            expeditionquestmap.value, expeditionquestenemy.value);
            }
            else if (location.href.includes('mod=auction') && location.href.includes('&zubab=')) buyItems();
            else if (!location.href.includes('mod=auction') && !location.href.includes('mod=market')){//regular auction and market excluded from bot to let user bid freely :)))
                let currentAction = pickAction();
                if (currentAction == 10) location.href = 'index.php?mod=quests&sh=' + sessionHash;
                else if (currentAction == 20) location.href = 'index.php?mod=auction&zubab=notrdy' + (parseInt(marketType.value) == 0 ? '&sh=' : '&ttype=3&sh=') + sessionHash;
                else if (currentAction == 21) checkAutoHeal();
                else if (currentAction == 30) checkExpedition(selectexpeditionmap.value, selectexpeditiontarget.value);
                else if (currentAction == 40) checkDungeon(selectdungeonmap.value, advanced.value, skipboss.value, fulldungclear.value);
                else if (currentAction == 50) checkCircusProvinciarium(selectcircusprovinciariummode.value);
                else if (currentAction == 60) checkArenaProvinciarium(selectarenaprovinciariummode.value);
                else if (currentAction == 70) checkWork(autoworktype.value);
                else backgroundOperations();
            }
        }
    }

    async function loop() {
        let rand = Math.round(Math.random() * (6500 - 2100)) + 2100;
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
                resetLink = 'index.php?mod=overview&doll=1&sh=' + sessionHash;
            }
            location.href = resetLink;
        }
    }, 1000)


    changePageInfo()
    loop()
})();
