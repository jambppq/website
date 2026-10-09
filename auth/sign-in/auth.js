(function () {
  /* ---------- config ---------- */
  var API_URL = "";                    // e.g. "https://api.example.com" (empty = same origin)
  var SIGN_UP_PATH = "/auth/sign-up";  // POST { gmail, password }
  var SIGN_IN_PATH = "/auth/sign-in";  // POST { gmail, password }
  var FORGOT_PATH = "/auth/forgot-password"; // POST { gmail }   (assumed endpoint)
  var GOOGLE_PATH = "/auth/google";    // browser is sent here to start Google sign-in (assumed endpoint)
  var AFTER_SIGN_UP_URL = "signin.html";
  var AFTER_SIGN_IN_URL = "/app/";     // where to go once signed in
  var MIN_PASSWORD = 8;

  var GENERIC_ERROR = "Something went wrong. Please try again.";
  var NETWORK_ERROR = "Can't reach the server. Check your connection and try again.";

  function $(id) { return document.getElementById(id); }

  function setMsg(el, text, type) {
    if (!el) return;
    el.textContent = text || "";
    el.className = "msg" + (type ? " " + type : "");
  }

  function post(path, body) {
    return fetch(API_URL + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error(j.message || GENERIC_ERROR);
        return j;
      });
    });
  }

  function errorText(err) {
    return err instanceof TypeError ? NETWORK_ERROR : (err.message || GENERIC_ERROR);
  }

  /* Wires a form: build() returns {error} or {data}; onOk runs after a 2xx response */
  function wireForm(form, path, build, onOk) {
    if (!form) return;
    var msg = form.querySelector(".msg");
    var btn = form.querySelector("button[type=submit]");
    var label = btn.textContent;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var built = build();
      if (built.error) { setMsg(msg, built.error, "error"); return; }

      setMsg(msg, "");
      btn.disabled = true;
      btn.textContent = "Please wait…";

      post(path, built.data).then(function (res) {
        onOk(res, msg);
      }).catch(function (err) {
        setMsg(msg, errorText(err), "error");
        btn.disabled = false;
        btn.textContent = label;
      });
    });
  }

  function val(id) { return $(id).value.trim(); }

  /* ---------- show / hide password ---------- */
  document.querySelectorAll("[data-toggle]").forEach(function (t) {
    t.addEventListener("click", function () {
      var input = $(t.getAttribute("data-toggle"));
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      t.textContent = show ? "Hide" : "Show";
      t.setAttribute("aria-pressed", show);
    });
  });

  /* ---------- Google ---------- */
  document.querySelectorAll("[data-google]").forEach(function (b) {
    b.addEventListener("click", function () { window.location.href = API_URL + GOOGLE_PATH; });
  });

  /* ---------- sign up ---------- */
  wireForm($("signupForm"), SIGN_UP_PATH, function () {
    var pw = $("password").value;
    if (pw.length < MIN_PASSWORD) return { error: "Use at least " + MIN_PASSWORD + " characters for your password." };
    if (pw !== $("confirm").value) return { error: "The two passwords don't match." };
    return { data: { gmail: val("gmail"), password: pw } };
  }, function (res, msg) {
    setMsg(msg, "Account created. Taking you to sign in…", "success");
    setTimeout(function () { window.location.href = AFTER_SIGN_UP_URL; }, 1200);
  });

  /* ---------- sign in ---------- */
  wireForm($("signinForm"), SIGN_IN_PATH, function () {
    return { data: { gmail: val("gmail"), password: $("password").value } };
  }, function (res) {
    /* If your API returns a token in the body, store it here, e.g. res.token */
    window.location.href = AFTER_SIGN_IN_URL;
  });

  /* ---------- forgot-password pop-up ---------- */
  var modal = $("forgotModal");
  if (modal) {
    var openBtn = $("openForgot"), cancelBtn = $("forgotCancel");
    var forgotForm = $("forgotForm"), forgotInput = $("forgotGmail"), forgotMsg = $("forgotMsg");
    var sendBtn = $("forgotSend"), lastFocus = null;

    function openModal() {
      lastFocus = document.activeElement;
      var typed = $("gmail") ? $("gmail").value.trim() : "";
      if (typed && !forgotInput.value) forgotInput.value = typed;   // reuse what they already typed
      setMsg(forgotMsg, "");
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";
      modal.classList.add("open");
      document.body.classList.add("modal-open");
      setTimeout(function () { forgotInput.focus(); }, 0);
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.classList.remove("modal-open");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    openBtn.addEventListener("click", openModal);
    cancelBtn.addEventListener("click", closeModal);

    /* click outside: pointerdown (not click) so dragging a text selection out of the card doesn't close it */
    modal.addEventListener("pointerdown", function (e) { if (e.target === modal) closeModal(); });

    document.addEventListener("keydown", function (e) {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key === "Tab") {                                         // keep focus inside the pop-up
        var f = modal.querySelectorAll("input, button:not(:disabled)");
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    forgotForm.addEventListener("submit", function (e) {
      e.preventDefault();
      setMsg(forgotMsg, "");
      sendBtn.disabled = true;
      sendBtn.textContent = "Sending…";
      post(FORGOT_PATH, { gmail: forgotInput.value.trim() }).then(function () {
        setMsg(forgotMsg, "If that Gmail has an account, a reset link is on its way.", "success");
        sendBtn.textContent = "Sent";
      }).catch(function (err) {
        setMsg(forgotMsg, errorText(err), "error");
        sendBtn.disabled = false;
        sendBtn.textContent = "Send";
      });
    });
  }
})();