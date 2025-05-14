const form = document.getElementById("faucetForm");
const dashboard = document.getElementById("dashboard");
const balanceDisplay = document.getElementById("balance");

let balance = 0;

function isValidLTC(address) {
  return /^([LM3][a-km-zA-HJ-NP-Z1-9]{26,33}|ltc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{39,59})$/.test(address);
}

function isValidGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

async function checkLTCAddressExists(address) {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/ltc/main/addrs/${address}`);
    const data = await response.json();

    if (data && data.txrefs && data.txrefs.length > 0) {
      return true; // Tiene transacciones
    } else if (data && data.final_balance !== undefined) {
      return data.final_balance > 0; // Puede tener saldo sin txrefs (vacío de tx pero con saldo inicial)
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error consultando BlockCypher:", error);
    return false;
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const ltcAddress = document.getElementById("ltcAddress").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!isValidLTC(ltcAddress)) {
    alert("Dirección LTC inválida.");
    return;
  }

  if (!isValidGmail(email)) {
    alert("Correo inválido. Solo se aceptan direcciones @gmail.com.");
    return;
  }

  const exists = await checkLTCAddressExists(ltcAddress);
  if (!exists) {
    alert("La dirección LTC no se encuentra activa en la red.");
    return;
  }

  form.classList.add("hidden");
  dashboard.classList.remove("hidden");
});

function deposit() {
  balance += 0.001;
  updateBalance();
}

function withdraw() {
  if (balance <= 0) {
    alert("Saldo insuficiente.");
    return;
  }
  balance -= 0.001;
  updateBalance();
}

function updateBalance() {
  balanceDisplay.textContent = balance.toFixed(8);
}
