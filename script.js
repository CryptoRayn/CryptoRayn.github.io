const ENDPOINT = "https://eof036in3p1ym4i.m.pipedream.net";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("checkButton").addEventListener("click", checkEmail);
});

function checkEmail() {
  const email = document.getElementById("email").value.trim();
  const result = document.getElementById("result");

  if (!email) {
    result.textContent = "Por favor, introduce un correo electrónico.";
    result.style.color = "red";
    return;
  }

  result.textContent = "Verificando...";
  result.style.color = "black";

  fetch(`${ENDPOINT}?email=${encodeURIComponent(email)}`)
    .then((res) => res.json())
    .then((data) => {
      // Como la respuesta de Pipedream está en `body`, accedemos así:
      const body = data.body;

      if (body?.status === 200 && body.user?.email) {
        result.textContent = `✅ Correo registrado: ${body.user.email}`;
        result.style.color = "green";
      } else {
        result.textContent = "❌ El correo NO está registrado en FaucetPay.";
        result.style.color = "red";
      }
    })
    .catch((error) => {
      console.error("Error al contactar:", error);
      result.textContent = "Error al contactar con el servidor.";
      result.style.color = "red";
    });
}
