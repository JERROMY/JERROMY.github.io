/* ============================================================
   密碼門檻模組（選用）— 簡報需要密碼時才加
   ------------------------------------------------------------
   用法：把本檔複製進 deck 資料夾（self-contained，不要用 ../），在 <head> 最前面加：
     <script src="gate.js" data-key="專案代號" data-hash="SHA-256 雜湊" data-note="提示文字（可省略）"></script>
   雜湊 = sha256("<data-key>:<密碼>")，產生方式：
     python3 -c "import hashlib;print(hashlib.sha256('<data-key>:<密碼>'.encode()).hexdigest())"
   - 放在 <head> 同步執行：未解鎖前整頁內容不會閃現；解鎖狀態記在 sessionStorage（同一分頁重新整理不用再輸入）。
   - 未解鎖時攔下頁面的鍵盤／點擊（不會翻頁），列印出來是空白。
   - 產 PDF／pptx 的流程（_build/htmlcap.py、_build/printpdf.py）會注入 CSS 略過門檻。
   ⚠ 這是前端遮擋，不是加密：原始檔、直接輸入 PDF／PPT 網址都拿得到內容。要真正保密請放私有空間或有伺服器驗證的主機。
   ============================================================ */
(function () {
  var me = document.currentScript;
  var KEY = (me && me.getAttribute("data-key")) || "deck";
  var HASH = ((me && me.getAttribute("data-hash")) || "").toLowerCase();
  var NOTE = (me && me.getAttribute("data-note")) || "這份簡報需要密碼才能瀏覽。";
  var SKEY = "gate:" + KEY, root = document.documentElement;
  try { if (sessionStorage.getItem(SKEY) === HASH && HASH) return; } catch (e) {}
  root.classList.add("locked");

  var css = document.createElement("style");
  css.textContent =
    "html.locked body>*:not(#nx-gate){visibility:hidden!important}" +
    "#nx-gate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;" +
    "background:radial-gradient(120% 90% at 78% 8%,rgba(142,123,196,.28) 0%,rgba(7,7,12,0) 62%),var(--nx-void,#07070C);" +
    "font-family:var(--font-sans,'Hanken Grotesk','Noto Sans TC',system-ui,sans-serif)}" +
    "html:not(.locked) #nx-gate{display:none}" +
    "#nx-gate .gbox{width:min(420px,100%);border:1px solid var(--border-default,rgba(244,246,251,.13));border-radius:16px;background:rgba(24,24,38,.72);padding:30px 30px 24px}" +
    "#nx-gate .gey{font-family:var(--font-mono,'Space Mono',monospace);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--nx-lime,#C8F250);display:flex;align-items:center;gap:8px}" +
    "#nx-gate .gey::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor}" +
    "#nx-gate .gt{font-family:var(--font-display,'Hanken Grotesk','Noto Sans TC',sans-serif);font-weight:300;font-size:30px;color:var(--text-strong,#F4F6FB);margin-top:16px}" +
    "#nx-gate .gs{font-size:14px;color:var(--text-muted,#6B7186);line-height:1.6;margin:8px 0 0}" +
    "#nx-gate form{display:flex;gap:10px;margin-top:20px}" +
    "#nx-gate input{flex:1;min-width:0;background:rgba(7,7,12,.6);border:1px solid var(--border-strong,rgba(244,246,251,.26));border-radius:8px;padding:11px 14px;" +
    "font-family:var(--font-mono,'Space Mono',monospace);font-size:16px;letter-spacing:.3em;color:var(--text-strong,#F4F6FB);outline:none}" +
    "#nx-gate input:focus{border-color:var(--nx-rose,#F4A6C8);box-shadow:0 0 0 3px rgba(244,166,200,.18)}" +
    "#nx-gate button{background:var(--nx-rose,#F4A6C8);color:var(--nx-void,#07070C);border:0;border-radius:8px;padding:0 20px;font:inherit;font-size:15px;font-weight:500;cursor:pointer}" +
    "#nx-gate button:hover{background:var(--nx-rose-bright,#FF8CC0)}" +
    "#nx-gate .ge{min-height:20px;margin-top:10px;font-size:13px;color:var(--nx-danger,#FF6B7D)}" +
    "@media print{#nx-gate{display:none!important}}";
  document.head.appendChild(css);

  // 未解鎖時攔下頁面其他地方的鍵盤／點擊（捕獲階段，早於 deck 的翻頁邏輯）
  ["keydown", "pointerup", "click", "wheel", "touchstart"].forEach(function (t) {
    window.addEventListener(t, function (e) {
      if (!root.classList.contains("locked")) return;
      var g = document.getElementById("nx-gate");
      if (g && g.contains(e.target)) return;
      e.stopImmediatePropagation();
    }, true);
  });

  function sha256(s) { // 精簡 SHA-256（ASCII），不依賴 crypto.subtle，http／file:// 也能用
    var rot = function (v, a) { return (v >>> a) | (v << (32 - a)); }, mp = Math.pow, mw = mp(2, 32), i, j, out = "", w = [], bl = s.length * 8, h = [], k = [], pc = 0, isC = {};
    for (var c = 2; pc < 64; c++) { if (!isC[c]) { for (i = 0; i < 313; i += c) isC[i] = c; h[pc] = (mp(c, .5) * mw) | 0; k[pc++] = (mp(c, 1 / 3) * mw) | 0; } }
    s += "\x80"; while (s.length % 64 - 56) s += "\x00";
    for (i = 0; i < s.length; i++) { j = s.charCodeAt(i); if (j >> 8) return ""; w[i >> 2] |= j << ((3 - i) % 4) * 8; }
    w[w.length] = ((bl / mw) | 0); w[w.length] = bl; h = h.slice(0, 8);
    for (j = 0; j < w.length;) {
      var x = w.slice(j, j += 16), o = h; h = h.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var a = x[i - 15], b = x[i - 2], A = h[0], E = h[4];
        var t1 = h[7] + (rot(E, 6) ^ rot(E, 11) ^ rot(E, 25)) + ((E & h[5]) ^ ((~E) & h[6])) + k[i] + (x[i] = (i < 16) ? x[i] : (x[i - 16] + (rot(a, 7) ^ rot(a, 18) ^ (a >>> 3)) + x[i - 7] + (rot(b, 17) ^ rot(b, 19) ^ (b >>> 10))) | 0);
        var t2 = (rot(A, 2) ^ rot(A, 13) ^ rot(A, 22)) + ((A & h[1]) ^ (A & h[2]) ^ (h[1] & h[2]));
        h = [(t1 + t2) | 0].concat(h); h[4] = (h[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) h[i] = (h[i] + o[i]) | 0;
    }
    for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var y = (h[i] >> (j * 8)) & 255; out += ((y < 16) ? 0 : "") + y.toString(16); }
    return out;
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function mount() {
    var title = (document.title || "").split("·")[0].trim() || "PROTECTED";
    var g = document.createElement("div");
    g.id = "nx-gate"; g.setAttribute("role", "dialog"); g.setAttribute("aria-modal", "true"); g.setAttribute("aria-labelledby", "nx-gate-t");
    g.innerHTML = '<div class="gbox"><div class="gey">' + esc(title) + '</div><div class="gt" id="nx-gate-t">請輸入密碼</div>' +
      '<p class="gs">' + esc(NOTE) + '</p><form autocomplete="off"><input type="password" inputmode="numeric" aria-label="密碼" placeholder="密碼" />' +
      '<button type="submit">進入</button></form><div class="ge" aria-live="polite"></div></div>';
    document.body.appendChild(g);
    // 門檻內的鍵盤／點擊不要再往上傳到 deck 的翻頁邏輯（不擋預設動作，照常打字、送出）
    ["keydown", "pointerup", "click", "wheel", "touchstart"].forEach(function (t) { g.addEventListener(t, function (e) { e.stopPropagation(); }); });
    var f = g.querySelector("form"), inp = g.querySelector("input"), err = g.querySelector(".ge");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (HASH && sha256(KEY + ":" + inp.value.trim()) === HASH) {
        try { sessionStorage.setItem(SKEY, HASH); } catch (x) {}
        err.textContent = ""; root.classList.remove("locked");
        if (window.dispatchEvent) window.dispatchEvent(new Event("resize"));
      } else { err.textContent = "密碼不正確，請再試一次。"; inp.select(); }
    });
    setTimeout(function () { inp.focus(); }, 50);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
