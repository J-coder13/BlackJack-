"use strict";

const cWidth = Math.floor(window.innerWidth*0.98),
  cHeight = Math.floor(window.innerHeight*.82);

let xMargin = 0;
let yTop = 0;
if(window.innerWidth>cWidth){xMargin = Math.floor((window.innerWidth-cWidth)/2);}

const BGCanvas = document.getElementById('BGCanvas'),
  mainCanvas = document.getElementById('mainCanvas'),
  aniCanvas = document.getElementById('aniCanvas'),
  displayCanvas = document.getElementById('displayCanvas'),
  slideCanvas = document.getElementById('slideCanvas'),
  glassCanavs = document.getElementById('glassCanvas'),
  betChipsCanvas = document.getElementById('betChipsCanvas');

const canvasArr = [BGCanvas, mainCanvas, aniCanvas, displayCanvas, slideCanvas, glassCanvas,betChipsCanvas];
canvasArr.forEach(cnv=>{
  cnv.style.position = 'absolute';
  cnv.style.marginTop = yTop+'px';
  cnv.style.left = xMargin+'px';
  cnv.width = cWidth;
  cnv.height = cHeight;
})

BGCanvas.style.zIndex = -1;
aniCanvas.style.zIndex = 25;
displayCanvas.style.zIndex = 10;
glassCanvas.style.zIndex = 99;
betChipsCanvas.style.zIndex = 15;
slideCanvas.style.zIndex = 10;

const anictx = aniCanvas.getContext('2d'),
  ctx = mainCanvas.getContext('2d'),
  BGctx = BGCanvas.getContext('2d'),
  disctx = displayCanvas.getContext('2d'),
  sctx = slideCanvas.getContext('2d'),
  bctx = betChipsCanvas.getContext('2d'),
  gctx = glassCanvas.getContext('2d');

const ctxArr = [ctx, BGctx, anictx, disctx, sctx, bctx, gctx];

ctxArr.forEach(ctx=>{
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
})

const stdFontSize = Math.floor(cHeight/20);


function setCtxProps(){
  let gFontSize = Math.floor(cHeight/6);
  gctx.font = gFontSize+'px TheBlacklist';
  gctx.lineWidth = Math.floor(cWidth/120);
  gctx.strokeStyle = 'black';
  gctx.fillStyle = 'rgb(180,15,15)';
  gctx.shadowOffsetX = gFontSize/15;
  gctx.shadowOffsetY = gFontSize/15;
  gctx.shadowColor = "rgba(0,0,0,0.5)";
  gctx.shadowBlur = 4;

  bctx.strokeStyle = 'black';
  bctx.fillStyle = 'white';
  // anictx.fillStyle = 'white';
  bctx.font=stdFontSize+'px Chela';
  anictx.font = bctx.font;
  disctx.fillStyle  = 'white';
  disctx.font = stdFontSize+'px Chela';
}

const account = {
  balance: 10000,
  bet: 0
}
const minBet = 100,
  maxBet = 1000;

const splitUpTo = 5;

const cutCard = 23;

const pHandXDif = Math.floor(cWidth/(splitUpTo+1)),
  pHandYDif = Math.floor(cHeight/20);

const cardW = Math.floor(cWidth/12),
  cardH = Math.floor(cardW*1.5);

const pHandXLocs = [],//used for splitting
  pHandYLocs = cHeight*0.95-cardH;

const cardPicLoc = "./Images/Cards/";
const picLoc = "./Images/Misc/";
const cardImgMap = new Map(),
  miscImgMap = new Map();
const pics = ['GreenFelt.jpg','DownArrowPointer.png','WhiteRabbitBack.png', 'Rules.jpg', 'CardValues.jpg'];
const btnPics = [];
const cardSuits = ['C','S','D','H'];
const numDecks = 6;

//adds all of the cards for a single deck of cards
const deckCards = [];
cardSuits.forEach((suit)=>{
  for(let i = 2; i<=13; i++){
    deckCards.push(i+suit);
  }
  deckCards.push('A'+suit);
});

const deckPics = [];//names of card pics
deckCards.forEach((card)=>{deckPics.push(card+'.png');})

const promiseCardImgArr = asyncHelperFunctions.createPromImgArr(deckPics, cardImgMap, cardPicLoc);
const promiseMiscPicArr = asyncHelperFunctions.createPromImgArr(pics, miscImgMap, picLoc);

Promise.all(promiseCardImgArr.concat(promiseMiscPicArr))
.then((document.fonts.load('12px TheBlacklist')))
.then((document.fonts.load('12px Chela')))
.then(()=>{
  setCtxProps();
  drawBG();
  pHand = new Hand();
  pHandsArr[0] = pHand;
  pHandXLocs[0]=cWidth/2
});

function drawBG(){
  BGctx.drawImage(miscImgMap.get('GreenFelt'),0,0,cWidth,cHeight);
  BGctx.strokeRect(0,0,cWidth,cHeight);
}

let shoe;
function createShoe(){
  shoe = [];
  for(let i = 0; i<numDecks; i++){
    shoe.push(...deckCards);
  }
}
createShoe();

function draw(){
  let r = Math.floor(Math.random()*shoe.length)
  return shoe.splice(r,1)[0];
}

function setDefCanvasProps(cnvID,num){
  let cnv = document.getElementById(cnvID);
  document.body.appendChild(cnv);
  cnv.style.zIndex = 10+num;
  cnv.style.position = 'absolute';
  cnv.style.marginTop = yTop+'px';
  cnv.style.left = xMargin+'px';
  cnv.width = cWidth;
  cnv.height = cHeight;
}

function removeCanvases(num){
  for(let i=0; i<num;i++){
    let id = 'canvas'+i;
    let canvas = document.getElementById(id);
    canvas.remove();
  }
}
