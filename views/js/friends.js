$(document).ready(function(){

    // Initially getting the friend list and request list for display purpose
    getFriendInfoLists();

    // Listens for click on the refresh button to update the lists on the frontend
    $(".refresh-div").on("click", function(){
        getFriendInfoLists();
    });

    // This functions gets the current players friend list and request list
    function getFriendInfoLists(){
        $.ajax({
            url: '/friendsinfo',
            method: 'GET',
            success: function(response) {
            
                console.log(response);  

                // extracting the friendList and requestList of the current player
                const friendList = response.friendList;
                const requestList = response.requestList;
    
                // If the current player's friend list is empty
                if(friendList.length == 0){

                    $("#friend-no-result").show();
                    
                    // removing any existing friend list items
                    $(".friends-list-div").children('.friend-list-item').remove();

                }
                
                // If the current player's request list is empty
                if(requestList.length == 0){

                    $("#request-no-result").show();

                    // removing any existing request list items
                    $(".pending-request-div").children('.pending-list-item').remove();

                }
    
                // If the current player's friend list is not empty
                if(friendList.length > 0){
                    
                    // $(".friends-list-div").children('.no-result-div').remove();
                    $("#friend-no-result").hide();

                    // removing any existing friend list items
                    $(".friends-list-div").children('.friend-list-item').remove();
    
                    friendList.forEach((friend) => {
                    
                        var friendListItem = $("<div>").addClass("friend-list-item");
                        var friendProfilePic = $("<div>").addClass("friend-profile-pic");
                        var friendSvg = $("<img>").attr("src", "./assets/pp1.svg").attr("alt", "SVG Profile Picture").addClass("friend-svg");
                        friendProfilePic.append(friendSvg);
                        friendListItem.append(friendProfilePic);
                        var friendInfoCont = $("<div>").addClass("friend-info-cont");
                        var friendUsername = $("<div>").addClass("friend-username").text(friend);
                        friendInfoCont.append(friendUsername);
                        var friendStatus = $("<div>").addClass("friend-status").text("Player");
                        friendInfoCont.append(friendStatus);
                        friendListItem.append(friendInfoCont);
                        $(".friends-list-div").append(friendListItem);
    
                    });
                
                }
    
                // If the current player's request list is not empty
                if(requestList.length > 0){
                    
                    // $(".pending-request-div").children('.no-result-div').remove();
                    $("#request-no-result").hide();

                    $(".pending-request-div").children('.pending-list-item').remove();
    
                    requestList.forEach((request) => {
                        
    
                        var pendingRequestItem = $("<div>").addClass("pending-request-item");
                        var friendProfilePic = $("<div>").addClass("friend-profile-pic");
                        var friendSvg = $("<img>").attr("src", "./assets/pp1.svg").attr("alt", "SVG Profile Picture").addClass("friend-svg");
                        friendProfilePic.append(friendSvg);
                        pendingRequestItem.append(friendProfilePic);
                        var friendInfoCont = $("<div>").addClass("friend-info-cont");
                        var friendUsername = $("<div>").addClass("friend-username").text(request);
                        friendInfoCont.append(friendUsername);
                        var friendStatus = $("<div>").addClass("friend-status").text("Player");
                        friendInfoCont.append(friendStatus);
                        pendingRequestItem.append(friendInfoCont);
                        var acceptButtonDiv = $("<div>").addClass("accept-button-div");
                        var acceptButton = $("<button>").text("Accept").addClass("accept-button");
                        acceptButtonDiv.append(acceptButton);
                        pendingRequestItem.append(acceptButtonDiv);
                        $(".pending-request-div").append(pendingRequestItem);
    
    
                    });
                }
    
    
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
              }
        });
    }


    $(document).on("click", ".friend-search-button-div", function(){
        var username = $(".header-username").text();
        var friendName = $(".friend-searchbar").val();

        // make an ajax call to search for the friend with the name in the input tag
        $.ajax({
            url: '/' + username +'/addfriend/' + friendName,
            method: 'POST',
            success: function(response) {

                // console.log(response);

                $(".add-result-div").text(response);
                $(".add-result-div").addClass("add-result-success");

                // removing the message for 2 seconds
                setTimeout(function(){
                    $(".add-result-div").removeClass("add-result-success");
                    $(".add-result-div").text("");
                }, 2000);

                // Making a call to get the updated friend list and request list
                getFriendInfoLists();


            },
            error: function(xhr, status, error) {
                
                // Getting the error response from the express server
                var responseText = xhr.responseText;

                $(".add-result-div").text(responseText);
                $(".add-result-div").addClass("add-result-error");

                // removing the message for 2 seconds
                setTimeout(function(){
                    $(".add-result-div").removeClass("add-result-error");
                    $(".add-result-div").text("");
                }, 2000);

              }
        });

    });


    $(document).on("click", ".accept-button-div", function(){
        
        var friendUsername = $(this).parent().find(".friend-username").text();
        var username = $(".header-username").text();

        $.ajax({
            url: '/' + username +'/acceptfriend/' + friendUsername, // Changed friendName to friendUsername
            method: 'POST',
            success: function(response) {
                console.log(response);
        
                $(".add-result-div").text(response);
                $(".add-result-div").addClass("add-result-success");

                // removing the message for 2 seconds
                setTimeout(function(){
                    $(".add-result-div").removeClass("add-result-success");
                    $(".add-result-div").text("");
                }, 2000);

                // refresh the friend list and request list
                getFriendInfoLists();

            },
            error: function(xhr, status, error) {

                // Getting the error response from the express server
                var responseText = xhr.responseText;

                $(".add-result-div").text(responseText);
                $(".add-result-div").addClass("add-result-error");

                // removing the message for 2 seconds
                setTimeout(function(){
                    $(".add-result-div").removeClass("add-result-error");
                    $(".add-result-div").text("");
                }, 2000);


              }
        });

    });

});

$(document).ready(function(){

    // check if friend-search-button-div is clicked and get the value in the input tag friend-searchbar
    // Event delegation for ".friend-search-button-div"
    $(document).on("click", ".friend-search-button-div", function(){
        // Your code here
    });

});
