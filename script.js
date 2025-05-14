document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const loginButton = document.getElementById('login-button');
    const loginMessage = document.getElementById('login-message');
    const welcomeForm = document.getElementById('welcome-form');
    const captchaContainer = document.getElementById('captcha-container');
    const captchaQuestion = document.getElementById('captcha-question');
    const captchaAnswerInput = document.getElementById('captcha-answer');
    const verifyButton = document.getElementById('verify-button');
    const captchaMessage = document.getElementById('captcha-message');
    const loadingIndicator = document.getElementById('loading-indicator');

    const jsonBinId = 'TU_ID_DE_JSONBIN'; // Reemplaza con tu ID de JSONBin
    const jsonBinAccessKey = 'TU_CLAVE_DE_ACCESO_DE_JSONBIN'; // Reemplaza con tu clave de acceso (solo lectura si es posible)

    async function fetchDataFromJSONBin() {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${jsonBinId}`, {
                headers: {
                    'X-Access-Key': jsonBinAccessKey
                }
            });
            const data = await response.json();
            if (data.record) {
                return data.record;
            } else {
                console.error('Formato de datos incorrecto en JSONBin.');
                loginMessage.textContent = 'Error al cargar la configuración.';
                loginMessage.classList.remove('hidden');
                loginMessage.classList.add('error-animation');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener datos desde JSONBin:', error);
            loginMessage.textContent = 'Error al conectar con el servidor.';
            loginMessage.classList.remove('hidden');
            loginMessage.classList.add('error-animation');
            return null;
        }
    }

    async function verifyFaucetPayEmail(email, apiKey) {
        try {
            const response = await fetch('https://faucetpay.io/api/v1/checkuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_key: apiKey,
                    email: email
                })
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error al verificar el correo de FaucetPay:', error);
            return false;
        }
    }

    loginButton.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        if (!email) {
            loginMessage.textContent = 'Por favor, ingresa tu correo electrónico de FaucetPay.';
            loginMessage.classList.remove('hidden');
            loginMessage.classList.add('error-animation');
            return;
        }

        loadingIndicator.classList.remove('hidden');
        loginMessage.classList.add('hidden');
        loginMessage.classList.remove('error-animation', 'success-animation');

        const configData = await fetchDataFromJSONBin();

        if (configData && configData.faucetpayApiKey && Array.isArray(configData.captchaQuestions)) {
            const isFaucetPayEmail = await verifyFaucetPayEmail(email, configData.faucetpayApiKey);
            loadingIndicator.classList.add('hidden');

            if (isFaucetPayEmail) {
                loginMessage.textContent = 'Correo electrónico verificado.';
                loginMessage.classList.remove('hidden');
                loginMessage.classList.add('success-animation');
                welcomeForm.classList.add('hidden');
                captchaContainer.classList.remove('hidden');

                const randomIndex = Math.floor(Math.random() * configData.captchaQuestions.length);
                const captchaData = configData.captchaQuestions[randomIndex];
                captchaQuestion.textContent = captchaData.pregunta;
                verifyButton.onclick = () => {
                    if (captchaAnswerInput.value.trim().toLowerCase() === captchaData.respuesta.toLowerCase()) {
                        captchaMessage.textContent = '¡Verificación exitosa! Redirigiendo... (aquí iría la lógica del faucet)';
                        captchaMessage.classList.remove('hidden');
                        captchaMessage.classList.add('success-animation');
                        setTimeout(() => {
                            // window.location.href = '/faucet'; // Ejemplo de redirección
                            console.log('Verificación Exitosa');
                        }, 2000);
                    } else {
                        captchaMessage.textContent = 'Respuesta incorrecta. Intenta nuevamente.';
                        captchaMessage.classList.remove('hidden');
                        captchaMessage.classList.add('error-animation');
                    }
                };
            } else {
                loginMessage.textContent = 'Este correo electrónico no está registrado en FaucetPay.';
                loginMessage.classList.remove('hidden');
                loginMessage.classList.add('error-animation');
            }
        } else {
            loadingIndicator.classList.add('hidden');
            loginMessage.textContent = 'Error al cargar la configuración del faucet.';
            loginMessage.classList.remove('hidden');
            loginMessage.classList.add('error-animation');
        }
    });
});
