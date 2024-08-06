

updateGameListDisplay()

$(document).ready(function() {

    // Getting the specific divs to update the date and time onto
    let timeDiv = document.getElementById("curr-time");
    let dateDiv = document.getElementById("curr-date"); 


    // Setting the interval to update the time and date every 500 milliseconds
    setInterval(() => {
        let currDateTime = new Date();
        timeDiv.innerHTML = currDateTime.toLocaleTimeString('en-CA', {hour:'2-digit',minute: '2-digit'});
        dateDiv.innerHTML = (new Intl.DateTimeFormat('en-CA', {dateStyle: 'full'}).format(currDateTime));
    }, 500);

});



function updateGameListDisplay(){

    // var adminUsername = $(".header-username").html();
    var adminUsername = "adminUsr";

    $.ajax({
        url: '/'+ adminUsername + '/getgames',
        method: 'GET',
        success: function(response) {

            var gameListCont = $(".cont1-bottom");

            // removing all the game-item-div
            $(".game-item-div").remove();

            $.each(response, function(index, gameItem) {

                var gameItemDiv = $("<div>").addClass("game-item-div");
                gameItemDiv.append($("<p>").addClass("game-text").text("Game ID: " + gameItem.gameID));
                gameItemDiv.append($("<p>").addClass("game-text").text("Game ID: " + gameItem.gameStatus));
                gameListCont.append(gameItemDiv);

            });

        },
        error: function(xhr, status, error) {
            
            // Getting the error response from the express server
            var responseText = xhr.responseText;

            console.log(responseText);

          }
    });
}


$(document).ready(function() { 

    $(".create-button").click(function(e) {
        e.preventDefault();

        // Getting the game ID and admin username
        var gameID = $(".create-game-searchbar").val();
        var adminUsername = $(".header-username").text();
        

        $.ajax({
            url: '/'+ adminUsername + '/creategame/' + gameID,
            type: "POST",
            success: function(response) {

                var result = $("<p>").addClass("result-success").text(response);
                $(".content2").append(result);
                
                // hiding result after 2 seconds
                setTimeout(function(){
                    result.hide();
                }, 2000);

                updateGameListDisplay();

            },
            error: function(err) {
                
                var result = $("<p>").addClass("result-error").text(err.responseText);
                $(".content2").append(result);

                // hiding result after 2 seconds
                setTimeout(function(){
                    result.hide();
                }, 2000);

            }
        }); 
    });
});

$(document).ready(function() { 

    // check if create-button was clicked
    $(".start-button").click(function(e) {
        e.preventDefault();

        // Getting the game ID and admin username
        var gameID = $(".start-game-searchbar").val();
        var adminUsername = $(".header-username").text();
        
        // Making an Ajax call to the server to authenticate the user registration credential
        $.ajax({
            url: '/'+ adminUsername + '/creategame/' + gameID,
            type: "POST",
            success: function(response) {

                var result = $("<p>").addClass("result-success").text(response);
                $(".content2").append(result);
                
                // hiding result after 2 seconds
                setTimeout(function(){
                    result.hide();
                }, 2000);

            },
            error: function(err) {
                
                var result = $("<p>").addClass("result-error").text(err.responseText);
                $(".content2").append(result);

                // hiding result after 2 seconds
                setTimeout(function(){
                    result.hide();
                }, 2000);

            }
        }); 
    });

});

$(document).ready(function() { 

});

$(document).ready(function() { 

});