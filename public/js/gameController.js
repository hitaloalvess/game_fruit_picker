export default function createGameController(screen, document) {

    const gameController = document.querySelector(`.modal-screenInitial`)
    const btnControl = document.querySelector(`.modal-screenInitial .container [data-button-type="controls"]`)

    const state = {
        currentContainer: 'initialGame',
        observers: []
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function unscribe(observerFunction) {
        state.observers = state.observers.filter(observe => observe !== observerFunction)
    }

    function notify(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    const functionalities = {
        play() {
            gameController.classList.add('disabled')

            notify({ type: 'start' })
        },
        reset() {
            const functionalitie = functionalities['play']

            if (functionalitie) {
                functionalitie()
            }
        },
        controls() {
            btnControl.style.display = 'none'
            changeContainer('controls')
        },
        closeControls() {
            btnControl.style.display = 'inline-block'
            changeContainer(state.currentContainer)
        }
    }

    const buttons = document.querySelectorAll(`.modal-screenInitial .container [data-button-type]`)

    buttons.forEach(button => {
        button.addEventListener('click', handleButton)
    });

    function handleButton(event) {
        const button = event.target

        const functionalitie = functionalities[button.dataset.buttonType]

        if (functionalitie) {
            functionalitie(button)
        }
    }

    function activeModal(typeContainer) {

        gameController.classList.remove('disabled')
        state.currentContainer = typeContainer

        changeContainer(typeContainer)
    }

    function changeContainer(typeContainer) {
        const containers = document.querySelectorAll(`.modal-screenInitial [data-container-type]`)

        containers.forEach(container => {
            const type = container.dataset.containerType

            if (type === typeContainer) {
                container.classList.add('active')
            } else {
                container.classList.remove('active')
            }
        })
    }

    function activeContainerGameFinished(command) {
        if (!('type' in command)) return
        if (command.type !== 'finished') return

        const pontuacao = document.querySelector(`.modal-screenInitial [data-container-type="gameFinished"] .pontuacao p`)
        pontuacao.textContent = command.pontos

        activeModal('gameFinished')
    }

    return {
        setState,
        activeContainerGameFinished,
        subscribe,
        unscribe
    }
}