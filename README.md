# Blackjack 21

Projeto de Blackjack 21 feito em HTML, CSS e JavaScript com organizacao em MVC simples (model, controller, view). O objetivo e praticar logica de jogo, OOP em JavaScript e manipulacao do DOM.

## Funcionalidades

- Distribuicao de cartas com baralho de 52 cartas
- Regras basicas do Blackjack (21, dealer para nos 17)
- Botao para pedir carta, ficar e iniciar novo jogo
- Placar local (vitorias do dealer, empates, vitorias do jogador)
- Interface responsiva com Bootstrap

## Estrutura do projeto

- view/blackjack_oop.html: interface principal
- view/css/blackjack_style.css: estilos
- model/blackjack_object.js: logica do jogo e regras
- controller/blackjack_manager.js: interacao com a UI e estado

## Como correr

1. Abrir o ficheiro view/blackjack_oop.html no browser.
2. Usar os botoes para jogar.

## Notas

- O placar e guardado em memoria local enquanto a pagina estiver aberta. Ao recarregar, o placar e reiniciado.
- As imagens das cartas estao em view/img/png.

## Creditos

Simao Ferro Rodrigues, 2025.
