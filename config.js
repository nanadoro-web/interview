/* =====================================================================
   config.js — 이 파일만 한 번 고치면 됩니다.

   index.html 이 새 판으로 바뀌어도 이 파일은 그대로 두세요.
   앞으로 index.html 을 다시 받아 올리셔도 여기만 살아 있으면 설정이 유지됩니다.
   ===================================================================== */

window.면접설정 = {

  /* 중계 서버 주소. 쓰시는 쪽 한 줄만 넣으시면 됩니다.

     Apps Script  — 끝이 /exec 입니다. (권장: 지역 차단이 없고 학교망에서 잘 열립니다)
       예) "https://script.google.com/macros/s/AKfycb…/exec"

     Vercel       — 끝에 /api/gemini 까지 붙입니다.
       예) "https://interview-chi-seven.vercel.app/api/gemini"

     Cloudflare   — 주소만 적습니다.
       예) "https://interview-proxy.아이디.workers.dev"

     주소 모양을 보고 알아서 맞춰 부르니 따로 고를 것은 없습니다.
     비워 두면 학생이 각자 자기 Gemini API 키를 넣는 방식으로 동작합니다. */
  중계서버: "https://script.google.com/macros/s/AKfycby1jYt-3oYnuMhdXAdWv6_UAN2gpgN9n7PJ76ZRqngYgvmoay7kEDW8YmVzKldJ3WuO/exec"

};
