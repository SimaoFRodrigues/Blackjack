class Blackjack {
  static MAX_POINTS = 21; //pontuação máxima para não rebentar
  static DEALER_STANDS_ON = 17; //pontuação em que o dealer é obrigado a parar

  // cria uma instância do Blackjack e inicializa o jogo
  constructor() {
    this.dealerCards = []; // array para as cartas do dealer
    this.playerCards = []; // array para as cartas do jogador
    this.dealerTurn = false; // flag para indicar se é a vez do dealer jogar

    // objeto que guarda o estado do jogo
    this.state = {
      gameEnded: false,
      playerWon: false,
      dealerWon: false,
      isTie: false, // para empates
      playerBusted: false,
      dealerBusted: false,
      playerHasBlackjack: false,
      dealerHasBlackjack: false,
    };

    // inicializa o baralho de cartas, criando e baralhando um novo
    this.deck = this.shuffle(this.newDeck());
  }

  // cria um baralho novo com 52 cartas
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

  // baralha um array de cartas usando o algoritmo Fisher-Yates
  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  // retorna uma copia das cartas do dealer
  getDealerCards() {
    return this.dealerCards.slice();
  }

  // retorna uma copia das cartas do jogador
  getPlayerCards() {
    return this.playerCards.slice();
  }

  // define se é a vez do dealer jogar
  setDealerTurn(val) {
    this.dealerTurn = val;
  }

  // obtem o valor numerico de uma unica carta
  getCardValue(card) {
    let value = card.split("_of_")[0];
    if (isNaN(parseInt(value))) {
      if (value === "ace") return 11;
      return 10; // jack, queen, king
    }
    return parseInt(value);
  }

  // calcula a pontuação total de uma mao, tratando os Ases de forma inteligente
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

  // executa a jogada do dealer: tira uma carta do baralho e adiciona à sua mão
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

  // verifica o estado do jogo (quem ganhou, perdeu, rebentou ou empatou) e atualiza o objeto state
  getGameState() {
    const playerScore = this.getScore(this.playerCards);
    const dealerScore = this.getScore(this.dealerCards);

    // verifica se é um Blackjack inicial (2 cartas)
    if (this.playerCards.length === 2 && playerScore === Blackjack.MAX_POINTS) {
      this.state.playerHasBlackjack = true;
    }
    if (this.dealerCards.length === 2 && dealerScore === Blackjack.MAX_POINTS) {
      this.state.dealerHasBlackjack = true;
    }

    // se o jogador tem Blackjack
    if (this.state.playerHasBlackjack) {
      if (this.state.dealerHasBlackjack) {
        this.state.isTie = true; // ambos tem Blackjack, é um empate
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

    // verifica se o jogador rebentou
    if (playerScore > Blackjack.MAX_POINTS) {
      this.state.playerBusted = true;
      this.state.dealerWon = true;
      this.state.gameEnded = true;
      return this.state;
    }

    // logica para quando é a vez do dealer jogar, depois do jogador parar
    if (this.dealerTurn) {
      // dealer rebentou
      if (dealerScore > Blackjack.MAX_POINTS) {
        this.state.dealerBusted = true;
        this.state.playerWon = true;
        this.state.gameEnded = true;
      } else if (dealerScore >= Blackjack.DEALER_STANDS_ON) {
        // eealer para de jogar. Compara as pontuações
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
