const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/token-cloudant", async (req, res) => {
    try {
        const { apikey } = req.body;

        if (!apikey) {
            return res.status(400).json({
                error: "O atributo 'apikey' é obrigatório."
            });
        }

        const body = new URLSearchParams({
            grant_type: "urn:ibm:params:oauth:grant-type:apikey",
            apikey: apikey
        });

        const response = await fetch(
            "https://iam.cloud.ibm.com/identity/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                },
                body: body.toString()
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data
            });
        }

        return res.status(200).json({
            access_token: data.access_token
        });

    } catch (error) {
        console.error("Erro:", error);

        return res.status(500).json({
            error: "Erro interno ao obter o token.",
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor executando na porta ${PORT} `);
});
