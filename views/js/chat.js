
// This jquery script is used to implement socket.io messaging on the client side
$(document).ready(()=>{
    var socket = io.connect('/');
    var usersTyping = {};
    
    $(".msg-button").click((event)=>{
        event.preventDefault();
        let username = $(".header-username").text();
        let msgBoxText = $(".text-input").val();
        socket.emit('chat', {name: username, message: msgBoxText})
        $(".text-input").val("");
    });

    // Checking if the user clicked on Enter key after typing text
    $('.text-input').keypress((event) => {
        if (event.which === 13) { 
            let username = $(".header-username").text();
            let msgBoxText = $(".text-input").val();
            socket.emit('chat', {name: username, message: msgBoxText})
            $(".text-input").val("");
        }
    });

    $('.text-input').keypress((event)=>{
        let username = $(".header-username").text();
        socket.emit('typing', {name: username});
    })

    socket.on("chat", (data) => {

        let msgItem = $("<div class='msg-item'></div>");
        msgItem.append($("<p class='msg-text'></p>").html("<strong>" + data.name + ":</strong> "+data.message));

        // If the message is sent by the current user, then apply the css in the .curr-player-msg class
        let username = $(".header-username").text();
        if(data.name == username){
            msgItem.addClass("curr-player-msg");
        }

        // Adding the msg Item div to the inner chats container Div
        $(".inner-chats-cont").append(msgItem);

        // Automatically scroll to the bottom of the .inner-chats-cont div
        $('.inner-chats-cont').scrollTop($('.inner-chats-cont')[0].scrollHeight);

    })


    socket.on("typing", (data) => {
        typingUsers[data.name] = true; // Add the user to the list of typing users

        updateTypingDiv();

        // Removing user from the typing list after 2 seconds
        setTimeout(() => {
            delete usersTyping[data.name]; 
            updateTypingIndicator();
        }, 2000); 
    });

    function updateTypingDiv() {

        let typingUsersArray = Object.keys(usersTyping);

        if(typingUsersArray.length > 0){
            $(".typing-container").text(typingUsersArray.join(", ") + " is typing...");
        } 
        else{
            $(".typing-container").text("");
        }
    }

});
    