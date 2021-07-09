class Formatter {
    capitalize = string => {
        if (typeof string !== 'string') return '';
        
        return string.split(/[-\s]/).map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
    }

}


module.exports = new Formatter;