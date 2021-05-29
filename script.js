'use strict';
const dice = document.querySelector('.dice');
dice.classList.add('hidden');

const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');

let firstPlayerPoints = 0,
  secondPlayerPoints = 0,
  playerPoints = 0;

const getRandomValue = () => Math.round(Math.random() * 5) + 1;

const setRandomImage = rnd => `assets/dice-${rnd}.png`;

const isValueEqualsOne = rnd => rnd === 1;

const getCurretPlayersScore = player => player.querySelector('.current-score');

const disableButtons = (...btns) =>
  btns.forEach(btn => {
    btn.disabled = true;
    btn.classList.add('btn-disabled');
  });

const activateButtons = (...btns) =>
  btns.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('btn-disabled');
  });

const players = Array.from(document.querySelectorAll('.player'));

const switchCurrentPlayer = score => {
  playerPoints = 0;
  score.textContent = '0';
  players.forEach(player => {
    if (player.classList.contains('player--active')) {
      player.classList.remove('player--active');
    } else {
      player.classList.add('player--active');
    }
  });
};

const getCurrentPlayer = () => {
  const filtered = players.filter(player =>
    player.classList.contains('player--active')
  );
  const currentPlayer = filtered[0];
  return currentPlayer;
};

const changePlayerOrNot = (rnd, score) => {
  if (isValueEqualsOne(rnd)) {
    switchCurrentPlayer(score);
  }
};

const checkCurrentPoints = rnd => {
  const currentPlayer = getCurrentPlayer();
  const score = getCurretPlayersScore(currentPlayer);

  changePlayerOrNot(rnd, score);

  score.textContent = playerPoints;
};

const showImage = rnd => {
  dice.src = setRandomImage(rnd);
  dice.classList.remove('hidden');
};

const addPoints = rnd => {
  playerPoints += rnd;
  checkCurrentPoints(rnd);
};

const rollDice = () => {
  const rnd = getRandomValue();
  showImage(rnd);
  addPoints(rnd);
};

btnRoll.addEventListener('click', rollDice);

const hasWinner = (playerScore, firstPlayerPoints, secondPlayerPoints) => {
  if (firstPlayerPoints >= 100 || secondPlayerPoints >= 100) {
    playerScore.textContent = 'WINNER!';
    disableButtons(btnRoll, btnHold);
    const player = getCurrentPlayer();
    player.classList.add('player--winner');
    return true;
  }
  return false;
};

const savePlayersPoints = (currentPlayer, playersScore) => {
  if (currentPlayer.classList.contains('player--0')) {
    firstPlayerPoints += playerPoints;
    playersScore.textContent = firstPlayerPoints;
  } else {
    secondPlayerPoints += playerPoints;
    playersScore.textContent = secondPlayerPoints;
  }
};

const holdPoints = () => {
  const currentPlayer = getCurrentPlayer();
  const playersScore = currentPlayer.querySelector('.score');

  savePlayersPoints(currentPlayer, playersScore);

  if (hasWinner(playersScore, firstPlayerPoints, secondPlayerPoints)) {
    return;
  }

  switchCurrentPlayer(getCurretPlayersScore(currentPlayer));
};

btnHold.addEventListener('click', holdPoints);

const setStartingPlayer = () => {
  players.forEach(player => {
    if (player.classList.contains('player--active')) {
      player.classList.remove('player--active');
    }
    player.classList.remove('player--winner');
  });
  players[0].classList.add('player--active');
};

const clearSavedScores = () => {
  const savedScores = document.querySelectorAll('.score');
  savedScores.forEach(score => (score.textContent = 0));
};

const clearPlayersPoints = () =>
  (firstPlayerPoints = secondPlayerPoints = playerPoints = 0);

const clearCurrentScores = () => {
  const currentScores = document.querySelectorAll('.current-score');
  currentScores.forEach(score => (score.textContent = '0'));
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

  dice.src = 'assets/dice-5.png';
};

btnNew.addEventListener('click', startNewGame);
