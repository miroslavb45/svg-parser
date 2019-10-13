const fs = require('fs');
const { parse, stringify, parseSync } = require('svgson');

let parsedData = [];
let parentId;

const inputSVG = fs.readFileSync('./input.svg', 'utf8');

const transformNode = (node) => {
    if(!Array.isArray(node)){
        let {name, attributes, children} = node;
        (name === 'g') ? parentId = attributes.id : null;
        if(name === 'path') parsedData.push(pshp(attributes, parentId)); 
    }
}

//Parse shape, extract color and path from xml node
const pshp = (attributes, id) => {
    let object = {};
    object.type = "shape";
    object.id = id;
    attributes['fill'] ? object.color = parseInt(attributes.fill.substr(1), 16) : null;
    object.path = ppth(attributes.d);
    return object;
} 

//Parse path, convert string pairs starting with M L to coord array
const ppth = (path) => path
    .split(" ")
    .map(coord => coord.split(","))
    .map( coord => (coord[0].startsWith("M") || coord[0].startsWith("L")) ? {x: coord[0].substr(1), y: coord[1]} : null)
    .filter(i => i);

//Parse the file
parseSync(inputSVG, {transformNode: transformNode});
//Write the result to file
fs.writeFileSync('./output.json',JSON.stringify(parsedData,null,1));
