import { createStore } from 'vuex';

// Загружаем данные из localStorage
const loadStateFromLocalStorage = () => {
  const storedState = localStorage.getItem('monster-slayer-state');
  return storedState ? JSON.parse(storedState) : null;
};

// Сохраняем состояние в localStorage
const saveStateToLocalStorage = (state) => {
  localStorage.setItem('monster-slayer-state', JSON.stringify(state));
};

// Начальное состояние игры
const defaultState = {
  playerHealth: 100,
  monsterHealth: 100,
  gameOver: false,
  winner: null,
  specialAttackAvailable: true,
  battleLog: [],
};

// Vuex Store
const store = createStore({
  state: loadStateFromLocalStorage() || defaultState,
  mutations: {
    attackMonster(state, { playerDamage, monsterDamage }) {
      state.monsterHealth -= playerDamage;
      state.playerHealth -= monsterDamage;
      state.battleLog.unshift(`Player attacks Monster for ${playerDamage}`);
      state.battleLog.unshift(`Monster attacks Player for ${monsterDamage}`);
      saveStateToLocalStorage(state);
    },
    specialAttack(state, { playerDamage, monsterDamage }) {
      state.monsterHealth -= playerDamage;
      state.playerHealth -= monsterDamage;
      state.specialAttackAvailable = false; // Спецатака недоступна после использования
      state.battleLog.unshift(`Player uses Special Attack for ${playerDamage}`);
      state.battleLog.unshift(`Monster attacks Player for ${monsterDamage}`);
      saveStateToLocalStorage(state);
    },
    healPlayer(state, { healValue, monsterDamage }) {
      state.playerHealth += healValue;
      if (state.playerHealth > 100) state.playerHealth = 100; // Максимум здоровья
      state.playerHealth -= monsterDamage;
      state.battleLog.unshift(`Player heals for ${healValue}`);
      state.battleLog.unshift(`Monster attacks Player for ${monsterDamage}`);
      saveStateToLocalStorage(state);
    },
    checkGameOver(state) {
      if (state.monsterHealth <= 0 && state.playerHealth > 0) {
        state.gameOver = true;
        state.winner = 'Player';
      } else if (state.playerHealth <= 0 && state.monsterHealth > 0) {
        state.gameOver = true;
        state.winner = 'Monster';
      } else if (state.playerHealth <= 0 && state.monsterHealth <= 0) {
        state.gameOver = true;
        state.winner = 'Draw';
      }
      saveStateToLocalStorage(state);
    },
    startNewGame(state) {
      Object.assign(state, {...defaultState});
      saveStateToLocalStorage(state);
    },
    toggleSpecialAttackAvailability(state) {
      state.specialAttackAvailable = !state.specialAttackAvailable;
      saveStateToLocalStorage(state);
    },
  },
  actions: {
    playerAttack({ commit }) {
      const playerDamage = getRandomValue(5, 12);
      const monsterDamage = getRandomValue(8, 15);
      commit('attackMonster', { playerDamage, monsterDamage });
      commit('checkGameOver');
    },
    playerSpecialAttack({ commit }) {
      const playerDamage = getRandomValue(10, 25);
      const monsterDamage = getRandomValue(8, 15);
      commit('specialAttack', { playerDamage, monsterDamage });
      commit('checkGameOver');
      setTimeout(() => commit('toggleSpecialAttackAvailability'), 3000); // Восстанавливаем доступность спецатаки через 3 секунды
    },
    playerHeal({ commit }) {
      const healValue = getRandomValue(8, 20);
      const monsterDamage = getRandomValue(8, 15);
      commit('healPlayer', { healValue, monsterDamage });
      commit('checkGameOver');
    },
    startNewGame({ commit }) {
      commit('startNewGame');
    },
  },
});

// Генерация случайного значения
const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export default store;
