document.addEventListener('DOMContentLoaded', function() {
    const claimButton = document.getElementById('claim-button');
    const claimMessage = document.getElementById('claim-message');
    const loadingIndicator = document.getElementById('loading-indicator');
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbztU5PV-BzHDr_5AhI9tMq7wh5LXetvHjVBPha3Vjw7odvWoCmxmv5xERMgtCp3An9xbw/exec'; // Asegúrate de que esta sea tu URL de la aplicación web

    claimButton.addEventListener('click', function() {
        document.getElementById('welcome-form').classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        claimMessage.classList.add('hidden'); // Ocultar mensajes anteriores

        fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'testConnection'
            })
        })
        .then(response => response.json())
        .then(data => {
            loadingIndicator.classList.add('hidden');
            document.getElementById('welcome-form').classList.remove('hidden');
            claimMessage.classList.remove('hidden');

            if (data.success) {
                claimMessage.textContent = data.message;
                claimMessage.classList.remove('error-animation');
                claimMessage.classList.add('success-animation');
            } else {
                claimMessage.textContent = data.message;
                claimMessage.classList.remove('success-animation');
                claimMessage.classList.add('error-animation');
            }
        })
        .catch(error => {
            loadingIndicator.classList.add('hidden');
            document.getElementById('welcome-form').classList.remove('hidden');
            claimMessage.classList.remove('hidden');
            claimMessage.textContent = 'Error al conectar con el backend.';
            claimMessage.classList.remove('success-animation');
            claimMessage.classList.add('error-animation');
            console.error('Error de conexión:', error);
        });
    });
});
