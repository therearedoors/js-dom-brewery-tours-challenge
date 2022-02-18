class HTMLElementManager {
    constructor(state){
        this.state = state
    }

    header(headerNum, key){
        const header = document.createElement(`h${headerNum}`)
        header.innerText = state.key
        return header
    }


}

module.exports = HTMLElementManager