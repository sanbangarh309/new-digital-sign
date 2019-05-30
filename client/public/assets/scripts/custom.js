// fade in #back-top
jQuery(document).ready(function($) {
//PARRALAX-EFFECT

(function ($) {

	$.fn.parallax = function () {

		var varWidthWindow = $(window).width();

		if (varWidthWindow < 768)
		{
			$(this).css('background-position', "");
			return;
		}

		$(this).each(function () {

			var $obj = $(this);

			console.log(this);

			$(window).scroll(function () {

				var varTopScroll = $(window).scrollTop();
				var varTopElement = $obj.offset().top;
				var varHeightWindow = $(window).height();

				var varElementVisibilityStartPoint = varTopElement - varHeightWindow;
				varElementVisibilityStartPoint = (varElementVisibilityStartPoint < 0) ? 0 : varElementVisibilityStartPoint;

				if (varTopElement + varHeightWindow < varTopScroll || varTopElement > varTopScroll + varHeightWindow) {
					/* console.log("Out of view"); */
					return;
				}

				var yPos = -((varTopScroll - varElementVisibilityStartPoint) * $obj.data('speed'));
				var bgpos = '50% ' + yPos + 'px';

				$obj.css('background-position', bgpos);

			});
		});

		return this;

	};


}(jQuery));

$(".myParallax").parallax();


$(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-top').fadeIn();
        } else {
            $('.back-top').fadeOut();
        }
    });

    // scroll body to 0px on click
    $('.back-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 1600);
        return false;
    });
});
/* FIXED==THEME */
//Scroll Menu
$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 50) {
        $(".home-header").addClass("fixed-theme");
    } else {
        $(".home-header").removeClass("fixed-theme");
    }
});

// HEADER FADE IN DOWN FUNCTION
$(window).scroll(function(){
    if ($(this).scrollTop() > 50) {
       $('.custom-navheader').addClass('fadedown');
	   $('.navbar-brand').addClass('small-size');
    } else {
       $('.custom-navheader').removeClass('fadedown');
	    $('.navbar-brand').removeClass('small-size');
    }
});

$(".myloginpage").click(function(){
	$('#lost-modal').modal('hide');
	$('#register-modal').modal('hide');
    $("#login-modal").modal('show');
 });
   $(".myloginpage1").click(function(){
	$('#lost-modal').modal('hide');
	$('#login-modal').modal('hide');
    $("#register-modal").modal('show');
 });

   $(".lostform").click(function(){
	$('#register-modal').modal('hide');
	$('#login-modal').modal('hide');
    $("#lost-modal").modal('show');
 });


$(document).ready(function(){
    $('.drop-tog').click(function(event){
        event.stopPropagation();
         $(".drop-downbox").slideToggle("fast");
    });
    $(".drop-downbox").on("click", function (event) {
        event.stopPropagation();
    });
});

$(document).on("click", function () {
    $(".drop-downbox").hide();
});

// RESPONSIVE SIDE MENU FUNCTION
	  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
	}

	function closeNav() {
		document.getElementById("mySidenav").style.width = "0";
	}


$(document).ready(function() {
			// $('.owl-carousel').owlCarousel({
			//   loop: true,
			//   margin: 10,
			//   responsiveClass: true,
			//   responsive: {
			// 	0: {
			// 	  items: 1,
			// 	  nav: true
			// 	},
			// 	600: {
			// 	  items: 3,
			// 	  nav: false
			// 	},
			// 	1000: {
			// 	  items: 12,
			// 	  nav: true,
			// 	  loop: false,
			// 	  margin: 20
			// 	}
			//   }
			// })
		  })
 });
