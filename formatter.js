class Formatter{
    /**
     * 
     * @param {string} text - the text to be flattened 
     * @returns {string} a string that is a single, flattened line.
     */
    static flatten(text){
        let newText = "";
        for (let i = 0; i < text.length; i++){
            if (!(text[i] =='\t' || text[i] == '\n' || text[i] == '\r')){
                newText += text[i];
            }
        }
        return newText;
    }

    /**
     * 
     * @param {string} text 
     * @summary Makes all quotes double quotes and handles any outlier cases, 
     * such as quotes used in contractions. 
     * @returns {string}
     */
    static handleQuotes(text){
        let quotes = text.filter(char => char == "'" || char == '"');


        let inQuote = false, type = null;
        for (let i = 0; i < quotes.length; i++){
            if (quotes[i] == type && inQuote){
                inQuote = false;
                quotes[i] = '"';
            }

            else if (quotes[i] != type && inQuote){
                quotes[i] = "'";

            }

            else if (!inQuote){
                inQuote = true;
                type = quotes[i];
                quotes[i] = '"';
                
            }
        }

        for (let i = 0; i < text.length; i++){
            if (text[i] == '"' || text[i] == "'"){
                text[i] = quotes.shift();
            }
        }

        return text;
    }

}