document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const claimButton = document.getElementById('claim-button');
    const claimMessage = document.getElementById('claim-message');
    const loadingIndicator = document.getElementById('loading-indicator');
    let recaptchaResponse = '';
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbxPUGPrGrTUQzw3aK1kACweio8_3jMVdEEPAhRgKZ7ZtMS3FXh34c9DqZLjq0j8Qcoyug/exec'; // URL actualizada

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

        document.getElementById('welcome-form').classList.add('hidden');
        loadingIndicator.classList.remove('hidden');

        fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'storeUserEmail',
                email: email,
                recaptchaResponse: recaptchaResponse
            })
        })
        .then(response => response.json())
        .then(data => {
            loadingIndicator.classList.add('hidden');
            document.getElementById('welcome-form').classList.remove('hidden');

            if (data.success) {
                localStorage.setItem('userEmail', email);
                window.location.href = data.redirect;
            } else if (data.needsRegistration) {
                const registerConfirmation = confirm(`El correo electrónico ${email} no está registrado. ¿Deseas registrarte?`);
                if (registerConfirmation) {
                    // Redirigir directamente a la faucet para el primer reclamo y el registro se hará allí
                    localStorage.setItem('userEmail', email);
                    window.location.href = '/faucet';
                } else {
                    claimMessage.textContent = 'Registro cancelado.';
                    claimMessage.classList.remove('hidden', 'success-animation');
                    claimMessage.classList.add('info-animation');
                }
            } else {
                claimMessage.textContent = data.message || 'Hubo un problema.';
                claimMessage.classList.remove('hidden', 'success-animation');
                claimMessage.classList.add('error-animation');
            }
            grecaptcha.reset();
            recaptchaResponse = '';
            claimButton.disabled = true;
            claimButton.classList.remove('recaptcha-ready');
        })
        .catch(error => {
            console.error('Error al comunicarse con el servidor:', error);
            claimMessage.textContent = 'Error al comunicarse con el servidor.';
            claimMessage.classList.remove('hidden', 'success-animation');
            claimMessage.classList.add('error-animation');
        });
    });
});
