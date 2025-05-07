document.addEventListener('DOMContentLoaded', function() {
    const claimButton = document.getElementById('claim-button');
    const emailInput = document.getElementById('email');
    const claimMessage = document.getElementById('claim-message');
    const loadingIndicator = document.getElementById('loading-indicator');

    claimButton.addEventListener('click', function() {
        const email = emailInput.value;
        const recaptchaResponse = grecaptcha.getResponse();

        if (!email) {
            claimMessage.textContent = 'Por favor, ingresa tu correo electrónico de FaucetPay.';
            claimMessage.classList.remove('hidden');
            return;
        }

        if (!recaptchaResponse) {
            claimMessage.textContent = 'Por favor, completa el reCAPTCHA.';
            claimMessage.classList.remove('hidden');
            return;
        }

        claimMessage.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');

        fetch('/api/claim', { // Reemplaza '/api/claim' con la URL de tu backend
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
            claimMessage.textContent = data.message || '¡Reclamo exitoso!';
            claimMessage.classList.remove('hidden');
            grecaptcha.reset();
            document.getElementById('claim-button').disabled = true;
            emailInput.value = '';
        })
        .catch(error => {
            loadingIndicator.classList.add('hidden');
            claimMessage.textContent = 'Ocurrió un error al procesar tu reclamo. Por favor, intenta de nuevo.';
            claimMessage.classList.remove('hidden');
            console.error('Error:', error);
            grecaptcha.reset();
            document.getElementById('claim-button').disabled = true;
        });
    });
});
