/* =====================================================================
   config.js — 이 파일만 한 번 고치면 됩니다.

   index.html 이 새 판으로 바뀌어도 이 파일은 그대로 두세요.
   앞으로 index.html 을 다시 받아 올리셔도 여기만 살아 있으면 설정이 유지됩니다.
   ===================================================================== */

window.면접설정 = {

  /* 중계 서버 주소.
     Vercel 이면 끝에 /api/gemini 까지 붙입니다.
       예) "https://interview-chi-seven.vercel.app/api/gemini"
     Cloudflare Workers 면 주소만 적습니다.
       예) "https://interview-proxy.아이디.workers.dev"

     비워 두면 학생이 각자 자기 Gemini API 키를 넣는 방식으로 동작합니다. */
  중계서버: "https://interview-chi-seven.vercel.app/api/gemini"

};
