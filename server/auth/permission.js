
function custom(allowedPermissions) {
    return (req, res, next) => {
        const {user} = req;
        const validPermission = allowedPermissions
            .map((permission) => user.permissions.includes(permission))
            .reduce((res, val) => res | val, false);
        if (validPermission) {
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    };
}

const basic = custom(['basic']);
const advanced = custom(['advanced']);

module.exports = {custom, basic, advanced};
