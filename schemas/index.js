const fs = require('fs');
const path = require('path');
const errors = require('restify-errors');
const ajv = require('ajv')({ allErrors: true, jsonPointers: true });
require('ajv-errors')(ajv);

var schemas = {};
fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js');
}).forEach(file => {
    schemas = Object.assign(schemas, require(path.join(__dirname, file)));
});

module.exports.validate = (req, res, next) => {
    let route = req.getRoute();
    let key = `${route.method.toLowerCase()} ${route.path}`;
    if (schemas[key]){
        var validate = ajv.compile(schemas[key]);
        if (!validate(req.params))
            return next(new errors.BadRequestError(validate.errors[0].message));
    }
    return next();
}
