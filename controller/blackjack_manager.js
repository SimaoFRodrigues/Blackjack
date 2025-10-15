let game = null; // Armazena a instância atual do jogo.
let dealerHiddenCard = null; // Armazena a carta virada do dealer.

/**
 * Função para depurar e mostrar o estado do objeto do jogo.
 * @param {Object} obj - O objeto a ser depurado.
 */
function debug(obj) {
  document.getElementById("debug").innerHTML = JSON.stringify(obj, null, 2);
}

/**
 * Inicializa os botões para um novo jogo.
 */
function buttonsInitialization() {
  document.getElementById("card").disabled = false;
  document.getElementById("stand").disabled = false;
  document.getElementById("new_game").disabled = true;
}

/**
 * Finaliza os botões no fim do jogo.
 */
function finalizeButtons() {
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;
  document.getElementById("new_game").disabled = false;
}

/**
 * Limpa a página para um novo jogo.
 */
function clearPage() {
  document.getElementById("cartas-dealer").innerHTML = "";
  document.getElementById("cartas-jogador").innerHTML = "";
  document.getElementById("pontuacao-dealer").innerText = "";
  document.getElementById("pontuacao-jogador").innerText = "";
  document.getElementById("resultado").innerText = "";
  document.getElementById("debug").innerHTML = "";
}

/**
 * Inicia um novo jogo de Blackjack.
 */
function newGame() {
  clearPage();
  game = new Blackjack();

  // Dá as cartas iniciais (2 para o jogador, 2 para o dealer com uma virada).
  game.playerMove();
  game.dealerMove();
  game.playerMove();
  dealerHiddenCard = game.deck.pop(); // Guarda a carta escondida.
  game.dealerCards.push(dealerHiddenCard);

  // Mostra as cartas na interface.
  updatePlayer();
  // Mostra a carta visível do dealer e uma carta virada.
  printCard(document.getElementById("cartas-dealer"), game.getDealerCards()[0]);
  // CORREÇÃO: Usar o nome de ficheiro correto para a carta virada.
  printCard(document.getElementById("cartas-dealer"), "card_back");
  document.getElementById("pontuacao-dealer").innerText = game.getCardValue(
    game.getDealerCards()[0]
  );

  buttonsInitialization();
  debug(game);

  // Verifica se há um Blackjack inicial para terminar o jogo logo.
  const state = game.getGameState();
  if (state.gameEnded) {
    dealerFinish(); // Chama dealerFinish para revelar as cartas e mostrar o resultado.
  }
}

/**
 * Mostra a mensagem final do jogo.
 * @param {Object} state - O estado final do jogo.
 */
function finalScore(state) {
  let message = "";
  if (state.playerHasBlackjack && !state.isTie) {
    message = "Blackjack! O Jogador Ganhou!";
  } else if (state.playerWon) {
    message = "O Jogador Ganhou!";
  } else if (state.dealerWon) {
    message = "O Dealer Ganhou!";
  } else if (state.isTie) {
    message = "Empate (Push)!";
  }

  if (state.playerBusted) {
    message = "O Jogador Rebentou! Dealer Ganhou.";
  } else if (state.dealerBusted) {
    message = "O Dealer Rebentou! Jogador Ganhou.";
  }

  document.getElementById("resultado").innerText = message;
  finalizeButtons();
}

/**
 * Atualiza a pontuação do dealer na interface.
 */
function updateDealer() {
  const dealerScore = game.getScore(game.getDealerCards());
  document.getElementById("pontuacao-dealer").innerText = dealerScore;
}

/**
 * Atualiza as cartas e a pontuação do jogador na interface.
 * @param {Object} [state] - O estado do jogo (opcional).
 */
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

/**
 * Faz o dealer tirar uma nova carta.
 * @returns {Object} - O estado do jogo após a jogada.
 */
function dealerNewCard() {
  const state = game.dealerMove();
  // Limpa e reimprime as cartas do dealer.
  const dealerCards = game.getDealerCards();
  document.getElementById("cartas-dealer").innerHTML = "";
  for (const card of dealerCards) {
    printCard(document.getElementById("cartas-dealer"), card);
  }
  updateDealer();
  debug(game);
  return state;
}

/**
 * Faz o jogador tirar uma nova carta (ação do botão "Card").
 */
function playerNewCard() {
  const state = game.playerMove();
  updatePlayer(state);
  debug(game);
}

/**
 * Finaliza a vez do jogador e inicia a vez do dealer (ação do botão "Stand").
 */
function dealerFinish() {
  game.setDealerTurn(true);
  finalizeButtons(); // Desativa botões do jogador.

  // Revela a carta escondida do dealer.
  const dealerCards = game.getDealerCards();
  document.getElementById("cartas-dealer").innerHTML = "";
  for (const card of dealerCards) {
    printCard(document.getElementById("cartas-dealer"), card);
  }
  updateDealer();

  // Loop para as jogadas automáticas do dealer.
  let state = game.getGameState();
  // Se o jogo não terminou logo após revelar as cartas (ex: dealer não tem 17), o dealer joga.
  if (!state.gameEnded) {
    const dealerInterval = setInterval(() => {
      state = game.getGameState(); // Reavalia o estado antes de cada jogada.
      if (!state.gameEnded) {
        dealerNewCard();
      } else {
        clearInterval(dealerInterval); // Para o loop.
        finalScore(state);
      }
    }, 1000); // Espera 1 segundo entre cada jogada do dealer.
  } else {
    // Se o jogo terminou assim que as cartas foram reveladas, mostra o resultado final.
    finalScore(state);
  }
}

/**
 * Imprime a imagem da carta na interface gráfica.
 * @param {HTMLElement} element - O elemento onde a carta será mostrada.
 * @param {string} card - A carta a ser mostrada (ou "back" para a carta virada).
 */
function printCard(element, card) {
  let cardImg = document.createElement("img");

  // CORREÇÃO: O caminho precisa incluir a subpasta "png".
  // O caminho é relativo ao ficheiro HTML que está em /view.
  cardImg.src = `img/png/${card}.png`;

  cardImg.style.height = "170px";
  cardImg.classList.add("mx-1");
  element.appendChild(cardImg);
}
