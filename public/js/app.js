import { renderScenery } from './render-scenery.js'
import createGameController from './gameController.js'
import createGame from './game.js'

const screen = document.querySelector('.hf-content')

renderScenery(screen)

const gameController = createGameController(screen, document)
const game = createGame(screen, document)

gameController.setState({ game })

game.subscribe(gameController.activeContainerGameFinished)

gameController.subscribe(game.renderElements)
gameController.subscribe(game.start)