$(document).ready(function() {
    // Social media icons animation on hover
    $('.icons a').hover(function() {
      $(this).toggleClass('animated jello');
    });
  
    // Contact icons animation on hover
    $('.contact-icons a').hover(function() {
      $(this).toggleClass('animated tada');
    });
  });
  