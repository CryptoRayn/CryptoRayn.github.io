const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch'); // Necesario para hacer llamadas HTTP

// Inicializa Firebase Admin SDK si aún no lo has hecho
if (!admin.apps.length) {
  admin.initializeApp();
}

// Clave secreta de reCAPTCHA v2
const RECAPTCHA_SECRET_KEY = '6LfRyTErAAAAAHMTto6NSkBLGvt_dLL48E9nQB9L';

// Clave API de FaucetPay (se configura mediante variables de entorno de Firebase)
const FAUCETPAY_API_KEY = functions.config().faucetpay ? functions.config().faucetpay.api_key : null;

exports.claim = functions.https.onRequest(async (req, res) => {
  // Solo aceptar solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { email, recaptchaResponse, currency = 'DOGE', amount = 0.0001 } = req.body; // Ejemplo de moneda y monto por defecto

  // Validar que se proporcionen el correo electrónico y la respuesta del reCAPTCHA
  if (!email) {
    return res.status(400).json({ error: 'Por favor, ingresa tu correo electrónico.' });
  }
  if (!recaptchaResponse) {
    return res.status(400).json({ error: 'Por favor, completa el reCAPTCHA.' });
  }

  // 1. Verificar el reCAPTCHA con la API de Google
  try {
    const recaptchaVerificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const recaptchaParams = new URLSearchParams();
    recaptchaParams.append('secret', RECAPTCHA_SECRET_KEY);
    recaptchaParams.append('response', recaptchaResponse);
    recaptchaParams.append('remoteip', req.ip); // Opcional, pero recomendado

    const recaptchaResponseData = await fetch(recaptchaVerificationUrl, {
      method: 'POST',
      body: recaptchaParams,
    }).then(res => res.json());

    if (!recaptchaResponseData.success) {
      console.error('reCAPTCHA verification failed:', recaptchaResponseData['error-codes']);
      return res.status(401).json({ error: 'La verificación del reCAPTCHA falló. Por favor, inténtalo de nuevo.' });
    }

    // 2. Interactuar con la API de FaucetPay para enviar el pago
    if (!FAUCETPAY_API_KEY) {
      console.error('FaucetPay API key not configured.');
      return res.status(500).json({ error: 'El servicio de faucet no está configurado correctamente.' });
    }

    const faucetpayApiUrl = 'https://faucetpay.io/api/v1/send';
    const faucetpayParams = new URLSearchParams();
    faucetpayParams.append('api_key', FAUCETPAY_API_KEY);
    faucetpayParams.append('email', email);
    faucetpayParams.append('currency', currency.toUpperCase()); // Asegurarse de que la moneda esté en mayúsculas
    faucetpayParams.append('amount', amount);
    faucetpayParams.append('ip', req.ip); // Opcional, pero recomendado

    const faucetpayResponse = await fetch(faucetpayApiUrl, {
      method: 'POST',
      body: faucetpayParams,
    }).then(res => res.json());

    console.log('FaucetPay API Response:', faucetpayResponse);

    if (faucetpayResponse.status === 200) {
      return res.status(200).json({ message: `¡${amount} ${currency.toUpperCase()} enviados a tu cuenta de FaucetPay!` });
    } else {
      console.error('FaucetPay API error:', faucetpayResponse.message);
      return res.status(faucetpayResponse.status === 400 ? 400 : 500, { error: `Error al enviar el pago: ${faucetpayResponse.message}` });
    }

  } catch (error) {
    console.error('Error durante la verificación del reCAPTCHA o la interacción con FaucetPay:', error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar tu reclamo. Por favor, intenta de nuevo.' });
  }
});
    // 2. Interactuar con la API de FaucetPay para enviar el pago
    if (!FAUCETPAY_API_KEY) {
      console.error('FaucetPay API key not configured.');
      return res.status(500).json({ error: 'El servicio de faucet no está configurado correctamente.' });
    }

    const faucetpayApiUrl = 'https://faucetpay.io/api/v1/send';
    const faucetpayParams = new URLSearchParams();
    faucetpayParams.append('api_key', FAUCETPAY_API_KEY);
    faucetpayParams.append('email', email);
    faucetpayParams.append('currency', currency.toUpperCase()); // Asegurarse de que la moneda esté en mayúsculas
    faucetpayParams.append('amount', amount);
    faucetpayParams.append('ip', req.ip); // Opcional, pero recomendado

    const faucetpayResponse = await fetch(faucetpayApiUrl, {
      method: 'POST',
      body: faucetpayParams,
    }).then(res => res.json());

    console.log('FaucetPay API Response:', faucetpayResponse);

    if (faucetpayResponse.status === 200) {
      return res.status(200).json({ message: `¡${amount} ${currency.toUpperCase()} enviados a tu cuenta de FaucetPay!` });
    } else {
      console.error('FaucetPay API error:', faucetpayResponse.message);
      return res.status(faucetpayResponse.status === 400 ? 400 : 500, { error: `Error al enviar el pago: ${faucetpayResponse.message}` });
    }

  } catch (error) {
    console.error('Error durante la verificación del reCAPTCHA o la interacción con FaucetPay:', error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar tu reclamo. Por favor, intenta de nuevo.' });
  }
});
