document.addEventListener("DOMContentLoaded", function () {
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const registerBtn = document.getElementById("button-register");
  
    const errorMessages = {
      name: document.getElementById("name-none"),
      emailNone: document.getElementById("email-none"),
      emailInvalid: document.getElementById("invalid-email"),
      emailExist: document.getElementById("exist-email"),
      passwordNone: document.getElementById("password-none"),
      passwordInvalid: document.getElementById("invalid-password"),
      confirmNone: document.getElementById("password-check-none"),
      confirmInvalid: document.getElementById("invalid-cf-password"),
    };
  
    const hideAllErrors = () => {
      Object.values(errorMessages).forEach(msg => msg.classList.add("hidden"));
    };
  
    const isValidEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
  
    const isEmailExist = (email) => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      return users.some(user => user.email === email);
    };
  
    registerBtn.addEventListener("click", function (e) {
      e.preventDefault();
      hideAllErrors();
  
      const fullName = fullNameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
  
      let isValid = true;
  
      if (fullName === "") {
        errorMessages.name.classList.remove("hidden");
        isValid = false;
      }
  
      if (email === "") {
        errorMessages.emailNone.classList.remove("hidden");
        isValid = false;
      } else if (!isValidEmail(email)) {
        errorMessages.emailInvalid.classList.remove("hidden");
        isValid = false;
      } else if (isEmailExist(email)) {
        errorMessages.emailExist.classList.remove("hidden");
        isValid = false;
      }
  
      if (password === "") {
        errorMessages.passwordNone.classList.remove("hidden");
        isValid = false;
      } else if (password.length < 8) {
        errorMessages.passwordInvalid.classList.remove("hidden");
        isValid = false;
      }
  
      if (confirmPassword === "") {
        errorMessages.confirmNone.classList.remove("hidden");
        isValid = false;
      } else if (confirmPassword !== password) {
        errorMessages.confirmInvalid.classList.remove("hidden");
        isValid = false;
      }
  
      if (isValid) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push({ fullName, email, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Đăng ký thành công!");
        window.location.href = "http://127.0.0.1:5500/pages/login.html";
      }
    });
  });
  