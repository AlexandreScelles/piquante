const passwordValidator = require('password-validator');

// Création du schèma
const passwordSchema = new passwordValidator

passwordSchema
.is().min(8)                                    // Longueur min. 8
.is().max(100)                                  // Longueur Max. 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// Vérification du password par rapport au schèma
module.exports = (req, res, next) => {
	if(passwordSchema.validate(req.body.password)){
		next();
	}else{
		return res.status(400).json({error:`Le mot de passe choisit n'est pas assez sécurisé:${passwordSchema.validate('req.body.password', {list: true})}`})
	}
}