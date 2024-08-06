
// Getting the username of the current player, common for all the pages
$(document).ready(function() { 

    $.ajax({
        url: '/dashboardinfo',
        method: 'GET',
        success: function(response) {
            $(".header-username").html(response.username);
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
          }
    });
    

}); 