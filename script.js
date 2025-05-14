const form = document.getElementById("faucetForm");
const dashboard = document.getElementById("dashboard");
const balanceDisplay = document.getElementById("balance");

let balance = 0;
const apiKey = "655e8722ec1eb50cc80fde5b22ec208341a3cb5f7d05bf3edee381ee52ae5808"; // Tu API Key de FaucetPay

// Validación básica de dirección Litecoin (LTC), soportando ambos formatos: estándar y Bech32
function isValidLTC(address) {
  // Direcciones LTC estándar (empiezan con L o M)
  const standardLTC = /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/;
  // Direcciones Bech32 (empiezan con ltc1)
  const bech32LTC = /^ltc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{39,59}$/;

  return standardLTC.test(address) || bech32LTC.test(address);
}

// Verificar en FaucetPay si la dirección Litecoin pertenece a un usuario
async function checkFaucetPayAddress(address) {
  try {
    const response = await fetch("https://faucetpay.io/api/v1/checkaddress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        api_key: apiKey,
        address: address
      })
    });

    const data = await response.json();

    if (data.status === 200) {
      console.log("Dirección vinculada a un usuario. Hash:", data.payout_user_hash);
      return data.payout_user_hash;
    } else if (data.status === 456) {
      console.warn("La dirección no está vinculada a ningún usuario.");
      return null;
    } else {
      console.error("Error en la respuesta de la API:", data.message);
      return null;
    }

  } catch (error) {
    console.error("Error al consultar la API de FaucetPay:", error);
    return null;
  }
}

// Manejar el formulario
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const ltcAddress = document.getElementById("ltcAddress").value.trim();

  if (!isValidLTC(ltcAddress)) {
    alert("Dirección LTC inválida.");
    return;
  }

  // Verificar que la dirección está asociada a un usuario en FaucetPay
  const payoutUserHash = await checkFaucetPayAddress(ltcAddress);
  if (!payoutUserHash) {
    alert("La dirección LTC no está registrada en FaucetPay.");
    return;
  }

  // Si la dirección es válida y está registrada, mostramos el dashboard
  form.classList.add("hidden");
  dashboard.classList.remove("hidden");
});

// Simulación de depósitos y retiros
function deposit() {
  balance += 1; // 1 LTC
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
  balanceDisplay.textContent = balance.toFixed(2) + " LTC";
}
