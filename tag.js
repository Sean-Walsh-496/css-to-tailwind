
function removeExtraCharacters(text, characters=[' ']){
    while(characters.includes(text[0]) || characters.includes(text[text.length - 1])){
        if (characters.includes(text[0])){
            text = text.slice(1);
        }
        if (characters.includes(text[text.length - 1])){
            text = text.slice(0, text.length - 1);
        }
    }
    return text;
}


module.exports.TagFactory = class TagFactory{
    makeTag(text){

    }
}



module.exports.Tag = class Tag{
    /**
     * 
     * @param {string} text 
     * @summary Returns the names of the attributes of the HTML tag
     * @returns {array}
     */
    #getModifierNames(text){
        let names = [];
        let inQuotes = false;
        for (let i = 0; i < text.length; i++){
            if (text[i] == '"' && !inQuotes){
                inQuotes = true;
                let j = i - 1;
                while (text[j] != '"' && j >= 0 ){
                    j--;
                }
                names.push(text.slice(j + 1, i - 1));
            }
            else if (text[i] == '"' && inQuotes){
                inQuotes = false;
            }
        }

        for (let i = 0; i < names.length; i++){
            names[i] = removeExtraCharacters(names[i], [' ', '=']);
        }
        
        return names;
    }

    /**
     * 
     * @param {string} styleText
     * @returns {array}
     */
    #parseStylePairs(styleText){
        return styleText.split(';').filter(pair => pair != '' && pair != ' ');
    }

    /**
     * 
     * @param {string} style
     * @returns {array} 
     */
    #splitPair(style){
        let divider = style.indexOf(':');
        return [style.slice(0, divider), style.slice(divider + 1)];        
    }

    /**
     * 
     * @param {string} text 
     * @summary Returns the sections of text surrounded by quotes.
     * @returns {array}
     */
    #getQuoted(text){
        let quotes = [];
        let start = null;
        for (let i = 0; i < text.length; i++){
            if (text[i] == '"' && start == null){
                start = i;
            }
            else if (text[i] == '"' && start != null){
                quotes.push(text.slice(start + 1, i));
                start = null;
            }
        }
        return quotes;
    }

    /**
     * 
     * @param {string} text 
     * @summary Returns the index of the first space in the tag, indicating where the tag name ends
     * and the attributes begin.
     * @returns {number}
     */
    #getFirstSpace(text){
        //returns the index where the first space separating the tag name from the attributes is.
        for (let i = 0; i < text.length; i++){
            if (text[i] == ' '){
                return i;
            }
        }
    }

    /**
     * @param {string} text
     * @returns {string} 
     */
    #getType(text){
        let space = this.#getFirstSpace(text);
        return text.slice(0, space).slice(1);
    }

    /**
     * @param {string} tagText The HTML text for the opening tag of an element.
     */
    constructor(tagText){
        this.type = this.#getType(tagText);
        tagText = tagText.slice(this.#getFirstSpace(tagText) + 1, tagText.length);
        const attributes = this.#getModifierNames(tagText);
        const values = this.#getQuoted(tagText);

        for (let i = 0; i < attributes.length; i++){this[attributes[i]] = values[i];}


        if (this.hasOwnProperty("style")){
            this.style = this.#parseStylePairs(this.style);
            for (let i = 0; i < this.style.length; i++){
                this.style[i] = this.#splitPair(this.style[i]);
                this.style[i][0] = removeExtraCharacters(this.style[i][0]);
                this.style[i][1] = removeExtraCharacters(this.style[i][1]);
            }
        }
    }

    /**
     * 
     * @returns {string}
     */
    getText(){
        let text = "";

        for (let att in this){
            if (att == 'type'){continue;}

            text += ` ${att}="${this[att]}"`;
        }
        return `<${this.type}${text}>`;
    }
} 
