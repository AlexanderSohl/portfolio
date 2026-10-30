const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const year = document.querySelector("#current-year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const pageScrollProgress = document.querySelector(".scroll-progress__fill");

if (pageScrollProgress) {
  let progressFrame = 0;
  const updatePageScrollProgress = () => {
    if (progressFrame) {
      return;
    }
    progressFrame = window.requestAnimationFrame(() => {
      progressFrame = 0;
      const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableDistance > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableDistance)) : 0;
      pageScrollProgress.style.transform = `scaleX(${progress})`;
    });
  };

  window.addEventListener("scroll", updatePageScrollProgress, { passive: true });
  window.addEventListener("resize", updatePageScrollProgress, { passive: true });
  updatePageScrollProgress();
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

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let ambientCanvas = null;
let ambientContext = null;
let ambientParticles = [];
let ambientFrame = 0;
let ambientWidth = 0;
let ambientHeight = 0;
let previousFrameTime = 0;
let pointerPosition = null;

const resizeAmbientCanvas = () => {
  if (!ambientCanvas || !ambientContext) {
    return;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  ambientWidth = window.innerWidth;
  ambientHeight = window.innerHeight;
  ambientCanvas.width = Math.round(ambientWidth * pixelRatio);
  ambientCanvas.height = Math.round(ambientHeight * pixelRatio);
  ambientContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
};

const makeAmbientParticle = (randomY = true) => {
  const isEmber = Math.random() < 0.34;
  return {
    x: Math.random() * ambientWidth,
    y: randomY ? Math.random() * ambientHeight : ambientHeight + 8,
    radius: isEmber ? 0.8 + Math.random() * 1.2 : 0.45 + Math.random() * 0.85,
    rise: isEmber ? 0.18 + Math.random() * 0.38 : 0.015 + Math.random() * 0.07,
    drift: (Math.random() - 0.5) * (isEmber ? 0.22 : 0.34),
    phase: Math.random() * Math.PI * 2,
    opacity: isEmber ? 0.18 + Math.random() * 0.3 : 0.08 + Math.random() * 0.14,
    isEmber
  };
};

const drawAmbientParticles = (time) => {
  if (!ambientCanvas || !ambientContext || document.hidden || reducedMotionQuery.matches) {
    ambientFrame = 0;
    return;
  }

  const delta = previousFrameTime ? Math.min((time - previousFrameTime) / 16.67, 2) : 1;
  previousFrameTime = time;
  ambientContext.clearRect(0, 0, ambientWidth, ambientHeight);

  ambientParticles.forEach((particle) => {
    particle.x += (particle.drift + Math.sin(time * 0.00045 + particle.phase) * 0.12) * delta;
    particle.y -= particle.rise * delta;

    if (pointerPosition) {
      const dx = particle.x - pointerPosition.x;
      const dy = particle.y - pointerPosition.y;
      const distance = Math.hypot(dx, dy);
      const influenceRadius = 135;
      if (distance > 0 && distance < influenceRadius) {
        const force = ((influenceRadius - distance) / influenceRadius) * 0.22 * delta;
        particle.x += (dx / distance) * force;
        particle.y += (dy / distance) * force;
      }
    }

    if (particle.y < -8) {
      particle.y = ambientHeight + 8;
      particle.x = Math.random() * ambientWidth;
    }
    if (particle.x < -8) particle.x = ambientWidth + 8;
    if (particle.x > ambientWidth + 8) particle.x = -8;

    ambientContext.globalAlpha = particle.opacity;
    ambientContext.fillStyle = particle.isEmber ? "#ff4d5a" : "#a8a29e";
    ambientContext.shadowColor = particle.isEmber ? "#c1121f" : "transparent";
    ambientContext.shadowBlur = particle.isEmber ? 8 : 0;
    ambientContext.beginPath();
    ambientContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ambientContext.fill();
  });

  ambientContext.globalAlpha = 1;
  ambientContext.shadowBlur = 0;
  ambientFrame = window.requestAnimationFrame(drawAmbientParticles);
};

const resumeAmbientAnimation = () => {
  if (ambientCanvas && !document.hidden && !reducedMotionQuery.matches && !ambientFrame) {
    previousFrameTime = 0;
    ambientFrame = window.requestAnimationFrame(drawAmbientParticles);
  }
};

const pauseAmbientAnimation = () => {
  if (ambientFrame) {
    window.cancelAnimationFrame(ambientFrame);
    ambientFrame = 0;
  }
};

const onPointerMove = (event) => {
  if (event.pointerType === "mouse" || event.pointerType === "pen") {
    pointerPosition = { x: event.clientX, y: event.clientY };
  }
};

const startAmbientBackground = () => {
  if (ambientCanvas || reducedMotionQuery.matches) {
    return;
  }

  ambientCanvas = document.createElement("canvas");
  ambientCanvas.className = "ambient-canvas";
  ambientCanvas.setAttribute("aria-hidden", "true");
  ambientContext = ambientCanvas.getContext("2d", { alpha: true });

  if (!ambientContext) {
    ambientCanvas.remove();
    ambientCanvas = null;
    return;
  }

  document.body.prepend(ambientCanvas);
  resizeAmbientCanvas();
  const particleCount = Math.min(95, Math.max(40, Math.floor((ambientWidth * ambientHeight) / 19000)));
  ambientParticles = Array.from({ length: particleCount }, () => makeAmbientParticle());
  window.addEventListener("resize", resizeAmbientCanvas, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("visibilitychange", onAmbientVisibilityChange);
  resumeAmbientAnimation();
};

const stopAmbientBackground = () => {
  pauseAmbientAnimation();
  window.removeEventListener("resize", resizeAmbientCanvas);
  window.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("visibilitychange", onAmbientVisibilityChange);
  if (ambientCanvas) {
    ambientCanvas.remove();
  }
  ambientCanvas = null;
  ambientContext = null;
  ambientParticles = [];
  pointerPosition = null;
};

function onAmbientVisibilityChange() {
  if (document.hidden) {
    pauseAmbientAnimation();
  } else {
    resumeAmbientAnimation();
  }
}

reducedMotionQuery.addEventListener("change", () => {
  if (reducedMotionQuery.matches) {
    stopAmbientBackground();
  } else {
    startAmbientBackground();
  }
});

startAmbientBackground();

const typewriterElement = document.querySelector("[data-typewriter]");

if (typewriterElement) {
  const typewriterPhrases = [
    "I build games.",
    "I test software.",
    "I write C#, Java, and JavaScript.",
    "I’m an SDET student at NJIT."
  ];
  let phraseIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;
  let typewriterTimer = 0;

  const typeNextCharacter = () => {
    if (reducedMotionQuery.matches) {
      typewriterElement.textContent = typewriterPhrases[0];
      return;
    }

    const phrase = typewriterPhrases[phraseIndex];
    let delay = 82;

    if (isDeleting) {
      if (characterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
        delay = 260;
      } else {
        characterIndex -= 1;
        typewriterElement.textContent = phrase.slice(0, characterIndex);
        delay = 42;
      }
    } else if (characterIndex < phrase.length) {
      characterIndex += 1;
      typewriterElement.textContent = phrase.slice(0, characterIndex);
    } else {
      isDeleting = true;
      delay = 1350;
    }

    typewriterTimer = window.setTimeout(typeNextCharacter, delay);
  };

  const applyMotionPreference = () => {
    window.clearTimeout(typewriterTimer);
    if (reducedMotionQuery.matches) {
      phraseIndex = 0;
      characterIndex = typewriterPhrases[0].length;
      isDeleting = false;
      typewriterElement.textContent = typewriterPhrases[0];
      return;
    }

    phraseIndex = 0;
    characterIndex = 0;
    isDeleting = false;
    typewriterElement.textContent = "";
    typewriterTimer = window.setTimeout(typeNextCharacter, 250);
  };

  reducedMotionQuery.addEventListener("change", applyMotionPreference);
  applyMotionPreference();
}

const storyChapters = Array.from(document.querySelectorAll("[data-story-chapter]"));
let storyStepObserver = null;
let roverProgressFrame = 0;
let roverProgressUpdate = null;
let storyObserverResizeHandler = null;

const clearStorytelling = () => {
  storyStepObserver?.disconnect();
  storyStepObserver = null;
  if (roverProgressUpdate) {
    window.removeEventListener("scroll", roverProgressUpdate);
    window.removeEventListener("resize", roverProgressUpdate);
  }
  if (storyObserverResizeHandler) {
    window.removeEventListener("resize", storyObserverResizeHandler);
    storyObserverResizeHandler = null;
  }
  if (roverProgressFrame) {
    window.cancelAnimationFrame(roverProgressFrame);
    roverProgressFrame = 0;
  }
  roverProgressUpdate = null;

  storyChapters.forEach((chapter) => {
    chapter.classList.remove("is-scrollytelling");
    chapter.querySelector(".chapter-visual")?.remove();
    chapter.querySelectorAll(".story-image-fallback").forEach((figure) => {
      figure.removeAttribute("aria-hidden");
    });
    chapter.querySelectorAll("[data-story-step]").forEach((step) => {
      step.classList.remove("is-active");
      step.removeAttribute("aria-current");
    });
  });
};

const enhanceStorytelling = () => {
  clearStorytelling();
  if (reducedMotionQuery.matches || !("IntersectionObserver" in window) || !storyChapters.length) {
    return;
  }

  const activateStep = (chapter, step, markStepActive = true) => {
    const stepIndex = Number(step.dataset.imageIndex || 0);
    chapter.querySelectorAll("[data-story-step]").forEach((storyStep) => {
      const isActive = markStepActive && storyStep === step;
      storyStep.classList.toggle("is-active", isActive);
      if (isActive) {
        storyStep.setAttribute("aria-current", "step");
      } else {
        storyStep.removeAttribute("aria-current");
      }
    });
    const chapterVisual = chapter.querySelector(".chapter-visual");
    if (chapter.hasAttribute("data-title-panel")) {
      const panelName = chapterVisual?.querySelector("[data-panel-name]");
      const panelStep = Array.from(chapter.querySelectorAll("[data-story-step]")).indexOf(step);
      if (panelName) {
        panelName.textContent = step.dataset.panelLabel || step.querySelector("h2, h3")?.textContent || "";
        chapterVisual.dataset.progress = String(panelStep + 1);
      }
    } else {
      chapter.querySelectorAll(".chapter-visual [data-visual-index]").forEach((image) => {
        const isActive = Number(image.dataset.visualIndex) === stepIndex;
        image.classList.toggle("is-active", isActive);
        if (isActive) {
          image.removeAttribute("aria-hidden");
        } else {
          image.setAttribute("aria-hidden", "true");
        }
      });
    }
  };

  storyChapters.forEach((chapter) => {
    const layout = chapter.querySelector(".chapter-layout");
    const steps = Array.from(chapter.querySelectorAll("[data-story-step]"));
    if (!layout || !steps.length) {
      return;
    }

    const visual = document.createElement("figure");
    visual.className = chapter.hasAttribute("data-title-panel")
      ? "chapter-visual chapter-title-visual"
      : "chapter-visual";

    if (chapter.hasAttribute("data-title-panel")) {
      visual.setAttribute("aria-hidden", "true");
      const panelName = document.createElement("span");
      panelName.className = "pinned-chapter-name";
      panelName.setAttribute("data-panel-name", "");
      const progressTrack = document.createElement("span");
      progressTrack.className = "chapter-progress-track";
      const progressFill = document.createElement("span");
      progressFill.className = "chapter-progress-fill";
      progressTrack.append(progressFill);
      visual.append(panelName, progressTrack);
    } else {
      visual.setAttribute("aria-label", `${chapter.querySelector("h2")?.textContent || "Project"} project visual`);
    }

    if (!chapter.hasAttribute("data-title-panel")) {
      steps.forEach((step) => {
        const fallbackFigure = step.querySelector(".story-image-fallback");
        const media = fallbackFigure?.querySelector("img, svg");
        if (media) {
          const visualMedia = media.cloneNode(true);
          visualMedia.classList.add("chapter-visual-media");
          visualMedia.dataset.visualIndex = step.dataset.imageIndex || "0";
          visual.append(visualMedia);
          const caption = fallbackFigure.querySelector("figcaption");
          if (caption && !visual.querySelector("figcaption")) {
            visual.append(caption.cloneNode(true));
          }
        }
      });
    }

    layout.prepend(visual);
    chapter.classList.add("is-scrollytelling");
    activateStep(chapter, steps[0], false);

    if (chapter.hasAttribute("data-rover-chapter")) {
      const route = visual.querySelector("[data-rover-route]");
      const marker = visual.querySelector("[data-rover-marker]");
      if (route && marker) {
        const routeLength = route.getTotalLength();
        route.setAttribute("stroke-dasharray", String(routeLength));

        const updateProgress = () => {
          if (roverProgressFrame) {
            return;
          }
          roverProgressFrame = window.requestAnimationFrame(() => {
            roverProgressFrame = 0;
            const bounds = chapter.getBoundingClientRect();
            const travelDistance = Math.max(chapter.offsetHeight - window.innerHeight, 1);
            const progress = Math.min(1, Math.max(0, -bounds.top / travelDistance));
            route.setAttribute("stroke-dashoffset", String(routeLength * (1 - progress)));
            const position = route.getPointAtLength(routeLength * progress);
            marker.setAttribute("transform", `translate(${position.x} ${position.y})`);
          });
        };

        roverProgressUpdate = updateProgress;
        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress, { passive: true });
        updateProgress();
      }
    }
  });

  const observeStorySteps = () => {
    storyStepObserver?.disconnect();
    const centerOffset = Math.round(window.innerHeight * 0.42);
    storyStepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chapter = entry.target.closest("[data-story-chapter]");
          if (chapter) {
            activateStep(chapter, entry.target);
          }
        }
      });
    }, {
      threshold: 0,
      rootMargin: `-${centerOffset}px 0px -${centerOffset}px 0px`
    });

    storyChapters.forEach((chapter) => {
      chapter.querySelectorAll("[data-story-step]").forEach((step) => storyStepObserver.observe(step));
    });
  };

  observeStorySteps();
  storyObserverResizeHandler = observeStorySteps;
  window.addEventListener("resize", storyObserverResizeHandler, { passive: true });
};

reducedMotionQuery.addEventListener("change", enhanceStorytelling);
enhanceStorytelling();

const revealItems = Array.from(document.querySelectorAll("main section:not(.story-step), main article, .featured-card"));
let revealObserver = null;

const applyScrollRevealPreference = () => {
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }

  if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => {
      item.classList.remove("scroll-reveal", "is-revealed");
      delete item.dataset.revealOrder;
    });
    return;
  }

  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

  revealItems.forEach((item, index) => {
    item.classList.add("scroll-reveal");
    item.dataset.revealOrder = String(index % 4);

    if (!item.dataset.revealFocusBound) {
      item.addEventListener("focusin", () => {
        item.classList.add("is-revealed");
        revealObserver?.unobserve(item);
      });
      item.dataset.revealFocusBound = "true";
    }

    revealObserver.observe(item);
  });
};

reducedMotionQuery.addEventListener("change", applyScrollRevealPreference);
applyScrollRevealPreference();

const goob = document.createElement("div");
goob.className = "goob-wanderer";
goob.innerHTML = '<button class="goob-wanderer__button" type="button" aria-label="Say hi to a Goob"><span class="goob-wanderer__sprite" aria-hidden="true"></span></button><span class="goob-wanderer__bubble" role="status" aria-live="polite" hidden></span>';
document.body.append(goob);

const goobButton = goob.querySelector(".goob-wanderer__button");
const goobSprite = goob.querySelector(".goob-wanderer__sprite");
const goobBubble = goob.querySelector(".goob-wanderer__bubble");
const goobNames = ["Kipper", "Gunk", "Gizmo", "Bumble", "Tofu", "Drizzle", "Muffin", "Plop"];
const walkFrames = [1, 0, 2, 0];
let goobX = 0;
let goobDirection = 1;
let goobFrame = -1;
let goobLastTime = 0;
let goobFrameElapsed = 0;
let goobWait = 0;
let goobMoving = !reducedMotionQuery.matches;
let goobAnimation = 0;
let goobBubbleTimeout = 0;

const setGoobFrame = (frame) => {
  goobSprite.style.backgroundPosition = `-${frame * 96}px 0`;
  goobSprite.classList.toggle("is-facing-left", goobDirection < 0);
};

const positionGoob = () => {
  const maxX = Math.max(0, window.innerWidth - 96);
  goobX = Math.min(maxX, Math.max(0, goobX));
  goob.style.left = `${goobX}px`;
  goob.classList.toggle("goob-wanderer--near-right", goobX > maxX / 2);
};

const stopGoobLoop = () => {
  if (goobAnimation) {
    window.cancelAnimationFrame(goobAnimation);
    goobAnimation = 0;
  }
  goobLastTime = 0;
};

const startGoobLoop = () => {
  if (document.hidden || reducedMotionQuery.matches || goobAnimation) {
    return;
  }
  const tickGoob = (time) => {
    goobAnimation = 0;
    if (document.hidden || reducedMotionQuery.matches) {
      return;
    }
    const elapsed = goobLastTime ? Math.min((time - goobLastTime) / 1000, 0.1) : 0;
    goobLastTime = time;
    if (goobMoving) {
      goobX += goobDirection * 42 * elapsed;
      const maxX = Math.max(0, window.innerWidth - 96);
      if (goobX >= maxX || goobX <= 0) {
        goobX = Math.min(maxX, Math.max(0, goobX));
        goobDirection *= -1;
        goobWait = 0.45;
      }
      goobFrameElapsed += elapsed;
      if (goobFrameElapsed >= 0.125) {
        goobFrameElapsed %= 0.125;
        goobFrame = (goobFrame + 1) % walkFrames.length;
        setGoobFrame(walkFrames[goobFrame]);
      }
      if (goobWait > 0) {
        goobWait -= elapsed;
        if (goobWait <= 0) {
          goobMoving = false;
          goobWait = 2 + Math.random() * 2;
          setGoobFrame(0);
        }
      } else if (Math.random() < elapsed / 12) {
        goobMoving = false;
        goobWait = 2 + Math.random() * 2;
        setGoobFrame(0);
      }
      positionGoob();
    } else {
      goobWait -= elapsed;
      if (goobWait <= 0) {
        goobDirection = Math.random() < 0.5 ? -1 : 1;
        goobMoving = true;
        goobFrame = 0;
        goobFrameElapsed = 0;
        setGoobFrame(walkFrames[0]);
      }
    }
    goobAnimation = window.requestAnimationFrame(tickGoob);
  };
  goobAnimation = window.requestAnimationFrame(tickGoob);
};

goobButton.addEventListener("click", () => {
  const name = goobNames[Math.floor(Math.random() * goobNames.length)];
  goobBubble.textContent = `${name} says hi!`;
  goobBubble.hidden = false;
  goob.classList.remove("is-hopping");
  void goob.offsetWidth;
  goob.classList.add("is-hopping");
  window.clearTimeout(goobBubbleTimeout);
  goobBubbleTimeout = window.setTimeout(() => {
    goobBubble.hidden = true;
    goob.classList.remove("is-hopping");
  }, 2000);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    goob.classList.add("is-paused");
    stopGoobLoop();
  } else {
    goob.classList.remove("is-paused");
    startGoobLoop();
  }
});

window.addEventListener("resize", positionGoob, { passive: true });
reducedMotionQuery.addEventListener("change", () => {
  if (reducedMotionQuery.matches) {
    stopGoobLoop();
    goobMoving = false;
    goobX = 0;
    setGoobFrame(0);
    positionGoob();
  } else {
    goobMoving = true;
    goobWait = 0;
    goobFrame = -1;
    goobFrameElapsed = 0;
    startGoobLoop();
  }
});

positionGoob();
setGoobFrame(0);
startGoobLoop();
