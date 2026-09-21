/* =====================================================================
   api/gemini.js — 면접 연습 프로그램의 중계 서버 (Vercel판)

   Cloudflare Workers는 접속자와 가까운 데이터센터에서 실행되는 탓에
   "User location is not supported"로 막히는 일이 있습니다.
   Vercel은 함수가 도는 지역이 고정되어 있어 그 문제가 없습니다.

   Vercel 대시보드 Settings → Environment Variables 에 넣을 값
     GEMINI_API_KEY   선생님의 Gemini API 키
     CLASS_CODE       학생에게 알려줄 접속 코드
     ALLOW_ORIGIN     허용할 주소. 쉼표로 여러 개 가능
                      예) https://nanadoro-web.github.io
   ===================================================================== */

const 허용모델 = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash"
];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const 허용 = String(process.env.ALLOW_ORIGIN || "")
    .split(",").map(v => v.trim().replace(/\/+$/, "")).filter(Boolean);

  const 통과주소 = (!허용.length) ? (origin || "*")
                : (허용.includes(origin) ? origin : 허용[0]);

  res.setHeader("Access-Control-Allow-Origin", 통과주소);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Class-Code");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET")
    return res.status(200).json({
      ok: true,
      안내: "면접 연습 중계 서버입니다. (Vercel)",
      점검: {
        키설정됨: !!process.env.GEMINI_API_KEY,
        코드설정됨: !!process.env.CLASS_CODE,
        허용주소: 허용.length ? 허용 : "제한 없음",
        지역: process.env.VERCEL_REGION || "알 수 없음"
      }
    });

  if (req.method !== "POST")
    return res.status(405).json({ error: "POST만 받습니다." });

  if (허용.length && origin && !허용.includes(origin))
    return res.status(403).json({ error: "허용되지 않은 주소입니다.", 원인: "주소" });

  const 코드 = req.headers["x-class-code"] || "";
  if (!process.env.CLASS_CODE || 코드 !== process.env.CLASS_CODE)
    return res.status(401).json({
      error: "접속 코드가 올바르지 않습니다. 선생님께 받은 코드를 확인하세요.",
      원인: "접속코드"
    });

  if (!process.env.GEMINI_API_KEY)
    return res.status(500).json({ error: "서버에 API 키가 설정되지 않았습니다." });

  const body = req.body || {};
  const model = String(body.model || "");
  if (!허용모델.includes(model))
    return res.status(400).json({ error: "쓸 수 없는 모델입니다: " + model });

  const url = "https://generativelanguage.googleapis.com/v1beta/models/"
            + encodeURIComponent(model) + ":generateContent";

  let upstream;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: body.contents,
        generationConfig: body.generationConfig
      })
    });
  } catch {
    return res.status(502).json({ error: "Gemini에 닿지 못했습니다." });
  }

  const 내용 = await upstream.text();

  if (!upstream.ok) {
    let 속 = null;
    try { 속 = JSON.parse(내용); } catch {}
    const 말 = (속 && 속.error && (속.error.message || 속.error))
            || (내용 ? String(내용).slice(0, 300) : "")
            || ("본문 없이 " + upstream.status + " 로 막혔습니다.");
    return res.status(upstream.status).json({
      error: String(말),
      원인: "위쪽",
      거친곳: "구글 직접",
      지역: process.env.VERCEL_REGION || ""
    });
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(200).send(내용);
}
