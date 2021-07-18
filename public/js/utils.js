export const newElement = function(tagName, className) {
    const elemento = document.createElement(tagName)
    elemento.classList.add(className)
    return elemento
}

export const addClass = function(elemento, classe) {
    elemento.className = classe
}

export const getX = function(elemento) {
    return parseInt(elemento.style.left.split('px')[0])
}

export const setX = function(elemento, posX) {
    elemento.style.left = `${posX}px`
}

export const getY = function(elemento) {
    return parseInt(elemento.style.top.split('px')[0])
}

export const setY = function(elemento, posY) {
    elemento.style.top = `${posY}px`
}

export const getAltura = function(elemento) {
    return elemento.clientHeight
}

export const getLargura = function(elemento) {
    return elemento.clientWidth
}

export const valueBetween = function(max, min) {
    if (min > max)[min, max] = [max, min]
    return Math.round(Math.random() * (max - min) + min)
}