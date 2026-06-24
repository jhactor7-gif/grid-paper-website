import { onFbReady, authErrorMessage } from "./fb-utils.js";

onFbReady(async ({ auth }) => {
  const { signInWithEmailAndPassword } = await import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
  );

  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("form-error");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "로그인 중...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/";
    } catch (err) {
      errorEl.textContent = authErrorMessage(err.code);
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "로그인";
    }
  });
});
