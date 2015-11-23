/*---LEFT BAR ACCORDION----*/

var isCordovaApp = document.URL.indexOf('http://') === -1;


console.log("isCordova:" + isCordovaApp);

$(function() {
    $('#nav-accordion').dcAccordion({
        eventType: 'click',
        autoClose: true,
        saveState: true,
        disableLink: true,
        speed: 'slow',
        showCount: false,
        autoExpand: true,
//        cookie: 'dcjq-accordion-1',
        classExpand: 'dcjq-current-parent'
    });
});

var Script = function () {


//    sidebar dropdown menu auto scrolling

    jQuery('#sidebar .sub-menu > a').click(function () {
        var o = ($(this).offset());
        diff = 250 - o.top;
        if(diff>0)
            $("#sidebar").scrollTo("-="+Math.abs(diff),500);
        else
            $("#sidebar").scrollTo("+="+Math.abs(diff),500);
    });



//    sidebar toggle

    $(function() {
        function responsiveView() {
            var wSize = $(window).width();
            if (wSize <= 768) {
                $('#container').addClass('sidebar-closed');
                //$('#sidebar > ul').hide();
            }

            if (wSize > 768) {
                $('#container').removeClass('sidebar-closed');
               // $('#sidebar > ul').show();
            }
        }
        $(window).on('load', responsiveView);
        $(window).on('resize', responsiveView);
    });

    $('.fa-bars').click(function () {
        if ($('#container').hasClass("sidebar-closed")) {
            //$('#main-content').css({'margin-left': '0px'});
						$("#container").removeClass("sidebar-closed");
            //$('#sidebar').css({'margin-left': '-210px'});
						//#container #sidebar {'margin-left': '-210px'}
						//#container.sidebar-closed #sidebar {'margin-left': '-210px'}
            //$('#sidebar > ul').hide();
            //$("#container").addClass("sidebar-closed");
        } else {
           // $('#main-content').css({'margin-left': '210px'});
            //$('#sidebar > ul').show();
           // $('#sidebar').css({'margin-left': '0'});
            $("#container").addClass("sidebar-closed");
        }
    });

    $('li.sub-menu > ul.sub > li').on('click', function() {
        var wSize = $(window).width();
        if (wSize <= 768) {
            $('#container').addClass('sidebar-closed');
           // $('#sidebar > ul').hide();
        }
    });
    $('li.home > a').on('click', function() {
        var wSize = $(window).width();
        if (wSize <= 768) {
            $('#container').addClass('sidebar-closed');
           // $('#sidebar > ul').hide();
        }
    });

// custom scrollbar

if (isCordovaApp === false){
    $("#sidebar").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled:false, cursorborder: ''});

    $("html").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '6', cursorborderradius: '10px', background: '#404040', spacebarenabled:false,  cursorborder: '', zindex: '1000'});
}
// widget tools

    jQuery('.panel .tools .fa-chevron-down').click(function () {
        var el = jQuery(this).parents(".panel").children(".panel-body");
        if (jQuery(this).hasClass("fa-chevron-down")) {
            jQuery(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else {
            jQuery(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200);
        }
    });

    jQuery('.panel .tools .fa-times').click(function () {
        jQuery(this).parents(".panel").parent().remove();
    });


//    tool tips

    //$('.tooltips').tooltip();

//    popovers

    $('.popovers').popover();



// custom bar chart

    if ($(".custom-bar-chart")) {
        $(".bar").each(function () {
            var i = $(this).find(".value").html();
            $(this).find(".value").html("");
            $(this).find(".value").animate({
                height: i
            }, 2000)
        })
    }

$("body").on("click", ".itemLike", function(event){
	console.log("item was liked");
	console.dir(event);
	/// Do "like" stuff request
	$(this).addClass("active"); 
	/// Do unlike stuff request{
	//$(this).removeClass("active"); 

});


$(".sidebarOverMask").click(function () {
	$("#container").addClass("sidebar-closed");
	})

$(".sidebarOverMask").on("touchmove", function(e){
	//alert('ii');
    e.preventDefault();
});
$("#sidebar").on("touchmove", function(e){
	//alert('aaa');
  //  $('body').css('overflow','hidden');
  //  $('body').css('position','fixed');
});



}();

