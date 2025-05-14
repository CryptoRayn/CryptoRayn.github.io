<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu Faucet</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>¡Cryptorayn!</h1>
        <div id="welcome-form">
            <label for="email">Tu Correo Electrónico de FaucetPay:</label>
            <input type="email" id="email" placeholder="Ingresa tu correo electrónico de FaucetPay">
            <button id="login-button">Continuar</button>
            <p id="login-message" class="hidden"></p>
        </div>
        <div id="captcha-container" class="hidden">
            <h2>Verificación</h2>
            <p id="captcha-question"></p>
            <input type="text" id="captcha-answer" placeholder="Ingresa la respuesta">
            <button id="verify-button">Verificar</button>
            <p id="captcha-message" class="hidden"></p>
        </div>
        <div id="loading-indicator" class="hidden">
            Cargando...
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
