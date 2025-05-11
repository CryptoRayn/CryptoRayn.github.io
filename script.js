document.addEventListener('DOMContentLoaded', function() {
    const claimButton = document.getElementById('claim-button');
    const emailInput = document.getElementById('email');
    const claimMessage = document.getElementById('claim-message');
    const loadingIndicator = document.getElementById('loading-indicator');
    const container = document.querySelector('.container');
    const recaptchaContainer = document.querySelector('.g-recaptcha');
    const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY_PUBLIC; // Nombre de la variable de entorno pública
    console.log("Clave del sitio reCAPTCHA:", recaptchaSiteKey); // <--- AÑADE ESTA LÍNEA AQUÍ

    // Añadimos la clase 'loaded' al contenedor cuando el contenido esté cargado
    container.classList.add('loaded');

    // Renderizar dinámicamente el reCAPTCHA con la clave del entorno
    if (recaptchaContainer && recaptchaSiteKey) {
        grecaptcha.render(recaptchaContainer, {
            'sitekey': recaptchaSiteKey,
            'callback': 'onRecaptchaSuccess',
            'expired-callback': 'onRecaptchaExpired'
        });
    } else {
        console.error('No se encontró el contenedor reCAPTCHA o la clave del sitio pública.');
    }

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

        fetch('/api/claim', {
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
            claimButton.disabled = false; // Habilitar el botón para futuros reclamos
            // Aquí podríamos habilitar el botón "IR" para el Proceso C
            // document.getElementById('botonIr').disabled = false;
        })
        .catch(error => {
            loadingIndicator.classList.add('hidden');
            claimButton.classList.remove('loading');
            animateError(claimMessage, 'Ocurrió un error al procesar tu reclamo. Por favor, intenta de nuevo.');
            console.error('Error:', error);
            grecaptcha.reset();
            claimButton.disabled = false; // Habilitar el botón en caso de error para reintento
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

function onRecaptchaSuccess() {
    const claimButton = document.getElementById('claim-button');
    claimButton.disabled = false;
    claimButton.classList.add('recaptcha-ready');
}

function onRecaptchaExpired() {
    const claimButton = document.getElementById('claim-button');
    claimButton.disabled = true;
    claimButton.classList.remove('recaptcha-ready');
    alert('El reCAPTCHA ha expirado. Por favor, inténtalo de nuevo.');
}
