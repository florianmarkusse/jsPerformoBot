import { getFirstLoopNodeArrayWrittenTo } from '../ast_utilities/astTraversal.mjs';

export class ReverseArrayWrite {
    constructor(setMap, name) {
        this.setMap = setMap;
        this.name = name;
    }

    fix(ast) {
        this.reverseMap = this.findvariables(this.setMap);
        this.filterReverseMap();
        for (const [key, value] of this.reverseMap) {
            let result = getFirstLoopNodeArrayWrittenTo(ast, this.name, key);
            console.log(result);
        }
        
    }



    findvariables(setMap) {
        let indexToLocations = new Map();
        let index;
        let arrayLocations = []
        for (const [key, value] of setMap.entries()) {

            if (index === undefined) {
                index = value;
            }

            if (index != value) {
                indexToLocations.set(index, arrayLocations);
                index = value;
                arrayLocations = [];
            }
            arrayLocations[arrayLocations.length] = key;
        }
        indexToLocations.set(index, arrayLocations);

        return indexToLocations;
    }

    filterReverseMap() {
        for (const [key, value] of this.reverseMap.entries()) {
            if (!isNaN(key) || value.length < 2) {
                this.reverseMap.delete(key);
            }
        }
    }

    
}