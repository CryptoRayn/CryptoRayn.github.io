document.addEventListener('DOMContentLoaded', function() {
    const claimButton = document.getElementById('claim-button');
    const emailInput = document.getElementById('email');
    const claimMessage = document.getElementById('claim-message');
    const loadingIndicator = document.getElementById('loading-indicator');
    const welcomeForm = document.getElementById('welcome-form');
    const container = document.querySelector('.container');

    // Animación sutil al cargar la página
    setTimeout(() => {
        container.classList.add('loaded');
    }, 50); // Pequeño retraso para asegurar que la animación fadeIn del CSS se complete

    claimButton.addEventListener('click', function() {
        const email = emailInput.value;
        const recaptchaResponse = grecaptcha.getResponse();

        if (!email) {
            animateError(claimMessage, 'Por favor, ingresa tu correo electrónico de FaucetPay.');
            return;
        }

        if (!recaptchaResponse) {
            animateError(claimMessage, 'Por favor, completa el reCAPTCHA.');
            return;
        }

        // Animación al enviar la solicitud
        claimMessage.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        claimButton.classList.add('loading'); // Clase para cambiar el estilo del botón

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
            claimButton.classList.remove('loading');
            animateSuccess(claimMessage, data.message || '¡Reclamo exitoso!');
            grecaptcha.reset();
            claimButton.disabled = true;
            emailInput.value = '';
        })
        .catch(error => {
            loadingIndicator.classList.add('hidden');
            claimButton.classList.remove('loading');
            animateError(claimMessage, 'Ocurrió un error al procesar tu reclamo. Por favor, intenta de nuevo.');
            console.error('Error:', error);
            grecaptcha.reset();
            claimButton.disabled = true;
        });
    });

    function animateError(element, message) {
        element.textContent = message;
        element.classList.remove('hidden');
        element.classList.add('error-animation');
        setTimeout(() => {
            element.classList.remove('error-animation');
        }, 500); // Duración de la animación
    }

    function animateSuccess(element, message) {
        element.textContent = message;
        element.classList.remove('hidden');
        element.classList.add('success-animation');
        setTimeout(() => {
            element.classList.remove('success-animation');
        }, 700); // Duración de la animación
    }
});
