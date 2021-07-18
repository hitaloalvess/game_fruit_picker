import createKeyboardListener from './keyboard-listener.js'

import { addClass, getX, setX, getY, setY, getLargura, getAltura, valueBetween } from './utils.js'

export default function createGame(tela, document) {

    const keyboardListener = createKeyboardListener(document)

    const state = {
        player: {},
        items: [],
        tela: tela,
        placar: {},
        timer: {},
        observers: []
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function unscribe(observerFunction) {
        state.observers = state.observers.filter(subscriber => subscriber !== observerFunction)
    }

    function notify(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }


    function start(command) {
        if (!('type' in command)) return
        if (command.type !== 'start') return

        setTimeout(() => {
            const frequencia = 40
            keyboardListener.registerPlayer(state.player)
            keyboardListener.subscribe(movePlayer)
            subscribe(keyboardListener.unscribe)

            const temporizador = setInterval(() => {
                for (const item of state.items) {
                    item.animateItem()
                    checkItemCollisionScreenBackground(item, state.tela)
                    checkItemCollisionPlayer(item, state.player)
                }
            }, frequencia)

            state.timer.start()
            setState({ tempo: temporizador })

        }, 200)
    }

    function gameFinished() {
        clearInterval(state.tempo)

        notify({
            type: 'finished',
            pontos: state.placar.points.textContent,
            observerFunction: movePlayer
        })

        clearElements()
    }

    function renderElements(command) {
        if (!('type' in command)) return
        if (command.type !== 'start') return

        addPlacar()
        addPlayer()
        addTimer(60)
        itemGenerator(3)
    }

    function addItem(item, posicao) {
        const html = `<img class="item-coletavel nao-saudavel" src="/public/img/${item.src}">`
        state.tela.insertAdjacentHTML('afterbegin', html)

        const elemento = document.querySelector(`img.item-coletavel`)
        const posX = calcNewPosXItem(elemento, state.tela)

        setX(elemento, posX)
        setY(elemento, (-elemento.clientHeight * posicao))

        const animateItem = function() {
            const newPosition = getY(this.elemento) + item.deslocamento
            setY(elemento, newPosition)
        }

        state.items.push({
            elemento,
            deslocamento: item.deslocamento,
            pontuacao: item.pontuacao,
            animateItem
        })
    }

    function itemGenerator(qtdItems) {
        const fruits = [{
                src: 'banana.png',
                deslocamento: 4,
                pontuacao: 3
            },
            {
                src: 'watermelon.png',
                deslocamento: 4,
                pontuacao: 2
            },
            {
                src: 'orange-juice.png',
                deslocamento: 4,
                pontuacao: 1
            }
        ]

        const items = Array.from(new Array(qtdItems)).map(item => fruits[valueBetween(3 - 1, 0)])

        items.forEach((item, index) => addItem(item, index * 10))

    }

    function calcNewPosXItem(item, tela) {
        let novaPosX = valueBetween(tela.clientWidth, 0)
        if (novaPosX > tela.clientWidth - getLargura(item)) novaPosX = tela.clientWidth - getLargura(item)

        return novaPosX
    }

    function addPlacar() {
        const html = `<div class="placar"><div class="placar-player">Score<span class="pontos">0</span></div></div>`
        state.tela.insertAdjacentHTML('afterbegin', html)

        const elemento = document.querySelector(`.placar`)
        const points = document.querySelector(`.placar .placar-player .pontos`)

        state.placar = { elemento, points }

    }

    function addPointsScoreBoard(pontos) {
        const currentScore = parseInt(state.placar.points.textContent)
        state.placar.points.textContent = `${currentScore + pontos}`
    }

    function addTimer(initialTime) {
        const html = `<div class="timer"><p>${initialTime}</p></div>`
        state.tela.insertAdjacentHTML('afterbegin', html)

        const elemento = document.querySelector(`.hf-content .timer`)
        const valueTimer = document.querySelector(`.hf-content .timer p`)

        const start = function() {
            let currentTime = valueTimer.textContent <= 9 ? `0${valueTimer.textContent}` : `${valueTimer.textContent}`
            let nextTime = parseInt(currentTime) - 1

            valueTimer.textContent = nextTime

            if (nextTime > 0) {
                setTimeout(start, 1000)
            } else {
                gameFinished()
            }
        }

        state.timer = {
            elemento,
            valueTimer,
            start
        }
    }

    function addPlayer() {
        const html = `<img class="player" src="/public/img/fruit-basket.png">`
        state.tela.insertAdjacentHTML('afterbegin', html)

        const deslocamento = 9
        const elemento = document.querySelector(`.player`)

        const playerX = (state.tela.clientWidth / 2) - (getLargura(elemento) / 2)
        const playerY = state.tela.clientHeight - getAltura(elemento)
        setX(elemento, playerX)
        setY(elemento, playerY)
        state.player = { elemento, deslocamento }

    }

    function movePlayer(command) {
        const acceptedMoves = {
            ArrowRight(player) {
                if (getX(player.elemento) + player.deslocamento <= state.tela.clientWidth - getLargura(player.elemento)) {
                    setX(player.elemento, (getX(player.elemento) + player.deslocamento))
                }
            },
            ArrowLeft(player) {
                if (getX(player.elemento) - player.deslocamento >= 0) {
                    setX(player.elemento, (getX(player.elemento) - player.deslocamento))
                }
            }
        }

        const keyPressed = command
        const player = state.player
        const moveFunction = acceptedMoves[keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
        }
    }

    function resetItem(item) {
        clearItem(item)
        itemGenerator(1)
    }

    function checkItemCollisionScreenBackground(item) {
        const tela = state.tela
        if (getY(item.elemento) + getAltura(item.elemento) >= tela.clientTop + tela.clientHeight) {
            resetItem(item)

        }
    }

    function checkItemCollisionPlayer(item, player) {
        if (!item || !player) return

        let positionItemX = getX(item.elemento)
        let positionPlayerX = getX(player.elemento)
        const positionItemY = getY(item.elemento) + getAltura(item.elemento)
        const positionPlayerY = getY(player.elemento)
        const intervalItensPosX = (positionItemX - positionPlayerX < 0 ? (positionItemX - positionPlayerX) * -1 : positionItemX - positionPlayerX)

        if (positionItemY >= positionPlayerY && intervalItensPosX >= 0 && intervalItensPosX <= 60) {
            addPointsScoreBoard(item.pontuacao)
            resetItem(item)
        }
    }

    function clearItem(item) {

        state.items = state.items.filter(element => element !== item)
        state.tela.removeChild(item.elemento)

    }

    function clearElements() {
        const elements = [state.player, state.placar, state.timer]

        state.items.forEach(item => {
            state.tela.removeChild(item.elemento)
        })
        elements.forEach(element => {
            state.tela.removeChild(element.elemento)
        })

        state.items = []
        state.player = null
        state.placar = null
        state.timer = null
    }

    return {
        setState,
        start,
        renderElements,
        subscribe,
        unscribe,
    }
}