
// This jquery is used to filter the owned stocks in the sell stock page
$(document).ready(function() {

    $('#searchInput').on('keyup', function() {

        var searchTerm = $(this).val().toLowerCase();
  
        $('.portfolio-item').each(function() {

            var itemContent = $(this).text().toLowerCase();
    
            if (itemContent.includes(searchTerm)) {

                $(this).show();
            } 
            else {
                $(this).hide();
            }

        });
    });
});


// This jquery function is used to get the porfolio of the user and display it on the sell page
$(document).ready(function() {

    $.ajax({
        url: '/portfolio',
        type: 'GET',
        success: function(data, textStatus, xhr) {
            
            if (xhr.status == 200) {

                // Checking if the content type of the response is a json
                var contentType = xhr.getResponseHeader('Content-Type');
        
                if (contentType && contentType.indexOf('application/json') !== -1) {

                    var jsonObject = JSON.parse(data);
                    var portfolioList = jsonObject.portfolio;

                    $.each(portfolioList, function(index, stockObj) {

                        var itemContent = $('<div class="item-content"></div>');
                        itemContent.append($("<p>").text("Stock Symbol: " + stockObj.symbol));
                        itemContent.append($("<p>").text("Stock Name: " + stockObj.name));
                        itemContent.append($("<p>").text("Quantity: " + stockObj.quantity));
                        itemContent.append($("<p>").text("Purchase Price: $" + stockObj.purchasePrice));
                        itemContent.append($("<p>").text("Current Price: $" + stockObj.currentPrice));
                        itemContent.append($("<p>").text("Purchase Date: " + stockObj.purchaseDate));
                        itemContent.append($("<p>").text("Profit: " + stockObj.profit));
                        itemContent.append($("<p>").text("Total Value: " + stockObj.totalValue));
                        var itemSell = $('<div class="item-sell"></div>');
                        itemSell.append('<input type="text" class="sell-searchbar sell-quant" placeholder="Enter Quantity">');
                        itemSell.append('<button class="item-sell-button">Sell</button>');
                        
                        var portfolioItem = $('<div class="portfolio-item"></div>');
                        portfolioItem.append(itemContent);
                        portfolioItem.append(itemSell);

                        $('.portfolio-container').append(portfolioItem);
                    });


            } else {

                console.log(data);

                var noPortDiv = $('<div class="no-portfolio-div"></div>');
                noPortDiv.text("You currently don't own any stocks. Your portfolio is empty.");
                
                $('.portfolio-container').append(noPortDiv);
            }
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.error('Error:', errorThrown);
        }
    });
});
  