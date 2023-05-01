"use strict";

const btncHeight = cHeight/5;

const btnCanvas = document.getElementById('btnCanvas');
const btnBGCanvas = document.getElementById('btnBGCanvas');
const glassBtnCanvas = document.getElementById('glassBtnCanvas');

const BTNctx = btnCanvas.getContext('2d');
const BGBTNctx = btnBGCanvas.getContext('2d');
const gBTNctx = btnBGCanvas.getContext('2d');

const btnCanvasArr = [btnCanvas, btnBGCanvas, glassBtnCanvas];
btnCanvasArr.forEach(cnv=>{
  cnv.style.position = 'absolute';
  cnv.style.top = cHeight+yTop+'px';
  cnv.style.left = xMargin+'px';
  cnv.width = cWidth;
  cnv.height = btncHeight;
})
btnBGCanvas.style.zIndex = -1;
glassBtnCanvas.style.zIndex = -1;

const btnCtxArr = [BTNctx, BGBTNctx, gBTNctx];
btnCtxArr.forEach(ctx=>{
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
})

function setBtnCtxProps(){
  BTNctx.strokeStyle = 'black';
  BTNctx.fillStyle = 'white';
}
// setBtnCtxProps();

const btnsPics = ['ButtonBackground.jpg','RedButtonMain.png', 'BlueCircle.png','RedCircle.png', 'PurpleCircle.png','GreenCircle.png','YellowCircle.png','WhiteCircle.png'];

const chipBtnsPics = [
  'WhiteChip1Top.png',
  'RedChip5Top.png',
  'GreenChip25Top.png',
  'BlackChip100Top.png',
  'PurpleChip500Top.png'
]

const chipPics = [
  'WhiteChip1Side.png',
  'RedChip5Side.png',
  'GreenChip25Side.png',
  'BlackChip100Side.png',
  'PurpleChip500Side.png'
]

const chipValues = {
  PurpleChip500Side: 500,
  BlackChip100Side: 100,
  GreenChip25Side: 25,
  RedChip5Side: 5,
  WhiteChip1Side: 1
}

const btnsPicLoc = './Images/Misc/',
  chipsTopLoc = './Images/Misc/ChipsTopView/',
  chipsSideLoc = './Images/Misc/ChipsSideView/';
const buttonsImgMap = new Map(),
  chipImgMap = new Map(),
  chipBtnImgMap = new Map();

const promiseButtonsImgArr = asyncHelperFunctions.createPromImgArr(btnsPics, buttonsImgMap, btnsPicLoc),
  promiseChipSideViewImgArr = asyncHelperFunctions.createPromImgArr(chipPics, chipImgMap, chipsSideLoc),
  promisechipBtnImgArr = asyncHelperFunctions.createPromImgArr(chipBtnsPics, chipBtnImgMap, chipsTopLoc);

Promise.all(promiseButtonsImgArr.concat(promiseChipSideViewImgArr).concat(promisechipBtnImgArr))
  .then(document.fonts.load('12px TheBlacklist'))
  .then(document.fonts.load('12px Chela'))
  .then(()=>{
    BGBTNctx.drawImage(buttonsImgMap.get('ButtonBackground'),0,0,cWidth,btncHeight);//draws Background
    strokeAndFillText(gctx,'JackPot Enterprises',cWidth/2,(cHeight/2)*.8,cWidth*0.9);
    strokeAndFillText(gctx,'BlackJack Game',cWidth/2,(cHeight/2)*1.19,cWidth*0.9);
    gctx.font = Math.floor(cHeight/20)+"px TheBlacklist";
    strokeAndFillText(gctx,'Click Start to Begin',cWidth/2,(cHeight/2)*1.5,cWidth*0.9);
    gctx.font = gctx.font = Math.floor(cHeight/6)+"px TheBlacklist";
    setBtnCtxProps();
    BTNctx.font = btncHeight/3 +'px Chela';
    drawBtnImg('Play');
    writeBtnMsg('Play', 'Start')
    /*displayBalance();
    drawChipButtons();
    drawPlayBetBtns();*/
  });

function strokeAndFillText(ctx,msg,x,y,maxW){
  ctx.strokeText(msg,x,y,maxW);
  ctx.fillText(msg,x,y,maxW);
}

//game canvas functions
const xCardDif = Math.floor(cardW/7),
  yCardDif = Math.floor(cardH/7),
  dHandxLocStart = cWidth/2-cardW/2,
  dHandyLocStart = cHeight*0.05;

function drawDHand(){
  ctx.clearRect(0,dHandyLocStart-1,cWidth,cardH+yCardDif+2);//clears facedown card edge cases
  anictx.clearRect(0,dHandyLocStart-1,cWidth,cardH+yCardDif+2);
  displayDValue();
  for(let j = 0; j<dHand.cards.length; j++){
    let xLoc = dHandxLocStart - xCardDif*j;
    let yLoc = dHandyLocStart + yCardDif*j;
    ctx.drawImage(cardImgMap.get(dHand.cards[j]), xLoc, yLoc,cardW, cardH);
  }
}

function drawPHand(pHand,xLocStartP,cvs=ctx){
  let pCards = pHand.cards;
  for(let j = 0, len = pCards.length; j<len; j++){
    let xLoc = xLocStartP + xCardDif*j;
    let yLoc = pHandYLocs - yCardDif*j;
    cvs.drawImage(cardImgMap.get(pCards[j]), xLoc, yLoc,cardW, cardH);
  }
}

function drawPHandsArr(){//Draws each of the players hands
  let numHands = pHandsArr.length;

  if(numHands==1){
    drawPHand(pHand,pHandXLocs[0]-cardW/2);
  //draws each of players hands
  }else{//true if player has split
    gctx.clearRect(0,cHeight/2,cWidth,cHeight/2); //in case of previous blackjack
    gctx.font = Math.floor(cHeight/15)+"px TheBlacklist";

    for(let i = 0; i<numHands; i++){
      let pHand = pHandsArr[i],
        xLocStartP = pHandXLocs[i]-cardW/2;

      drawPHand(pHand,xLocStartP);

      if(pHand.bust==true){
        strokeAndFillText(gctx,'Bust',pHandXLocs[i],pHandYLocs+cardH/2);
      }else if(pHand.blackJack==true){
        console.log('writing blackjack');
        strokeAndFillText(gctx,'BlackJack',pHandXLocs[i],pHandYLocs+cardH/2);
      }
    }
    gctx.font = Math.floor(cHeight/6)+"px TheBlacklist";

  }
}

//buttons canvas functions
const buttonsMap = new Map(),
  optionButtonsMap = new Map(),
  chipBtnMap = new Map();

const btnSize = Math.floor(btncHeight*0.6),
  btnYPos = Math.floor((btncHeight-btnSize)/2),
  chipSize = Math.floor(btncHeight*0.5);

(function setButtonsProps(){
  const vertGap = btncHeight/20;

  optionButtonsMap.set("Play",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:vertGap, w:3*btnSize, h:btncHeight*0.4});
  optionButtonsMap.set("Reveal Card",{img:'RedCircle',x:/*(cWidth/1.9+1.5*btnSize)*1.55*/cWidth*.925, y:btnYPos, w:btnSize, h:btnSize});
  optionButtonsMap.set("Strategy Card",{img:'RedButtonMain',x:cWidth/1.9+1.5*btnSize, y:btnYPos*1.5, w:2*btnSize, h:btncHeight*0.4});
  optionButtonsMap.set("Clear Bet",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:btncHeight/2, w:3*btnSize, h:btncHeight*0.4});
  optionButtonsMap.set("Double",{img:'BlueCircle',x:cWidth/2+btnSize, y:btnYPos, w:btnSize, h:btnSize});
  optionButtonsMap.set("Surrender",{img:'WhiteCircle',x:cWidth/2-2*btnSize, y:btnYPos, w:btnSize, h:btnSize});
  optionButtonsMap.set("Split",{img:'PurpleCircle',x:cWidth/2+btnSize*2, y:btnYPos, w:btnSize, h:btnSize});
  optionButtonsMap.set("Hit",{img:'GreenCircle',x:cWidth/2, y:btnYPos, w:btnSize, h:btnSize});
  optionButtonsMap.set("Stand",{img:'YellowCircle',x:cWidth/2-btnSize, y:btnYPos, w:btnSize, h:btnSize});
  optionButtonsMap.set("Yes",{img:'GreenCircle',x:cWidth/2, y:btnYPos, w:btnSize, h:btnSize});
  optionButtonsMap.set("No",{img:'RedCircle',x:cWidth/2-btnSize, y:btnYPos, w:btnSize, h:btnSize});

  const chipsXPosStart = Math.floor(chipSize*1.5),
    chipsXDif = chipSize;
  const chipXPosArr = [];
  for(let i = 0; i<5; i++){
    let xPos = chipsXPosStart+chipsXDif*i-chipSize/2;
    chipXPosArr.push(xPos);
  }
  let yPosChip = btncHeight/2-chipSize/2;
  chipBtnMap.set('WhiteChip',{img:'WhiteChip1Top',x:chipXPosArr[0],y:yPosChip,h:chipSize,w:chipSize,v:chipValues.WhiteChip1Side, s:"WhiteChip1Side"});
  chipBtnMap.set('RedChip',{img:'RedChip5Top',x:chipXPosArr[1],y:yPosChip,h:chipSize,w:chipSize,v:chipValues.RedChip5Side, s:"RedChip5Side"});
  chipBtnMap.set('GreenChip',{img:'GreenChip25Top',x:chipXPosArr[2],y:yPosChip,h:chipSize,w:chipSize, v:chipValues.GreenChip25Side, s:"GreenChip25Side"});
  chipBtnMap.set('BlackChip',{img:'BlackChip100Top',x:chipXPosArr[3],y:yPosChip,h:chipSize,w:chipSize, v:chipValues.BlackChip100Side, s:"BlackChip100Side"});
  chipBtnMap.set('PurpleChip',{img:'PurpleChip500Top',x:chipXPosArr[4],y:yPosChip,h:chipSize,w:chipSize, v:chipValues.PurpleChip500Side, s:"PurpleChip500Side"});
})()

function drawBtnImg(name, propMap=optionButtonsMap, imgMap=buttonsImgMap, ctx=BTNctx){
  let n = propMap.get(name);
  ctx.drawImage(imgMap.get(n.img),n.x,n.y,n.w,n.h);
}

function clearTutorialBtn(){
  BTNctx.clearRect((cWidth/1.9+(1.7*btnSize)),cHeight/17,(btnSize*2),btncHeight);
}
function drawPlayBetBtns(){
  
  let fontSize = btncHeight/5;
  BTNctx.font = fontSize+'px Chela';
  //BTNctx.clearRect(cWidth/2-btnSize*2,0,btnSize*5,btncHeight);
  drawBtnImg('Strategy Card'); 
  drawBtnImg('Play'); drawBtnImg('Clear Bet');
  BTNctx.font = fontSize+12+'px Chela';
  
  
  if(account.bet<minBet){
    let betDif = minBet-account.bet;
    writeBtnMsg('Play', 'Minimum Bet: '+ minBet); writeBtnMsg('Clear Bet');
  }else{
    if(rebet){
      writeBtnMsg('Play', 'Bet Same Amount'); writeBtnMsg('Clear Bet', 'New Bet');
    }else{
      writeBtnMsg('Play'); writeBtnMsg('Clear Bet');
    }
    
  }
  
  
  if(strategyCard == true){
      writeBtnMsg('Strategy Card', 'Aid On');
      
  } else {
      writeBtnMsg('Strategy Card', 'Aid Off');
  }
 
  if (!playingGame){
    drawBtnImg('Reveal Card')
    writeBtnMsg('Reveal Card', 'Rules');
  } else{ 
    drawBtnImg('Reveal Card');
    writeBtnMsg('Reveal Card', 'Assist');
  }
  
}
function displayMessage(){
  gctx.clearRect(cWidth/1.12,cHeight/2,cWidth/2,cHeight/2); //in case of previous blackjack
  gctx.font = Math.floor(cHeight/18)+"px TheBlacklist";
  strokeAndFillText(gctx,"Strategic Move:",cWidth/1.125,pHandYLocs);
  strokeAndFillText(gctx,getMessage(pHand.cards, pHand.value, dHand.cards),cWidth/1.125,pHandYLocs*1.2);
  gctx.font = Math.floor(150)+"px TheBlacklist";
}
function drawButtons(){
  BTNctx.clearRect(cWidth/2-btnSize*2,0,btnSize*5,btncHeight);//clears previously drawn btns
  displayBalance()
  let fontSize = btncHeight/5;
  BTNctx.font = fontSize+'px Chela';

  if(insuranceOpt){
    clearTutorialBtn()
    if(strategyCard){drawBtnImg('Reveal Card'); writeBtnMsg('Reveal Card', 'Help');}
    strokeAndFillText(gctx,'Insurance?',cWidth/2,cHeight/2,cWidth*0.9);
    drawBtnImg('Yes'); drawBtnImg('No');
    writeBtnMsg('Yes'); writeBtnMsg('No');
  }else if(checkingCard){
    clearTutorialBtn()
    //drawBtnImg('Reveal Card'); writeBtnMsg('Reveal Card', 'Help');
    //writeCheckingCardsMsg();
  }else if(playingGame){
    clearTutorialBtn()
    if(strategyCard){drawBtnImg('Reveal Card'); writeBtnMsg('Reveal Card', 'Help');}
    drawBtnImg('Hit'); drawBtnImg('Stand');
    writeBtnMsg('Hit'); writeBtnMsg('Stand');
    if(pHand.cards.length==2){
      drawDoubleAndSurrenderBtn();
      if(pHand.cards[0][0]==pHand.cards[1][0]&&pHandsArr.length<splitUpTo){
        if (pHand.cards[0].length <= 2){
          drawSplitBtn();
        } else {
          if (pHand.cards[0][0]==pHand.cards[1][0] && pHand.cards[0][1]==pHand.cards[1][1]){
            drawSplitBtn();
          }
        }
      }
    } 
    
  }else{drawPlayBetBtns();}
}

const chipW = Math.floor(cardW*0.7),
  chipH = Math.floor(chipW*0.7),
  chipYLoc = pHandYLocs-chipW,
  chipYDif = Math.floor(chipH/4);
function displayBetChips(){
  for(let h = 0, numHands=pHandsArr.length; h<numHands; h++){
    drawChips(h);
  }
}
function viewRules(){
  disctx.drawImage(miscImgMap.get('Rules'),cWidth*.65,cHeight/10,cWidth*.3,cHeight*.85);
  disctx.drawImage(miscImgMap.get('CardValues'),cWidth*.025,cHeight/10,cWidth*.3,cHeight*.85);
}

function drawChips(h=0,bet=null,loc=null,cvs=bctx,disVal=true){
  let chipXLoc;
  if(!loc){chipXLoc = pHandXLocs[h]-cardW;}
  else{chipXLoc=loc;}
  let pHand = pHandsArr[h];

  if(bet==null){bet = pHand.bet;}

  let numChips = calcMinChips(bet);
  let chips = Object.keys(chipValues);
  let betXLoc = chipXLoc+chipW/2,
    betYLoc = chipYLoc+chipH,
    dif = 0;
  cvs.clearRect(betXLoc-chipW/2,0,chipW,cHeight);//clear last stack
  if(disVal){strokeAndFillText(cvs,bet,betXLoc,betYLoc+chipYDif);}//writes chip stack value if true
  //draws stack of chips
  for(let i = 0, len = chips.length; i<len; i++){
    for(let j = 0; j<numChips[i]; j++){
      cvs.drawImage(chipImgMap.get(chips[i]),chipXLoc,chipYLoc-dif*chipYDif,chipW,chipH);
      dif +=1;
    }
  }
}

//calculates minimum number of each chip need to make a bet
function calcMinChips(bet = account.bet){
  let values = Object.values(chipValues);
  let len = values.length
  let numChips = [];
  for(let i = 0; i<len; i++){
    numChips[i] = Math.floor(bet/values[i]);
    bet = bet%values[i];
  }
  return numChips;
}

function displayDValue(){
  let dYPos = Math.floor(cHeight*0.03);//unncessary calculations

  disctx.clearRect(cWidth/2-stdFontSize, dYPos-stdFontSize, 2*stdFontSize, 1.5*stdFontSize);
  strokeAndFillText(disctx,"Wins : "+String(wins),cWidth*.95,cHeight*.05);
  strokeAndFillText(disctx,"Losses : "+String(losses),cWidth*.95,cHeight*.1);
  strokeAndFillText(disctx,"Draws : "+String(pushes),cWidth*.95,cHeight*.15);
  strokeAndFillText(disctx,dHand.value,cWidth/2,dYPos);
}

function displayPValue(){
  let pXPos = pHandXLocs[curHand],
    pYPos = Math.floor(cHeight*0.97);

  disctx.clearRect(0,cHeight*0.9,cWidth,cHeight*0.1);
  strokeAndFillText(disctx,pHand.value,pXPos,pYPos);
  strokeAndFillText(disctx,"Wins : "+String(wins),cWidth*.95,cHeight*.05);
  strokeAndFillText(disctx,"Losses : "+String(losses),cWidth*.95,cHeight*.1);
  strokeAndFillText(disctx,"Draws : "+String(pushes),cWidth*.95,cHeight*.15);
}

const pointer = {
  w: cWidth/25,
  h: cHeight/20,
  y: cHeight-cardH*1.8,
}
function displayPointer(cvs=disctx){
  let p = pointer;
  p.x = pHandXLocs[curHand]-p.w/2;
  cvs.clearRect(0,p.y,cWidth,p.h);
  cvs.drawImage(miscImgMap.get('DownArrowPointer'),p.x,p.y,p.w,p.h);
}

function checkBalance(amt){
  gctx.clearRect(0,cHeight*0.3,cWidth,cHeight*0.4);
  let newBal = account.balance-amt;
  if(newBal<0){
    strokeAndFillText(gctx,"Insufficient Balance",cWidth/2,cHeight/2,cWidth);
  }else{
    return true;
  }
}

const balFontSize = Math.floor(btncHeight/3);
function displayBalance(){
  // display Wins, Losses and Draws as Well
  strokeAndFillText(disctx,"Wins : "+String(wins),cWidth*.95,cHeight*.05);
  strokeAndFillText(disctx,"Losses : "+String(losses),cWidth*.95,cHeight*.1);
  strokeAndFillText(disctx,"Draws : "+String(pushes),cWidth*.95,cHeight*.15);
  let xPos = Math.floor(cWidth*0.85) ;
  BTNctx.textAlign = 'center';
  BTNctx.font= balFontSize+'px TheBlacklist';
  BTNctx.clearRect(cWidth*0.76,0,cWidth*0.3,btncHeight);
  BTNctx.fillText('Balance',xPos,btncHeight*0.3);
  BTNctx.fillText(account.balance,xPos,btncHeight*0.7);
  if (!playingGame){
    drawPlayBetBtns()
  }
  
}

function drawChipButtons(){
  chipBtnMap.forEach((b)=>{
    BGBTNctx.drawImage(chipBtnImgMap.get(b.img),b.x,b.y,b.w,b.h);
  })
}

function writeCheckingCardsMsg(){
  BTNctx.font= balFontSize+'px TheBlacklist';
  strokeAndFillText(BTNctx,"Checking",cWidth/2,btncHeight*0.3);
  strokeAndFillText(BTNctx,"Card...",cWidth/2,btncHeight*0.7);
}

function writeBtnMsg(name, msg=null, propMap=optionButtonsMap, ctx=BTNctx){
  let n = propMap.get(name);
  if(!msg){msg = name;}
  strokeAndFillText(ctx,msg,n.x+n.w/2,n.y+n.h/2,n.w*0.9)
}

function drawDoubleAndSurrenderBtn(){
  drawBtnImg('Double'); drawBtnImg('Surrender');
  writeBtnMsg('Double'); writeBtnMsg('Surrender');
}

function drawSplitBtn(){drawBtnImg('Split'); writeBtnMsg('Split');}