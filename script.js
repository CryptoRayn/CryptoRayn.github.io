document.getElementById("claimButton").addEventListener("click", function () {
  const messages = [
    "¡Felicidades! Has recibido 10 satoshis 🎉",
    "¡Buen intento! Inténtalo de nuevo en 5 minutos ⏳",
    "¡Wow! Te ganaste 50 satoshis 🔥",
    "Lo siento, sin recompensa esta vez 😢"
  ];

  const msg = messages[Math.floor(Math.random() * messages.length)];
  document.getElementById("message").innerText = msg;
});

