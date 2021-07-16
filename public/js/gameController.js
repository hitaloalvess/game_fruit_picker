import createGame from './game.js'
import createKeyboardListener from './keyboard-listener.js'
export default function createModal(screen) {

    const game = createGame(screen)


    const modal = document.querySelector(`.modal-screenInitial`)
    const btnControl = document.querySelector(`.modal-screenInitial .container [data-button-type="controls"]`)

    const state = {
        currentContainer: 'initialGame'
    }

    const functionalities = {
        play() {
            modal.classList.add('disabled')
            game.renderElements()
            setTimeout(game.start, 3000)
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

        modal.classList.remove('disabled')
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

    function activeContainergameFinished(pontos) {
        const pontuacao = document.querySelector(`.modal-screenInitial [data-container-type="gameFinished"] .pontuacao p`)
        pontuacao.textContent = pontos

        activeModal('gameFinished')
    }

    return {
        activeContainergameFinished
    }
}