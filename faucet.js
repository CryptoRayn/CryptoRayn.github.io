document.addEventListener('DOMContentLoaded', function() {
    const timeLeftElement = document.getElementById('time-left');
    const claimNowButton = document.getElementById('claim-now-button');
    const claimStatusElement = document.getElementById('claim-status');
    const timerInterval = 1000; // 1 segundo
    const claimIntervalHours = 1;
    const appsScriptUrl = 'TU_URL_DE_LA_APLICACION_WEB'; // ¡REEMPLAZA CON LA URL DE TU APPS SCRIPT!
    let timer;

    function updateTimerDisplay(remainingTime) {
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = Math.floor(remainingTime % 60);
        timeLeftElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (remainingTime <= 0) {
            clearInterval(timer);
            claimNowButton.disabled = false;
            timeLeftElement.textContent = 'Listo para reclamar';
        }
    }

    function startTimer(lastClaimTime) {
        const nextClaimTime = new Date(lastClaimTime.getTime() + claimIntervalHours * 60 * 60 * 1000);
        const now = new Date();
        let remainingTime = Math.max(0, Math.floor((nextClaimTime.getTime() - now.getTime()) / 1000));

        updateTimerDisplay(remainingTime);
        timer = setInterval(() => {
            remainingTime = Math.max(0, remainingTime - 1);
            updateTimerDisplay(remainingTime);
        }, timerInterval);
    }

    function getLastClaimTime() {
        fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getLastClaimTime'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.lastClaimTime) {
                startTimer(new Date(data.lastClaimTime));
            } else {
                // Si no hay hora de reclamo previa, permitir reclamar inmediatamente
                claimNowButton.disabled = false;
                timeLeftElement.textContent = 'Listo para reclamar';
                console.log(data.message || 'No se encontró la última hora de reclamo.');
            }
        })
        .catch(error => {
            console.error('Error al obtener la última hora de reclamo:', error);
            claimStatusElement.textContent = 'Error al cargar el temporizador.';
            claimStatusElement.classList.remove('hidden');
        });
    }

    claimNowButton.addEventListener('click', function() {
        claimNowButton.disabled = true;
        timeLeftElement.textContent = 'Reclamando...';

        fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'recordClaimTime'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                claimStatusElement.textContent = 'Reclamo exitoso. Espera 1 hora para el próximo reclamo.';
                claimStatusElement.classList.remove('hidden', 'error-animation');
                claimStatusElement.classList.add('success-animation');
                getLastClaimTime(); // Volver a obtener la hora para iniciar el nuevo temporizador
            } else {
                claimStatusElement.textContent = data.message || 'Error al registrar el reclamo.';
                claimStatusElement.classList.remove('hidden', 'success-animation');
                claimStatusElement.classList.add('error-animation');
                claimNowButton.disabled = false; // Re-habilitar el botón en caso de error
                timeLeftElement.textContent = 'Listo para reclamar'; // Resetear visualización
            }
        })
        .catch(error => {
            console.error('Error al registrar la hora de reclamo:', error);
            claimStatusElement.textContent = 'Error al conectar con el servidor.';
            claimStatusElement.classList.remove('hidden', 'success-animation');
            claimStatusElement.classList.add('error-animation');
            claimNowButton.disabled = false; // Re-habilitar el botón en caso de error
            timeLeftElement.textContent = 'Listo para reclamar'; // Resetear visualización
        });
    });

    // Al cargar la página, obtener la última hora de reclamo
    getLastClaimTime();
});
