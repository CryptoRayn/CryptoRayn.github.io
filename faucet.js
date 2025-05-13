document.addEventListener('DOMContentLoaded', function() {
    const timeLeftElement = document.getElementById('time-left');
    const claimNowButton = document.getElementById('claim-now-button');
    const claimStatusElement = document.getElementById('claim-status');
    const timerInterval = 1000;
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbyI2AYg6-kmWuTvFoLNUpTrpY2axdceFSzwiVmcnIEVL1Jt2TuMf_QBpT7pLYkDOAxhCQ/exec'; // URL actualizada
    let timer;
    let userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        window.location.href = '/';
        return;
    }

    function updateTimerDisplay(remainingTime) {
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = Math.floor(remainingTime % 60);
        timeLeftElement.textContent = `<span class="math-inline">${String(hours).padStart(2, '0')}:</span>${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (remainingTime <= 0) {
            clearInterval(timer);
            claimNowButton.disabled = false;
            timeLeftElement.textContent = 'Listo para reclamar';
        }
    }

    function startTimer(nextClaimTime) {
        const now = new Date();
        let remainingTime = Math.max(0, Math.floor((nextClaimTime.getTime() - now.getTime()) / 1000));
        updateTimerDisplay(remainingTime);
        timer = setInterval(() => {
            remainingTime = Math.max(0, remainingTime - 1);
            updateTimerDisplay(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(timer);
                claimNowButton.disabled = false;
                timeLeftElement.textContent = 'Listo para reclamar';
            }
        }, timerInterval);
    }

    function getLastClaimTime() {
        fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getLastClaimTime',
                email: userEmail
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.nextClaimTime) {
                startTimer(new Date(data.nextClaimTime));
            } else {
                claimNowButton.disabled = false;
                timeLeftElement.textContent = 'Listo para reclamar';
                console.log(data.message || 'No se pudo obtener la hora del próximo reclamo.');
            }
        })
        .catch(error => {
            console.error('Error al obtener la hora del próximo reclamo:', error);
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
                action: 'recordClaimTime',
                email: userEmail
            })
        })
        .then(response => response.json())
        .then(data => {
            claimStatusElement.classList.remove('hidden');
            if (data.success) {
                claimStatusElement.textContent = data.message || 'Reclamo exitoso. Espera para el próximo reclamo.';
                claimStatusElement.classList.remove('error-animation');
                claimStatusElement.classList.add('success-animation');
                getLastClaimTime();
            } else {
                claimStatusElement.textContent = data.message || 'Error al reclamar.';
                claimStatusElement.classList.remove('success-animation');
                claimStatusElement.classList.add('error-animation');
                claimNowButton.disabled = false;
                timeLeftElement.textContent = 'Listo para reclamar';
            }
        })
        .catch(error => {
            console.error('Error al reclamar:', error);
            claimNowButton.disabled = false;
            timeLeftElement.textContent = 'Listo para reclamar';
        });
    });

    getLastClaimTime();
});
