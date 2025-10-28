class Blackjack {
  static MAX_POINTS = 21; //pontuaçao máxima
  static DEALER_STANDS_ON = 17; //pontuação em que o dealer é obrigado a parar

  // cria uma instância do Blackjack e inicia o jogo
  constructor() {
    this.dealerCards = [];
    this.playerCards = [];
    this.dealerTurn = false;

    // objeto que guarda o estado do jogo
    this.state = {
      gameEnded: false,
      playerWon: false,
      dealerWon: false,
      isTie: false,
      playerBusted: false,
      dealerBusted: false,
      playerHasBlackjack: false,
      dealerHasBlackjack: false,
    };

    // inicia o baralho de cartas, cria um novo e baralha-o
    this.deck = this.shuffle(this.newDeck());
  }

  // cria um baralho com 52 cartas
  newDeck() {
    let values = [
      "ace",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "jack",
      "king",
      "queen",
    ];
    let types = ["clubs", "diamonds", "hearts", "spades"];
    let deck = [];

    for (let type of types) {
      for (let value of values) {
        deck.push(`${value}_of_${type}`);
      }
    }
    return deck;
  }

  // baralha um array de cartas usando o algoritmo de Fisher-Yates
  shuffle(deck) {
    // percorre o baralho de trás pra frente
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      // troca a carta da posição atual com a da posição aleatória
      let temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    return deck;
  }

  getDealerCards() {
    return this.dealerCards.slice();
  }

  getPlayerCards() {
    return this.playerCards.slice();
  }

  setDealerTurn(val) {
    this.dealerTurn = val;
  }

  // obtem o valor numerico carta a carta
  // pega o primeiro valor da carta, se não for inteiro verifica se for ás é 11,
  // os outros 10, e tudo o que for inteiro transforma o número de String em inteiro
  getCardValue(card) {
    let value = card.split("_of_")[0];
    if (isNaN(parseInt(value))) {
      if (value === "ace") return 11;
      return 10;
    }
    return parseInt(value);
  }

  // calcula a pontuação total de uma mao, incluindo a decisão dos ases
  getScore(cards) {
    let score = 0;
    let aceCount = cards.filter((card) => card.startsWith("ace")).length;

    for (const card of cards) {
      score += this.getCardValue(card);
    }

    while (score > Blackjack.MAX_POINTS && aceCount > 0) {
      score -= 10;
      aceCount--;
    }
    return score;
  }

  // tira uma carta do baralho e adiciona à mão do dealer
  dealerMove() {
    if (!this.state.gameEnded) {
      this.dealerCards.push(this.deck.pop());
      return this.getGameState();
    }
    return this.state;
  }

  // tira uma carta do baralho e adiciona à mão do jogador
  playerMove() {
    if (!this.state.gameEnded) {
      this.playerCards.push(this.deck.pop());
      return this.getGameState();
    }
    return this.state;
  }

  // verifica o estado do jogo e atualiza o objeto state
  getGameState() {
    const playerScore = this.getScore(this.playerCards);
    const dealerScore = this.getScore(this.dealerCards);

    // verifica se é um Blackjack inicial
    if (this.playerCards.length === 2 && playerScore === Blackjack.MAX_POINTS) {
      this.state.playerHasBlackjack = true;
    }
    if (this.dealerCards.length === 2 && dealerScore === Blackjack.MAX_POINTS) {
      this.state.dealerHasBlackjack = true;
    }

    // se o jogador tiver Blackjack
    if (this.state.playerHasBlackjack) {
      if (this.state.dealerHasBlackjack) {
        this.state.isTie = true; //e um empate
      } else {
        this.state.playerWon = true;
      }
      this.state.gameEnded = true;
      return this.state;
    }
    // se só o dealer tem Blackjack
    if (this.state.dealerHasBlackjack) {
      this.state.dealerWon = true;
      this.state.gameEnded = true;
      return this.state;
    }

    // se o jogador rebentou
    if (playerScore > Blackjack.MAX_POINTS) {
      this.state.playerBusted = true;
      this.state.dealerWon = true;
      this.state.gameEnded = true;
      return this.state;
    }

    // logica para quando é a vez do dealer jogar
    if (this.dealerTurn) {
      // se o dealer rebentou
      if (dealerScore > Blackjack.MAX_POINTS) {
        this.state.dealerBusted = true;
        this.state.playerWon = true;
        this.state.gameEnded = true;
      } else if (dealerScore >= Blackjack.DEALER_STANDS_ON) {
        // dealer para de jogar e compara as pontuações
        if (dealerScore > playerScore) {
          this.state.dealerWon = true;
        } else if (playerScore > dealerScore) {
          this.state.playerWon = true;
        } else {
          this.state.isTie = true; // empate
        }
        this.state.gameEnded = true;
      }
    }
    return this.state;
  }
}
