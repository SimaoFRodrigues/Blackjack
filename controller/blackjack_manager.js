let game = null; // armazena a instância atual do jogo

// bonus: placar, com persistência na memória local
let totalDealerWins = 0;
let empates = 0;
let totalPlayerWins = 0;

function updateScoreboard() {
  $("#total-dealer-wins").text(totalDealerWins);
  $("#empates").text(empates);
  $("#total-player-wins").text(totalPlayerWins);
}

// guarda o placar no localStorage
function saveScoreboard() {
  try {
    localStorage.setItem(
      "blackjack_totalDealerWins",
      totalDealerWins.toString()
    );
    localStorage.setItem("blackjack_empates", empates.toString());
    localStorage.setItem(
      "blackjack_totalPlayerWins",
      totalPlayerWins.toString()
    );
  } catch (e) {
    // se falhar, ignorar pq o jogo continua sem persistência
  }
}

// carrega o placar e pra cada key se não existir, define 0, se existir, converte para inteiro
function loadScoreboard() {
  let d = localStorage.getItem("blackjack_totalDealerWins");
  if (d === null) {
    totalDealerWins = 0;
  } else {
    totalDealerWins = parseInt(d, 10);
    if (isNaN(totalDealerWins)) totalDealerWins = 0;
  }

  let e = localStorage.getItem("blackjack_empates");
  if (e === null) {
    empates = 0;
  } else {
    empates = parseInt(e, 10);
    if (isNaN(empates)) empates = 0;
  }

  let p = localStorage.getItem("blackjack_totalPlayerWins");
  if (p === null) {
    totalPlayerWins = 0;
  } else {
    totalPlayerWins = parseInt(p, 10);
    if (isNaN(totalPlayerWins)) totalPlayerWins = 0;
  }

  updateScoreboard();
}

// inicia os botões para um novo jogo
function buttonsInitialization() {
  $("#card").prop("disabled", false);
  $("#stand").prop("disabled", false);
  $("#new_game").prop("disabled", true);
}

// finaliza os botões no fim do jogo
function finalizeButtons() {
  $("#card").prop("disabled", true);
  $("#stand").prop("disabled", true);
  $("#new_game").prop("disabled", false);
}

// limpa a página para o proximo jogo
function clearPage() {
  $("#cartas-dealer").html("");
  $("#cartas-jogador").html("");
  $("#pontuacao-dealer").text("");
  $("#pontuacao-jogador").text("");
  $("#resultado").text("");
}

// inicia um novo jogo de Blackjack
function newGame() {
  clearPage();
  game = new Blackjack();

  // da as cartas iniciais, dá 2 cartas a cada, a do dealer virada
  game.playerMove();
  game.dealerMove();
  game.playerMove();
  game.dealerCards.push(game.deck.pop());

  // mostra as cartas na interface
  updatePlayer();
  printCard($("#cartas-dealer"), game.getDealerCards()[0]);
  printCard($("#cartas-dealer"), "card_back");
  $("#pontuacao-dealer").text(game.getCardValue(game.getDealerCards()[0]));

  buttonsInitialization();

  // verifica se há um Blackjack inicial para acabar logo o jogo
  const state = game.getGameState();
  if (state.gameEnded) {
    dealerFinish(); // para revelar as cartas e mostrar o resultado
  }
}

// mostra a mensagem final do jogo
function finalScore(state) {
  let message = "";
  if (state.playerHasBlackjack && !state.isTie) {
    message = "Blackjack! Ganhaste!";
  } else if (state.playerWon) {
    message = "Ganhaste!";
  } else if (state.dealerWon) {
    message = "O Dealer Ganhou!";
  } else if (state.isTie) {
    message = "Empate!";
  }

  if (state.playerBusted) {
    message = "Rebentaste! O Dealer Ganhou";
  } else if (state.dealerBusted) {
    message = "O Dealer Rebentou! O Jogador Ganhou";
  }

  // determina vencedor (uma única vez) e actualiza placar
  let winner = null;
  if (state.isTie) {
    winner = "tie";
  } else if (state.playerBusted) {
    winner = "dealer";
  } else if (state.dealerBusted) {
    winner = "player";
  } else if (state.playerHasBlackjack && !state.isTie) {
    winner = "player";
  } else if (state.playerWon) {
    winner = "player";
  } else if (state.dealerWon) {
    winner = "dealer";
  }

  if (winner === "dealer") totalDealerWins++;
  else if (winner === "player") totalPlayerWins++;
  else if (winner === "tie") empates++;

  updateScoreboard();
  saveScoreboard();

  $("#resultado").text(message);
  finalizeButtons();
}

// atualiza as cartas e a pontuação do dealerS na interface
function updateDealer() {
  const dealerScore = game.getScore(game.getDealerCards());
  $("#pontuacao-dealer").text(dealerScore);
}

// atualiza as cartas e a pontuação do jogador na interface
function updatePlayer(state) {
  const playerCards = game.getPlayerCards();
  $("#cartas-jogador").html("");
  for (const card of playerCards) {
    printCard($("#cartas-jogador"), card);
  }
  $("#pontuacao-jogador").text(game.getScore(playerCards));

  if (state && state.gameEnded) {
    finalScore(state);
  }
}

// faz o dealer tirar uma nova carta
function dealerNewCard() {
  const state = game.dealerMove();
  // limpa e mostra de novo as cartas do dealer
  const dealerCards = game.getDealerCards();
  $("#cartas-dealer").html("");
  for (const card of dealerCards) {
    printCard($("#cartas-dealer"), card);
  }
  updateDealer();
  return state;
}

// faz o jogador tirar uma nova carta
function playerNewCard() {
  const state = game.playerMove();
  updatePlayer(state);
}

// finaliza a vez do jogador e inicia a vez do dealer
function dealerFinish() {
  game.setDealerTurn(true);
  finalizeButtons();

  // revela a carta escondida do dealer
  const dealerCards = game.getDealerCards();
  $("#cartas-dealer").html("");
  for (const card of dealerCards) {
    printCard($("#cartas-dealer"), card);
  }
  updateDealer();

  // loop para as jogadas automaticas do dealer
  let state = game.getGameState();
  // se o jogo não terminou depois de revelar as cartas, o dealer joga
  if (!state.gameEnded) {
    const dealerInterval = setInterval(function () {
      state = game.getGameState();
      if (!state.gameEnded) {
        dealerNewCard();
      } else {
        clearInterval(dealerInterval); // para o loop
        finalScore(state);
      }
    }, 1000); // espera 1 segundo
  } else {
    // se o jogo acabar quando as cartas forem reveladas, mostra o resultado final
    finalScore(state);
  }
}

// imprime a imagem da carta na interface
function printCard(element, card) {
  const cardImg = $("<img>").attr("src", `img/png/${card}.png`);
  element.append(cardImg);
}

// executa so quando o documento html estiver totalmente carregado
$(document).ready(function () {
  // reset no placar ao dar reload
  localStorage.removeItem("blackjack_totalDealerWins");
  localStorage.removeItem("blackjack_empates");
  localStorage.removeItem("blackjack_totalPlayerWins");
  totalDealerWins = empates = totalPlayerWins = 0;
  updateScoreboard();

  // associa as funções aos cliques dos botões
  $("#card").on("click", playerNewCard);
  $("#stand").on("click", dealerFinish);
  $("#new_game").on("click", newGame);

  newGame();
});
