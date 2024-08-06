
// This JQuery Script tries to find the stock input by the user in the searchbar
$(document).ready(function() {

    // Checks if the user clicked the enter button
    $('.buy-searchbar').keypress(function(event) {

        if (event.which == 13) { 
            getTheStockInfo();
        }
    });

    // Checks if the user clicked the search button
    $('.buy-search-button-div').on('click', function() {
        getTheStockInfo();
    });


    function getTheStockInfo(){
        var stockTicker = $('.buy-searchbar').val().toUpperCase();
        // console.log(stockTicker);
        $.ajax({
            url: '/stockinfo/' + stockTicker,
            method: 'GET',
            success: function(response, textStatus, xhr) {
 
                if (xhr.status == 200) {

                    // Checking if the content type of the response is a json
                    var contentType = xhr.getResponseHeader('Content-Type');
            
                    if (contentType && contentType.indexOf('application/json') !== -1) {

                        var jsonObject = JSON.parse(response);
                        var portfolioList = jsonObject;

                        var itemContent = $('<div class="item-content"></div>');
                        itemContent.append($("<p>").addClass("ticker-name").text("Symbol: " + portfolioList.symbol));
                        itemContent.append($("<p>").text("Name: " + portfolioList.name));
                        itemContent.append($("<p>").text("Price: $" + portfolioList.price));
                        itemContent.append($("<p>").text("Exchange: " + portfolioList.exchange));
                        itemContent.append($("<p>").text("Exc. Short Name: " + portfolioList.exchangeShortName));
                        itemContent.append($("<p>").text("Type: " + portfolioList.type));
                        var itemBuy = $('<div class="item-buy"></div>');
                        itemBuy.append('<input type="text" class="buy-searchbar buy-quant" placeholder="Enter Quantity">');
                        itemBuy.append('<button class="item-buy-button">Buy</button>');
                        
                        var portfolioItem = $('<div class="portfolio-item"></div>');
                        portfolioItem.append(itemContent);
                        portfolioItem.append(itemBuy);

                        $('.portfolio-container').append(portfolioItem);
    
    
                    } else {

                        var noPortDiv = $('<div class="no-portfolio-div"></div>');
                        noPortDiv.text("Stock with the ticker " + stockTicker + " not found in the database!");
                        
                        $('.portfolio-container').append(noPortDiv);

                        // hiding the no portfolio div after 2 seconds
                        setTimeout(function(){
                            $('.no-portfolio-div').hide();
                        }, 2000);

                    }
                }

            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Error:', errorThrown);
            }
        });
    }

    $('.portfolio-container').on('keypress', '.buy-quant', function(event) {
        if (event.which == 13) { 
                var quantity = $(this).val();
                var username = $('.header-username').text();
                var stockTicker = $(this).parent().parent().find('.ticker-name').text().split(' ')[1];
                console.log(username);
                console.log(quantity);
                console.log(stockTicker);
        }
    });

    $('.portfolio-container').on('click', '.item-buy-button', function() {

        var quantity = $('.buy-quant').val();
        var username = $('.header-username').text();

        // get the stock ticker of this portfolio item
        var stockTicker = $(this).parent().parent().find('.ticker-name').text().split(' ')[1];

        $.ajax({
            url: '/buy/' + username + '/' + stockTicker + '/' + quantity,
            method: 'POST',
            success: function(response, textStatus, xhr) {
                if (xhr.status == 200) {
                    var result = $("<p>").addClass("result-success").text(response);
                    $(".content2").append(result);
                    
                    // hiding result after 2 seconds
                    setTimeout(function(){
                        result.hide();
                    }, 2000);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                var result = $("<p>").addClass("result-error").text(errorThrown);
                $(".content2").append(result);

                // hiding result after 2 seconds
                setTimeout(function(){
                    result.hide();
                }, 2000);
            }
        });
    });

});