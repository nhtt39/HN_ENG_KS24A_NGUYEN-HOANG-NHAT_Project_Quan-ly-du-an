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

  if (!localStorage.getItem("users")) {
      const defaultUsers = [
          {
              id: "user1",
              fullName: "User One",
              email: "user1@example.com",
              password: "password123"
          }
      ];
      localStorage.setItem("users", JSON.stringify(defaultUsers));

      const defaultProjects = [
          {
              name: "Dự án mẫu 1",
              desc: "Mô tả dự án mẫu 1",
              userId: "user1"
          },
          {
              name: "Dự án mẫu 2",
              desc: "Mô tả dự án mẫu 2",
              userId: "user1"
          }
      ];
      localStorage.setItem("projects", JSON.stringify(defaultProjects));
  }

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
          const newUser = {
              id: "user" + (users.length + 1),
              fullName,
              email,
              password
          };
          users.push(newUser);
          localStorage.setItem("users", JSON.stringify(users));
          alert("Đăng ký thành công!");
          window.location.href = "/pages/login.html";
      }
  });
});