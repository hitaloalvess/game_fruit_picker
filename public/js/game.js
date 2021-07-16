import createPlayer from './player.js'
import createItem from './item.js'
import createPlacar from './placar.js'
import createModal from './modal.js'
import createTimer from './timer.js'

import { addClass } from './utils.js'

export default function createGame(tela) {
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

        const temporizador = setInterval(() => {
            state.item.animar()
            checkItemCollisionScreenBackground(state.item, state.tela)
            checkItemCollisionPlayer(state.item, state.player)
        }, frequencia)
        state.timer.start()
        setState({ tempo: temporizador })
    }

    function gameOver() {
        const modal = createModal(tela)

        clearInterval(state.tempo)
        modal.activeContainerGameOver(state.placar.getPontosPlayer())
        notify(movePlayer)
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

    function addPlayer() {
        const player = createPlayer()
        addClass(player.elemento, 'player')
        player.elemento.src = '/public/img/fruit-basket.png'
        player.setX((tela.clientWidth / 2))

        state.tela.appendChild(player.elemento)

        const playerX = (state.tela.clientWidth / 2) - (player.getLargura() / 2)
        const playerY = state.tela.clientHeight - player.getAltura()
        player.setX(playerX)
        player.setY(playerY)
        state.player = player

    }

    function addPlacar() {
        const placar = createPlacar()
        state.tela.appendChild(placar.elemento)
        placar.adicionarPontoPlayer(0)
        state.placar = placar

    }

    function addTimer() {
        const timer = createTimer(60)
        state.tela.appendChild(timer.elemento)
        state.timer = timer
    }

    function movePlayer(command) {
        const acceptedMoves = {
            ArrowRight(player) {
                if (player.getX() + player.deslocamento <= state.tela.clientWidth - player.getLargura()) {
                    player.setX(player.getX() + player.deslocamento)
                }
            },
            ArrowLeft(player) {
                if (player.getX() - player.deslocamento >= 0) {
                    player.setX(player.getX() - player.deslocamento)
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

    function checkItemCollisionScreenBackground(item, tela) {
        if (item.getY() + item.getAltura() >= tela.clientTop + tela.clientHeight) {
            // gameOver()
            resetPositionItem()
        }
    }

    function checkItemCollisionPlayer(item, player) {
        if (!item || !player) return

        let positionItemX = item.getX()
        let positionPlayerX = player.getX()
        const positionItemY = item.getY() + item.getAltura()
        const positionPlayerY = player.getY()
        const intervalItensPosX = (positionItemX - positionPlayerX < 0 ? (positionItemX - positionPlayerX) * -1 : positionItemX - positionPlayerX)

        if (positionItemY >= positionPlayerY && intervalItensPosX >= 0 && intervalItensPosX <= 60) {
            state.placar.adicionarPontoPlayer(1)
            resetPositionItem()
        }
    }

    function resetPositionItem() {
        state.item.calcPosX(state.tela)
        state.item.addClass(state.item.elemento)
        state.item.setY(-state.item.getAltura())
    }

    function clearElements() {
        const elements = [state.item, state.player, state.placar]

        elements.forEach(element => {
            state.tela.removeChild(element.elemento)
        })

        state.item = null
        state.player = null
        state.placar = null
    }

    return {
        state,
        start,
        addPlayer,
        movePlayer,
        addItem,
        addPlacar,
        addTimer,
        setState,
        subscribe,
        unscribe,
        clearElements
    }
}