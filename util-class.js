module.exports = class UtilClass{
    /**
     * 
     * @param {string} name 
     * @param {array} nonNumVals 
     * @param {array} numVals 
     * @param {boolean} canBeNeg 
     */
    constructor(name, nonNumVals, numVals, canBeNeg){
        this.name = name;
        this.nonNumVals = nonNumVals;
        this.numVals = numVals;
        this.canBeNeg = canBeNeg;
    }



}




