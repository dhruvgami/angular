var dp = jQuery;
//dp.noConflict();
dp(document).ready(function() {
    //EXPANDING THUMBNAIL
    Grid.init();
    // Superslides fullscreen slider
    dp('#slides').superslides({
        animation: 'slide', // Choose between slide or fade
        play: 4000
    });
    dp('#slides_cs').superslides({
        animation: 'slide', // Choose between slide or fade
        play: 4000,
        pagination: false
    });
    //BACK TO TOP
    dp("#backtotop").backToTop();
    //PARALLAX
    dp('.bg-about').parallax("10%", 1);
    dp('.bg-skill').parallax("10%", 1);
    //VIDEO BACKGROUND
    var videobackground = new dp.backgroundVideo(dp('.bg-video'), {
        "align": "centerXY",
        "muted": "muted", // change value "muted" or "no"
        "width": 1280,
        "height": 720,
        "path": "video/",
        "filename": "steven",
        "types": ["mp4", "ogg", "webm"]
    });
    //TOOLTIP
    dp('a[data-toggle="tooltip"]').tooltip();
    //VIDEO INDEX
    var videobackground = new dp.backgroundVideo(dp('.home-video'), {
        "align": "centerXY",
        "muted": "muted", // change value "muted" or "no"
        "width": 1280,
        "height": 720,
        "path": "videos/",
        "filename": "lobby",
        "types": ["mp4", "ogg", "webm"]
    });
    //NIVO LIGHTBOX
    dp('.popup').venobox();

    var sudoSlider = dp("#slider").sudoSlider({
        customLink: 'a.customLink',
        prevNext: false
    });

    //TESTIMONIAL SLIDER
    dp(".testimonial-slider").sudoSlider({
        customLink: '.testimonial-item > a',
        speed: 400,
        responsive: true,
        effect: "fadeOutIn",
        useCSS: true,
        continuous: true,
        prevNext: false,
        updateBefore: true
    });
    
    //ANIMATED OBJECT
    dp(".animatez").waypoint(function(direction) {
        var effect = dp(this).attr('data-effect');
        dp(this).removeClass('animatez');
        dp(this).addClass('animated ' + effect);
    }, {
        offset: '70%'
    });
    //ANIMATED SKILL BAR
    dp(".bar").waypoint(function(direction) {
        var value = dp(this).attr('data-value');
        dp(this).css({
            'width': value + '%'
        });
    }, {
        offset: '80%'
    });

    //COUNT UP ON SCREEN
    dp('.countTo').waypoint(function(direction) {
        dp('.countTo').countTo();
        dp('.countTo').removeClass('countTo');
        dp(this).removeClass('timer');
    }, {
        offset: "80%"
    });

    //SMOOTH SCROLL
    dp(".sscroll").smoothScroll();

    //FITVIDS
    dp(".responsive-video").fitVids();

    //BACKSTRETCH
    if(dp.fn.backstretch){
        var bg_image = dp(".home-image");
        var bg_image_src = bg_image.data("src");
        bg_image.backstretch(bg_image_src);
    }
    //COUNT DOWN COMING SOON
    if (dp.fn.countdown) {
        var endDate = "December 31, 2014  15:03:25"; // <-- Change to your date launch.
        dp('.countdown.styled').countdown({
            date: endDate,
            render: function(data) {
                dp(this.el).html("<div>" + this.leadingZeros(data.days, 3) + " <span>days</span></div><div>" + this.leadingZeros(data.hours, 2) + " <span>hrs</span></div><div>" + this.leadingZeros(data.min, 2) + " <span>min</span></div><div>" + this.leadingZeros(data.sec, 2) + " <span>sec</span></div>");
            }
        });
    }

    //HTML 5 Audio Player
    if (dp.fn.mediaelementplayer) {
        dp('audio , video').mediaelementplayer({
            loop: false,
            enableAutosize: false,
            features: ['playpause', 'progress', 'current', 'volume'],
            audioHeight: 40,
            alwaysShowHours: false

        });
    }

    $('.leed-btnWater').on('click', function() {
        var firstname = $('.firstname').val();
        var lastname = $('.lastname').val();
        var email = $('.email').val();
        var company = $('.company').val();
        $('#FirstName').val(firstname);
        $('#LastName').val(lastname);
        $('#Email').val(email);
        $('#Company').val(company);
        $('.mktoButton').trigger('click');
    });

});

	$('.demo-field').blur(function()
	{
	    
		if( $(this).val() ) {
			  $(this).addClass('full-field');
		}
		else {
			  $(this).removeClass('full-field');
		}    
	});

$('.email-field').blur(function()
		      {
			  var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
			  if(regEx.test($(this).val()))
			  {
                              $(this).addClass('full-field');
			  }
			  else {
                              $(this).removeClass('full-field');
			  }
		      });

var main_host = "";
if ( ((location.hostname).split('www.')).length == 1 ){
    main_host = ((location.hostname).split('www.'))[0]
}
else{
    main_host = ((location.hostname).split('www.'))[1]
}

var main_url = 'assets/json/downtimeFlag.json';
$.ajax({
      url: main_url,
      type: "GET",
    }).done(function(data) {
      if (data){
        $( document ).ready(function() {

          if (sessionStorage.intimate_downtime){
            if (sessionStorage.intimate_downtime == "activate"){
              //do nothing
            }
            else{
              return;
            }
          }
          sessionStorage.setItem("intimate_downtime", "activate");
          $('.jquery-header-bar').css('font-family', '"Montserrat", Helvetica, sans-serif');
          $('.notification p').first().html("<span style='font-size: 16px;'><b>LEEDON.IO SCHEDULED MAINTENANCE MAY 6 - MAY 7</b></span><br><span style='font-size: 13px;'>LEEDON.IO will be offline from 9 pm EST on May 6, 2016 until 12 pm on May, 7, 2016 for maintenance. During this time, you will not be able to log into the system, while we perform routine maintenance and implement system updates.<br><a class='anchor_blue' href='mailto:contact@leedon.io'>Contact us for more information.</a>");
          $('.jquery-header-bar').hide().delay(3000).slideDown(400);
          $('.jquery-arrow').click(function(){
              sessionStorage.intimate_downtime = "deactivate"
              $('.jquery-header-bar').slideToggle();
          });
        });
      }
});


/*if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && $(window).width() > 767) { // only init skrollr on non-mobile devices
    skrollr.init(yourOptions);
}

$(window).on('resize', function () {
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { // no reason to destroy on mobile
        if ($(window).width() <= 767) {
          skrollr.init().destroy(); // skrollr.init() returns the singleton created above
        }
    }

});
*/
/*var container = document.querySelector('#portfoliomasonry');
var msnry = new Masonry(container, {
    itemSelector: '.portfolio-item',
    columnWidth: '.portfolio-item',
}); */
