async function verificarCorreo() {
  const email = document.getElementById("emailInput").value.trim();
  const resultado = document.getElementById("resultado");

  if (!email) {
    resultado.textContent = "Por favor, ingresa un correo.";
    return;
  }

  try {
    const response = await fetch("https://faucetpay.io/api/v1/checkuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Authorization": "Bearer 655e8722ec1eb50cc80fde5b22ec208341a3cb5f7d05bf3edee381ee52ae5808"
      },
      body: JSON.stringify({
        email: email
      })
    });

    const data = await response.json();
    console.log(data);

    if (data.status === 200 && data.message.includes("User found")) {
      resultado.textContent = "✅ El correo está registrado en FaucetPay.";
    } else {
      resultado.textContent = "❌ El correo NO está registrado en FaucetPay.";
    }

  } catch (error) {
    resultado.textContent = "⚠️ Error al consultar la API.";
    console.error(error);
  }
}
