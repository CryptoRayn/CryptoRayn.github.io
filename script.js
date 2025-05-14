const webhookUrl = "https://hook.us2.make.com/ldpdob431873o77466jrkaeq4u0qo1l1"; // reemplaza con tu URL

function enviarPrueba() {
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: "prueba@correo.com" })
  })
  .then(res => {
    if (res.ok) {
      console.log("✅ Enviado con éxito.");
    } else {
      console.log("❌ Error en el envío.");
    }
  })
  .catch(err => {
    console.error("❌ Error de red o CORS.");
  });
}
