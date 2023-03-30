var express = require('express');
var serveStatic = require('serve-static');
app = express();
app.get('/strategy.csv', (req, res) => {
  strategy_card =[]
  count = 0;
  const fs = require('fs')
  const content = fs.readFileSync('Blackjack Strategy Table.csv', 'utf-8')
  content.split("\n").forEach((line) => {
    count+= 1;
      if (line.split(",").length > 11){
        array = line.split(",")
        var newarray = []
        var letter1= array[0][1]
        var letter2= array[1][0]
        if (array[0].length > 2){
            letter1 = array[0][1] + array[0][2]
        }
        if (array[1].length > 2){
            letter2 = array[1][0] + array[1][1]
        }
        newarray.push(letter1+","+letter2)
        startlength = letter2.length+ letter1.length
        if (letter1.length == 2)
            startlength-=1
            if (letter2.length == 2)
            startlength-=1
        for(let i = startlength; i < array.length; i++){
            newarray.push(array[i])
        }
        strategy_card.push(newarray)
      } else {
        strategy_card.push(line.split(","))
      }
    })
    strategy_card.pop()
    res.json(strategy_card)
});

app.use(express.static('public'));

var port = process.env.PORT || 3000;
app.listen(port);
console.log('server started '+ port);

app.get('/', function (req, res) {
  res.redirect('/index.html');
})
