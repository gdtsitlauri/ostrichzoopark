document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // BASIC STARTUP
  // =========================
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // Αποφυγή διπλού smooth scroll από CSS + JS
  document.documentElement.style.scrollBehavior = "auto";

  window.scrollTo(0, 0);
  setTimeout(() => window.scrollTo(0, 0), 0);

  // =========================
  // FONT LOADING
  // =========================
  document.body.classList.add("font-loading");

  let fontLoadingRemoved = false;

  function removeFontLoading() {
    if (fontLoadingRemoved) return;
    document.body.classList.remove("font-loading");
    fontLoadingRemoved = true;
  }

  if (document.fonts && document.fonts.load) {
    document.fonts
      .load("1em ComicSansCustom")
      .then(() => {
        setTimeout(removeFontLoading, 80);
      })
      .catch(() => {
        removeFontLoading();
      });

    setTimeout(removeFontLoading, 2500);
  } else {
    window.addEventListener("load", () => {
      setTimeout(removeFontLoading, 200);
    });
  }

  // =========================
  // GLOBAL HELPERS
  // =========================
  let scrollAnimationId = null;
  const SCROLL_DURATION = 600;
  const SECTION_TRANSITION_DURATION = 650;

  function animateScrollTo(targetY, duration = SCROLL_DURATION) {
    if (scrollAnimationId !== null) {
      cancelAnimationFrame(scrollAnimationId);
      scrollAnimationId = null;
    }

    const startY = window.pageYOffset || window.scrollY || 0;
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const finalTarget = Math.max(0, Math.min(targetY, maxScroll));
    const diff = finalTarget - startY;

    if (Math.abs(diff) < 2) {
      window.scrollTo(0, finalTarget);
      return;
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      window.scrollTo(0, finalTarget);
      return;
    }

    const startTime = performance.now();
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      window.scrollTo(0, startY + diff * eased);

      if (progress < 1) {
        scrollAnimationId = requestAnimationFrame(step);
      } else {
        scrollAnimationId = null;
      }
    }

    scrollAnimationId = requestAnimationFrame(step);
  }

  // =========================
  // INJECTED ANIMATION CLASSES
  // =========================
  const injectedStyle = document.createElement("style");
  injectedStyle.innerHTML = `
    .slide-fade-in {
      opacity: 1 !important;
      transition: opacity 2.2s cubic-bezier(.33,.66,.4,1);
    }

    .slide-fade-out {
      opacity: 0 !important;
      transition: opacity 1.2s cubic-bezier(.33,.66,.4,1);
    }

    .section-enter-from-right {
      opacity: 0 !important;
      transform: translate3d(48px, 0, 0) scale(.96) !important;
    }

    .section-enter-from-left {
      opacity: 0 !important;
      transform: translate3d(-48px, 0, 0) scale(.96) !important;
    }

    .section-exit-to-left {
      opacity: 0 !important;
      transform: translate3d(-48px, 0, 0) scale(.96) !important;
    }

    .section-exit-to-right {
      opacity: 0 !important;
      transform: translate3d(48px, 0, 0) scale(.96) !important;
    }
  `;
  document.head.appendChild(injectedStyle);

  // =========================
  // HERO SLIDER
  // =========================
  const heroSlider = document.querySelector(".hero-img-slider");

  if (heroSlider) {
    const heroImages = Array.from(heroSlider.querySelectorAll(".hero-img"));
    let heroIndex = 0;
    let heroAnimating = false;
    let heroStep1Timeout = null;
    let heroStep2Timeout = null;
    let heroStep3Timeout = null;

    // Recommended tighter timings for a more natural feel
    const HERO_TRANSITION_DURATION = 1600;
    const HERO_TRANSITION_CURVE = "cubic-bezier(.33,.66,.4,1)";
    const HERO_FADE_OUT_DURATION = 900;
    const HERO_FADE_IN_DELAY = 180;
    const HERO_INTERVAL = 10000;

    function clearHeroTimeouts() {
      clearTimeout(heroStep1Timeout);
      clearTimeout(heroStep2Timeout);
      clearTimeout(heroStep3Timeout);
    }

    function initHeroSlides() {
      heroImages.forEach((img, idx) => {
        img.classList.remove("slide-fade-in", "slide-fade-out");
        img.style.opacity = idx === 0 ? "1" : "0";
        img.style.display = idx === 0 ? "block" : "none";
        img.style.transition = "none";
        img.style.transform = "none";
        img.style.zIndex = idx === 0 ? "2" : "0";
      });
    }

    function showHeroSlide(i, force = false) {
      if (!heroImages.length) return;
      if (heroAnimating && !force) return;

      let nextIndex;
      if (i < 0) nextIndex = heroImages.length - 1;
      else if (i >= heroImages.length) nextIndex = 0;
      else nextIndex = i;

      if (nextIndex === heroIndex && !force) return;

      clearHeroTimeouts();
      heroAnimating = true;

      const currentImg = heroImages[heroIndex];
      const nextImg = heroImages[nextIndex];

      heroImages.forEach((img, idx) => {
        img.classList.remove("slide-fade-in", "slide-fade-out");
        img.style.transition = "none";
        img.style.transform = "none";

        if (idx === heroIndex) {
          img.style.display = "block";
          img.style.opacity = "1";
          img.style.zIndex = "3";
        } else if (idx === nextIndex) {
          img.style.display = "block";
          img.style.opacity = force ? "1" : "0";
          img.style.zIndex = "2";
        } else {
          img.style.display = "none";
          img.style.opacity = "0";
          img.style.zIndex = "0";
        }
      });

      if (force) {
        nextImg.style.display = "block";
        nextImg.style.opacity = "1";
        nextImg.style.zIndex = "2";
        heroIndex = nextIndex;
        heroAnimating = false;
        return;
      }

      currentImg.classList.add("slide-fade-out");
      currentImg.style.transition = `opacity ${HERO_FADE_OUT_DURATION}ms ${HERO_TRANSITION_CURVE}`;
      currentImg.style.opacity = "0";

      heroStep1Timeout = setTimeout(() => {
        nextImg.style.display = "block";
        nextImg.style.opacity = "0";
        nextImg.style.zIndex = "2";

        heroStep2Timeout = setTimeout(() => {
          nextImg.classList.add("slide-fade-in");
          nextImg.style.transition = `opacity ${HERO_TRANSITION_DURATION}ms ${HERO_TRANSITION_CURVE}`;
          nextImg.style.opacity = "1";

          heroStep3Timeout = setTimeout(() => {
            heroImages.forEach((img, idx) => {
              if (idx !== nextIndex) {
                img.style.display = "none";
                img.style.opacity = "0";
                img.style.zIndex = "0";
                img.classList.remove("slide-fade-in", "slide-fade-out");
              }
            });

            nextImg.style.display = "block";
            nextImg.style.opacity = "1";
            nextImg.style.zIndex = "2";

            heroIndex = nextIndex;
            heroAnimating = false;
          }, HERO_TRANSITION_DURATION);
        }, HERO_FADE_IN_DELAY);
      }, HERO_FADE_OUT_DURATION);
    }

    initHeroSlides();
    showHeroSlide(0, true);

    setInterval(() => {
      showHeroSlide(heroIndex + 1);
    }, HERO_INTERVAL);
  }

  // =========================
  // SECTION SLIDERS
  // =========================
  document.querySelectorAll(".slider").forEach(slider => {
    const slides = slider.querySelector(".slides");
    const images = slides ? Array.from(slides.querySelectorAll("img")) : [];
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");

    if (!slides || !images.length || !prevBtn || !nextBtn) return;

    let index = 0;
    let isAnimating = false;
    let autoSlideInterval = null;
    let sliderStep1Timeout = null;
    let sliderStep2Timeout = null;
    let sliderUnlockTimeout = null;

    const SLIDER_FADE_DURATION = 800;
    const SLIDER_DELAY = 80;
    const SLIDER_INTERVAL = 5000;

    function clearSliderTimeouts() {
      clearTimeout(sliderStep1Timeout);
      clearTimeout(sliderStep2Timeout);
      clearTimeout(sliderUnlockTimeout);
    }

    function initSlides() {
      images.forEach((img, idx) => {
        img.classList.remove("slide-fade-in", "slide-fade-out");
        img.style.opacity = idx === 0 ? "1" : "0";
        img.style.transform = "scale(1)";
        img.style.display = idx === 0 ? "block" : "none";
        img.style.transition = "none";
        img.style.zIndex = idx === 0 ? "2" : "0";
      });
    }

    function showSlide(i, force = false) {
      if (isAnimating && !force) return;

      let nextIndex;
      if (i < 0) nextIndex = images.length - 1;
      else if (i >= images.length) nextIndex = 0;
      else nextIndex = i;

      if (nextIndex === index && !force) return;

      clearSliderTimeouts();
      isAnimating = true;

      images.forEach(img => {
        img.classList.remove("slide-fade-in", "slide-fade-out");
        img.style.transition = "none";
      });

      if (!force) {
        images[index].classList.add("slide-fade-out");
        images[index].style.transition =
          "opacity 0.8s cubic-bezier(.25,.46,.45,.94), transform 0.8s cubic-bezier(.25,.46,.45,.94)";
        images[index].style.opacity = "0";
        images[index].style.transform = "scale(0.97)";
        images[index].style.zIndex = "1";
        images[index].style.display = "block";
      }

      sliderStep1Timeout = setTimeout(() => {
        images[nextIndex].style.display = "block";

        sliderStep2Timeout = setTimeout(() => {
          images[nextIndex].classList.add("slide-fade-in");
          images[nextIndex].style.transition =
            "opacity 0.8s cubic-bezier(.25,.46,.45,.94), transform 0.8s cubic-bezier(.25,.46,.45,.94)";
          images[nextIndex].style.opacity = "1";
          images[nextIndex].style.transform = "scale(1)";
          images[nextIndex].style.zIndex = "2";

          images.forEach((img, idx) => {
            if (idx !== nextIndex) {
              img.style.display = "none";
              img.style.zIndex = "0";
            }
          });

          index = nextIndex;

          sliderUnlockTimeout = setTimeout(() => {
            isAnimating = false;
          }, 850);
        }, SLIDER_DELAY);
      }, force ? 0 : SLIDER_FADE_DURATION);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        showSlide(index + 1);
      }, SLIDER_INTERVAL);
    }

    prevBtn.addEventListener("click", () => {
      showSlide(index - 1);
      resetAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
      showSlide(index + 1);
      resetAutoSlide();
    });

    initSlides();
    showSlide(0, true);
    resetAutoSlide();
  });

  // =========================
  // PAGE NAVIGATION
  // =========================
  const menuLinks = document.querySelectorAll(".top-menu a");
  const catBoxes = document.querySelectorAll(".cat-box");
  const sections = Array.from(document.querySelectorAll(".content-section"));
  const home = document.getElementById("home");
  const footer = document.querySelector("footer");

  const sectionOrder = ["home", "farm", "tavern", "activities", "events"];

  let currentId = "home";
  let isSectionTransitioning = false;
  let sectionTransitionTimeout = null;

  function clearSectionTransitionTimeouts() {
    clearTimeout(sectionTransitionTimeout);
  }

  function setActiveMenuLink(targetId) {
    menuLinks.forEach(link => link.classList.remove("active"));
    const activeLink = Array.from(menuLinks).find(
      link => link.dataset.target === targetId
    );
    if (activeLink) activeLink.classList.add("active");
  }

  function getSectionEl(id) {
    return id === "home" ? home : document.getElementById(id);
  }

  function cleanupSectionClasses(section) {
    if (!section) return;

    section.classList.remove(
      "fade-out",
      "section-enter-from-right",
      "section-enter-from-left",
      "section-exit-to-left",
      "section-exit-to-right"
    );
  }

  function goToSection(targetId) {
    if (!targetId || isSectionTransitioning) return;

    const newSection = getSectionEl(targetId);
    const currentSection = getSectionEl(currentId);

    if (!newSection || !currentSection) return;

    setActiveMenuLink(targetId);

    if (targetId === currentId) {
      animateScrollTo(0, SCROLL_DURATION);
      return;
    }

    clearSectionTransitionTimeouts();
    isSectionTransitioning = true;

    const currentIndex = sectionOrder.indexOf(currentId);
    const targetIndex = sectionOrder.indexOf(targetId);
    const goingBackward =
      currentIndex !== -1 && targetIndex !== -1 && targetIndex < currentIndex;

    const enterClass = goingBackward
      ? "section-enter-from-left"
      : "section-enter-from-right";

    const exitClass = goingBackward
      ? "section-exit-to-right"
      : "section-exit-to-left";

    [home, ...sections].forEach(section => {
      cleanupSectionClasses(section);
    });

    newSection.style.display = "block";
    newSection.classList.remove("active");
    newSection.classList.add(enterClass);

    currentSection.style.display = "block";

    animateScrollTo(0, SCROLL_DURATION);

    // force reflow
    void newSection.offsetWidth;

    requestAnimationFrame(() => {
      currentSection.classList.remove("active");
      currentSection.classList.add(exitClass);

      newSection.classList.add("active");
      newSection.classList.remove(enterClass);

      sectionTransitionTimeout = setTimeout(() => {
        currentSection.style.display = "none";
        cleanupSectionClasses(currentSection);
        cleanupSectionClasses(newSection);

        newSection.classList.add("active");
        currentId = targetId;
        isSectionTransitioning = false;
      }, SECTION_TRANSITION_DURATION);
    });
  }

  menuLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.dataset.target;

      if (targetId === "contact") {
        const footerEl = document.getElementById("contact") || footer;
        if (footerEl) {
          const targetY =
            footerEl.getBoundingClientRect().top + window.pageYOffset;
          animateScrollTo(targetY, SCROLL_DURATION);
        }
        return;
      }

      goToSection(targetId);
    });
  });

  catBoxes.forEach(box => {
    box.addEventListener("click", () => {
      const targetId = box.dataset.target;
      goToSection(targetId);
    });
  });

  sections.forEach(section => {
    section.classList.remove("active", "fade-out");
    cleanupSectionClasses(section);
    section.style.display = "none";
  });

  if (home) {
    cleanupSectionClasses(home);
    home.style.display = "block";

    requestAnimationFrame(() => {
      home.classList.add("active");
      currentId = "home";
    });
  }

  setActiveMenuLink("home");
  document.body.classList.add("app-ready");

  // =========================
  // I18N
  // =========================
  const langButtons = document.querySelectorAll(".lang-btn");

  const translations = {
    en: {
      menuHome: "Home",
      menuFarm: "Farm",
      menuTavern: "Tavern",
      menuActivities: "Activities",
      menuEvents: "Events",
      menuContact: "Contact",
      logoTitle:
        '<span class="green">Ostrich</span> <span class="dark">ZooPark</span> & <span class="no-break"><span class="green">Tavern</span> <span class="red thea-inline">"THEA"</span></span>',
      catTeaser:
        '<span class="green">Explore</span> <span class="dark">Taste</span> <span class="red">Enjoy</span>',
      catFarmTitle: "Farm",
      catFarmDesc: "Discover our Farm",
      catTavernTitle: "Tavern",
      catTavernDesc: "Taste our Flavours",
      catActivitiesTitle: "Activities",
      catActivitiesDesc: "Things to do",
      catEventsTitle: "Events",
      catEventsDesc: "Organize moments",
      aboutTitle: "About Us",
      about1:
        "Zoo Park with ostriches, animals and tavern in Episkopi Heraklion.",
      about2:
        "In a specially designated area you can admire the largest birds on earth, as well as many other animal and bird species.",
      about3:
        "Our ranch is situated at 15 km from Heraklion city, Crete in a natural, green environment.",
      about4:
        "We offer to our visitors and especially children the chance to observe it and get acquainted with these so inquisitively watched animals.",
      about5:
        "Visit our restaurant “THEA” overlooking the Psiloritis and Yiouchtas mountains and try some unique ostrich recipes, as well as traditional delicacies in affordable producer prices.",
      about6:
        "Enjoy your coffee or ice cream watching your children play safely in the playground.",
      about7:
        "<strong>Attention: The ranch is not visible from the main road, which is 150m away.</strong>",
      farmHeader:
        '<span class="green">Explore</span> <span class="dark">our</span> <span class="red">Farm</span>',
      tavernHeader:
        '<span class="green">Enjoy</span> <span class="dark">our</span> <span class="red">Tavern</span>',
      activitiesHeader:
        '<span class="green">Things</span> <span class="dark">to</span> <span class="red">do</span>',
      eventsHeader:
        '<span class="green">Organize</span> <span class="dark">your</span> <span class="red">moments</span>',
      contactTitle: "Contact Us",
      address: "Episkopi, Heraklion Crete",
      brandFooter:
        '© <span class="green">Ostrich</span> <span class="dark">ZooPark</span> & <span class="green">Tavern</span> <span class="red">"THEA"</span>',
      privacyLink: "Privacy Policy",
      privacyTitle: "Privacy Policy",
      privacyContent: `
        <p>The website ostrichzoopark.com is purely informational and does not collect users’ personal data.</p>
        <p>We do not use analytics, tracking, statistics or advertising cookies.<br>We do not use contact forms and we do not store visitor information.</p>
        <p>The server may log technical details, such as IP address and visit time, only for security and proper operation purposes, with no further processing.</p>
        <p>For any communication, you can email us at:<br><a href="mailto:farmalasithiotakis@yahoo.gr">farmalasithiotakis@yahoo.gr</a></p>
      `
    },
    el: {
      menuHome: "Αρχική",
      menuFarm: "Φάρμα",
      menuTavern: "Ταβέρνα",
      menuActivities: "Δραστηριότητες",
      menuEvents: "Εκδηλώσεις",
      menuContact: "Επικοινωνία",
      logoTitle:
        '<span class="green">Ostrich</span> <span class="dark">ZooPark</span> & <span class="no-break"><span class="green">Ταβέρνα</span> <span class="red thea-inline">"ΘΕΑ"</span></span>',
      catTeaser:
        '<span class="green">Εξερευνήστε</span> <span class="dark">Γευτείτε</span> <span class="red">Απολαύστε</span>',
      catFarmTitle: "Φάρμα",
      catFarmDesc: "Ανακαλύψτε τη φάρμα",
      catTavernTitle: "Ταβέρνα",
      catTavernDesc: "Δοκιμάστε πιάτα μας",
      catActivitiesTitle: "Δραστηριότητες",
      catActivitiesDesc: "Πράγματα να κάνετε",
      catEventsTitle: "Εκδηλώσεις",
      catEventsDesc: "Οργανώστε στιγμές",
      aboutTitle: "Ποιοι Είμαστε",
      about1:
        "Πάρκο με στρουθοκαμήλους, ζώα και ταβέρνα στην Επισκοπή Ηρακλείου.",
      about2:
        "Σε ειδικά διαμορφωμένο χώρο μπορείτε να θαυμάσετε τα μεγαλύτερα πτηνά στη γη και πολλά άλλα είδη ζώων και πτηνών.",
      about3:
        "Η φάρμα μας βρίσκεται 15 χλμ από το Ηράκλειο Κρήτης σε φυσικό, πράσινο περιβάλλον.",
      about4:
        "Προσφέρουμε στους επισκέπτες και ιδιαίτερα στα παιδιά την ευκαιρία να τα παρατηρήσουν και να γνωρίσουν αυτά τα τόσο περίεργα ζώα.",
      about5:
        "Επισκεφθείτε το εστιατόριό μας “ΘΕΑ” με θέα τα βουνά Ψηλορείτη και Γιούχτα και δοκιμάστε μοναδικές συνταγές και παραδοσιακά εδέσματα σε προσιτές τιμές παραγωγού.",
      about6:
        "Απολαύστε τον καφέ ή το παγωτό σας βλέποντας τα παιδιά σας να παίζουν με ασφάλεια στον χώρο.",
      about7:
        "<strong>Προσοχή: Η φάρμα μας δεν είναι ορατή από τον κεντρικό δρόμο που απέχει 150μ.</strong>",
      farmHeader:
        '<span class="green">Εξερευνήστε</span> <span class="dark">τη</span> <span class="red">Φάρμα</span>',
      tavernHeader:
        '<span class="green">Απολαύστε</span> <span class="dark">την</span> <span class="red">Ταβέρνα</span>',
      activitiesHeader:
        '<span class="green">Όσα</span> <span class="dark">μπορείτε</span> <span class="red">να κάνετε</span>',
      eventsHeader:
        '<span class="green">Οργανώστε</span> <span class="dark">τις</span> <span class="red">στιγμές</span>',
      contactTitle: "Επικοινωνία",
      address: "Επισκοπή Πεδιάδος, Ηράκλειο Κρήτης",
      brandFooter:
        '© <span class="green">Ostrich</span> <span class="dark">ZooPark</span> & <span class="green">Ταβέρνα</span> <span class="red">"ΘΕΑ"</span>',
      privacyLink: "Πολιτική Απορρήτου",
      privacyTitle: "Πολιτική Απορρήτου",
      privacyContent: `
        <p>Ο ιστότοπος ostrichzoopark.com είναι καθαρά ενημερωτικός και δεν συλλέγει προσωπικά δεδομένα χρηστών.</p>
        <p>Δεν χρησιμοποιούμε cookies ανάλυσης, tracking, στατιστικών ή διαφήμισης.<br>Δεν χρησιμοποιούμε φόρμες επικοινωνίας και δεν αποθηκεύουμε πληροφορίες επισκεπτών.</p>
        <p>Ο διακομιστής (server) ενδέχεται να καταγράφει τεχνικά στοιχεία, όπως IP και χρόνο επίσκεψης, μόνο για λόγους ασφαλείας και σωστής λειτουργίας, χωρίς να γίνεται περαιτέρω επεξεργασία.</p>
        <p>Για οποιαδήποτε επικοινωνία, μπορείτε να μας στείλετε email στο:<br><a href="mailto:farmalasithiotakis@yahoo.gr">farmalasithiotakis@yahoo.gr</a></p>
      `
    }
  };

  function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const type = el.getAttribute("data-i18n-type");

      if (dict[key] != null) {
        if (type === "html") {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    document.documentElement.lang = lang;
  }

  const langOverlay = document.createElement("div");
  langOverlay.id = "lang-change-overlay";
  langOverlay.style.position = "fixed";
  langOverlay.style.inset = "0";
  langOverlay.style.background = "#EDE8D0";
  langOverlay.style.display = "none";
  langOverlay.style.zIndex = "9999";
  langOverlay.style.opacity = "0";
  langOverlay.style.transition = "opacity .55s ease";
  document.body.appendChild(langOverlay);

  function animateLanguageChange(nextLang) {
    langOverlay.style.display = "block";

    requestAnimationFrame(() => {
      langOverlay.style.opacity = "1";
    });

    const animTargets = document.querySelectorAll(".lang-anim-target");
    animTargets.forEach(el => el.classList.add("lang-fading"));

    setTimeout(() => {
      applyTranslations(nextLang);

      setTimeout(() => {
        langOverlay.style.opacity = "0";
        animTargets.forEach(el => el.classList.remove("lang-fading"));

        setTimeout(() => {
          langOverlay.style.display = "none";
        }, 650);
      }, 150);
    }, 400);
  }

  let currentLang = "el";
  applyTranslations(currentLang);
  document.body.classList.add("i18n-ready");

  langButtons.forEach(btn => {
    if (btn.getAttribute("data-lang") === currentLang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (lang === currentLang) return;

      langButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      animateLanguageChange(lang);
      currentLang = lang;
    });
  });

  // =========================
  // BACK TO TOP
  // =========================
  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    backToTop.addEventListener("click", e => {
      e.preventDefault();
      animateScrollTo(0, SCROLL_DURATION);
    });
  }

  // =========================
  // PRIVACY MODAL
  // =========================
  const privacyLink = document.getElementById("privacy-link");
  const privacyModal = document.getElementById("privacy-modal");

  function openModal() {
    if (!privacyModal) return;

    privacyModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeBtn = privacyModal.querySelector(".modal-close");
    if (closeBtn) {
      setTimeout(() => closeBtn.focus({ preventScroll: true }), 0);
    }
  }

  function closeModal() {
    if (!privacyModal) return;

    privacyModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (privacyLink && privacyModal) {
    privacyLink.addEventListener("click", e => {
      e.preventDefault();
      openModal();
    });

    privacyModal.addEventListener("click", e => {
      const isOverlay =
        e.target &&
        e.target.classList &&
        e.target.classList.contains("modal-overlay");

      const wantsClose =
        e.target &&
        (e.target.matches("[data-close]") ||
          (e.target.closest && e.target.closest("[data-close]")));

      if (isOverlay || wantsClose) {
        e.preventDefault();
        closeModal();
      }
    });

    document.addEventListener("keydown", e => {
      if (
        e.key === "Escape" &&
        privacyModal.getAttribute("aria-hidden") === "false"
      ) {
        closeModal();
      }
    });
  }
});