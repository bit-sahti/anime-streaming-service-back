class Formatter {
    capitalize = string => {
        if (typeof string !== 'string') return '';

        //it won't work on words that actually have an hypen, like sci-fi        
        return string.split(/[-\s]/).map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
    }

}


module.exports = new Formatter;