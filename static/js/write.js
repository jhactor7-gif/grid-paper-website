import { onFbReady } from "./fb-utils.js";

onFbReady(async ({ auth, db }) => {
  const { onAuthStateChanged } = await import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
  );
  const { collection, addDoc, serverTimestamp } = await import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
  );

  const writeSection = document.getElementById("write-section");
  const authRequired = document.getElementById("auth-required");
  const form = document.getElementById("write-form");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const charCount = document.getElementById("char-count");
  const errorEl = document.getElementById("form-error");
  const submitBtn = document.getElementById("submit-btn");

  let currentUser = null;

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
      writeSection.hidden = false;
      authRequired.hidden = true;
    } else {
      writeSection.hidden = true;
      authRequired.hidden = false;
    }
  });

  contentInput.addEventListener("input", () => {
    charCount.textContent = `${contentInput.value.length}자`;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    errorEl.hidden = true;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "발행 중...";

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        content,
        authorUid: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email.split("@")[0],
        createdAt: serverTimestamp(),
      });
      window.location.href = `/post/${docRef.id}`;
    } catch (err) {
      errorEl.textContent = "글을 저장하지 못했어요. 다시 시도해주세요.";
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "발행하기";
    }
  });
});
