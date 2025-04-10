document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login-btn");
  
    const errorMessages = {
      emailNone: document.getElementById("email-none"),
      emailInvalid: document.getElementById("invalid-email"),
      emailError: document.getElementById("email-error"),
      passwordNone: document.getElementById("password-none"),
      passwordError: document.getElementById("password-error"),
    };
  
    const hideAllErrors = () => {
      Object.values(errorMessages).forEach(msg => msg.classList.add("hidden"));
    };
  
    const isValidEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
  
    const findUserByEmail = (email) => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      return users.find(user => user.email === email);
    };
  
    loginBtn.addEventListener("click", function () {
      hideAllErrors();
  
      const email = emailInput.value.trim();
      const password = passwordInput.value;
  
      let isValid = true;
  
      if (email === "") {
        errorMessages.emailNone.classList.remove("hidden");
        isValid = false;
      } else if (!isValidEmail(email)) {
        errorMessages.emailInvalid.classList.remove("hidden");
        isValid = false;
      }
  
      const user = findUserByEmail(email);
  
      if (!user && email !== "") {
        errorMessages.emailError.classList.remove("hidden");
        isValid = false;
      }
  
      if (password === "") {
        errorMessages.passwordNone.classList.remove("hidden");
        isValid = false;
      } else if (user && user.password !== password) {
        errorMessages.passwordError.classList.remove("hidden");
        isValid = false;
      }
  
      if (isValid && user) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "/pages/dashboard.html";
      }
      
    });
  });
  