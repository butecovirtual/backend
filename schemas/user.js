module.exports = {
    "post /user": {
        type: "object",
        required: ["username", "mobile"],
        properties: {
            username: { 
                type: "string", 
                maxLength: 20 
            },
            mobile: { 
                type: ["string", "integer"],
                pattern: "^[1-9][0-9]*$",
                minLength: 11,
                maxLength: 11
            }
        },
        errorMessage: {
            type: "A requisição deve ser um objeto JSON válido.",
            required: {
                username: "O nome de usuário deverá ser informado.",
                mobile: "Um número de telefone celular deverá ser informado."
            },
            properties: {
                username: "O nome de usuário não deve ultrapassar 20 caracteres.",
                mobile: "Deve ser informado um número de telefone celular válido."
            }
        }
    },

    "post /user/authenticate": {
        type: "object",
        required: ["username", "token"],
        properties: {
            username: { 
                type: "string", 
                maxLength: 20 
            },
            token: { 
                type: "string",
                pattern: "^[0-9]*$",
                minLength: 4,
                maxLength: 4
            }
        },
        errorMessage: {
            type: "A requisição deve ser um objeto JSON válido.",
            required: {
                username: "O nome de usuário deverá ser informado.",
                token: "Deve ser informado o token de acesso enviado por SMS."
            },
            properties: {
                username: "O nome de usuário não deve ultrapassar 20 caracteres.",
                token: "O token de 4 dígitos deverá ser informado como string."
            }
        }
    }
};
