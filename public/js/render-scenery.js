import { newElement } from './utils.js'

export const renderScenery = function(tela) {
    const floor = newElement('div', 'floor')
    const grams = newElement('div', 'grams')
    const gram = newElement('div', 'gram')
    const qdtGramsRender = 7

    for (let i = 0; i < qdtGramsRender; i++) {
        grams.appendChild(gram.cloneNode(true))
    }

    tela.appendChild(floor)
    tela.appendChild(grams)
}