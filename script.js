// ==================== ⚙️ Configuración ====================
const modoTest = true; // 🧪 ¡Eliminar en producción!
const faucetpayApiKey = "655e8722ec1eb50cc80fde5b22ec208341a3cb5f7d05bf3edee381ee52ae5808"; // 🧪 Solo para modoTest

document.addEventListener('DOMContentLoaded', () => {
  const checkButton = document.getElementById('checkBtn');
  const ltcAddressInput = document.getElementById('ltcAddress');
  const resultDiv = document.getElementById('result');
  const irButton = document.getElementById('irButton');
  const recaptchaContainer = document.getElementById('recaptcha-container');
  
  checkButton.addEventListener('click', async () => {
    const ltcAddress = ltcAddressInput.value.trim();
    
    if (!ltcAddress) {
      resultDiv.textContent = 'Por favor, ingresa una dirección LTC.';
      resultDiv.className = 'result-error';
      resultDiv.classList.remove('result-hidden');
      return;
    }
    
    resultDiv.textContent = 'Verificando...';
    resultDiv.className = '';
    resultDiv.classList.remove('result-hidden');
    irButton.disabled = true;
    recaptchaContainer.style.display = 'none';
    
    let apiKey = '';
    
    if (modoTest) {
      apiKey = faucetpayApiKey; // 🧪 API fija para desarrollo
    } else {
      try {
        apiKey = await obtenerApiKeyProtegida(); // 🔐 protegida en producción
        if (!apiKey) throw new Error('No se recibió clave');
      } catch (err) {
        resultDiv.textContent = 'Error al obtener la API desde el sistema protegido.';
        resultDiv.className = 'result-error';
        return;
      }
    }
    
    validarDireccionConFaucetPay(ltcAddress, apiKey);
  });
  
  async function validarDireccionConFaucetPay(ltcAddress, apiKey) {
    const apiUrl = 'https://faucetpay.io/api/v1/checkaddress';
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `api_key=${encodeURIComponent(apiKey)}&address=${encodeURIComponent(ltcAddress)}`
      });
      
      const data = await response.json();
      resultDiv.classList.remove('result-hidden');
      
      if (data.status === 200) {
        // Aquí no mostramos el hash, solo indicamos éxito
        resultDiv.textContent = `✅ Dirección válida. Puedes continuar.`;
        resultDiv.className = 'result-success';
        irButton.disabled = true; // deshabilitar hasta resolver captcha
        recaptchaContainer.style.display = 'block';
      } else if (data.status === 456) {
        resultDiv.textContent = '❌ La dirección no pertenece a ningún usuario de FaucetPay.';
        resultDiv.className = 'result-error';
        irButton.disabled = true;
        recaptchaContainer.style.display = 'none';
      } else {
        resultDiv.textContent = `⚠️ Error: ${data.message || 'Desconocido'}`;
        resultDiv.className = 'result-error';
        irButton.disabled = true;
        recaptchaContainer.style.display = 'none';
      }
    } catch (error) {
      console.error('Error al verificar dirección:', error);
      resultDiv.textContent = '❌ Error de red al verificar.';
      resultDiv.className = 'result-error';
      irButton.disabled = true;
      recaptchaContainer.style.display = 'none';
    }
  }
  
  // 🔐 Solo se usa en producción
  async function obtenerApiKeyProtegida() {
    return new Promise((resolve, reject) => {
      const espera = setInterval(() => {
        if (window.fpkResult && typeof window.fpkResult === 'string') {
          clearInterval(espera);
          resolve(window.fpkResult.trim());
        }
      }, 300);
      
      setTimeout(() => {
        clearInterval(espera);
        reject('Timeout: sin respuesta');
      }, 10000);
    });
  }
});

// Función llamada por el callback del reCAPTCHA para activar el botón "ir"
function onRecaptchaSuccess() {
  const irButton = document.getElementById('irButton');
  irButton.disabled = false;
}
