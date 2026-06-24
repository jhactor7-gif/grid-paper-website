import { onFbReady, escapeHtml, formatDate } from "./fb-utils.js";

onFbReady(async ({ db }) => {
  const { doc, getDoc } = await import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
  );

  const article = document.getElementById("post-detail");
  const notFound = document.getElementById("not-found");
  const postId = article.dataset.postId;

  try {
    const snap = await getDoc(doc(db, "posts", postId));
    if (!snap.exists()) {
      article.hidden = true;
      notFound.hidden = false;
      return;
    }
    const data = snap.data();
    document.title = `${data.title || "글"} — 원고지`;

    const paragraphs = (data.content || "")
      .split(/\n+/)
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");

    article.querySelector(".post-body").innerHTML = `
      <p class="post-eyebrow mono">${formatDate(data.createdAt)}</p>
      <h1 class="post-title">${escapeHtml(data.title || "제목 없음")}</h1>
      <p class="post-author">by ${escapeHtml(data.authorName || "익명")}</p>
      <div class="post-content">${paragraphs}</div>
      <a href="/" class="btn btn-outline post-back">← 목록으로</a>
    `;
  } catch (err) {
    article.hidden = true;
    notFound.hidden = false;
  }
});
