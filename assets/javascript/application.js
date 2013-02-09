//modified from http://andrewhorsman.net/ruby-oauth-google-calendar-data/
function find_header_by_position(position) {
  var i;
  for (i = $.headers.length - 1; i >= 0; --i) {
    if (position > $.headers[i][0])
      return $.headers[i];
  }
}

function display_header() {
  if ($.current_header === undefined) return;
  var temp = $.current_header[1];
  $("#current-header").html(temp);
}

function init_headers() {
  $.headers = [];
  $(".blog-header").each(function() {
    var temp = [ $(this).position().top, $(this).data('title') ];
    $.headers.push(temp);
  });
  $.current_header = find_header_by_position($(window).scrollTop());
  display_header();
}

$(function() {
  setTimeout(init_headers,500);
  $.scroll_event = false;

  $(window).scroll(function() {
    // Stops first scroll event, thus preventing a double fade
    // sequence on page load.
    if (!$.scroll_event) {
      $.scroll_event = true;
      return;
    }

    var header = find_header_by_position($(window).scrollTop());
    if ($.current_header != header) {
      $.current_header = header;
      display_header();
    }
  });
});