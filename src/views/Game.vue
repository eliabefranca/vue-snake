<template>
  <div class="game">
    <div class="game-stats">
        <p style="color: #57ddff">SCORE: {{ score }}</p>
      </div>
      <div id="canvas">
        <template v-for="(value, index) of canvas">
          <div :class="'pixel ' + getClass(value)" :key="index"></div>
        </template>
      </div>
  </div>
</template>

<script>
'use strict'

// game constants
import { INITIAL_SPEED } from './../constants/index'
import './../assets/styles/game.scss'

export default {
  props: ['endGame'],
  data() {
    return {
      canvasSize: {x: 50, y: 50},
      canvas: null,
      
      tracking: {
        snake: [],
        food: null
      },
      direction: '',
      speed: null,
      debug: false,
      gameLoop: null,
      isWaitingToMove: false
    }
  },

  methods: {
    getClass (value) {
      let elementClass = ''
      if (value === 1) {
        elementClass = 'pixel--filled'
      }
      else if (value === 2) {
        elementClass = 'pixel--food'
      }

      return elementClass
    },

    draw () {
      this.resetCanvas()
      this.move()

      const { food, snake } = this.tracking

      for (const piece of snake) {
        this.canvas[ piece ] = 1
      }

      this.canvas[ food ] = 2
      

      this.isWaitingToMove = false
    },

    createFood () {
      let isAvalidIndex = false;
      let index = 0;

      do {
        const range = this.canvasSize.y * this.canvasSize.x
        index = Math.floor(Math.random() * range)

        if (this.canvas[index] === '') {
          isAvalidIndex = true
        }

      } while (!isAvalidIndex)

      this.tracking.food = index
    },

    resetCanvas () {
      this.canvas = new Array(
        this.canvasSize.x * this.canvasSize.y
      ).fill('')
    },

    getLine (index) {
      index++

      let line = 1

      if (index <= this.canvasSize.y) {
        line = 1
      } else {
        line = index / this.canvasSize.y
        if (line % 1 !== 0) {
          line = Math.floor(line) + 1
        }
      }

      return line - 1
    },

    getColumn (index) {
      let column = index % this.canvasSize.x
    
      if (index < 1) {
        column = 0
      } else {
        column = Math.floor(column)
      }

      return column
    },

    move () {
      const { snake, food } = this.tracking
      
      let newPos
      let currentLine
      let currentColumn
      let head = snake[0]

      switch (this.direction) {
        case 'left':
          currentLine = this.getLine(snake[0])
        
          newPos = head - 1
          newPos = newPos < 0 ? this.canvasSize.x - 1 : newPos

          // if its going to the prev line
          if (this.getLine(newPos) !== currentLine) {
            newPos = newPos + this.canvasSize.x
          }
                   
          break
        case 'right':
          currentLine = this.getLine(snake[0])
        
          newPos = snake[0] + 1

          // if its going to the next line
          if (this.getLine(newPos) !== currentLine) {
            newPos = newPos - this.canvasSize.x
          }        
          
          break
        case 'down':
          currentColumn = this.getColumn(snake[0])
                     
          newPos = head + this.canvasSize.x
        
          if (newPos > this.canvas.length) {
            newPos =  currentColumn
          }

          break
        case 'up':
          currentColumn = this.getColumn(snake[0])   

          newPos = head - this.canvasSize.x
        
          // if line < 0
          if (newPos < 0) {
            newPos =  (this.canvasSize.x * this.canvasSize.y - 1) - 
                      (this.canvasSize.x - 1 - currentColumn)
          }
          
          break
        default:
          return false
      }

      snake.pop() // remove last
      snake.unshift(null) // add new

      if (snake.indexOf(newPos) >= 0) {
        snake[0] = newPos

        this.gameOver()
      }

      // insert new position  
      snake[0] = newPos

      if (newPos === food) {
        this.grow()
        this.createFood()
      }
    },

    grow () {

      let nextPos
      const lastPos = this.tracking.snake.length === 1 ?
                      this.tracking.snake[0] : 
                      this.tracking.snake[-1] 

      switch(this.direction) {
        case 'left':
          nextPos = lastPos + 1          
          break
        case 'right':
          nextPos = lastPos - 1
          break
        case 'up':
          nextPos = lastPos - this.canvasSize.x
          break
        case 'down':
          nextPos = lastPos + this.canvasSize.x
          break
      }

      this.advanceLevel()

      this.tracking.snake.push(nextPos)
    },

    changeDirection (direction) {
      if (this.isWaitingToMove) return false

      if (this.direction === '') {
        this.direction = direction
      } 
      else if (this.direction === 'up') {
        if (direction === 'down') {
          return false
        }
        this.direction = direction
      } 
      else if (this.direction === 'down') {
        if (direction === 'up') {
          return false
        }
        this.direction = direction
      }
      else if (this.direction === 'left') {
        if (direction === 'right') {
          return false
        }
        this.direction = direction
      }
      else if (this.direction === 'right') {
        if (direction === 'left') {
          return false
        }
        this.direction = direction
      }

      this.isWaitingToMove = true
    },

    startGame () {
      const randomX = Math.floor(Math.random() * this.canvasSize.x)
      const randomY = Math.floor(Math.random() * this.canvasSize.y)
            

      this.tracking.snake = [null]
      this.tracking.snake[0] = randomX + (randomY * this.canvasSize.y)

      this.speed = INITIAL_SPEED
      this.resetCanvas()
      this.createFood()
      
      this.gameLoop = setInterval(() => {
        this.draw() 
      }, this.speed)

      console.log('posicao inicial')
      console.log({randomX, randomY})
      console.log(this.tracking.snake)
    },

    gameOver () {
      this.endGame()
    },

    advanceLevel () {
      clearInterval(this.gameLoop)
  
      this.speed -= 1
  
      this.gameLoop = setInterval(() => {
        this.draw() 
      }, this.speed)
    }
  },

  computed: {
    score () {
      let score = (this.tracking.snake.length - 1) * this.speed
      
      return score
    }
  },

  mounted () {
    this.startGame()
  },

  created () {
    const game = this

    // constrols
    window.addEventListener('keypress', function (e) {
      const key = e.key.toLowerCase()
      let direction = ''

      if (key === 'w') {
        direction = 'up'
      } else if (key === 'd') {
        direction = 'right'
      } else if (key === 's') {
        direction = 'down'
      } else {
        direction = 'left'
      }

      game.changeDirection(direction)
    })
  }
}
</script>
