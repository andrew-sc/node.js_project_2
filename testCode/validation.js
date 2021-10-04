module.exports = {
    isEmail: (value) => {
        const [localPart, domain, ...etc] = value.split("@");

        if (!localPart || !domain || etc.length){
            return false;
        } else if( value.split('@').length !== 2 ) {
            return false;
        } else if ( value.includes(" ") ) {
            return false;
        } else if (value[0] === '-') {
            return false;
        } else if (!/^[0-9a-z+_-]+$/gi.test(localPart)) {
            return false;
        } else if (!/^[0-9a-z-.]+$/gi.test(domain)) {
            return false;
        };
        
        return true;
    },
};