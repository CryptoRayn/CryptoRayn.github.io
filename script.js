document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const claimButton = document.getElementById('claim-button');
    const claimMessage = document.getElementById('claim-message');
    const loadingIndicator = document.getElementById('loading-indicator');
    let recaptchaResponse = '';
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbztU5PV-BzHDr_5AhI9tMq7wh5LXetvHjVBPha3Vjw7odvWoCmxmv5xERMgtCp3An9xbw/exec'; // ¡REEMPLAZA ESTO CON LA URL DE TU APPS SCRIPT!

    window.recaptchaCallback = function(response) {
        recaptchaResponse = response;
        claimButton.disabled = false;
        claimButton.classList.add('recaptcha-ready');
    };

    window.recaptchaExpiredCallback = function() {
        recaptchaResponse = '';
        claimButton.disabled = true;
        claimButton.classList.remove('recaptcha-ready');
        alert('El reCAPTCHA ha expirado. Por favor, inténtalo de nuevo.');
    };

    claimButton.addEventListener('click', function() {
        const email = emailInput.value;

        if (!email) {
            claimMessage.textContent = 'Por favor, ingresa tu correo electrónico de FaucetPay.';
            claimMessage.classList.remove('hidden', 'success-animation');
            claimMessage.classList.add('error-animation');
            return;
        }

        if (!recaptchaResponse) {
            claimMessage.textContent = 'Por favor, completa el reCAPTCHA.';
            claimMessage.classList.remove('hidden', 'success-animation');
            claimMessage.classList.add('error-animation');
            return;
        }

        // Ocultar el formulario y mostrar el indicador de carga
        document.getElementById('welcome-form').classList.add('hidden');
        loadingIndicator.classList.remove('hidden');

        // Enviar datos al Google Apps Script
        fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                recaptchaResponse: recaptchaResponse
            })
        })
        .then(response => response.json())
        .then(data => {
            loadingIndicator.classList.add('hidden');
            document.getElementById('welcome-form').classList.remove('hidden');

            if (data.success) {
                if (data.redirect) {
                    window.location.href = data.redirect; // Redirigir a la página de la faucet
                } else {
                    claimMessage.textContent = data.message || 'Éxito.';
                    claimMessage.classList.remove('hidden', 'error-animation');
                    claimMessage.classList.add('success-animation');
                }
            } else {
                claimMessage.textContent = data.message || 'Hubo un problema.';
                claimMessage.classList.remove('hidden', 'success-animation');
                claimMessage.classList.add('error-animation');
            }

            // Resetear el reCAPTCHA
            grecaptcha.reset();
            recaptchaResponse = '';
            claimButton.disabled = true;
            claimButton.classList.remove('recaptcha-ready');
        })
        .catch(error => {
            loadingIndicator.classList.add('hidden');
            document.getElementById('welcome-form').classList.remove('hidden');
            claimMessage.textContent = 'Error de conexión con el servidor.';
            claimMessage.classList.remove('hidden', 'success-animation');
            claimMessage.classList.add('error-animation');
            console.error('Error:', error);

            // Resetear el reCAPTCHA
            grecaptcha.reset();
            recaptchaResponse = '';
            claimButton.disabled = true;
            claimButton.classList.remove('recaptcha-ready');
        });
    });
});
