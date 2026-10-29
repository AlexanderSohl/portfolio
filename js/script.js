const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const year = document.querySelector("#current-year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (menuButton && navigation) {
  const setMenuOpen = (isOpen) => {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
    navigation.classList.toggle("is-open", isOpen);
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  window.matchMedia("(min-width: 44.001rem)").addEventListener("change", () => {
    setMenuOpen(false);
  });
}

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const nameField = contactForm.elements.namedItem("name");
  const emailField = contactForm.elements.namedItem("email");
  const messageField = contactForm.elements.namedItem("message");
  const formStatus = document.querySelector("#form-status");
  const recipientLink = document.querySelector("#contact-email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let hasSubmitted = false;

  const setFieldError = (field, message) => {
    const error = document.querySelector(`#${field.getAttribute("aria-describedby")}`);
    field.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
  };

  const validateForm = () => {
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    setFieldError(nameField, name ? "" : "Please enter your name.");
    setFieldError(
      emailField,
      !email
        ? "Please enter your email address."
        : emailPattern.test(email)
          ? ""
          : "Please enter a valid email address."
    );
    setFieldError(
      messageField,
      !message
        ? "Please enter a message."
        : message.length >= 10
          ? ""
          : "Your message must be at least 10 characters."
    );

    return {
      isValid: Boolean(name && emailPattern.test(email) && message.length >= 10),
      name,
      email,
      message
    };
  };

  contactForm.addEventListener("input", (event) => {
    if (event.target.matches("input, textarea")) {
      formStatus.textContent = "";
      if (hasSubmitted) {
        validateForm();
      }
    }
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hasSubmitted = true;
    const result = validateForm();

    if (!result.isValid) {
      formStatus.textContent = "Please correct the highlighted fields.";
      contactForm.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    const recipient = recipientLink.getAttribute("href").replace(/^mailto:/i, "");
    if (!recipient || recipient === "YOUR_EMAIL_HERE") {
      formStatus.textContent = "The contact email has not been added to this page yet.";
      recipientLink.focus();
      return;
    }

    const subject = `Portfolio message from ${result.name}`;
    const body = `From: ${result.name} (${result.email})\n\n${result.message}`;
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formStatus.textContent = "Your email app should open with your message ready to send.";
    window.location.href = mailto;
  });
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const images = Array.from(carousel.querySelectorAll(".carousel-image-stage img"));
  const previousButton = carousel.querySelector("[data-previous]");
  const nextButton = carousel.querySelector("[data-next]");
  const counter = carousel.querySelector("[data-counter]");

  if (images.length < 2 || !previousButton || !nextButton || !counter) {
    return;
  }

  let currentIndex = 0;

  const showImage = (index) => {
    currentIndex = (index + images.length) % images.length;
    images.forEach((image, imageIndex) => {
      image.hidden = imageIndex !== currentIndex;
    });
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
  };

  previousButton.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  showImage(currentIndex);
});
