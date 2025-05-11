document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const claimButton = document.getElementById('claim-button');
    const claimMessage = document.getElementById('claim-message');
    const loadingIndicator = document.getElementById('loading-indicator');
    let recaptchaResponse = '';

    // Función para habilitar el botón una vez que el reCAPTCHA se haya resuelto
    window.recaptchaCallback = function() {
        recaptchaResponse = grecaptcha.getResponse();
        claimButton.disabled = false;
        claimButton.classList.add('recaptcha-ready');
    };

    // Función para deshabilitar el botón si el reCAPTCHA expira o falla
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

        // Simulación de una petición al servidor (reemplazar con tu lógica real)
        setTimeout(function() {
            loadingIndicator.classList.add('hidden');
            document.getElementById('welcome-form').classList.remove('hidden');

            // Simulación de éxito
            if (Math.random() > 0.5) {
                claimMessage.textContent = `¡Recompensa enviada a ${email}!`;
                claimMessage.classList.remove('hidden', 'error-animation');
                claimMessage.classList.add('success-animation');
            } else {
                // Simulación de error
                claimMessage.textContent = 'Hubo un problema al reclamar. Inténtalo de nuevo.';
                claimMessage.classList.remove('hidden', 'success-animation');
                claimMessage.classList.add('error-animation');
            }

            // Resetear el reCAPTCHA
            grecaptcha.reset();
            recaptchaResponse = '';
            claimButton.disabled = true;
            claimButton.classList.remove('recaptcha-ready');

        }, 3000); // Simula una espera de 3 segundos
    });
});
