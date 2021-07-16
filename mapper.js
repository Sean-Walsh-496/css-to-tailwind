const fs = require("fs");
const UtilClass = require("./util-class.js");

let text = fs.readFileSync("C:/Users/walsh/Desktop/Code/JavaScript/Projects/css-to-tailwinds/css-to-tailwind/css-triplets.txt", "utf8");

function findShortest(lists){
    let sIndex = null;
    let sLength = 9999999999;

    for (let i = 0; i < lists.length; i++){
        if (lists[i].length < sLength){
            sLength = lists[i].length;
            sIndex = i;
        }
    }
    return sIndex;
}

function findCommonSub(texts){
    let shortest = findShortest(texts);
    for (let i = 0; i < texts[shortest].length; i++){
        for (let text of texts){
            if (text[i] != texts[0][i]){
                return texts[0].slice(0, i);
            }
        }
    }
    return texts[shortest];
}

function firstCol(MArray){
    let list = [];
    for (let sublist of MArray){
        list.push(sublist[0]);
    }
    return list;
}

function findFirstAtt(text){
    for (let i = 0; i < text.length; i++){
        if (text[i] == ':'){
            return text.slice(0, i);
        }
    }
    return null;
}

function findValue(text){
    for (let i = 0; i < text.length; i++){
        if (text[i] == ':'){
            return text.slice(i + 1);
        }
    }
    return null;
}

function findValues(utilObject){
    for (let i = 0; i < utilObject.vals.length; i++){
        delete utilObject.vals[i][2];
        utilObject.vals[i][1] = findValue(utilObject.vals[i][1]);
    }
    return utilObject;
}

function findQuotes(text){
    let indices = [];
    for (let i = 0; i < text.length; i++){
        if (text[i] == '"'){
            indices.push(i);
        }
    }
    return indices;
}

function sectionLine(text){
    let indices = findQuotes(text);
    let divided = [];
    for (let i = 0; i < indices.length; i+=2){
        divided.push(text.slice(indices[i] + 1, indices[i+1]));
    }
    return divided;
}

function getLines(){
    let allLines = [], start = null
    for (let i = 0; i < text.length; i++){
        if (text[i] == '['){
            start = i;
        }
        else if (text[i] == ']'){
            let line = sectionLine(text.slice(start + 1, i));
            allLines.push(line);
            start = null;
        }
    }
    return allLines
}

function findAllAtt(cssAtt, lines){
    let valids = [];
    for (let i = 0; i < (lines.length); i++){
        if (findFirstAtt(lines[i][1]) == cssAtt && lines[i][0][1] != '-'){
            valids.push(lines[i]);
            lines.splice(i, 1);
            i--;
        }
        else if (lines[i][0][1] == '-'){
            lines.splice(i, 1);
        }
    }
    return valids;
}

function separateAtts(lined){
    let atts = [];
    while (lined.length > 1){
        atts.push(findAllAtt(findFirstAtt(lined[0][1]), lined));
    }
    return atts;
}

function removeEmpties(atts){
    for (let i = 0; i < atts.length; i++){
        if (atts[i].length == 0){
            atts.splice(i, 1);
            i--;
        }
    }
}

function getMap(atts){
    let mapList = [];
    for (let att of atts){
        let temp = [];
        for (let utilClass of att){
            temp.push(utilClass[0]);
        }
        mapList.push([findFirstAtt(att[0][1]), findCommonSub(temp)]);
    }
    return mapList;
}

function getAllTailwind(atts){
    let newList = [];

    
    for (let sec of atts){
        let newSec = [];
        for (let triplet of sec){
            newSec.push(triplet);
        }
        newList.push(newSec);
    }
    return newList;
}

function numericValue(text){
    for (let char of text){
        if (!isNaN(char)){
            return true;
        }
    }
    return false;
}

/* function getValues(collection){
    console.log(collection);
    let notNums = [], nums = [];
    for (let item of collection){
        for (let i = item[0].length - 1; i >= 0; i--){
            if (item[0][i] == '-'){
                if (numericValue(item[0].slice(i + 1))){
                    nums.push([item[0].slice(i + 1), findValue(item[1])]);
                }
                else{
                    notNums.push([item[0].slice(i + 1), findValue(item[1])]);
                }
            }
        }
    }
    return [notNums, nums];
} */

function getCSSClass(tailwinds){
    let classes = [];
    for (let section of tailwinds){
        classes.push(new UtilClass(findCommonSub(firstCol(section)), section, true));
    }
    return classes
}

let x = separateAtts(getLines());
removeEmpties(x);
x = getAllTailwind(x);
x = getCSSClass(x);

for (let i = 0; i < x.length; i++){
    x[i] = findValues(x[i]);
}


console.log(x.length);
console.log('[')
for (let y of x){
    console.log('   {')
    console.log(`   name: "${y.name}",`);
    console.log("   vals: [")
    for (pair of y.vals){
        console.log(`       ["${pair[0]}", "${pair[1]}", "${pair[2]}"],`);
    }
    console.log('       ],')
    console.log('   },')
} 
console.log(']')