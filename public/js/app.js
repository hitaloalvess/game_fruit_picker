import { renderScenery, renderGameController } from './render-elements.js'
import createGameController from './gameController.js'
import createGame from './game.js'

const screen = document.querySelector('.hf-content')

renderScenery(screen)
renderGameController(screen)

const gameController = createGameController(screen, document)
const game = createGame(screen, document)

gameController.setState({ game })
gameController.subscribe(game.renderElements)
gameController.subscribe(game.start)

game.subscribe(gameController.activeContainerGameFinished)