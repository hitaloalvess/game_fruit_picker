export default function createItem(tela) {
    const elemento = document.createElement('img')
    let deslocamento = 5
    let pontuacao = 1

    function getY() {
        return parseInt(this.elemento.style.top.split('px')[0])
    }

    function setY(y) {
        this.elemento.style.top = `${y}px`
    }

    function getX() {
        return parseInt(this.elemento.style.left.split('px')[0])
    }

    function setX(x) {
        this.elemento.style.left = `${x}px`
    }

    function getAltura() {
        return parseInt(this.elemento.clientHeight)
    }

    function getLargura() {
        return parseInt(this.elemento.clientWidth)
    }

    function getPontuacao() {
        return this.pontuacao
    }

    function addClass(item) { //ARRUMAR ESSA FUNCAO DEPOIS, USAR A DO UTILS
        item.className = valorEntre(1, 0) ? 'item-coletavel saudavel' : 'item-coletavel nao-saudavel'
    }

    function calcPosX(tela) {
        let novaPosX = valorEntre(tela.clientWidth, 0)
        if (novaPosX > tela.clientWidth - this.getLargura()) novaPosX = tela.clientWidth - this.getLargura()

        this.setX(novaPosX)
    }

    function animar() {
        this.setY(this.getY() + this.deslocamento)
    }

    function valorEntre(max, min) {
        if (min > max)[min, max] = [max, min]
        return Math.round(Math.random() * (max - min)) + min
    }
    return {
        elemento,
        deslocamento,
        pontuacao,
        getX,
        setX,
        getY,
        setY,
        getAltura,
        getLargura,
        getPontuacao,
        addClass,
        calcPosX,
        animar
    }
}