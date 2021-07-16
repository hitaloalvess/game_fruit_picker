import { addClass } from "./utils.js"

export default function createPlacar() {
    const elemento = document.createElement('div')
    const placarPlayer = document.createElement('div')
    const pontosPlayer = document.createElement('span')

    placarPlayer.innerHTML += 'Score'

    const fathers = [placarPlayer, elemento]
    const childrens = [pontosPlayer, placarPlayer]
    multipleAppendChild(fathers, childrens)

    const elements = [elemento, placarPlayer, pontosPlayer]
    const classes = ['placar', 'placar-player', 'pontos']
    addClassMultipleElements(elements, classes)

    function getPontosPlayer() {
        return parseInt(this.pontosPlayer.innerText)
    }

    function adicionarPontoPlayer(pontos) {
        this.pontosPlayer.textContent = ((isNaN(this.getPontosPlayer()) ? 0 : this.getPontosPlayer()) + pontos)
    }

    function multipleAppendChild(fathers, childrens) {
        if (fathers.length != childrens.length) return
        for (let i in fathers) {
            fathers[i].appendChild(childrens[i])
        }
    }


    function addClassMultipleElements(elements, classes) {
        if (elements.length != classes.length) return
        for (let i in elements) {
            addClass(elements[i], classes[i])
        }
    }

    return {
        elemento,
        pontosPlayer,
        getPontosPlayer,
        adicionarPontoPlayer
    }
}