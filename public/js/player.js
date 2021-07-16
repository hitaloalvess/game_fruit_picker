export default function createPlayer() {
    const elemento = document.createElement('img')
    let deslocamento = 9

    function getX() {
        return parseInt(this.elemento.style.left.split('px')[0])
    }

    function setX(posX) {
        this.elemento.style.left = `${posX}px`
    }

    function getY() {
        return parseInt(this.elemento.style.top.split('px')[0])
    }

    function setY(posY) {
        this.elemento.style.top = `${posY}px`
    }

    function getAltura() {
        return this.elemento.clientHeight
    }

    function getLargura() {
        return this.elemento.clientWidth
    }

    // function addClass(elemento, classe) {
    //     elemento.className = classe
    // }


    return {
        elemento,
        deslocamento,
        getX,
        setX,
        getY,
        setY,
        getAltura,
        getLargura
    }
}