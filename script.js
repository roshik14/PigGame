"use strict";

const getDiceElement = () => document.querySelector(".dice");

const hideImage = () => {
  const dice = getDiceElement();
  dice.classList.add("hidden");
};

hideImage();

const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");
const btnNew = document.querySelector(".btn--new");

let firstPlayerPoints = 0,
  secondPlayerPoints = 0,
  playerPoints = 0;

const getRandomValue = () => Math.round(Math.random() * 5) + 1;

const setRandomImage = (rnd) => `assets/dice-${rnd}.png`;

const isValueEqualsOne = (rnd) => rnd === 1;

const getCurretPlayersScore = (player) =>
  player.querySelector(".current-score");

const hasSelector = (elem, selector) => elem.classList.contains(selector);

const removeSelector = (elem, selector) => elem.classList.remove(selector);

const addSelector = (elem, selector) => elem.classList.add(selector);

const disableButtons = (...btns) =>
  btns.forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("btn-disabled");
  });

const activateButtons = (...btns) =>
  btns.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("btn-disabled");
  });

const players = Array.from(document.querySelectorAll(".player"));

const switchCurrentPlayer = (score) => {
  playerPoints = 0;
  score.textContent = "0";
  players.forEach((player) => {
    if (hasSelector(player, "player--active")) {
      removeSelector(player, "player--active");
    } else {
      addSelector(player, "player--active");
    }
  });
};

const getCurrentPlayer = () => {
  const filtered = players.filter((player) =>
    hasSelector(player, "player--active")
  );
  const currentPlayer = filtered[0];
  return currentPlayer;
};

const changePlayerOrNot = (rnd, score) => {
  if (isValueEqualsOne(rnd)) {
    switchCurrentPlayer(score);
  }
};

const checkCurrentPoints = (rnd) => {
  const score = getCurretPlayersScore(getCurrentPlayer());

  changePlayerOrNot(rnd, score);

  score.textContent = playerPoints;
};

const showImage = (dice, rnd) => {
  dice.src = setRandomImage(rnd);
  removeSelector(dice, "hidden");
};

const addPointsToCurrentScore = (rnd) => {
  playerPoints += rnd;
  checkCurrentPoints(rnd);
};

const rollDice = () => {
  const rnd = getRandomValue();
  showImage(getDiceElement(), rnd);
  addPointsToCurrentScore(rnd);
};

btnRoll.addEventListener("click", rollDice);

const hasWinner = (playerScore, firstPlayerPoints, secondPlayerPoints) => {
  if (firstPlayerPoints >= 100 || secondPlayerPoints >= 100) {
    playerScore.textContent = "WINNER!";
    disableButtons(btnRoll, btnHold);
    addSelector(getCurrentPlayer(), "player--winner");
    return true;
  }
  return false;
};

const savePlayersPoints = (currentPlayer, playersScore) => {
  if (hasSelector(currentPlayer, "player--0")) {
    firstPlayerPoints += playerPoints;
    playersScore.textContent = firstPlayerPoints;
  } else {
    secondPlayerPoints += playerPoints;
    playersScore.textContent = secondPlayerPoints;
  }
};

const holdPoints = () => {
  const currentPlayer = getCurrentPlayer();
  const playersScore = currentPlayer.querySelector(".score");

  savePlayersPoints(currentPlayer, playersScore);

  if (hasWinner(playersScore, firstPlayerPoints, secondPlayerPoints)) {
    return;
  }

  switchCurrentPlayer(getCurretPlayersScore(currentPlayer));
};

btnHold.addEventListener("click", holdPoints);

const setStartingPlayer = () => {
  players.forEach((player) => {
    if (hasSelector(player, "player--active")) {
      removeSelector(player, "player--active");
    }
    removeSelector(player, "player--winner");
  });
  addSelector(players[0], "player--active");
};

const clearSavedScores = () => {
  const savedScores = document.querySelectorAll(".score");
  savedScores.forEach((score) => (score.textContent = 0));
};

const clearPlayersPoints = () =>
  (firstPlayerPoints = secondPlayerPoints = playerPoints = 0);

const clearCurrentScores = () => {
  const currentScores = document.querySelectorAll(".current-score");
  currentScores.forEach((score) => (score.textContent = "0"));
};

const clearAllScores = () => {
  clearPlayersPoints();
  clearSavedScores();
  clearCurrentScores();
};

const startNewGame = () => {
  clearAllScores();
  activateButtons(btnRoll, btnHold);
  setStartingPlayer();

  getDiceElement().src = "assets/dice-5.png";
};

btnNew.addEventListener("click", startNewGame);
