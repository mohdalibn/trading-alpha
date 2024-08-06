
// This is the client-side JavaScript for Player Registration Authentication

$(document).ready(function() {
    
    $(".register-button").click(function(e) {
            e.preventDefault();

            // Getting the username and password from the body using the IDs
            var username = $("#username").val();
            var password = $("#password").val();
            
            // Making an Ajax call to the server to authenticate the user registration credential
            $.ajax({
            url: "/register",
            type: "POST",
            data: {
                username: username,
                password: password
            },
            success: function(response) {
                
                console.log(response); // Logging the response to the console

                // Adding login success text as well as success class for custom css
                $(".auth-message").addClass("auth-message-success");
                $(".auth-message").text("Your Registration was successful!");

                window.location.href = "/dashboard";

                // // Waiting 1.5 seconds before redirecting the player to their dashboard page
                // setTimeout(function() {
                //     window.location.href = "/dashboard";
                // }, 1500);

            },
            error: function(err) {
                
                console.log(err.responseText); // Logging the error to the console
 
                // Adding login error text as well as error class for custom css
                $(".auth-message").addClass("auth-message-error");
                $(".auth-message").text("Registration Failed! The username " + username + " already exists!");

                window.location.href = "/register";

                // // Waiting 2 seconds before reloading the registration page again
                // setTimeout(function() {
                //     window.location.href = "/register";
                // }, 2000);


            }
        });

    });
});

