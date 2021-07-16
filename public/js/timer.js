import { addClass } from "./utils.js"

export default function createTimer(time) {

    const elemento = document.createElement('div')
    const valueTimer = document.createElement('p')

    valueTimer.textContent = time

    elemento.appendChild(valueTimer)
    addClass(elemento, 'timer')

    const state = {
        initialTime: time
    }




    function start() {
        valueTimer.textContent = state.initialTime
        run()
    }

    function run() {

        let currentTime = valueTimer.textContent <= 9 ? `0${valueTimer.textContent}` : `${valueTimer.textContent}`
        let nextTime = parseInt(currentTime) - 1

        valueTimer.textContent = nextTime

        if (nextTime > 0) setTimeout(run, 1000)
    }

    return {
        elemento,
        start
    }
}