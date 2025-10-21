let game = null; // Armazena a instância atual do jogo.
let dealerHiddenCard = null; // Armazena a carta virada do dealer.

//Função para depurar e mostrar o estado do objeto do jogo
function debug(obj) {
  document.getElementById("debug").innerHTML = JSON.stringify(obj, null, 2);
}

// inicializa os botões para um novo jogo
function buttonsInitialization() {
  document.getElementById("card").disabled = false;
  document.getElementById("stand").disabled = false;
  document.getElementById("new_game").disabled = true;
}

// finaliza os botões no fim do jogo
function finalizeButtons() {
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;
  document.getElementById("new_game").disabled = false;
}

// limpa a página para um novo jogo
function clearPage() {
  document.getElementById("cartas-dealer").innerHTML = "";
  document.getElementById("cartas-jogador").innerHTML = "";
  document.getElementById("pontuacao-dealer").innerText = "";
  document.getElementById("pontuacao-jogador").innerText = "";
  document.getElementById("resultado").innerText = "";
  document.getElementById("debug").innerHTML = "";
}

// inicia um novo jogo de Blackjack
function newGame() {
  clearPage();
  game = new Blackjack();

  // da as cartas iniciais (2 para o jogador, 2 para o dealer com uma delas virada)
  game.playerMove();
  game.dealerMove();
  game.playerMove();
  dealerHiddenCard = game.deck.pop(); // guarda a carta escondida
  game.dealerCards.push(dealerHiddenCard);

  // mostra as cartas na interface
  updatePlayer();
  // mostra a carta visível do dealer e uma carta virada
  printCard(document.getElementById("cartas-dealer"), game.getDealerCards()[0]);
  // usar o nome de ficheiro correto para a carta virada
  printCard(document.getElementById("cartas-dealer"), "card_back");
  document.getElementById("pontuacao-dealer").innerText = game.getCardValue(
    game.getDealerCards()[0]
  );

  buttonsInitialization();
  debug(game);

  // verifica se há um Blackjack inicial para terminar o jogo logo
  const state = game.getGameState();
  if (state.gameEnded) {
    dealerFinish(); // para revelar as cartas e mostrar o resultado
  }
}

// mostra a mensagem final do jogo
function finalScore(state) {
  let message = "";
  if (state.playerHasBlackjack && !state.isTie) {
    message = "Blackjack! O Jogador Ganhou!";
  } else if (state.playerWon) {
    message = "O Jogador Ganhou!";
  } else if (state.dealerWon) {
    message = "O Dealer Ganhou!";
  } else if (state.isTie) {
    message = "Empate!";
  }

  if (state.playerBusted) {
    message = "O Jogador Rebentou! O Dealer Ganhou";
  } else if (state.dealerBusted) {
    message = "O Dealer Rebentou! O Jogador Ganhou";
  }

  document.getElementById("resultado").innerText = message;
  finalizeButtons();
}

// atualiza a pontuação do dealer na interface
function updateDealer() {
  const dealerScore = game.getScore(game.getDealerCards());
  document.getElementById("pontuacao-dealer").innerText = dealerScore;
}

// atualiza as cartas e a pontuação do jogador na interface
function updatePlayer(state) {
  const playerCards = game.getPlayerCards();
  document.getElementById("cartas-jogador").innerHTML = "";
  for (const card of playerCards) {
    printCard(document.getElementById("cartas-jogador"), card);
  }
  document.getElementById("pontuacao-jogador").innerText =
    game.getScore(playerCards);

  if (state && state.gameEnded) {
    finalScore(state);
  }
}

// faz o dealer tirar uma nova carta
function dealerNewCard() {
  const state = game.dealerMove();
  // limpa e reimprime as cartas do dealer
  const dealerCards = game.getDealerCards();
  document.getElementById("cartas-dealer").innerHTML = "";
  for (const card of dealerCards) {
    printCard(document.getElementById("cartas-dealer"), card);
  }
  updateDealer();
  debug(game);
  return state;
}

// faz o jogador tirar uma nova carta (ação do botão "Pedir Carta")
function playerNewCard() {
  const state = game.playerMove();
  updatePlayer(state);
  debug(game);
}

// finaliza a vez do jogador e inicia a vez do dealer (ação do botão "Ficar")
function dealerFinish() {
  game.setDealerTurn(true);
  finalizeButtons(); // desativa botões do jogador

  // revela a carta escondida do dealer
  const dealerCards = game.getDealerCards();
  document.getElementById("cartas-dealer").innerHTML = "";
  for (const card of dealerCards) {
    printCard(document.getElementById("cartas-dealer"), card);
  }
  updateDealer();

  // loop para as jogadas automaticas do dealer
  let state = game.getGameState();
  // se o jogo não terminou depois de revelar as cartas, o dealer joga
  if (!state.gameEnded) {
    const dealerInterval = setInterval(() => {
      state = game.getGameState(); // reavalia o estado antes de cada jogada
      if (!state.gameEnded) {
        dealerNewCard();
      } else {
        clearInterval(dealerInterval); // para o loop
        finalScore(state);
      }
    }, 1000); // espera 1 segundo entre cada jogada do dealer dara dinamizar
  } else {
    // se o jogo acabar quando as cartas forem reveladas, mostra o resultado final
    finalScore(state);
  }
}

// imprime a imagem da carta na interface grafica
function printCard(element, card) {
  let cardImg = document.createElement("img"); // elemento onde a carta será mostrada
  cardImg.src = `img/png/${card}.png`;
  element.appendChild(cardImg);
}
