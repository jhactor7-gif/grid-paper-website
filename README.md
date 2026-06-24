# 원고지 — 회원가입 & 글쓰기 블로그

Flask + Firebase(Auth/Firestore)로 만든 작은 블로그입니다.
회원가입 / 로그인 후 글을 쓰고, 누구나 글 목록과 본문을 읽을 수 있어요.
Vercel에 그대로 배포할 수 있도록 구성되어 있습니다.

## 폴더 구조

```
blog-app/
├── app.py                  # Flask 서버 (페이지 라우팅)
├── requirements.txt
├── vercel.json              # Vercel 배포 설정
├── firestore.rules          # Firestore 보안 규칙
├── templates/
│   ├── base.html             # 공통 레이아웃, 내비게이션, Firebase 초기화
│   ├── index.html            # 홈 (글 목록)
│   ├── login.html
│   ├── signup.html
│   ├── write.html            # 글쓰기 (로그인 필요)
│   └── post.html             # 글 상세
└── static/
    ├── css/style.css         # 반응형 디자인 (원고지 모티프)
    └── js/
        ├── fb-utils.js
        ├── login.js
        ├── signup.js
        ├── write.js
        ├── posts-list.js
        └── post-detail.js
```

## 1. Firebase 프로젝트 만들기

1. https://console.firebase.google.com 에서 새 프로젝트 생성
2. **Authentication → 시작하기 → 로그인 방법 → 이메일/비밀번호** 사용 설정
3. **Firestore Database → 데이터베이스 만들기** (프로덕션 모드로 시작해도 OK,
   이후 `firestore.rules` 내용을 콘솔의 **Firestore → 규칙** 탭에 그대로 붙여넣기)
4. **프로젝트 설정(⚙) → 일반 → 내 앱 → 웹 앱 추가(</>)** 로 웹 앱 등록
5. 발급되는 설정값(apiKey, authDomain, projectId, storageBucket,
   messagingSenderId, appId)을 복사해두세요. 이 값들은 브라우저에 노출되는
   **공개 클라이언트 키**라 안전하게 환경변수로 넣어도 됩니다.

## 2. 로컬에서 실행하기

```bash
cd blog-app
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

export FIREBASE_API_KEY="..."
export FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
export FIREBASE_PROJECT_ID="your-project"
export FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
export FIREBASE_MESSAGING_SENDER_ID="..."
export FIREBASE_APP_ID="..."

python app.py
# http://127.0.0.1:5000 접속
```

(Windows PowerShell에서는 `export` 대신 `$env:FIREBASE_API_KEY="..."` 사용)

## 3. GitHub에 올리기

```bash
cd blog-app
git init
git add .
git commit -m "원고지 블로그 초기 커밋"
git branch -M main
git remote add origin https://github.com/<your-id>/<repo-name>.git
git push -u origin main
```

## 4. Vercel에 배포하기

1. https://vercel.com → **Add New → Project** → 위에서 만든 GitHub 저장소 선택
2. Framework Preset은 자동 감지되지 않으면 **Other** 선택 (vercel.json이
   Python 빌드를 지정합니다)
3. **Environment Variables** 에 아래 6개를 추가:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
4. **Deploy** 클릭
5. 배포가 끝나면 Firebase 콘솔의 **Authentication → Settings → 승인된 도메인**에
   Vercel이 발급한 도메인(예: `your-app.vercel.app`)을 추가해주세요.
   (추가하지 않으면 로그인/회원가입 시 도메인 인증 오류가 발생합니다.)

## 기능 요약

- **회원가입 / 로그인 / 로그아웃** — Firebase Authentication (이메일+비밀번호)
- **글쓰기** — 로그인한 사용자만 작성 가능, Firestore `posts` 컬렉션에 저장
- **글 목록 / 글 상세** — 비로그인 사용자도 열람 가능
- **모바일 반응형** — 360px부터 데스크탑까지 자연스럽게 확장되는 그리드/타이포
- 디자인 모티프: 한국 원고지(manuscript paper)의 격자와 빨간 교정펜 색

## 커스터마이징 팁

- `static/css/style.css` 최상단 `:root` 변수만 바꿔도 전체 색감을 바꿀 수 있어요.
- 글에 이미지/카테고리/좋아요 등을 추가하려면 `write.js`의 `addDoc` 호출과
  `post-detail.js` / `posts-list.js`의 렌더링 부분을 함께 확장하면 됩니다.
