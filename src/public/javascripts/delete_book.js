$(document).ready( function() {
  $('#delete-form').on( 'submit', function() {
    var action = $(this).attr( 'action' )

    console.log( action )

    $.ajax({
      url: action,
      type: 'DELETE',
      success: function() {
        window.location = '/'
      }
    });
  })
})
