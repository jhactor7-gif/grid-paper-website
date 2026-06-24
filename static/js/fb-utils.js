// Small shared helpers used by every page script.

export function onFbReady(callback) {
  if (window.__fb) {
    callback(window.__fb);
  } else {
    window.addEventListener("fbready", () => callback(window.__fb), { once: true });
  }
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function authErrorMessage(code) {
  const map = {
    "auth/invalid-email": "이메일 형식이 올바르지 않아요.",
    "auth/user-not-found": "등록되지 않은 이메일이에요.",
    "auth/wrong-password": "비밀번호가 일치하지 않아요.",
    "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않아요.",
    "auth/email-already-in-use": "이미 가입된 이메일이에요.",
    "auth/weak-password": "비밀번호는 6자 이상이어야 해요.",
    "auth/network-request-failed": "네트워크 연결을 확인해주세요.",
  };
  return map[code] || "문제가 발생했어요. 다시 시도해주세요.";
}
