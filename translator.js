//<div style="bottom: auto; width: 100px; height: auto;"></div>
const analogues = require("./map.js");
const bigList = require("./util-class-lookup.js");


class Translator{

    static findUtilObject(styleName, list){
        for (let i = 0; i < list.length; i++){
            if (list[i].name == analogues.get(styleName)){
                return list[i];
            }
        }
        console.error("No util-class with that name");
    }

    static convertPxToRem(value){
        const conversionFactor = 16;

        value = value.slice(0, value.length - 2);
        value = parseInt(value);
        return value/conversionFactor;
    }

    static fractionToDecimal(value){
        let divider = value.indexOf('/');
        let num = value.slice(0, divider);
        let den = value.slice(divider + 1);
        return parseInt(num) / parseInt(den);
    }

    static convertPercentToFrac(value, listOfValues){
        let closest = Number.MAX_VALUE;
        let closestValue;
        listOfValues.forEach(el => {
            let current = this.fractionToDecimal(el);
            if (Math.abs(value - current) < closest){
                closestValue = el;
                closest = Math.abs(value - current);
            }
        });


        return closestValue;
    }

    static closestValue(value, listOfValues = []){

        let closest = Number.MAX_VALUE;
        let closestValue;

        //cases: (value is a rem, a pixel,) or a percent
        //cases

        if (value.includes('px') || value.includes("rem")){

            let valueRem = value.includes('px') ? this.convertPxToRem(value) : value;

            listOfValues.forEach(element => {
                let comparison = element[1];
                if (comparison.includes('px')){
                    comparison = this.convertPxToRem(comparison.slice(0, -2));
                }

                else if (comparison.includes('rem')){
                    let numberComparison = parseFloat(comparison.replaceAll("rem", ''));
                    

                    if (Math.abs(valueRem - numberComparison) < closest){
                        closestValue = element[0];
                        closest = Math.abs(valueRem - numberComparison);
                    }
                }
            
            })
        }

        else if (value.includes('%')){
            value = parseFloat(value.replaceAll('%', ''))

            listOfValues.forEach(element => {
                let comparison = parseFloat(element[1].replaceAll('%', ''));

                if (Math.abs(value - comparison) < closest){
                    closestValue = element[0];
                    closest = Math.abs(value - comparison);
                }
                
            })
        }
        
        return closestValue;

    }

    static closestCategorical(value, listOfValues){
        let returnValue = "undefined";
        listOfValues.forEach(element => {
            element[1] = element[1].replaceAll(';', '').replace(' ', '')
            if (value.toLowerCase() == element[1].toLowerCase()){
                returnValue = element[0]
            }
        });
        return returnValue;
    }

    static getFirstTag(text){
        //prefers no whitespace
        for (let i = 0; i < text.length; i++){
            if (text[i] == '>'){
                return text.slice(0, i+1)
            }
        }

        console.error("Something went wrong! Couldn't find first tag of input")

    }

    static deleteSection(text, start, end){
        let newString = "";
        for (let i = 0; i < text.length; i++){
            if (!(i >= start && i <= end)){
                newString += text[i];
            }
        }
        newString = newString.replaceAll("  ", ' ');
        return newString;
    }

    static findAttRange(tagObject, attName){
        let i = tagObject.text.search(attName);
        let quoteCount = 0, j = i;
        while (true){
            if (tagObject.text[j] == '"'){
                quoteCount++;
            }
            if (quoteCount == 2){
                return [i, j];
            }
            j++;
        }
    }

    static changeClass(tagObject){
        tagObject.class = "";
        for (let i = 0; i < tagObject.style.length; i++){
            let styleValue = tagObject.style[i][1], styleName = tagObject.style[i][0]; 
            let output;

            const utilObject = this.findUtilObject(styleName, bigList);

            if (isNaN(styleValue[0])){ //insanely sketch
                output = this.closestCategorical(styleValue, utilObject.nonNumVals);
            }
            else {
                output = this.closestValue(styleValue, utilObject.numVals);
            }

            
            tagObject.class += `${analogues.get(styleName).slice(1)}${output} `;
        }
    }
    
    static deleteStyle(tagObject){
        if (! tagObject.hasOwnProperty('style')){
            console.error("attempted to remove style from tag that has no style");
        }
        else{
            const range = this.findAttRange(tagObject, "style");
            delete tagObject.style;
            tagObject.text = this.deleteSection(tagObject.text, range[0], range[1]);
            return ;
        }
    }

    static addUtilClass(tagObject, classText){
        let tagText = tagObject.text
        const classRange = this.findAttRange(tagObject, 'class');

        if (classRange[0] != -1){
            
            const classSubstring = tagText.slice(classRange[0], classRange[1] + 1);
            tagObject.text = tagObject.text.replace(classSubstring, ` class="${classText}" `);
        }   
        else{
            const spaceIndex = this.getFirstSpace(tagText);
            tagObject.text = tagText.slice(0, spaceIndex) + ` class="${classText}" ` + tagText.slice(spaceIndex);
        }   
        tagObject.class = classText;  

    }

    static translate(tagObject){

        this.changeClass(tagObject);
        delete tagObject.style;
        return tagObject.getText();
    }

}


module.exports = Translator;