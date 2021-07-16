export const newElement = function(tagName, className) {
    const elemento = document.createElement(tagName)
    elemento.classList.add(className)
    return elemento
}

export const addClass = function(elemento, classe) {
    elemento.className = classe
}