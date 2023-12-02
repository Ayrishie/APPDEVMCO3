import { check } from "express-validator";

const validation = {
    signupValidation: function(){
        return [
            check("email", "Email cannot be empty.").notEmpty(),
            check("password", "Password must at least be 8 characters.").isLength({ min: 8 })
        ]
    }
};

export default validation;