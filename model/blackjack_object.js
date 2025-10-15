class Blackjack {
  // Constante que define a pontuação máxima para não rebentar (Blackjack 21).
  static MAX_POINTS = 21;
  // Constante que define a pontuação em que o dealer é obrigado a parar.
  static DEALER_STANDS_ON = 17;

  //Cria uma instância do Blackjack e inicializa o jogo.
  constructor() {
    this.dealerCards = []; // Array para as cartas do dealer.
    this.playerCards = []; // Array para as cartas do jogador.
    this.dealerTurn = false; // Flag para indicar se é a vez do dealer jogar.

    // Objeto que guarda o estado do jogo.
    this.state = {
      gameEnded: false,
      playerWon: false,
      dealerWon: false,
      isTie: false, // Para empates (Push).
      playerBusted: false,
      dealerBusted: false,
      playerHasBlackjack: false,
      dealerHasBlackjack: false,
    };

    //Inicializa o baralho de cartas, criando e baralhando um novo.
    this.deck = this.shuffle(this.newDeck());
  }

  //Cria um baralho novo com 52 cartas.
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

  //Baralha um array de cartas usando o algoritmo Fisher-Yates.
  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  //Retorna uma cópia das cartas do dealer.
  getDealerCards() {
    return this.dealerCards.slice();
  }

  //Retorna uma cópia das cartas do jogador.
  getPlayerCards() {
    return this.playerCards.slice();
  }

  //Define se é a vez do dealer jogar.
  setDealerTurn(val) {
    this.dealerTurn = val;
  }

  //Obtém o valor numérico de uma única carta.
  getCardValue(card) {
    let value = card.split("_of_")[0];
    if (isNaN(parseInt(value))) {
      if (value === "ace") return 11;
      return 10; // jack, queen, king
    }
    return parseInt(value);
  }

  //Calcula a pontuação total de uma mão, tratando os Ases de forma inteligente.
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

  //executa a jogada do dealer: tira uma carta do baralho e adiciona à sua mão.
  dealerMove() {
    if (!this.state.gameEnded) {
      this.dealerCards.push(this.deck.pop());
      return this.getGameState();
    }
    return this.state;
  }

  //executa a jogada do jogador: tira uma carta do baralho e adiciona à sua mão.
  playerMove() {
    if (!this.state.gameEnded) {
      this.playerCards.push(this.deck.pop());
      return this.getGameState();
    }
    return this.state;
  }

  //Verifica o estado do jogo (quem ganhou, perdeu, rebentou ou empatou) e atualiza o objeto state.
  getGameState() {
    const playerScore = this.getScore(this.playerCards);
    const dealerScore = this.getScore(this.dealerCards);

    // Verifica se é um Blackjack inicial (2 cartas)
    if (this.playerCards.length === 2 && playerScore === Blackjack.MAX_POINTS) {
      this.state.playerHasBlackjack = true;
    }
    if (this.dealerCards.length === 2 && dealerScore === Blackjack.MAX_POINTS) {
      this.state.dealerHasBlackjack = true;
    }

    // Se o jogador tem Blackjack
    if (this.state.playerHasBlackjack) {
      if (this.state.dealerHasBlackjack) {
        this.state.isTie = true; // Ambos têm Blackjack, é um empate.
      } else {
        this.state.playerWon = true;
      }
      this.state.gameEnded = true;
      return this.state;
    }
    // Se só o dealer tem Blackjack
    if (this.state.dealerHasBlackjack) {
      this.state.dealerWon = true;
      this.state.gameEnded = true;
      return this.state;
    }

    // Verifica se o jogador rebentou.
    if (playerScore > Blackjack.MAX_POINTS) {
      this.state.playerBusted = true;
      this.state.dealerWon = true;
      this.state.gameEnded = true;
      return this.state;
    }

    // Lógica para quando é a vez do dealer jogar (depois de o jogador parar).
    if (this.dealerTurn) {
      // Dealer rebentou.
      if (dealerScore > Blackjack.MAX_POINTS) {
        this.state.dealerBusted = true;
        this.state.playerWon = true;
        this.state.gameEnded = true;
      } else if (dealerScore >= Blackjack.DEALER_STANDS_ON) {
        // Dealer para de jogar. Compara as pontuações.
        if (dealerScore > playerScore) {
          this.state.dealerWon = true;
        } else if (playerScore > dealerScore) {
          this.state.playerWon = true;
        } else {
          this.state.isTie = true; // Empate
        }
        this.state.gameEnded = true;
      }
    }
    return this.state;
  }
}
