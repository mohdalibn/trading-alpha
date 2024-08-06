
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


$(document).ready(function() { 

    $.ajax({
        url: '/dashboardinfo',
        method: 'GET',
        success: function(response) {
            $(".header-username").html(response.username);


            // ---------------------------------------------------------------------
            // Displaying the General user related information
            var displayDiv = $(".content2");
            displayDiv.empty();
            
            var infoTitle = $("<h1>").addClass("info-title").text("User Related Information");

            displayDiv.append(infoTitle);

            displayDiv.append($("<p>").addClass("info-desc").html("<strong>Your Username: </strong>" + response.username));
            displayDiv.append($("<p>").addClass("info-desc").html("<strong>Your Password: </strong>" + response.password));
            displayDiv.append($("<p>").addClass("info-desc").html("<strong>No. of different Stocks in Portfolio: </strong>" + response.portfolio.length));
            displayDiv.append($("<p>").addClass("info-desc").html("<strong>Available Funding: </strong>$" + response.funding));
            displayDiv.append($("<p>").addClass("info-desc").html("<strong>Total Value of Portfolio: </strong>$" + response.totalValue));
            displayDiv.append($("<p>").addClass("info-desc").html("<strong>No. of different Friends: </strong>" + response.friendList.length));
            displayDiv.append($("<p>").addClass("info-desc").html("<strong>No. of Incomming Friend Requests: </strong>" + response.requestList.length));

          // ---------------------------------------------------------------------
          // Displaying the game related information
            var cont1BottomDiv = $(".cont1-bottom");
            cont1BottomDiv.empty();

            var gameInfoTitle = $("<h1>").addClass("game-info-title").text("Game Information");

            cont1BottomDiv.append(gameInfoTitle);

            cont1BottomDiv.append($("<p>").addClass("game-info-desc").html("<strong>Status: </strong>" + response.userStatus));

            if(!response.gameID){
                cont1BottomDiv.append($("<p>").addClass("game-info-desc").html("<strong>Game ID: </strong>No Game!"));
            }
            else{
              cont1BottomDiv.append($("<p>").addClass("game-info-desc").html("<strong>Current Game ID: </strong>" + response.userStatus));
            }

            response.ranking = 3;
            response.bestPlayer = "SimonRiley";

            cont1BottomDiv.append($("<p>").addClass("game-info-desc").html("<strong>Current Ranking: </strong>" + response.ranking));


            cont1BottomDiv.append($("<p>").addClass("game-info-desc").html("<strong>Best Player: </strong>" + response.bestPlayer));
            



        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
          }
    });
    

}); 




