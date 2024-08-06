
## Description
Name I decided for my website (subject to change): **Trading Alpha** 

**Trading Alpha** is an interactive, web-based application game that simulates the process and experience of real-world stock trading in a risk-free platform by letting players compete in fair trading competitions and declares the player with the highest-valued porfolio as the winner at the end. players are granted with an initial cash account upon registration and can buy and sell equities based on real-time NYSE prices in a valid competion/game.

From a player's perspective, **Trading Alpha** is dynamic platform that offers both an exciting competitive environment and a good educational experience, assisting players in understanding how stock markets work and developing trading techniques. To maximize the value of their portfolio, players must monitor stock prices, make strategic decisions, identify opurtunities to buy and sell, and manage thier porfolio effectively. Admins can create and manage games, send competition invitations to players, set initial funds, establish game durations, and check player portfolios, which provide insights into player strategies and game progress.


## Screens

![PlayerDashboardView](https://github.com/CS3100W24/project-mohdalibn/assets/95453430/31cd3265-da84-40aa-9f13-e714eca0febe)

![AdminDashboardView](https://github.com/CS3100W24/project-mohdalibn/assets/95453430/7af3c9a6-da78-4b1f-8ce4-faa2431a0e35)


## Features

|ID|Name|Access By|Short Description|Expected Implementation|Source of Idea|
|--|----|---------|-----------------|--------|--------------|
|01|Player registration|Player|players register for a specific game|Must implement|Project instructions|
|02|Game duration | Admin| Configure start/end of each game individually| Likely to be done|Lots of other games I know|
|03|Moving average|Player|An added feature to candlestick charts|Probably not unless its easy|Web sites like [investopedia](https://www.investopedia.com/terms/m/movingaveragechart.asp#:~:text=A%20moving%20average%20(MA)%20chart,data%20for%20each%20time%20period.)|
| 04 | Diaplay Graphs| Player | display graph charts of the price of a stock |Probably | WealthSimple |
| 05 | Buying Stock | Player | Players buying a stock | Must implement | Project instructions |
| 06 | Selling Stock | Player | Players selling a stock | Must implement | Project instructions |
| 07 | Porfolio Tracker | Player | Tracks players porfolio performance | most likely to be done | Project instructions |
| 08 | Player Credentials | Admin | Maintain player login and profile information | Must implement | Project instructions |
| 09 | Transaction History | Player & Admin | Players buying a stock | Must implement | Project instructions |
| 10 | Winner Declaration | Admin | Declaring the winner after a game | Must implement | Project instructions |
| 11 | Initial Funding | Admin | set the initial funding for the players of a game/compettion | Must implement | Project instructions |
| 12 | Game Creation | Admin | Creating games for players to play | Must implement | Project instructions |
| 13 | Leaderboard | Player | View current rankings of all players | Must Implement | Project theme |
| 14 | Player Ranking | Player | Current player ranking according to the leaderboards | likely to be done | Project theme |
| 15 | Add Friend | Players | Players can add friends | might implement (depends on difficulty) | myself |
| 16 | Remove Friend | Players | Players can remove friends | might implement (depends on difficulty) | myself |
| 17 | Player Chat | Player | Global chat for players to communication | might implement (depends on difficulty) | myself |
| 18 | Stock search bar | Player | Search for stocks to buy | Likely to be done | WealthSimple |
| 19 | Remaining Funds | Player | Players can view their remaining funds | Likely to be done | WealthSimple |
| 20 | Password Reset | Player | Players can reset their password | Likely to be done | ChatGPT |
| 21 | Player Report | Player | Players can report other players | Likely to be done | ChatGPT |
| 22 | Private Chat | Player | Players can send private chats to friends | Likely to be done | myself |
| 23 | Player Suspension | Admin | Admin can suspend a reported player | Most likely to be done | ChatGPT |
| 24 | Player Ban | Admin | Admin can ban a reported player | Most likely to be done | ChatGPT |
| 25 | Stock Statistics | Player | Players can view a stock's statistics | Most likely to be done | ChatGPT |
| 26 | Email Verification | Player | Players will have to verify thier email | Likely to be done | myself |
| 27 | Contact Support | Player | Players can contact admin for support | Likely to be done | myself |
| 28 | Stock Wishlist | Player | Players can have a wishlist of stocks they want to buy | Likely to be done | ChatGPT |
| 29 | Game Rules | Player | Players can view the game rules | Likely to be done | ChatGPT |
| 30 | FAQ | Player | Players can see the frequently asked questions | Likely to be done | ChatGPT |

## Implementation

### Tools and packages

#### Frontend Techstack (Expected):
  - HTML, CSS, JavaScript, React, BootStrap/Tailwind
#### Backend Techstack (Expected):
  - JavaScript, Node.js, Express.js, MongoDB, Passport.js(might use for user authentication), Python (if necessary)
#### Other tools & libaries (Expected):
  - Request.js

### App API

1. GET /portfolio?player=*playername*&game=*gameid*  
   responds with the current portfolio of the player

2. POST /buy?player=*playername*&game=*gameid*&stock=tickersymbol*&quant=*nnn*
    requests that a pretend purchase is made within the game
    responds indicating stock purchase success or not and the price

3. POST /sell?player=*playername*&game=*gameid*&stock=tickersymbol*&quant=*nnn*
    requests that a pretend sale is made within the game
    responds indicating stock sale success or not and the price
   
4. GET /sell?player=*playername*&game=*gameid*&stock=tickersymbol*&quant=*nnn*
    requests that a pretend sale is made within the game
    responds indicating stock sale success or not and the price

5. GET /dashboard?player=*playername*  
   responds with the dashboard/homepage of the player


### Stock API

Choosen API Provider: **twelvedata**

Link: https://twelvedata.com/

for both buy and sell, we'll make a GET HTTP request to the real-time prices of a stock using Twelvedata API
GET 

```
https://api.twelvedata.com/add?symbol=target_stock_symbol&interval=1min&apikey=my_api_key
```

## Attributions

Source                                                                                                                                                                                                                                                                                          | Contribution | Location |
|-------|----|----|
| ChatGPT 3.5   | used to get idea on features for the project | `proposal.md` |
| Google | used to search the stock api, and tech stack | `proposal.md` |
| part1_instructions.md | used to include the 11 features already given by the professor | `proposal.md` |
