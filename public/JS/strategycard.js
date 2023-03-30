const rows = ["Hands","8","9", "10", "11", "12", "13", "14","15", "16", "17", "2,2", "3,3", "4,4", "5,5", "6,6", "7,7", "8,8", "9,9", "10,10", "A,A", "A,2", "A,3", "A,4", "A,5","A,6", "A,7", "A,8", "A,9", "A,10"]  
const column = ["Hands", "2", "3", "4", "5", "6", "7", "8", "9", "10", "A"]
// read in strategy card
var strategy_card = []

function readCsv(){
    fetch('http://localhost:3000/strategy.csv')
    .then(response => response.json())
    .then(content => {
        content.forEach(item => {
            strategy_card.push(item)
        })
    });
    if (strategy_card.length == 0){
        console.log("Not read in")
        strategy_card = [
            ['Hands,2,3,4,5,6,7,8,9,10,A'],
            ['8','S','S','S','S','S','H','H','H','H','H'],
            ['9','D','D','D','D','D','H','H','H','H','H'],
            ['10','D','D','D','D','D','H','H','H','H','D'],
            ['11','D','D','D','D','D','H','H','D','D','D'],
            ['12','S','S','S','S','S','H','H','H','H','H'],
            ['13','S','S','S','S','S','H','H','H','H','H'],
            ['14','S','S','S','S','S','H','H','H','H','H'],
            ['15','S','S','S','S','S','H','H','H','S','S'],
            ['16','S','S','S','S','S','S','H','S','S','S'],
            ['17','S','S','S','S','S','S','S','S','S','S'],
            ['2,2','S','P','P','S','S','P','P','H','P','H'],
            ['3,3','P','S','S','S','P','P','P','P','P','P'],
            ['4,4','S','S','H','H','H','H','P','H','H','H'],
            ['5,5','D','D','D','D','D','H','H','H','D','H'],
            ['6,6','S','S','S','S','S','P','P','P','H','P'],
            ['7,7','P','S','P','S','P','P','P','P','P','P'],
            ['8,8','P','P','P','P','P','P','P','P','P','P'],
            ['9,9','S','S','S','S','S','S','P','P','P','P'],
            ['10,10','S','S','S','S','S','S','S','S','S','S'],
            ['A,A','P','P','P','P','P','P','P','P','P','P'],
            ['A,2','H','H','H','D','H','H','H','H','H','H'],
            ['A,3','H','D','D','D','H','H','H','H','H','H'],
            ['A,4','H','D','D','D','D','H','H','H','H','H'],
            ['A,5','D','D','D','D','D','H','H','H','H','H'],
            ['A,6','D','D','D','D','D','H','H','H','H','H'],
            ['A,7','S','S','S','S','S','S','D','D','D','D'],
            ['A,8','S','S','S','S','S','S','S','S','S','S'],
            ['A,9','S','S','S','S','S','S','S','S','S','S'],
            ['A,10','S','S','S','S','S','S','S','S','S','S'],
          ]
    }
}
/* returns the column for the dealer's card */
function dealerColumn(card){
    if (card.length == 3 || card[0] == "J"|| card[0] == "Q"|| card[0] == "K"){
        return column.indexOf(String(10))
    }
    return column.indexOf(String(card[0]))
}
/* returns the row for the player's hand */
function playerCardRow(cards, total){ 
    ret = ""
    if (cards.length == 2){
        if (cards[0][0] == cards [1][0]){
            if (cards[1].length > 2 || cards[1] == 'K' || cards[1] == 'Q' || cards[1] == 'J'){
                return 19
            }
            else if (cards[0][0]== 'A'){
                return 20
            }
            else {
                return 9 + parseInt(cards[1][0])
            }
        }
        if (cards[0][0] == 'A'){
            if (cards[1].length > 2 || cards[1] == 'K' || cards[1] == 'Q' || cards[1] == 'J'){
                return 29
            }
            else {
                return 19 + parseInt(cards[1][0])
            }
        } else if (cards[1][0] == 'A') {
            if (cards[0].length > 2 || cards[0] == 'K' || cards[0] == 'Q' || cards[0] == 'J'){
                return 29
            }
            else {
                return 19 + parseInt(cards[0][0])
            }
        }
    }
    if (total >= 17) {
        ret = rows.indexOf(String(17))
    } else if (total <=8){
        ret = rows.indexOf(String(8))
    } else {
        ret = rows.indexOf(String(total))
    }
    return ret
}

/*Gets the best decision message accepting array of players cards, total of the cards added up, dealer's first card as a string*/ 
function getMessage(player, total, dealer){
    var row = playerCardRow(player, total);
    var column = dealerColumn(dealer[1])
    var decision = strategy_card[row][column];
    if (decision == "H"){
        return "Hit"
    }
    else if (decision == "P"){
        return "Split"
    }
    else if (decision == "S"){
        return "Stand"
    }
    if (player.length > 2){
        return "Hit"
    }
    return "Double Down"
}
