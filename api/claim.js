const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { email, recaptchaResponse } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Por favor, ingresa tu correo electrónico de FaucetPay.' });
  }

  if (!recaptchaResponse) {
    return res.status(400).json({ message: 'Por favor, completa el reCAPTCHA.' });
  }

  // Obtener la clave secreta de las variables de entorno de Vercel
  const secretKey = process.env.RECAPTCHA_SECRET;
  const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
  const verificationParams = new URLSearchParams();
  verificationParams.append('secret', secretKey);
  verificationParams.append('response', recaptchaResponse);
  verificationParams.append('remoteip', req.headers['x-forwarded-for'] || req.socket.remoteAddress);

  try {
    const verificationResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verificationParams.toString(),
    });
    const verificationData = await verificationResponse.json();

    if (!verificationData.success) {
      console.error('reCAPTCHA verification failed:', verificationData['error-codes']);
      return res.status(401).json({ message: 'La verificación reCAPTCHA falló. Por favor, inténtalo de nuevo.' });
    }

    // Si la verificación es exitosa, respondemos con un mensaje.
    return res.status(200).json({ message: '¡Correo y reCAPTCHA verificados!' });

  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return res.status(500).json({ message: 'Ocurrió un error al verificar el reCAPTCHA.' });
  }
};