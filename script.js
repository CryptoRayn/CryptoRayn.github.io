const form = document.getElementById("faucetForm");
const dashboard = document.getElementById("dashboard");
const balanceDisplay = document.getElementById("balance");

let balance = 0;

// Validación básica de dirección Dogecoin (empieza con D o A y longitud adecuada)
function isValidDOGE(address) {
  return /^[DA9][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
}

// Validación de correos @gmail.com
function isValidGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

// Verificar en red si la dirección Dogecoin ha sido usada (usando BlockCypher)
async function checkDOGEAddressExists(address) {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/doge/main/addrs/${address}`);
    const data = await response.json();

    // Si tiene transacciones, ha sido usada
    if (data && (data.txrefs || data.unconfirmed_txrefs)) {
      return true;
    }

    // Si tiene saldo positivo, también consideramos válida
    if (data && data.final_balance > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error consultando BlockCypher para DOGE:", error);
    return false;
  }
}

// Manejar el formulario
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const dogeAddress = document.getElementById("cryptoAddress").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!isValidDOGE(dogeAddress)) {
    alert("Dirección DOGE inválida.");
    return;
  }

  if (!isValidGmail(email)) {
    alert("Solo se permiten correos @gmail.com.");
    return;
  }

  const exists = await checkDOGEAddressExists(dogeAddress);
  if (!exists) {
    alert("La dirección DOGE no ha sido usada o no tiene actividad visible.");
    return;
  }

  form.classList.add("hidden");
  dashboard.classList.remove("hidden");
});

// Simulación de depósitos y retiros
function deposit() {
  balance += 1; // 1 DOGE
  updateBalance();
}

function withdraw() {
  if (balance <= 0) {
    alert("Saldo insuficiente.");
    return;
  }
  balance -= 1;
  updateBalance();
}

function updateBalance() {
  balanceDisplay.textContent = balance.toFixed(2) + " DOGE";
}
