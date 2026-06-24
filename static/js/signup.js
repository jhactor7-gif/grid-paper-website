import { onFbReady, authErrorMessage } from "./fb-utils.js";

onFbReady(async ({ auth }) => {
  const { createUserWithEmailAndPassword, updateProfile } = await import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
  );

  const form = document.getElementById("signup-form");
  const errorEl = document.getElementById("form-error");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "가입 처리 중...";

    const nickname = document.getElementById("nickname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (nickname) {
        await updateProfile(cred.user, { displayName: nickname });
      }
      window.location.href = "/";
    } catch (err) {
      errorEl.textContent = authErrorMessage(err.code);
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "회원가입";
    }
  });
});
