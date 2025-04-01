const express = require('express');
const fetch = require('node-fetch'); // Asegúrate de instalar esta dependencia
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON y URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de OAuth (reemplaza los valores según te proporcionen)
const CONFIG = {
  instanceName: 'canaimaa2z',
  clientId: 'canaimaa2z',
  clientSecret: '613edae2e94029f95483de78926ab78293a43216',
  // Asegúrate de que el redirectUri coincide con el configurado en TimesheetMobile
  redirectUri: 'https://tudominio.com/callback'
};

/**
 * Ruta para intercambiar manualmente el código de autorización por tokens.
 * Envía una solicitud POST a /exchange-token con el parámetro "code".
 */
app.post('/exchange-token', async (req, res) => {
  const authorizationCode = req.body.code;
  if (!authorizationCode) {
    return res.status(400).json({ error: 'Falta el código de autorización.' });
  }

  // URL del endpoint para el intercambio de tokens
  const tokenUrl = `https://eu.timesheetmobile.com/${CONFIG.instanceName}/oauth/token.php`;

  // Preparar los parámetros según OAuth 2.0
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', authorizationCode);
  params.append('client_id', CONFIG.clientId);
  params.append('client_secret', CONFIG.clientSecret);
  params.append('redirect_uri', CONFIG.redirectUri);

  try {
    // Realiza la solicitud POST
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: params
    });

    // Parsear la respuesta como JSON
    const data = await response.json();
    console.log('Respuesta del intercambio de tokens:', data);
    res.json(data);
  } catch (error) {
    console.error('Error intercambiando el token:', error);
    res.status(500).json({ error: 'Error intercambiando el token.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
