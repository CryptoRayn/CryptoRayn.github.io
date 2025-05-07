document.addEventListener('DOMContentLoaded', function() {
    const claimButton = document.getElementById('claim-button');
    const walletAddressInput = document.getElementById('wallet-address');
    const coinSelect = document.getElementById('coin');
    const claimMessage = document.getElementById('claim-message');
    const loadingIndicator = document.getElementById('loading-indicator');

    claimButton.addEventListener('click', function() {
        const walletAddress = walletAddressInput.value;
        const selectedCoin = coinSelect.value;
        const recaptchaResponse = grecaptcha.getResponse(); // Obtiene la respuesta del reCAPTCHA

        if (!walletAddress) {
            claimMessage.textContent = 'Por favor, ingresa tu dirección de FaucetPay.';
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
                address: walletAddress,
                coin: selectedCoin,
                recaptchaResponse: recaptchaResponse // Envía la respuesta del reCAPTCHA
            })
        })
        .then(response => response.json())
        .then(data => {
            loadingIndicator.classList.add('hidden');
            claimMessage.textContent = data.message || '¡Reclamo exitoso!';
            claimMessage.classList.remove('hidden');
            // Opcionalmente, podrías limpiar el formulario o actualizar la UI
            grecaptcha.reset(); // Resetea el reCAPTCHA para el siguiente reclamo
            document.getElementById('claim-button').disabled = true; // Deshabilita el botón nuevamente
            walletAddressInput.value = ''; // Limpia la dirección (opcional)
        })
        .catch(error => {
            loadingIndicator.classList.add('hidden');
            claimMessage.textContent = 'Ocurrió un error al procesar tu reclamo. Por favor, intenta de nuevo.';
            claimMessage.classList.remove('hidden');
            console.error('Error:', error);
            grecaptcha.reset(); // Resetea el reCAPTCHA en caso de error
            document.getElementById('claim-button').disabled = true; // Asegura que el botón esté deshabilitado
        });
    });
});
