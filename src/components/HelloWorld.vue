<template>
  <section class="game">
    <h1>Monster Slayer</h1>
    <div class="health-bars">
      <div>
        <h2>Player Health</h2>
        <div class="bar">
          <div class="inner-bar" :style="{ width: playerHealth + '%' }"></div>
        </div>
      </div>
      <div>
        <h2>Monster Health</h2>
        <div class="bar">
          <div class="inner-bar" :style="{ width: monsterHealth + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="controls">
      <button @click="attack" :disabled="gameOver">Attack</button>
      <button @click="specialAttack" :disabled="!specialAttackAvailable || gameOver">Special Attack</button>
      <button @click="heal" :disabled="gameOver">Heal</button>
      <button @click="startNewGame">New Game</button>
    </div>

    <p v-if="gameOver">{{ winner }} wins! Game Over</p>

    <ul class="log" v-if="battleLog.length > 0">
      <li v-for="(log, index) in battleLog" :key="index">{{ log }}</li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Получение состояния из Vuex
const playerHealth = computed(() => store.state.playerHealth);
const monsterHealth = computed(() => store.state.monsterHealth);
const gameOver = computed(() => store.state.gameOver);
const winner = computed(() => store.state.winner);
const specialAttackAvailable = computed(() => store.state.specialAttackAvailable);
const battleLog = computed(() => store.state.battleLog);

// Методы для игры
const attack = () => store.dispatch('playerAttack');
const specialAttack = () => store.dispatch('playerSpecialAttack');
const heal = () => store.dispatch('playerHeal');
const startNewGame = () => store.dispatch('startNewGame');  // Запускаем новую игру
</script>

<style scoped>
.game {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.health-bars {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.bar {
  width: 200px;
  height: 25px;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.inner-bar {
  height: 100%;
  background-color: #28a745;
  transition: width 0.3s;
}

.controls button {
  margin: 10px;
  padding: 10px;
  background-color: #007bff;
  border: none;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

.controls button:disabled {
  background-color: #ccc;
}

.log {
  text-align: left;
  margin-top: 20px;
  max-height: 200px;
  overflow-y: scroll;
}
</style>
