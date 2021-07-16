import createItem from './item.js'
import createPlacar from './placar.js'
import createModal from './gameController.js'
import createTimer from './timer.js'
import createKeyboardListener from './keyboard-listener.js'

import { addClass, getX, setX, getY, setY, getLargura, getAltura } from './utils.js'

export default function createGame(tela) {

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


    function start() {
        const frequencia = 30

        keyboardListener.registerPlayer(state.player)
        keyboardListener.subscribe(movePlayer)

        subscribe(keyboardListener.unscribe)

        const temporizador = setInterval(() => {
            state.item.animar()
            checkItemCollisionScreenBackground(state.item, state.tela)
            checkItemCollisionPlayer(state.item, state.player)
        }, frequencia)
        state.timer.start()
        setState({ tempo: temporizador })
    }

    function gameFinished(command) {
        if (command.type !== 'finished') return
        const modal = createModal(tela)

        clearInterval(state.tempo)
        modal.activeContainergameFinished(state.placar.getPontosPlayer())
        notify(movePlayer)
        clearElements()
    }


    function addItem() {

        const item = createItem(state.tela)
        item.addClass(item.elemento)
        item.elemento.src = '/public/img/apple.png'
        state.tela.appendChild(item.elemento)

        const itemY = item.elemento.clientHeight
        item.calcPosX(state.tela)
        item.setY(-itemY)
        item.animar()
        state.item = item

    }

    function addPlacar() {
        // const placar = createPlacar()
        // state.tela.appendChild(placar.elemento)
        // placar.adicionarPontoPlayer(0)
        // state.placar = placar
        state.tela.innerHTML += `<div class="placar"><div class="placar-player">Score<span class="pontos">0</span></div></div>`
        const elemento = document.querySelector(`.placar`)
        const points = document.querySelector(`.placar .placar-player .pontos`)
        console.log(elemento, points)
        state.placar = { elemento, points } //VER PORQUE NAO ALTERA APARTIR DA REFERENCIA POINTS CONTIDA AQUI

        console.log(state.placar)
    }

    function addPointsScoreBoard(pontos) {
        const ponto = document.querySelector('.placar .placar-player .pontos')
        const currentScore = parseInt(ponto.innerHTML)
        ponto.innerHTML = `${currentScore + pontos}`
    }

    function addTimer() {
        const timer = createTimer(60)
        state.tela.appendChild(timer.elemento)

        timer.subscribe(gameFinished)
        state.timer = timer
    }

    function addPlayer() {
        state.tela.innerHTML += `<img class="player" src="/public/img/fruit-basket.png">`

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

    function resetPositionItem() {
        state.item.calcPosX(state.tela)
        state.item.addClass(state.item.elemento)
        state.item.setY(-state.item.getAltura())
    }

    function checkItemCollisionScreenBackground(item, tela) {
        if (item.getY() + item.getAltura() >= tela.clientTop + tela.clientHeight) {
            // gameFinished()
            resetPositionItem()
        }
    }

    function checkItemCollisionPlayer(item, player) {
        if (!item || !player) return

        let positionItemX = item.getX()
        let positionPlayerX = getX(player.elemento)
        const positionItemY = item.getY() + item.getAltura()
        const positionPlayerY = getY(player.elemento)
        const intervalItensPosX = (positionItemX - positionPlayerX < 0 ? (positionItemX - positionPlayerX) * -1 : positionItemX - positionPlayerX)

        if (positionItemY >= positionPlayerY && intervalItensPosX >= 0 && intervalItensPosX <= 60) {
            addPointsScoreBoard(1)
            resetPositionItem()
        }
    }

    function renderElements() {
        addPlacar()
        addPlayer(screen)
        addItem()
        addTimer()
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
        state,
        start,
        renderElements,
        subscribe,
        unscribe,
        clearElements
    }
}