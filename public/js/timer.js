import { addClass } from "./utils.js"

export default function createTimer(time) {

    const elemento = document.createElement('div')
    const valueTimer = document.createElement('p')

    valueTimer.textContent = time

    elemento.appendChild(valueTimer)
    addClass(elemento, 'timer')

    const state = {
        initialTime: time,
        observers: []
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function unscribe(observerFunction) {
        state.observers = state.observers.filter(observer => observer !== observerFunction)
    }

    function notify(command) {
        if (state.observers.length <= 0) return
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    function start() {
        valueTimer.textContent = state.initialTime
        run()
    }

    function run() {

        let currentTime = valueTimer.textContent <= 9 ? `0${valueTimer.textContent}` : `${valueTimer.textContent}`
        let nextTime = parseInt(currentTime) - 1

        valueTimer.textContent = nextTime

        if (nextTime > 0) {
            setTimeout(run, 1000)
        } else {
            notify({ type: 'finished' })
        }
    }

    return {
        elemento,
        start,
        subscribe
    }
}