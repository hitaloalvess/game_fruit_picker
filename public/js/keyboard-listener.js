export default function createKeyboardListener(document) {
    const state = {
        player: {},
        observers: []
    }

    function registerPlayer(player) {
        state.player = player
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

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key
        notify(keyPressed)
    }

    return {
        subscribe,
        unscribe,
        registerPlayer
    }
}