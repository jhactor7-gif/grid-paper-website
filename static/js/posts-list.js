import { onFbReady, escapeHtml, formatDate } from "./fb-utils.js";

onFbReady(async ({ db }) => {
  const { collection, getDocs, query, orderBy } = await import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
  );

  const grid = document.getElementById("post-grid");
  const emptyState = document.getElementById("empty-state");
  const countEl = document.getElementById("post-count");

  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      grid.innerHTML = "";
      emptyState.hidden = false;
      countEl.textContent = "";
      return;
    }

    countEl.textContent = `총 ${snap.size}편`;

    const cardsHtml = snap.docs.map((doc, i) => {
      const data = doc.data();
      const excerpt = (data.content || "").slice(0, 90);
      return `
        <a class="post-card" href="/post/${doc.id}" style="--delay:${i % 6}">
          <span class="post-card-fold" aria-hidden="true"></span>
          <h3 class="post-card-title">${escapeHtml(data.title || "제목 없음")}</h3>
          <p class="post-card-excerpt">${escapeHtml(excerpt)}${data.content && data.content.length > 90 ? "…" : ""}</p>
          <div class="post-card-meta mono">
            <span>${escapeHtml(data.authorName || "익명")}</span>
            <span>${formatDate(data.createdAt)}</span>
          </div>
        </a>
      `;
    }).join("");

    grid.innerHTML = cardsHtml;
  } catch (err) {
    grid.innerHTML = "";
    emptyState.hidden = false;
    emptyState.querySelector("a")?.remove();
  }
});
