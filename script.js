const form = document.getElementById("faucetForm");
const dashboard = document.getElementById("dashboard");
const balanceDisplay = document.getElementById("balance");

let balance = 0;

// Validar formato de dirección Litecoin (comienza con L, M o 3 y tiene longitud adecuada)
function isValidLTC(address) {
  return /^([LM3][a-km-zA-HJ-NP-Z1-9]{26,33})$/.test(address);
}

// Validar correo electrónico que sea @gmail.com
function isValidGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

// Verifica si la dirección LTC tiene transacciones en la blockchain (usando SoChain API)
async function checkLTCAddressExists(address) {
  try {
    const response = await fetch(`https://sochain.com/api/v2/address/LTC/${address}`);
    const data = await response.json();

    if (data.status === "success" && data.data.total_txs > 0) {
      return true; // Dirección activa en la red
    } else {
      return false; // No tiene transacciones
    }
  } catch (error) {
    console.error("Error consultando SoChain:", error);
    return false;
  }
}

// Evento del formulario al enviar
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const ltcAddress = document.getElementById("ltcAddress").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!isValidLTC(ltcAddress)) {
    alert("Dirección LTC inválida. Asegúrate de que sea una dirección Litecoin válida.");
    return;
  }

  if (!isValidGmail(email)) {
    alert("Correo inválido. Solo se permiten direcciones @gmail.com.");
    return;
  }

  // Verifica si la dirección existe en la red
  const exists = await checkLTCAddressExists(ltcAddress);
  if (!exists) {
    alert("La dirección LTC no existe o nunca ha sido utilizada en la blockchain.");
    return;
  }

  // Mostrar dashboard
  form.classList.add("hidden");
  dashboard.classList.remove("hidden");
});

// Simulación de depósito
function deposit() {
  balance += 0.001;
  updateBalance();
}

// Simulación de retiro
function withdraw() {
  if (balance <= 0) {
    alert("Saldo insuficiente para retirar.");
    return;
  }
  balance -= 0.001;
  updateBalance();
}

// Actualiza el saldo visual
function updateBalance() {
  balanceDisplay.textContent = balance.toFixed(8);
}
