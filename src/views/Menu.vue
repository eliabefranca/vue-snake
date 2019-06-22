<template>
  <div class="game-menu">
    <div class="game-options">
      <p class="game-over-text" v-if="gameOver">Game Over</p>
      <button @click="newGame">
        <span class="border-top"></span>
        <span class="border-left"></span>
        <span class="border-bottom"></span>
        <span class="border-right"></span>
        New Game
      </button>
    </div>
  </div>
</template>

<script>
import './../assets/styles/menu.scss'

export default {
  props: ['gameOver','newGame']
}
</script>
