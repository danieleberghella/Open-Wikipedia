import validate from "validate.js";

validate.validators.userExists = function (value, options, key, attributes) {

    return new Promise( async (res) => {
        const user = await db.collection('user').findOne({ email: value, id: { not: options?.id } })
        if (user) {
            res('User already signed up');
        } else {
            res();
        }
    })
};

export function userValidation(req, res, next) {

    validate.async(req.body, {
        firstName: {
            presence: { allowEmpty: false },
            length: { minimum: 3 }
        },
        lastName: {
            presence: { allowEmpty: false },
            length: { minimum: 3 }
        },
        email: {
            email: true,
            userExists: {id: req.params.id ? +req.params.id : req.params.id}
        },
        password: {
            length: { minimum: 8 }
        },
        passwordConfirmation: {
            length: { minimum: 8 },
            equality: {
                attribute: "password",
                message: "Password doesn't match"
            }
        }
    }).then(
        () => {
            // on success
            next();
            
        },
        (errors) => {
            // on error
            res.status(403).json({ isError: true, error: errors })
        }
    );

}