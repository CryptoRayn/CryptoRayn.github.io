document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const captchaContainer = document.querySelector('.g-recaptcha');
    const enterButton = document.getElementById('enterButton');
    const claimMessage = document.getElementById('claim-message');
    const loadingIndicator = document.getElementById('loading-indicator');
    const form = document.getElementById('welcome-form');

    // Reemplaza con tu clave de sitio de reCAPTCHA v2
    const recaptchaSiteKey = 'TU_CLAVE_DE_SITIO_RECAPTCHA';
    // Reemplaza con la URL de tu bin de JSONBin (con permiso de escritura si es necesario)
    const jsonBinUrl = 'https://api.jsonbin.io/v3/b/TU_ID_DE_BIN';
    // Reemplaza con tu clave secreta de JSONBin si tu bin es privado
    const jsonBinSecretKey = '$2b$10$TU_CLAVE_SECRETA_JSONBIN'; // ¡MANTÉN ESTA CLAVE SEGURA!

    window.enableButton = function() {
        enterButton.disabled = false;
        enterButton.classList.add('recaptcha-ready');
    };

    window.disableButton = function() {
        enterButton.disabled = true;
        enterButton.classList.remove('recaptcha-ready');
    };

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = emailInput.value;
        const recaptchaResponse = grecaptcha.getResponse();

        if (!recaptchaResponse) {
            claimMessage.textContent = 'Por favor, completa el captcha.';
            claimMessage.classList.remove('hidden', 'success-animation');
            claimMessage.classList.add('error-animation');
            return;
        }

        enterButton.disabled = true;
        enterButton.classList.add('loading');
        claimMessage.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');

        const dataToSend = {
            email: email,
            recaptchaResponse: recaptchaResponse,
            timestamp: new Date().toISOString()
        };

        fetch(jsonBinUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': jsonBinSecretKey // Necesario si tu bin es privado
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos enviados a JSONBin:', data);
            loadingIndicator.classList.add('hidden');
            enterButton.classList.remove('loading');
            claimMessage.textContent = `Correo "${email}" y captcha enviados para su procesamiento (almacenado en JSONBin).`;
            claimMessage.classList.remove('hidden', 'error-animation');
            claimMessage.classList.add('success-animation');
            grecaptcha.reset();
            enterButton.disabled = true;
            enterButton.classList.remove('recaptcha-ready');
        })
        .catch(error => {
            console.error('Error al enviar datos a JSONBin:', error);
            loadingIndicator.classList.add('hidden');
            enterButton.classList.remove('loading');
            claimMessage.textContent = 'Error al intentar enviar los datos.';
            claimMessage.classList.remove('hidden', 'success-animation');
            claimMessage.classList.add('error-animation');
            enterButton.disabled = false; // Re-enable el botón en caso de error
        });
    });
});
