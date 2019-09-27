
// --------------------------------------------
// Here is the url of your website. 
// You have to replace it with your domain name
// --------------------------------------------
var themeUrl = 'http://cecile.bordes.free.fr/';
var templateUrl = 'http://cecile.bordes.free.fr/';

// import Smooth from 'smooth-scrolling'

// const section = document.querySelector('.vs-section')
// const smooth = new Smooth({
//   native: false,
//   section: section,
//   ease: 0.1
// })

// smooth.init()

var formationDone = false;
var competencesDone = false;
var scrolling = false;
var listPlaying = false;
var expOpen = false;


var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
   currentMousePos.x = event.pageX;
   currentMousePos.y = event.pageY;
});

var animPlaying = false;
var firstLoad = true;

// preload
var preload = new createjs.LoadQueue();

verifierMail = function(mailteste) {
	var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');
	if(reg.test(mailteste)) return(true);
	else return(false);
}


okornot = function() {
	if(document.querySelector('input[name="c_prenom"]').value=='') document.querySelector('input[name="c_prenom"]').style.borderBottom = '1px solid red'; else document.querySelector('input[name="c_prenom"]').style.borderBottom = '1px solid #fff';
	if(document.querySelector('input[name="c_nom"]').value=='') document.querySelector('input[name="c_nom"]').style.borderBottom = '1px solid red'; else document.querySelector('input[name="c_nom"]').style.borderBottom = '1px solid #fff';
	if(verifierMail(document.querySelector('input[name="c_email"]').value) == false) document.querySelector('input[name="c_email"]').style.borderBottom = '1px solid red'; else document.querySelector('input[name="c_email"]').style.borderBottom = '1px solid #fff';
	if(document.querySelector('input[name="c_telephone"]').value=='') document.querySelector('input[name="c_telephone"]').style.borderBottom = '1px solid red'; else document.querySelector('input[name="c_telephone"]').style.borderBottom = '1px solid #fff';
	if(document.querySelector('input[name="c_message"]').value=='') document.querySelector('input[name="c_message"]').style.borderBottom = '1px solid red'; else document.querySelector('input[name="c_message"]').style.borderBottom = '1px solid #fff';
	
	if(document.querySelector('input[name="c_prenom"]').value!='' && document.querySelector('input[name="c_nom"]').value!='' && verifierMail(document.querySelector('input[name="c_email"]').value) && document.querySelector('input[name="c_telephone"]').value!='' && document.querySelector('input[name="c_message"]').value!='') {
		var request = new XMLHttpRequest();
		request.open('GET', './wp-content/themes/ambroisie/send.php?c_prenom='+encodeURIComponent(document.querySelector('input[name="c_prenom"]').value)+'&c_nom='+encodeURIComponent(document.querySelector('input[name="c_nom"]').value)+'&c_email='+encodeURIComponent(document.querySelector('input[name="c_email"]').value)+'&c_telephone='+encodeURIComponent(document.querySelector('input[name="c_telephone"]').value)+'&c_message='+encodeURIComponent(document.querySelector('input[name="c_message"]').value)+'&c_lang='+encodeURIComponent(document.querySelector('input[name="c_lang"]').value), true);
		request.onload = function() { if(request.status >= 200 && request.status < 400) document.querySelector('#reponse').innerHTML = request.responseText; }
		request.send();
	}
	return false;
}

history.pushState({}, '', location);


$(document).ready(function(){

    openMenu();
    hoverMenuLines();
    le_raf();
    loading();
    
    String.prototype.decodeHTML = function() {
        return $("<div>", {html: "" + this}).html();
    };
    
    var $content = $(".innerContent"),
    
    // When a page loads.
    init = function() {

        // Smooth Scrolling

        const section = document.querySelector('.vs-section')
        const smooth = new Smooth({
          native: false,
          section: section,
          ease: 0.1,
          noscrollbar: true
        })

        setTimeout(function(){
            smooth.init()
        },250); 
        

        // apparition page
        TweenMax.to('.innerContent', 1, {opacity:1});
        TweenMax.to('html,body', 0, {scrollTop:0});

        // TweenMax.to(".holdClick", 0, {opacity:0});

        // Lancement des fonctions de la page Home à chaque arrivée sur la page
        if ($('body').hasClass('page-template-index')) {
            
            if (firstLoad == false) {
                introHome();
            }
        }

        // Lancement des fonctions de la page About à chaque arrivée sur la page
        if ($('body').hasClass('page-template-about')) {
            
            if (firstLoad == false) {
                introAbout();
            }
        }

        // Lancement des fonctions de la page Experiences à chaque arrivée sur la page
        if ($('body').hasClass('post-type-archive-experience')) {

            if (firstLoad == false) {
                scrolling = false;
                introExperiences();
                expScroll();
                splitText();
                closeExp();
                hoverListExp();
            }
        }

        if ($('body').hasClass('error404')) {

            if (firstLoad == false) {
                scrolling = false;
                errorAnim();
            }
        }
    },
    
    ajaxLoad = function(html) {
        document.title = html
            .match(/<title>(.*?)<\/title>/)[1]
            .trim()
            .decodeHTML();

        $('body').attr('class','').addClass(html.match(/<body class="(.*?)">/)[1]);
    
        init();
    },
    
    /* When we go to another page */
    loadPage = function(href) {
        // disparition page en cours, onComplete chargement nouvelle
        TweenMax.to('.innerContent', 0.5, {opacity:0, onComplete:function() {
            $content.load(href + " .innerContent>*", ajaxLoad);
        }});
    };
    init();
    
    $(window).on("popstate", function(e) {
        if(e.originalEvent.state !== null) { loadPage(location.href); }
        // console.log('bug');
        // loadPage(location.href);
    });

    // window.addEventListenner("orientationchange", function() {
    //     window.location.href = window.location.href;
    // }, false);

    $(document).on("click", "a, area", function(e) {

        var href = $(this).attr("href");
        var classLink = $(this).attr("class");
        var windowLocation = window.location.pathname;
        var href2 = href;

        if (window.location.href == href) {
            closeMenu();
            return false;
        };

        if($(this).attr("class")=='prevExp') {
            e.preventDefault();
            prevExp();
        }

        if($(this).attr("class")=='nextExp') {
            e.preventDefault();
            nextExp();
        }
        if($(this).attr("class")=='sortant') {
            (".sortant").attr('target', '_blank');
        }

        if($(this).attr("class")=='listLink hoverList') {
            e.preventDefault();

            listPlaying = true;

            var itemCible = $(this).attr("id");
            listExp(itemCible);

            TweenMax.to($('.innerExperience .list .singleList').eq(itemCible).find("p"), 0.4, {opacity:0});
        }

        if($(this).attr("class")=='discover') {
            e.preventDefault();

            var activeItem = 0;
            while ( !$('.innerExperience .numbers .singleNumber').eq(activeItem).hasClass('active') ) {
                activeItem = activeItem + 1;
            }

            openExp(activeItem);
        }

        if(href=='#'){
            e.preventDefault();
            return;
        }

        
        


        if(href.indexOf('mailto:')!=-1) return;
        if(href.indexOf('tel:')!=-1) return;
        if(href.indexOf('facebook')!=-1) return;
        if(href.indexOf('instagram')!=-1) return;
        if($(this).attr("class")=='redirect') {
            e.preventDefault();

            closeMenu();
            history.pushState({}, '', href);
            setTimeout(function(){
                loadPage(href);
            },600); 
        }
        else if(href!=undefined) {
            // console.log('test');
            if(href.indexOf(document.domain) > -1 || href.indexOf(':') === -1) {
                history.pushState({}, '', href);
                loadPage(href);
                return false;
            }
        }




        // if(classLink=='singleProject hover'){
        //     console.log('click');
        //     TweenMax.to(".holdClick", 0.3, {opacity:0});
        // }
    });
});



function loading() {

    $('body').addClass('overflow-hidden');
    TweenMax.to('html,body', 0, {scrollTop:0});

	var preload = new createjs.LoadQueue();
	// preload.on("fileload", handleFileLoad);
	preload.on("progress", handleOverallProgress);
	preload.on("complete", handleComplete);
	    
	preload.loadFile(directory_uri + '/img/spritesheet-3-min.png');
    preload.loadFile(directory_uri + '/img/arrowDown.svg');
    preload.loadFile(directory_uri + '/img/arrowUp.svg');
    preload.loadFile(directory_uri + '/img/closePointer.svg');
    preload.loadFile(directory_uri + '/img/logo-menu.png');
    preload.loadFile(directory_uri + '/img/logo-menu.svg');
    preload.loadFile(directory_uri + '/img/logo-small.png');
    preload.loadFile(directory_uri + '/img/logo-white.png');

    // for(var f= 0; f < array_general.length; f++)
        // preload.loadFile(array_general[f]);

	// etc tous tes fichiers
	    
	            
	// function handleOverallProgress(event) {
	//     TweenMax.to($('#ligne-chargeur'), 0.8, {scaleX:event.progress});
	//     $('#txt-chargeur').css('opacity',1);
	//     $('#txt-chargeur').html(parseInt(event.progress*100)+'%');
	//     // TweenMax.to($('#txt-chargeur'), 1, {y:parseInt((1-event.progress)*100)+'%'});
	// }

	function handleOverallProgress(event) {


            TweenMax.killTweensOf('.loading');
            if(event.progress<0.20) TweenMax.to('.loading .innerLoading .line', 0.5, {scaleX:'0.02', ease: Power4.easeInOut});
            if(event.progress>0.20 && event.progress<0.5) TweenMax.to('.loading .innerLoading .line', 0.6, {scaleX:'0.25', ease: Power4.easeInOut});
            if(event.progress>=0.5 && event.progress<0.75) TweenMax.to('.loading .innerLoading .line', 0.6, {scaleX:'0.50', ease: Power4.easeInOut});
            if(event.progress>=0.75 && event.progress<1) TweenMax.to('.loading .innerLoading .line', 0.6, {scaleX:'0.75', ease: Power4.easeInOut});
            if(event.progress>=1) TweenMax.to('.loading .innerLoading .line', 0.8, {scaleX:'1', ease: Power4.easeInOut});
            $('.innerLoading .percentage p').html(parseInt(event.progress*100));

            // if(event.progress>=1) TweenMax.to('.line-above', 2.5, {scaleX:'1', ease:Power4.easeInOut});

    }

	// function handleFileLoad(event) {}

	function handleComplete(event) {
		setTimeout(loadingComplete, 1000);
	}
}

function loadingComplete() {
    // console.log('loading');
    $('.loading .innerLoading .leftLoad').css('transform-origin', 'top left');
    $('.loading .innerLoading .rightLoad').css('transform-origin', 'top right');
    TweenMax.to(".loading .innerLoading .percentage", 0.6, {scale:2.4, ease:Power4.easeIn});
    TweenMax.to(".loading .innerLoading .percentage", 0.3, {opacity:0, delay: 0.3});
    TweenMax.to('.line', 1, {scaleX:'0', ease: Power4.easeInOut, onComplete:function() {

        TweenMax.to('.loading', 0.4, {opacity:0, onComplete:function() {
            $('.loading').css('display','none');
            $('body').removeClass('overflow-hidden');

            introHeader();

            // Lancement des fonctions de la page Home après le loader
            if ($('body').hasClass('page-template-index')) {
                introHome();
            }

            // Lancement des fonctions de la page About après le loader
            if ($('body').hasClass('page-template-about')) {
                introAbout();
            }

            // Lancement des fonctions de la page Experience après le loader
            if ($('body').hasClass('post-type-archive-experience')) {
                scrolling = false;
                introExperiences();
                expScroll();
                splitText();
                closeExp();
                hoverListExp();
            }

            // Lancement des fonctions de la page 404
            if ($('body').hasClass('error404')) {
                scrolling = false;
                errorAnim();
            }

            firstLoad = false;
        
        }});

        // Intro header
        // TweenMax.to(".overlay", 2.5, {opacity:0.94, delay: 0.4});
        // TweenMax.to(".burgerMenu div", 0.5, {scaleX: 1, delay: 2.5, ease: Power4.easeOut});

        
    }});
	// TweenMax.to($('.loading'), 0.4, {opacity:0, onComplete:function() {
	// 	$('.loading').css('display','none');
 //        TweenMax.to('.inner-elements h1', 2, {opacity:1});
	// }});

}


function introHeader() {

    TweenMax.to(".burgerMenu div:nth-child(1)", 0.6, {scaleX:0.7, ease:Power4.easeInOut, delay: 2});
    TweenMax.to(".burgerMenu div:nth-child(2)", 0.6, {scaleX:1, ease:Power4.easeInOut, delay: 2.1});
    TweenMax.to(".burgerMenu div:nth-child(3)", 0.6, {scaleX:0.7, ease:Power4.easeInOut, delay: 2.2});

}

function introHome() {
    
    canvasHome();

    TweenMax.to(".innerHome", 1.4, {opacity:1});

    TweenMax.to(".name h1", 0.8, {y:'0', ease: Power4.easeOut, delay: 1.4});
    TweenMax.to(".name h1", 0.8, {opacity:1, delay: 1.4});

    TweenMax.to(".name h2", 0.8, {y:'0', ease: Power4.easeOut, delay: 1.6});
    TweenMax.to(".name h2", 0.8, {opacity:1, delay: 1.6});

}

function introAbout() {

    TweenMax.to(".innerAbout", 1.4, {opacity:1});
    
    TweenMax.staggerTo($(".introTitle h1 span"), 0.8, {opacity:1, delay: 0.4}, 0.1);
    TweenMax.staggerTo($(".introTitle h1 span"), 0.8, {y:'0px', ease:Power4.easeOut, delay: 0.4}, 0.1);

    TweenMax.to(".introText", 0.8, {y:'0', ease: Power4.easeOut, delay: 1});
    TweenMax.to(".introText", 0.8, {opacity:1, delay: 1});

    TweenMax.to(".parallaxImg", 0.8, {y:'0', ease: Power4.easeOut, delay: 1.1});
    TweenMax.to(".parallaxImg", 0.8, {opacity:1, delay: 1.1});

}

function errorAnim() {
    TweenMax.staggerTo($(".innerNotFound .notFound h1 span"), 1.2, {opacity:1, top:'0px',ease:Power4.easeOut}, 0.1);
    TweenMax.to(".innerNotFound .notFound h2", 0.8, {opacity:0.5, delay:1.2});
}





function introExperiences() {

    // var itemNumber1 = 0;
    expIn(0);

    TweenMax.to(".innerExperience", 1.4, {opacity:1});
    TweenMax.staggerTo($(".list .singleList a"), 1.2, {opacity:1, delay: 0.8}, 0.1);

}



function expIn(itemNumber2) {

    // Number
    $('.innerExperience .numbers .singleNumber').eq(itemNumber2).addClass('active');
    TweenMax.to(".innerExperience .numbers .active", 0.8, {scale:1, opacity:0.3, ease: Power4.easeOut});

    // Name
    $('.innerExperience .names .singleName').eq(itemNumber2).addClass('activeName');
    setTimeout(function(){
        TweenMax.to(".innerExperience .names .singleName", 0, {opacity:1});
        TweenMax.staggerTo($(".innerExperience .names .activeName span"), 0.6, {opacity:1, top:'0px', ease: Power4.easeOut, delay: 0.2}, 0.04);
    },50);

    // List
    $('.innerExperience .list .singleList').eq(itemNumber2).addClass('activeList');
    TweenMax.to(".innerExperience .list .activeList", 0.4, {scale:1, opacity:1, ease: Power4.easeInOut, onComplete: function() {
        listPlaying = false;
    }});
    // TweenMax.to($('.innerExperience .list .activeList p'), 0.1, {opacity:0});

}


function expOut(itemNumber4) {

    // faire disparaitre le .number active
    TweenMax.to(".innerExperience .numbers .active", 0.4, {scale:0.8, opacity:0, ease: Power4.easeIn, onComplete:function() {

        // Enlever la classe active a ce dernier
        $('.innerExperience .numbers .singleNumber').eq(itemNumber4).removeClass('active');

    }});

    $('.innerExperience .names .singleName').eq(itemNumber4).removeClass('activeName');
    $('.innerExperience .names .singleName').eq(itemNumber4).addClass('activeNameOut');
    TweenMax.staggerTo($(".innerExperience .names .activeNameOut span"), 0.6, {opacity:0, top:'-20px', ease: Power4.easeIn, onComplete:function() {

        // Remettre ce dernier au bon endroit
        TweenMax.staggerTo($(".innerExperience .names .activeNameOut span"), 0, {top:'20px'}, 0.1);

        // Enlever la classe active a ce dernier
        setTimeout(function(){
            $('.innerExperience .names .singleName').eq(itemNumber4).removeClass('activeNameOut');
        },100);
        
    }}, 0.04);

    $('.innerExperience .list .singleList').eq(itemNumber4).removeClass('activeList');
    $('.innerExperience .list .singleList').eq(itemNumber4).addClass('activeListOut');

    TweenMax.to(".innerExperience .list .activeListOut", 0.4, {opacity:0.4, scale:0.85, ease: Power4.easeInOut, onComplete:function() {

        // Enlever la classe active a ce dernier
        $('.innerExperience .list .singleList').eq(itemNumber4).removeClass('activeListOut');

    }});

    
}




function nextExp() {

    // Compter le nombre d'items au total
    var totalItem = $(".numbers > p").length;

    // Compter c'etait le combientieme
    var itemNumber3 = 0;

    while ( !$('.innerExperience .numbers .singleNumber').eq(itemNumber3).hasClass('active') ) {
        itemNumber3 = itemNumber3 + 1;
    }

    // Faire disparaitre l'item actif
    expOut(itemNumber3);

    // Faire apparaitre le nouvel item (suivant)
    // en attendant que la disparition de l'autre soit terminée
    setTimeout(function(){

        itemNumber3 = itemNumber3 + 1;

        if (itemNumber3 == totalItem) {
            itemNumber3 = 0;
        }

        expIn(itemNumber3);

    },450); 

}


function prevExp() {

    // Compter le nombre d'items au total
    var totalItem = $(".numbers > p").length;

    // Compter c'etait le combientieme
    var itemNumber3 = 0;

    while ( !$('.innerExperience .numbers .singleNumber').eq(itemNumber3).hasClass('active') ) {
        itemNumber3 = itemNumber3 + 1;
    }

    expOut(itemNumber3);

    // Faire apparaitre le nouvel item (précédent)
    // en attendant que la disparition de l'autre soit terminée
    setTimeout(function(){
        itemNumber3 = itemNumber3 - 1;

        if (itemNumber3 == -1) {
            itemNumber3 = totalItem - 1;
        }

        expIn(itemNumber3);
    },450); 

}



function listExp(itemCible) {

    // Compter c'etait le combientieme
    var itemNumber = 0;

    while ( !$('.innerExperience .list .singleList').eq(itemNumber).hasClass('activeList') ) {
        itemNumber = itemNumber + 1;
    }

    expOut(itemNumber);

    // Faire apparaitre l'item cible
    // en attendant que la disparition de l'autre soit terminée
    setTimeout(function(){
        expIn(itemCible);
    },450); 
}

function hoverListExp() {

    $( ".innerExperience .list .singleList a" ).hover(function() {


        $(this).addClass('hoverList');

        var itemList = 0;
        while ( !$('.innerExperience .list .singleList a').eq(itemList).hasClass('hoverList') ) {
            itemList = itemList + 1;
        }

        if ((!$('.innerExperience .list .singleList').eq(itemList).hasClass('activeList')) && (listPlaying == false)) {
            TweenMax.to($('.innerExperience .list .singleList').eq(itemList).find("p"), 0.4, {opacity:1});
        }

    }, function() {

        var itemList = 0;
        while ( !$('.innerExperience .list .singleList a').eq(itemList).hasClass('hoverList') ) {
            itemList = itemList + 1;
        }

        TweenMax.to($('.innerExperience .list .singleList').eq(itemList).find("p"), 0.4, {opacity:0});

        $(this).removeClass('hoverList');
    })

}


function expScroll() {

    //Firefox
    $('body').bind('DOMMouseScroll', function(e){

        if (expOpen) return;

        if (scrolling) return;
        scrolling = true;

        if ($('body').hasClass('post-type-archive-experience')) {

            if(e.originalEvent.detail > 0) {
                //scroll down
                // console.log('scroll down');
                nextExp();
                setTimeout(function(){
                    scrolling = false;
                },2000); 

            }else {
            //scroll up
                prevExp();
                setTimeout(function(){
                    scrolling = false;
                },2000);
            }

            //prevent page fom scrolling
            // return false;
        }
        
    });

    //IE, Opera, Safari
    $('body').bind('mousewheel', function(e){

        if (expOpen) return;

        if (scrolling) return;
        scrolling = true;

        if ($('body').hasClass('post-type-archive-experience')) {
            if(e.originalEvent.wheelDelta < 0) {
                //scroll down
                // console.log('scroll down');
                nextExp();
                setTimeout(function(){
                    scrolling = false;
                },2000);

            }else {
                //scroll up
                prevExp();
                setTimeout(function(){
                    scrolling = false;
                },2000);
            }
            //prevent page fom scrolling
            // return false;
        }
    });
}




function splitText() {

    var eq = 0;
    var totalEq = $(".names > p").length;

    while (eq < totalEq) {

        var $div = $('.singleName').eq(eq).clone().html('');
        $('.singleName').eq(eq).contents().each(function(){
            var spanClass = '';

            if ($(this).is('span')) {
                spanClass = $(this).attr('class');
            }

            $textArray = $(this).text().split('');

            for (var i = 0; i < $textArray.length; i++) {
                $('<span>').addClass(spanClass).text($textArray[i]).appendTo($div);
            }
        });

        $('.singleName').eq(eq).replaceWith($div);

        eq = eq + 1;
    }  
}








function hoverMenuLines() {

    $( ".innerUl ul li" ).hover(function() {

        var width = (500 - ($(this).find('a').width()))/ 2;
        $(this).find(".line").css('width', width);
        TweenMax.to($(this).find(".line"), 0.5, {scaleX:1, ease:Power4.easeInOut});

    }, function() {
        TweenMax.to($(this).find(".line"), 0.5, {scaleX:0, ease:Power4.easeInOut});
    })

}



function openExp(activeExp) {

    expOpen = true;

    $('.innerInsideExp').eq(activeExp).addClass( "activeExp" );

    TweenMax.to(".activeExp", 1, {y:'0%', ease: Power4.easeInOut});
    TweenMax.to(".activeExp .insideExp", 1, {y:'0%', ease: Power4.easeInOut});

    TweenMax.to(".activeExp .insideExp .photoExp div", 1, {y:'0%', opacity: 1, ease: Power4.easeInOut});

    TweenMax.to(".activeExp .insideExp .infosExp h2", 0.6, {y:'0px', ease: Power4.easeOut, delay: 0.6});
    TweenMax.to(".activeExp .insideExp .infosExp h2", 0.6, {opacity: 1, delay: 0.6});

    TweenMax.to(".activeExp .insideExp .infosExp h3", 0.6, {y:'0px', ease: Power4.easeOut, delay: 0.7});
    TweenMax.to(".activeExp .insideExp .infosExp h3", 0.6, {opacity: 0.5, delay: 0.7});

    TweenMax.to(".activeExp .insideExp .infosExp p", 0.6, {y:'0px', ease: Power4.easeOut, delay: 0.8});
    TweenMax.to(".activeExp .insideExp .infosExp p", 0.6, {opacity: 1, delay: 0.8});

    TweenMax.to(".activeExp .insideExp .infosExp a", 0.6, {y:'0px', ease: Power4.easeOut, delay: 0.9});
    TweenMax.to(".activeExp .insideExp .infosExp a", 0.6, {opacity: 0.4, delay: 0.9});

    TweenMax.to(".activeExp .insideExp .photoExp .credit", 0.6, {opacity: 1, delay: 0.9});

    TweenMax.staggerTo($(".activeExp .insideExp .numberExp p span"), 0.8, {y:'40%', ease: Power4.easeOut, delay: 1}, 0.1);

}

function closeExp() {

    $(document).on("click", ".innerInsideExp .insideExp .closeExpClick", function() {

        TweenMax.to(".activeExp", 1, {y:'100%', ease: Power4.easeInOut});
        TweenMax.to(".activeExp .insideExp", 1, {y:'-100%', ease: Power4.easeInOut, onComplete:function() {
            $('.activeExp').removeClass( "activeExp" );
            expOpen = false;
        }});

        TweenMax.to(".activeExp .insideExp .photoExp div", 1, {y:'10%', opacity: 0, ease: Power4.easeInOut});

        TweenMax.to(".activeExp .insideExp .infosExp h2", 0.6, {y:'20px', ease: Power4.easeIn});
        TweenMax.to(".activeExp .insideExp .infosExp h2", 0.6, {opacity: 0});

        TweenMax.to(".activeExp .insideExp .infosExp h3", 0.6, {y:'20px', ease: Power4.easeIn});
        TweenMax.to(".activeExp .insideExp .infosExp h3", 0.6, {opacity: 0});

        TweenMax.to(".activeExp .insideExp .infosExp p", 0.6, {y:'20px', ease: Power4.easeIn});
        TweenMax.to(".activeExp .insideExp .infosExp p", 0.6, {opacity: 0});

        TweenMax.to(".activeExp .insideExp .infosExp a", 0.6, {y:'20px', ease: Power4.easeIn});
        TweenMax.to(".activeExp .insideExp .infosExp a", 0.4, {opacity: 0});

        TweenMax.to(".activeExp .insideExp .photoExp .credit", 0, {opacity: 0});

        TweenMax.staggerTo($(".activeExp .insideExp .numberExp p span"), 0.6, {y:'80%', ease: Power4.easeIn}, -0.15);
    });
    
}




function openMenu() {
    // console.log('openMenu');
    $(document).on("click", ".burgerMenu", function() {

        // si le menu est fermé
        if(!$('.burgerMenu').hasClass('open')) {
            $('.burgerMenu').addClass( "open" );
            $('body').addClass('overflowHidden');

            TweenMax.to(".burgerMenu div:nth-child(1)", 0.6, {scaleX:1, ease:Power4.easeInOut});
            TweenMax.to(".burgerMenu div:nth-child(2)", 0.6, {scaleX:0.7, ease:Power4.easeInOut});
            TweenMax.to(".burgerMenu div:nth-child(3)", 0.6, {scaleX:1, ease:Power4.easeInOut});
            
            TweenMax.to(".menu", 0.8, {y:'0%', ease: Power4.easeInOut});
            TweenMax.to(".innerMenu", 0.8, {y:'0%', ease: Power4.easeInOut});

            TweenMax.staggerTo($(".menu .innerUl ul li"), 0.6, {opacity:1, delay: 0.4}, 0.1);
            TweenMax.staggerTo($(".menu .innerUl ul li"), 0.6, {y:'0', delay: 0.4, ease: Power4.easeOut}, 0.1);
            
            TweenMax.to(".signImg", 0.5, {opacity:1, delay: 1.2});
            TweenMax.to(".signName h2", 0.7, {opacity:1, delay: 1.3});
            TweenMax.to(".signName h3", 0.7, {opacity:1, delay: 1.4});
            TweenMax.to(".signName h2", 0.7, {y:'0', ease: Power4.easeOut, delay: 1.3});
            TweenMax.to(".signName h3", 0.7, {y:'0', ease: Power4.easeOut, delay: 1.4});

            TweenMax.to(".author", 0.4, {opacity:1, delay: 1.2});

        }else {
            closeMenu();
        }
    });
}

function closeMenu() {

    $('.burgerMenu').removeClass( "open" );
    $('body').removeClass('overflowHidden');

    TweenMax.to(".burgerMenu div:nth-child(1)", 0.6, {scaleX:0.7, ease:Power4.easeInOut});
    TweenMax.to(".burgerMenu div:nth-child(2)", 0.6, {scaleX:1, ease:Power4.easeInOut});
    TweenMax.to(".burgerMenu div:nth-child(3)", 0.6, {scaleX:0.7, ease:Power4.easeInOut});

    TweenMax.to(".menu", 0.8, {y:'-100%', ease: Power4.easeInOut});
    TweenMax.to(".innerMenu", 0.8, {y:'100%', ease: Power4.easeInOut});

    TweenMax.staggerTo($(".menu  .innerUl ul li"), 0.6, {opacity:0}, -0.1);
    TweenMax.staggerTo($(".menu .innerUl ul li"), 0.6, {y:'20px', ease: Power4.easeIn}, -0.1);
    
    TweenMax.to(".signImg", 0.5, {opacity:0});
    TweenMax.to(".signName h2", 0.7, {opacity:0});
    TweenMax.to(".signName h3", 0.7, {opacity:0});
    TweenMax.to(".signName h2", 0, {y:'10px', ease: Power4.easeOut, delay: 1});
    TweenMax.to(".signName h3", 0, {y:'10px', ease: Power4.easeOut, delay: 1});

    TweenMax.to(".author", 0.2, {opacity:0});

}



function le_raf() {
    raf = requestAnimationFrame(le_raf);

    if ($('body').hasClass('page-template-about')) {
        var parallaxImg = ((window.innerHeight / 2) - ($('.parallaxImg').offset().top + 200)) / (window.innerHeight / 2) * 60;
        TweenMax.to(".parallaxImg", 0, {y:parallaxImg, ease: Power4.easeInOut});

        if(($('.formation').offset().top - (window.innerHeight / 2 + 150)) < 0) {
            if (formationDone == false) {
                TweenMax.staggerTo($(".innerAbout .formation .tableForm .formationItem"), 1, {y:'-3Opx', opacity: 1, ease: Power4.easeOut}, 0.1);
                formationDone = true;
            }
        }

        if(($('.competences').offset().top - (window.innerHeight / 2 + 150)) < 0) {
            if (competencesDone == false) {
                TweenMax.staggerTo($(".innerAbout .competences .tableComp .competencesItem"), 1, {y:'-3Opx', opacity: 1, ease: Power4.easeOut}, 0.1);
                competencesDone = true;
            }
        }

        if(($('.insight').offset().top - (window.innerHeight)) < 0) {
            var parallaxInsight = ((window.innerHeight / 2) - ($('.bigNumber').offset().top + 200)) / (window.innerHeight / 2) * 50;
            TweenMax.to(".bigNumber", 0, {y:parallaxInsight, ease: Power4.easeInOut});
        }
    }

    // -----------------------------------------------------
    // Parallax img
    // -----------------------------------------------------

    var percentageW = (100 * currentMousePos.x / $(window).innerWidth() / 100);
    var percentageH = (100 * currentMousePos.y / $(window).innerHeight() / 100);

    percentageW = 2 * (percentageW - 1);
    percentageH = 2 * (percentageH - 1);

    percentageW = percentageW * (0.015 * ($('.activeExp .insideExp .photoExp').innerWidth()));
    percentageH = percentageH * (0.015 * ($('.activeExp .insideExp .photoExp').innerHeight()));

    if (window.innerWidth > 820) {
        TweenMax.to('.activeExp .insideExp .photoExp div', 0.8, {x: percentageW});
        TweenMax.to('.activeExp .insideExp .photoExp div', 0.8, {y: percentageH}); 
    }      

    

}



function canvasHome() {
    // console.log('canvasHome');

    //Width and height for our canvas
    var canvasWidth = 580; 
    var canvasHeight = 430;
    
    //the with and height of our spritesheet
    var spriteWidth = 580;
    var spriteHeight = 21930;
    
    //we are having one rows and 51 cols in the current sprite sheet
    var rows = 51; 
    var cols = 1; 
    
    //The 0th (first) row is for the right movement
    var trackRight = 0; 
    
    //1st (second) row for the left movement (counting the index from 0)
    var trackLeft = 1; 
    
    //To get the width of a single sprite we divided the width of sprite with the number of cols
    //because all the sprites are of equal width and height 
    var width = spriteWidth/cols; 
    
    //Same for the height we divided the height with number of rows 
    var height = spriteHeight/rows; 
    
    //Each row contains 8 frame and at start we will display the first frame (assuming the index from 0)
    var curFrame = 0; 
    
    //The total frame is 51 
    var frameCount = 51; 
    
    //x and y coordinates to render the sprite 
    var x=0;
    var y=0; 
    
    //x and y coordinates of the canvas to get the single frame 
    var srcX=0; 
    var srcY=0; 
    
    //tracking the movement left and write 
    var left = false;
    
                           //Assuming that at start the character will move right side 
    var right = true;
    
    //Speed of the movement 
    var speed = 12; 
    
    //Getting the canvas 
    var canvas = document.getElementById('canvasHome');
    
    //setting width and height of the canvas 
    canvas.width = canvasWidth;
    canvas.height = canvasHeight; 
    
    //Establishing a context to the canvas 
    var ctx = canvas.getContext("2d");
    
    //Creating an Image object for our character 
    var spritesheet = new Image(); 
    
    //Setting the source to the image file 
    spritesheet.src = directory_uri + "/img/spritesheet-3-min.png";




    function updateFrame(){
        //Updating the frame index 

        curFrame = curFrame + 1;
        // curFrame = ++curFrame % frameCount; 

        // console.log(curFrame);
        
        //Calculating the x coordinate for spritesheet 
        srcY = curFrame * height; 

        // console.log(srcY);

        ctx.clearRect(x,y,width,height);
    }


    function draw(){
        //Updating the frame 
        updateFrame();
        //Drawing the image 
        ctx.drawImage(spritesheet,srcX,srcY,width,height,x,y,width,height);
    }

    var rep = 1;

    setInterval(function() {

        if (rep < frameCount) { 
            draw();
            rep = rep + 1;
        }

    },40);
    
}







