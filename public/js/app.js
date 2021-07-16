import { renderScenery } from './render-scenery.js'
import createModal from './gameController.js'

const screen = document.querySelector('.hf-content')

renderScenery(screen)

createModal(screen)