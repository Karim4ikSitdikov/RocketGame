let easy = document.getElementById('easy')
let medium = document.getElementById('medium')
let hard = document.getElementById('hard')
let player_name = document.getElementById('player_name')
let start_btn = document.getElementById('start_btn')
let currentDifficult = 'medium'

let gameStarted = false
let start_screen = document.getElementById('start_screen')
let timerDisplay =  document.getElementById('timer')
let scoreDisplay  = document.getElementById('coins')
let healthDisplay = document.getElementById('health')
let fuelDisplay = document.getElementById('fuel')
let rocket = document.getElementById('rocket')
let back_timer = document.getElementById('back_timer')
let back_timer_display = document.getElementById('back_timer_display')
let game_screen = document.getElementById('game_screen')
let game_over_screen = document.getElementById('game_over_screen')
let restart_btn = document.getElementById('restart_btn')
let nick = document.getElementById('nick')
let time_score = document.getElementById('time_score')
let menu_btn = document.getElementById('menu_btn')

let screenHeight = window.innerHeight
let screenWeight = window.innerWidth
let fuel = 100
let time = 0
let health = 100
let score = 0
let rocketX = screenWeight/2
let rocketY = 20

let timeInterval
let fuelInterval
let coinInterval
let asteroidInterval
let healthInterval
let gameInterval
let hasProtect = false

let coinSpeed = 2
let asteroidSpeed = 4
let fuelSpeed = 3
let healthSpeed = 5

easy.addEventListener('click', () => {
    currentDifficult = 'light'
})
medium.addEventListener('click', () => {
    currentDifficult = 'medium'
})
hard.addEventListener('click', () => {
    currentDifficult = 'hard'
})
player_name.addEventListener('input', () => {
    if ( player_name.value.length >= 3){
        start_btn.attributes.removeNamedItem('disabled')
    }
})
start_btn.addEventListener('click', () => {
    if (!start_btn.hasAttribute('disabled')){
        initGame()
    }
})
menu_btn.addEventListener('click', () => {
    game_over_screen.classList.add('hidden')
    start_screen.classList.remove('hidden')
})
function initGame(){
    start_screen.classList.add('hidden')
    game_over_screen.classList.add('hidden')
    game_screen.classList.remove('hidden')
    document.querySelectorAll('.coin').forEach(el => el.remove())
    document.querySelectorAll('.asteroid').forEach(el => el.remove())
    document.querySelectorAll('.fuel').forEach(el => el.remove())
    document.querySelectorAll('.health').forEach(el => el.remove())
    fuel = 100
    time = 0
    health = 100
    score = 0
    rocketX = screenWeight/2
    rocketY = 20
    hasProtect = false
    rocket.classList.remove('shield')
    rocket.style.left = `${rocketX}px`
    rocket.style.bottom = `${rocketY}px`
    timerDisplay.textContent = `00:00`
    fuelDisplay.textContent = fuel
    scoreDisplay.textContent = score
    healthDisplay.textContent = health
    backTimerFunction()
}
function backTimerFunction(){
    back_timer_display.classList.remove('hidden')
    back_timer.textContent = '3'
    setTimeout(function(){
        back_timer.textContent = '2'
    },1000)
    setTimeout(function(){
        back_timer.textContent = '1'
    },2000)
    setTimeout(function(){
        back_timer.textContent = 'Поехали!'
    },3000)
    setTimeout(function(){
        back_timer_display.classList.add('hidden')
        startGame()
    },4000)
}
function startGame(){
    gameStarted = true
    spawnAsteroid()
    spawnCoin()
    spawnFuel()
    timeInterval = setInterval(() => {
        time += 1
        let timeS = time % 60
        if(timeS < 10) timeS = `0${timeS}`
        let timeM = (time - timeS)/60
        if (timeM < 10) timeM = `0${timeM}`
        timerDisplay.textContent = `${timeM}:${timeS}`
        fuel -= 5
        fuelDisplay.textContent = `${fuel}`
        if (fuel <= 0){
            endGame()
        }
    }, 1000)
    fuelInterval = setInterval(spawnFuel, 3000)
    coinInterval  = setInterval(spawnCoin, 2000)
    asteroidInterval = setInterval(spawnAsteroid, 2000)
    healthInterval = setInterval(spawnHealth, 10000)
    gameInterval = setInterval(updateGame, 16)
}

function spawnCoin(){
    let coinE = document.createElement('div')
    coinE.classList.add('coin')
    coinE.style.left = `${Math.random() * (screenWeight - 30)}px`
    coinE.style.top = '-50px'
    game_screen.appendChild(coinE)
}

function spawnFuel(){
    let fuelE = document.createElement('div')
    fuelE.classList.add('fuel')
    fuelE.style.left = `${Math.random() * (screenWeight - 30)}px`
    fuelE.style.top = '-50px'
    game_screen.appendChild(fuelE)
}

function spawnAsteroid(){
    let asteroidSize
    if(currentDifficult === 'light'){
        let rand = Math.random()
        if(rand <= 0.33){
            asteroidSize = 'small'
        }
        if(rand > 0.33 && rand <= 0.66){
            asteroidSize = 'medium'
        }
        if(rand < 0.66){
            asteroidSize = 'large'
        }
    }
    else if(currentDifficult === 'medium'){
        let rand = Math.random()
        if(rand <= 0.5){
            asteroidSize = 'medium'
        }
        if(rand > 0.5){
            asteroidSize = 'large'
        }
    }
    else if(currentDifficult === 'hard'){
        asteroidSize = 'large'
    }
    let asteroidE = document.createElement('div')
    asteroidE.classList.add('asteroid')
    asteroidE.style.left = `${Math.random() * (screenWeight - 70)}px`
    asteroidE.style.top = '-50px'
    asteroidE.classList.add(asteroidSize)
    game_screen.appendChild(asteroidE)
}

function spawnHealth(){
    if(currentDifficult !== 'hard'){
        let healthE = document.createElement('div')
        healthE.classList.add('health')
        healthE.style.left = `${Math.random() * (screenWeight - 30)}px`
        healthE.style.top = '-50px'
        game_screen.appendChild(healthE)
    }
}

function updateGame(){
    document.querySelectorAll('.coin').forEach(coin => {
        let coinY = parseInt(coin.style.top)
        if(currentDifficult === 'light'){
            coinY += coinSpeed
        }
        else if(currentDifficult === 'medium'){
            coinY += coinSpeed * 1.5
        }
        else if(currentDifficult === 'hard'){
            coinY += coinSpeed * 2
        }
        coin.style.top = `${coinY}px`
        if (coinY >= screenHeight) coin.remove()
        if (checkCollision(coin, rocket)) {
            coin.remove()
            score += 1
            scoreDisplay.textContent = `${score}`
            if(currentDifficult === 'light'){
                if(score === 5){
                    score = 0
                    scoreDisplay.textContent = `${score}`
                    hasProtect = true
                    rocket.classList.add('shield')
                }
            }
            if(currentDifficult === 'medium'){
                if(score === 7){
                    score = 0
                    scoreDisplay.textContent = `${score}`
                    hasProtect = true
                    rocket.classList.add('shield')
                }
            }
        }
    })

    document.querySelectorAll('.asteroid').forEach(asteroid => {
        let asteroidY = parseInt(asteroid.style.top)
        if(currentDifficult === 'light'){
            asteroidY += asteroidSpeed
        }
        else if(currentDifficult === 'medium'){
            asteroidY += asteroidSpeed * 1.5
        }
        else if(currentDifficult === 'hard'){
            asteroidY += asteroidSpeed * 2
        }
        asteroid.style.top = `${asteroidY}px`
        if (asteroidY >= screenHeight) asteroid.remove()
        if (checkCollision(asteroid, rocket)) {
            if (asteroid.classList.item(1) === 'large'){
                asteroid.remove()
                if(hasProtect){
                    hasProtect = false
                    rocket.classList.remove('shield')
                }
                else{
                    health -= 30
                }

            }
            else if (asteroid.classList.item(1) === 'medium'){
                asteroid.remove()
                if(hasProtect){
                    hasProtect = false
                    rocket.classList.remove('shield')
                }
                else{
                    health -= 20
                }
            }
            else if (asteroid.classList.item(1) === 'small'){
                asteroid.remove()
                if(hasProtect){
                    hasProtect = false
                    rocket.classList.remove('shield')
                }
                else{
                    health -= 10
                }
            }
            if(health <= 0){
                endGame()
            }
            healthDisplay.textContent = `${health}`
        }
    })

    document.querySelectorAll('.fuel').forEach(fuelE => {
        let fuelEY = parseInt(fuelE.style.top)
        if(currentDifficult === 'light'){
            fuelEY += fuelSpeed
        }
        else if(currentDifficult === 'medium'){
            fuelEY += fuelSpeed * 1.5
        }
        else if(currentDifficult === 'hard'){
            fuelEY += fuelSpeed * 2
        }
        fuelE.style.top = `${fuelEY}px`
        if (fuelEY >= screenHeight) fuelE.remove()
        if (checkCollision(fuelE, rocket)) {
            fuelE.remove()
            fuel += 25
            if (fuel >= 100) fuel = 100
            fuelDisplay.textContent = `${fuel}`
        }
    })

    document.querySelectorAll('.health').forEach(healthE => {
        let healthEY = parseInt(healthE.style.top)
        if(currentDifficult === 'light'){
            healthEY += healthSpeed
        }
        else if(currentDifficult === 'medium'){
            healthEY += healthSpeed * 1.5
        }
        else if(currentDifficult === 'hard'){
            healthEY += healthSpeed * 2
        }
        healthE.style.top = `${healthEY}px`
        if (healthEY >= screenHeight) healthE.remove()
        if (checkCollision(healthE, rocket)) {
            healthE.remove()
            health += 25
            if (health >= 100) health = 100
            healthDisplay.textContent = `${health}`
        }
    })
}

function checkCollision(el1, el2){
    let rect1 = el1.getBoundingClientRect()
    let rect2 = el2.getBoundingClientRect()
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    )
}

function endGame(){
    gameStarted = false
    clearInterval(gameInterval)
    clearInterval(coinInterval)
    clearInterval(asteroidInterval)
    clearInterval(fuelInterval)
    clearInterval(healthInterval)
    clearInterval(timeInterval)
    game_screen.classList.add('hidden')
    game_over_screen.classList.remove('hidden')
    nick.textContent = player_name.value
    let timeS = time % 60
    if(timeS < 10) timeS = `0${timeS}`
    let timeM = (time - timeS)/60
    if (timeM < 10) timeM = `0${timeM}`
    time_score.textContent = `${timeM}:${timeS}`
    restart_btn.addEventListener('click', initGame)
}


document.addEventListener('keydown', (e) => {
    if(gameStarted){
        switch(e.key){
            case 'A':
            case 'a':
            case 'ArrowLeft':
                rocketX -= 30
                if(rocketX <= 25) rocketX = 25
                rocket.style.left = `${rocketX}px`
                break

            case 'D':
            case 'd':
            case 'ArrowRight':
                rocketX += 30
                if(rocketX >= screenWeight - 25) rocketX = screenWeight - 25
                rocket.style.left = `${rocketX}px`
                break

            case 'W':
            case 'w':
            case 'ArrowTop':
                rocketY += 30
                if(rocketY >= screenHeight - 75) rocketY = screenHeight - 75
                rocket.style.bottom = `${rocketY}px`
                break

            case 'S':
            case 's':
            case 'ArrowDown':
                rocketY -= 30
                if(rocketY <= 0) rocketY = 0
                rocket.style.bottom = `${rocketY}px`
                break
        }
    }

})