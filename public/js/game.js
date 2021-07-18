import createKeyboardListener from './keyboard-listener.js'

import { addClass, getX, setX, getY, setY, getLargura, getAltura, valueBetween } from './utils.js'

export default function createGame(tela, document) {

    const keyboardListener = createKeyboardListener(document)

    const state = {
        player: {},
        item: {},
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
                state.item.animateItem()
                checkItemCollisionScreenBackground(state.item, state.tela)
                checkItemCollisionPlayer(state.item, state.player)
            }, frequencia)

            state.timer.start()
            setState({ tempo: temporizador })

        }, 1000)
    }

    function gameFinished(command) {
        clearInterval(state.tempo)

        notify({
            type: 'finished',
            pontos: state.placar.points.textContent,
            observerFunction: movePlayer
        })

        clearElements()
    }


    function addItem(src, deslocamento, pontuacao) {
        const html = `<img class="item-coletavel nao-saudavel" src="/public/img/${src}.png">`
        state.tela.insertAdjacentHTML('afterbegin', html)

        const elemento = document.querySelector(`img.item-coletavel`)
        const posX = calcNewPosXItem(elemento, state.tela)

        setX(elemento, posX)
        setY(elemento, -elemento.clientHeight)

        const animateItem = function() {
            const newPosition = getY(this.elemento) + this.deslocamento
            setY(elemento, newPosition)
        }

        state.item = {
            elemento,
            deslocamento,
            pontuacao,
            animateItem
        }
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

    function resetPositionItem(item) {
        const tela = state.tela

        setX(item.elemento, calcNewPosXItem(item.elemento, tela))
        setY(item.elemento, -getLargura(item.elemento))
    }

    function checkItemCollisionScreenBackground(item) {
        const tela = state.tela
        if (getY(item.elemento) + getAltura(item.elemento) >= tela.clientTop + tela.clientHeight) {
            resetPositionItem(item)
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
            resetPositionItem(item)
        }
    }

    function renderElements(command) {
        if (!('type' in command)) return
        if (command.type !== 'start') return

        addPlacar()
        addPlayer()
        addItem('orange-juice', 5, 2)
        addTimer(6)
    }

    function clearElements() {
        const elements = [state.item, state.player, state.placar, state.timer]

        elements.forEach(element => {
            state.tela.removeChild(element.elemento)
        })

        state.item = null
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