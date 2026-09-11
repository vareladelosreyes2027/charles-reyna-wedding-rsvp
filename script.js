// =============================================================
// 1. Paste your Google Apps Script Web App URL below.
//    (You get this after deploying Code.gs — see the setup guide.)
// =============================================================
const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbwAbMaVpHOSdr3Reo1l-aiXVFYlEMcNTXcBu7BE49zlcLOP9rhOLDnkGm86CLMvCDW9/exec";

const form = document.getElementById("rsvp-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const btnLabel = submitBtn.querySelector(".btn-label");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("guest-name").value.trim();
  const availabilityInput = form.querySelector('input[name="availability"]:checked');

  statusEl.textContent = "";
  statusEl.className = "form-status";

  if (!name || !availabilityInput) {
    statusEl.textContent = "Please add your name and pick an option above.";
    statusEl.classList.add("error");
    return;
  }

  if (ENDPOINT_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    statusEl.textContent = "This site isn't connected to a spreadsheet yet — see the setup guide.";
    statusEl.classList.add("error");
    return;
  }

  const availability = availabilityInput.value;

  submitBtn.disabled = true;
  btnLabel.textContent = "Sending…";

  try {
    // Sent as text/plain on purpose: this avoids a CORS "preflight"
    // request, which Google Apps Script Web Apps don't handle well.
    const response = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name, availability }),
    });

    const result = await response.json();

    if (result.result === "success") {
      statusEl.textContent = "Thank you — your RSVP is saved.";
      statusEl.classList.add("success");
      btnLabel.textContent = "Sent ✓";
    } else {
      throw new Error(result.message || "Unknown error");
    }
  } catch (err) {
    statusEl.textContent = "Something went wrong — please try again in a moment.";
    statusEl.classList.add("error");
    submitBtn.disabled = false;
    btnLabel.textContent = "Send RSVP";
  }
});
