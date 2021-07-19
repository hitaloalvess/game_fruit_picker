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

export const renderGameController = function(tela) {
    const html = `<div class="modal-screenInitial center">
<div class="container center">
    <div data-container-type="initialGame" class="initialGame active center">

        <h3>INICIAR GAME</h3>
        <button data-button-type="play" class="btn-circle center">
            <i class="fas fa-play"></i>
    </button>

    </div>

    <div data-container-type="gameFinished" class="gameFinished center">
        <h3>GAME FINISHED</h3>

        <div class="pontuacao center">
            <h5>Score = </h5>
            <p></p>
        </div>
        <button data-button-type="reset" class="btn-circle center">
            <i class="fas fa-undo-alt"></i>
        </button>
    </div>


    <div data-container-type="controls" class="controls">
        <h3>Controles</h3>
        <div class="control">
            <div class="key center"><i class="fas fa-arrow-left"></i></div>
            <p>Mover para esquerda</p>
        </div>
        <div class="control">
            <div class="key center"><i class="fas fa-arrow-right"></i></div>
            <p>Mover para direita</p>
        </div>
        <button class="closeControls"><i data-button-type="closeControls" class="fas fa-times center"></i></button>
    </div>
    <button type="button" class="btn-control">
        <i data-button-type="controls" class="fas fa-gamepad"></i>
    </button>
</div>


</div>`

    tela.insertAdjacentHTML('afterbegin', html)
}

export const renderItem = function(tela, src) {
    const html = `<img class="item-coletavel nao-saudavel" src="/public/img/${src}">`
    tela.insertAdjacentHTML('afterbegin', html)
}

export const renderPlacar = function(tela) {
    const html = `<div class="placar center"><div class="placar-player center">Score<span class="pontos">0</span></div></div>`
    tela.insertAdjacentHTML('afterbegin', html)
}

export const renderTimer = function(tela, initialTime) {
    const html = `<div class="timer center"><p>${initialTime}</p></div>`
    tela.insertAdjacentHTML('afterbegin', html)
}

export const renderPlayer = function(tela, src) {
    const html = `<img class="player" src="/public/img/${src}">`
    tela.insertAdjacentHTML('afterbegin', html)
}