// Navigation Scripts to Change Header on Scroll
jQuery(document).ready(function($) {

  var dropOn = 0;

  $('#MenuRessources').focus(function() {
    if (dropOn === 1) {
      $('.dropdown-menu').hide();
      dropOn = 0;
    } else {
      $('.dropdown-menu').show();
      dropOn = 1;
    }
  });

  $(window).scroll(function() {
    var height = $(window).scrollTop();

    if (height > 0) {
      $('.navbar-custom').addClass('is-visible is-fixed');
    } else {
      $('.navbar-custom').removeClass('is-visible is-fixed');
    }
  });


  $('div.accordion-body').on('shown', function() {
    $(this).parent("div").find(".icon-chevron-down")
      .removeClass("icon-chevron-down").addClass("icon-chevron-up");
  });

  $('div.accordion-body').on('hidden', function() {
    $(this).parent("div").find(".icon-chevron-up")
      .removeClass("icon-chevron-up").addClass("icon-chevron-down");
  });

  $('.unCollapser').on('click', function() {
    $(this).parent(".unCollapse").find(".collapse")
      .removeClass(".collapse").addClass(".noCollapse");
  });



  $(document).click(function(event) {
    if (!($(event.target).hasClass("unCollapser"))) {
      $('.collapse').collapse('hide');
    }
  });
});

$(document).ready(function() {
  $('.js-scrollTo').on('click', function() { // Au clic sur un élément
    window.scrollTo(0, 0);
  });
});