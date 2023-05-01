"use strict";
var rules = false
function getMousePos(cvn, evt){
  var rect = cvn.getBoundingClientRect();
  return{
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}
var help = false;
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.w && pos.y < rect.y+rect.h && pos.y > rect.y
}

btnCanvas.addEventListener('click', function(evt){
  let mousePos = getMousePos(btnCanvas,evt);
    if(insuranceOpt===true){
      if(isInside(mousePos,optionButtonsMap.get('Yes'))){
        gctx.clearRect(0,0,cWidth,cHeight);
        console.log('yes clicked');
        if(checkBalance(account.bet/2)){
          insurance();
        }
      }else if(isInside(mousePos,optionButtonsMap.get('No'))){
        gctx.clearRect(0,0,cWidth,cHeight);
        console.log('no clicked');
        //checkDealerBlackJack();
      }
    }else{
      gctx.clearRect(0,cHeight*0.3,cWidth,cHeight*0.6);//in case insufficient balance is displayed
      if(beginning == true){
        displayBalance();
        drawChipButtons();
        drawPlayBetBtns();
        beginning = false;
      }
      if(checkingCard==false){
        if(playingGame===true){
          if(!strategyCard){
            if(isInside(mousePos,optionButtonsMap.get('Hit'))){
              hit(pHand,0,curHand,true,()=>{
                if(pHand.value<21){glassBtnCanvas.style.zIndex = -1;}
                else if(pHand.value==21){stand();}
                drawButtons();
              });
              // let totHands = pHandsArr.length;
            }else if(isInside(mousePos,optionButtonsMap.get('Stand'))){
              stand();
            }else if(pHand.cards.length==2){
              if(isInside(mousePos,optionButtonsMap.get('Double'))){
                if(checkBalance(account.bet)){
                  doubleDown();
                }
              }
              else if(isInside(mousePos,optionButtonsMap.get('Surrender'))){surrender(pHand);}
              else if(pHand.cards[0][0]==pHand.cards[1][0] &&isInside(mousePos,optionButtonsMap.get('Split'))){
                if (pHand.cards[0].length <= 2){
                  if(checkBalance(account.bet)){
                    split();
                  }
                } else{
                  if (pHand.cards[0][0]==pHand.cards[1][0] && pHand.cards[0][1]==pHand.cards[1][1]){
                    if(checkBalance(account.bet)){
                      split();
                    }
                  }
                }
              }
            }
            if(!isInside(mousePos,optionButtonsMap.get('Split'))){displayPointer();}
        } else {
          console.log("Playing")
          if(isInside(mousePos,optionButtonsMap.get('Hit'))){
            hit(pHand,0,curHand,true,()=>{
              if(pHand.value<21){glassBtnCanvas.style.zIndex = -1;}
              else if(pHand.value==21){stand();}
              drawButtons();
            });
            // let totHands = pHandsArr.length;
          }else if(isInside(mousePos,optionButtonsMap.get('Stand'))){
            stand();
          }else if(pHand.cards.length==2){
            if(isInside(mousePos,optionButtonsMap.get('Double'))){
              if(checkBalance(account.bet)){
                doubleDown();
              }
            }
            else if(isInside(mousePos,optionButtonsMap.get('Surrender'))){surrender(pHand);}
            else if(pHand.cards[0][0]==pHand.cards[1][0] &&isInside(mousePos,optionButtonsMap.get('Split'))){
              if (pHand.cards[0].length < 3){
                if(checkBalance(account.bet)){
                  split();
                }
              } else{
                if (pHand.cards[0][0]==pHand.cards[1][0] && pHand.cards[0][1]==pHand.cards[1][1]){
                  if(checkBalance(account.bet)){
                    split();
                  }
                }
              }
            } else if(isInside(mousePos, optionButtonsMap.get("Reveal Card"))){
              help = true;
              displayMessage();
            }
          } else {
            console.log("Ignored");
            displayMessage();
          }
          
          if(!isInside(mousePos,optionButtonsMap.get('Split'))){
            displayPointer();
          }
        }
        }else{
          console.log("Not Playing")
          //options for new hand
          if(isInside(mousePos,optionButtonsMap.get('Play'))&&account.bet>=minBet){
            if(checkBalance(account.bet)){
              disctx.clearRect(0,0,cWidth,cHeight);
              strokeAndFillText(disctx,"Wins : "+String(wins),cWidth*.95,cHeight*.05);
              strokeAndFillText(disctx,"Losses : "+String(losses),cWidth*.95,cHeight*.1);
              strokeAndFillText(disctx,"Draws : "+String(pushes),cWidth*.95,cHeight*.15);
              rules = false
              glassBtnCanvas.style.zIndex = 99;
              playingGame = true;
              if(rebet===true){rebetChip(()=>{ ctx.clearRect(0,0,cWidth,cHeight); newGame();});}
              else{ ctx.clearRect(0,0,cWidth,cHeight);//clears all drawn cards
              newGame();
              account.balance-=account.bet;}
              displayBalance();
            }
          }else if(isInside(mousePos, optionButtonsMap.get("Strategy Card"))){
            if(!strategyCard){
              if(strategy_card.length== 0)
                readCsv()
              strategyCard = true;
              console.log("Strategy Card On");
            } else {
              strategyCard = false;
              console.log("Strategy Card Off");
            }
            drawPlayBetBtns()
          } else if(isInside(mousePos, optionButtonsMap.get("Reveal Card"))){
            //Should View Rules
            console.log(rules)
            if (rules == true){
              disctx.clearRect(0,0,cWidth,cHeight);
              rules = false
              strokeAndFillText(disctx,"Wins : "+String(wins),cWidth*.95,cHeight*.05);
              strokeAndFillText(disctx,"Losses : "+String(losses),cWidth*.95,cHeight*.1);
              strokeAndFillText(disctx,"Draws : "+String(pushes),cWidth*.95,cHeight*.15);
              
              drawChipButtons();
            }else{
              viewRules()
              rules = true
            }
            
          }else if(rebet===false){
            if(isInside(mousePos,optionButtonsMap.get('Clear Bet'))){
              pHand.bet = account.bet=0;
              bctx.clearRect(0,0,cWidth,cHeight);
              drawPlayBetBtns()
            }
            //Changes bet based on chips selected
            chipBtnMap.forEach(chip=>{
              if(isInside(mousePos,chip)){
                let newBet = account.bet+chip.v;

                if(checkBalance(newBet)==true){
                  pHand.bet = account.bet = newBet;
                  aniLib.slide(chipImgMap.get(chip.s),chip.x,cHeight,cWidth/2-cardW,chipYLoc,chipW,chipH,25,0,bctx,()=>{
                    bctx.clearRect(cWidth/2-cardW-1,0,cWidth,cHeight);//clears edge case
                    drawChips();
                  });
                }
              }
              drawPlayBetBtns();
            })
          }else if(rebet===true){
            if(isInside(mousePos,optionButtonsMap.get('Clear Bet'))){
              rebet=false;
              pHand.bet = account.bet = 0;
              bctx.clearRect(0,0,cWidth,cHeight);
              drawPlayBetBtns();
            }
          }
        }
      }
    }

},false);
