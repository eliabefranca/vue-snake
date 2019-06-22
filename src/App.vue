<template>
  <div id="app">
    <h1>🐍 Snake Game 🐍</h1>
    <Menu v-if="isAnewGame || gameOver" :game-over="gameOver" :new-game="newGame"/>
    <Game v-else :end-game="endGame"/>
  </div>  
</template>

<script>
import Game from '@/views/Game'
import Menu from '@/views/Menu'
import '@/assets/styles/page.scss'


import store from '@/store/index'
import { mapState, mapMutations } from 'vuex'

export default {
  store,

  computed: mapState(['gameOver','isAnewGame']),

  methods: mapMutations(['newGame', 'endGame']),

  name: 'app',
  components: {
    Game, Menu
  }
}
</script>