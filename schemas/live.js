module.exports = {
    "post /live": {
        type: "object",
        required: ["title", "when"],
        properties: {
            title: { type: "string" },
            when: { 
                type: "string", 
                format: "date-time" 
            },
            valueBase: {
                type: "number",
                minimum: 0
            },
            valueTable: {
                type: "number",
                minimum: 0
            },
            sponsors: {
                type: "array",
                items: { type: "string" }
            }
        },
        errorMessage: {
            type: "A requisição deve ser um objeto JSON válido.",
            required: {
                title: "Você deve informar um título para sua live.",
                when: "Deve ser informada uma data/hora de quanto sua live iniciará."
            },
            properties: {
                when: "A data/hora de início da live deverá ser informada em um padrão válido.",
                valueBase: "O valor informado deverá ser maior que 0 (zero).",
                valueTable: "O valor informado deverá ser maior que 0 (zero).",
                sponsors: "Verifique a documentação relativo aos patrocinadores."
            }
        }
    }
};
