(function () {
  var form = document.getElementById("lookup-form");
  var emailInput = document.getElementById("ol-email");
  var codeInput = document.getElementById("ol-code");
  var emailErr = document.getElementById("ol-email-error");
  var codeErr = document.getElementById("ol-code-error");
  var btn = form.querySelector(".ol-btn");

  function setLoading(isLoading) {
    if (isLoading) btn.classList.add("loading");
    else btn.classList.remove("loading");
  }

  function validateEmail(value) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(String(value).toLowerCase());
  }

  function validate() {
    var ok = true;
    emailErr.textContent = "";
    codeErr.textContent = "";

    var email = (emailInput.value || "").trim();
    var code = (codeInput.value || "").trim();

    if (!email) {
      emailErr.textContent = "Vui lòng nhập email.";
      ok = false;
    } else if (!validateEmail(email)) {
      emailErr.textContent = "Email chưa đúng định dạng.";
      ok = false;
    }

    if (!code) {
      codeErr.textContent = "Vui lòng nhập mã đơn hàng.";
      ok = false;
    } else if (code.length < 4) {
      codeErr.textContent = "Mã đơn tối thiểu 4 ký tự.";
      ok = false;
    }
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
  });
})();
