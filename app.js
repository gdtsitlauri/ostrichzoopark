// === HERO IMAGE SLIDER FOR HOME ===
document.addEventListener("DOMContentLoaded", () => {
  const heroSlider = document.querySelector('.hero-img-slider');
  if (heroSlider) {
    const heroImages = heroSlider.querySelectorAll('.hero-img');
    let heroIndex = 0;
    function showHeroSlide(i, force = false) {
      let nextIndex;
      if (i < 0) nextIndex = heroImages.length - 1;
      else if (i >= heroImages.length) nextIndex = 0;
      else nextIndex = i;
      const looping = (heroIndex === heroImages.length - 1 && nextIndex === 0) || (heroIndex === 0 && nextIndex === heroImages.length - 1);
      heroImages.forEach((img, idx) => {
        img.classList.remove('slide-fade-in', 'slide-fade-out');
        img.style.opacity = '0';
        img.style.transition = 'none';
        // Keep outgoing image above until fade-out completes
        if (idx === heroIndex && !force && !looping) {
          img.style.zIndex = '3';
        } else {
          img.style.zIndex = '0';
        }
      });
      // skip fade-out animation if looping from last to first
  const transitionDuration = 2200;
  const transitionCurve = 'cubic-bezier(.33,.66,.4,1)';
  const fadeOutDuration = 1200;
  const fadeInDelay = 400;
      if (!force && !looping) {
    heroImages[heroIndex].classList.add('slide-fade-out');
    heroImages[heroIndex].style.transition = `opacity ${fadeOutDuration}ms ${transitionCurve}`;
    heroImages[heroIndex].style.opacity = '0';
    heroImages[heroIndex].style.zIndex = '3';
    heroImages[heroIndex].style.display = 'block'; // keep visible during fade-out
    heroImages[heroIndex].style.transform = 'none'; // prevent any movement
      }
      setTimeout(() => {
        heroImages[nextIndex].style.display = 'block';
        setTimeout(() => {
          heroImages[nextIndex].classList.add('slide-fade-in');
          heroImages[nextIndex].style.transition = `opacity ${transitionDuration}ms ${transitionCurve}`;
          heroImages[nextIndex].style.opacity = '1';
          heroImages[nextIndex].style.zIndex = '2';
          heroImages.forEach((img, idx) => {
            if (idx !== nextIndex) img.style.display = (idx === heroIndex && !force && !looping) ? 'block' : 'none';
          });
          setTimeout(() => {
            // hide the old image after fade-out completes and reset z-index
            heroImages.forEach((img, idx) => {
              if (idx !== nextIndex) {
                img.style.display = 'none';
                img.style.zIndex = '0';
              }
            });
            heroIndex = nextIndex;
          }, fadeOutDuration);
        }, fadeInDelay);
      }, (force || looping) ? 0 : fadeOutDuration);
  // ...function ends here, no extra closing brace...
    }
    // Init: hide all except first
    heroImages.forEach((img, idx) => {
      img.style.opacity = idx === 0 ? '1' : '0';
      img.style.transform = 'scale(1)';
      img.style.display = idx === 0 ? 'block' : 'none';
      img.style.transition = 'none';
      img.style.zIndex = idx === 0 ? '2' : '0';
    });
    showHeroSlide(0, true);
    let heroAutoSlideInterval = setInterval(() => {
      showHeroSlide(heroIndex + 1);
    }, 10000);
  }
});
// Απενεργοποίηση browser scroll restoration + αναγκαστικό scroll top για να μην φαίνεται στιγμιαία το footer
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// === SLIDER FUNCTIONALITY ===
document.querySelectorAll(".slider").forEach(slider => {
  const slides = slider.querySelector(".slides");
  const images = slides.querySelectorAll("img");
  let index = 0;

  // Custom fade/scale animation for slider images
  function showSlide(i, force = false) {
    let nextIndex;
    if (i < 0) nextIndex = images.length - 1;
    else if (i >= images.length) nextIndex = 0;
    else nextIndex = i;

    // Remove animation classes from all images
    images.forEach(img => {
      img.classList.remove('slide-fade-in', 'slide-fade-out');
      img.style.opacity = '0';
      img.style.transform = 'scale(0.97)';
      img.style.transition = 'none';
      img.style.zIndex = '0';
    });

    // Animate out current image (skip if force)
    if (!force) {
      images[index].classList.add('slide-fade-out');
      images[index].style.transition = 'opacity 0.8s cubic-bezier(.25,.46,.45,.94), transform 0.8s cubic-bezier(.25,.46,.45,.94)';
      images[index].style.opacity = '0';
      images[index].style.transform = 'scale(0.97)';
      images[index].style.zIndex = '1';
    }

    // Μικρό delay πριν ξεκινήσει το fade-in της επόμενης εικόνας
    setTimeout(() => {
      images[nextIndex].style.display = 'block';
      setTimeout(() => {
        images[nextIndex].classList.add('slide-fade-in');
        images[nextIndex].style.transition = 'opacity 0.8s cubic-bezier(.25,.46,.45,.94), transform 0.8s cubic-bezier(.25,.46,.45,.94)';
        images[nextIndex].style.opacity = '1';
        images[nextIndex].style.transform = 'scale(1)';
        images[nextIndex].style.zIndex = '2';
        // Hide all except current
        images.forEach((img, idx) => {
          if (idx !== nextIndex) img.style.display = 'none';
        });
        index = nextIndex;
      }, 80); // 80ms delay για πιο ομαλή μετάβαση
    }, force ? 0 : 800);
  }

  // Init: hide all except first
  images.forEach((img, idx) => {
    img.style.opacity = idx === 0 ? '1' : '0';
    img.style.transform = 'scale(1)';
    img.style.display = idx === 0 ? 'block' : 'none';
    img.style.transition = 'none';
    img.style.zIndex = idx === 0 ? '2' : '0';
  });

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      showSlide(index + 1);
    }, 5000);
  }
  slider.querySelector(".prev").addEventListener("click", () => {
    showSlide(index - 1);
    resetAutoSlide();
  });
  slider.querySelector(".next").addEventListener("click", () => {
    showSlide(index + 1);
    resetAutoSlide();
  });

  // Εξαναγκασμένο fade-in στην πρώτη εικόνα όταν εμφανίζεται η κατηγορία
  showSlide(0, true);

  // Αυτόματη εναλλαγή εικόνων κάθε 5 δευτερόλεπτα
  let autoSlideInterval = setInterval(() => {
    showSlide(index + 1);
  }, 5000);

  // Σταμάτα το interval όταν ο slider/section κρύβεται (προαιρετικά)
  // Αν θέλεις να σταματά όταν αλλάζει κατηγορία, μπορείς να προσθέσεις observer ή event
});

// === PAGE NAVIGATION WITH FADE/ZOOM ANIMATION ===
document.addEventListener("DOMContentLoaded", () => {
  // δεύτερη διασφάλιση ότι μένουμε στην κορυφή πριν εμφανιστούν animations
  setTimeout(() => window.scrollTo(0,0), 0);
  const menuLinks = document.querySelectorAll(".top-menu a");
  const catBoxes = document.querySelectorAll(".cat-box");
  const sections = document.querySelectorAll(".content-section");
  const home = document.getElementById("home");
  const footer = document.querySelector("footer");
  let scrollAnimationId = null;
  const SCROLL_DURATION = 1000; // ενιαία ταχύτητα για πάνω & κάτω

  function animateScrollTo(targetY, duration = 700) {
    if (scrollAnimationId) cancelAnimationFrame(scrollAnimationId);
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    if (Math.abs(diff) < 2) return; // τίποτα να κάνει
    const startTime = performance.now();
    // Ενιαίο easeInOut και προς τα πάνω και προς τα κάτω για συνεχή, χωρίς "πάγωμα" αίσθηση
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + diff * eased);
      if (progress < 1) {
        scrollAnimationId = requestAnimationFrame(step);
      }
    }
    scrollAnimationId = requestAnimationFrame(step);
  }


  let currentId = "home";

  function showSection(targetId) {
    if (!targetId) return;
    const newSection = document.getElementById(targetId);
    if (!newSection || targetId === currentId) return;
    const currentSection = document.getElementById(currentId);

    // update active link
    menuLinks.forEach(link => link.classList.remove("active"));
    const activeLink = Array.from(menuLinks).find(l => l.dataset.target === targetId);
    if (activeLink) activeLink.classList.add("active");

    // fade-out του τρέχοντος
    if (currentSection) {
      currentSection.classList.remove("active");
      currentSection.classList.add("fade-out");

      // Δυναμική καθυστέρηση: περίμενε να τελειώσει το fade-out
      setTimeout(() => {
        currentSection.style.display = "none";
        currentSection.classList.remove("fade-out");

        // fade-in του νέου
        newSection.style.display = "block";
        setTimeout(() => {
          newSection.classList.add("active");
          currentId = targetId;
          animateScrollTo(0, SCROLL_DURATION);
        }, 150); // λίγο μεγαλύτερη καθυστέρηση για να προλάβει το DOM
      }, 650); // ίδιο χρόνο με CSS transition + μικρό buffer
    } else {
      // αν δεν υπάρχει προηγούμενο (πχ πρώτο load)
      newSection.style.display = "block";
      requestAnimationFrame(() => newSection.classList.add("active"));
      currentId = targetId;
      animateScrollTo(0, SCROLL_DURATION);
    }
  }

    // MENU CLICK
    menuLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const targetId = link.dataset.target;

        if (targetId === "contact") {
          const footerEl = document.getElementById("contact") || footer;
          if (footerEl) {
            const targetY = footerEl.getBoundingClientRect().top + window.pageYOffset;
            animateScrollTo(targetY, SCROLL_DURATION);
          }
          return; // δεν αλλάζουμε active
        }

        showSection(targetId);
      });
    });

  // CAT-BOX CLICK
  catBoxes.forEach(box => {
    box.addEventListener("click", () => {
      const targetId = box.dataset.target;
      showSection(targetId);
    });
  });

  // αρχικό state: κρύψε όλα
  sections.forEach(s => {
    s.classList.remove("active");
    s.style.display = "none";
  });
  home.style.display = "block";

  // fade-in το Home όταν φορτώνει η σελίδα
  setTimeout(() => {
    home.classList.add("active");
    currentId = "home";
  }, 100); // ίδιο delay με την εναλλαγή

  // Υπογράμμιση Home στο μενού
  const homeLink = Array.from(menuLinks).find(l => l.dataset.target === "home");
  if (homeLink) homeLink.classList.add("active");
  
  // Σήμανση ότι η αρχικοποίηση ολοκληρώθηκε ώστε να εμφανιστεί το footer χωρίς flash
  document.body.classList.add('app-ready');
  
  // === LANGUAGE SWITCH ACTIVE STATE ===
  const langButtons = document.querySelectorAll('.lang-btn');
  // === SIMPLE I18N ===
  const translations = {
    en: {
      menuHome: 'Home', menuFarm: 'Farm', menuTavern: 'Tavern', menuActivities: 'Activities', menuEvents: 'Events', menuContact: 'Contact',
  logoTitle: '<span class="green">Ostrich</span> <span class="dark">ZooPark</span> & <span class="no-break"><span class="green">Tavern</span> <span class="red thea-inline">"THEA"</span></span>',
  catFarmTitle: 'Farm', catFarmDesc: 'Discover our Farm',
      catTavernTitle: 'Tavern', catTavernDesc: 'Taste our Flavours',
      catActivitiesTitle: 'Activities', catActivitiesDesc: 'Things to do',
      catEventsTitle: 'Events', catEventsDesc: 'Organize moments',
      aboutTitle: 'About Us',
      about1: 'Zoo Park with ostriches, animals and tavern in Episkopi Heraklion.',
      about2: 'In a specially designated area you can admire the largest birds on earth, as well as many other animal and bird species.',
      about3: 'Our ranch is situated at 15 km from Heraklion city, Crete in a natural, green environment.',
      about4: 'We offer to our visitors and especially children the chance to observe it and get acquainted with these so inquisitively watched animals.',
      about5: 'Visit our restaurant “THEA” overlooking the Psiloritis and Yiouchtas mountains and try some unique ostrich recipes, as well as traditional delicacies in affordable producer prices.',
      about6: 'Enjoy your coffee or ice cream watching your children play safely in the playground.',
      about7: '<strong>Attention: The ranch is not visible from the main road, which is 150m away.</strong>',
      farmHeader: '<span class="green">Explore</span> <span class="dark">our</span> <span class="red">Farm</span>',
      tavernHeader: '<span class="green">Enjoy</span> <span class="dark">our</span> <span class="red">Tavern</span>',
      activitiesHeader: '<span class="green">Things</span> <span class="dark">to</span> <span class="red">do</span>',
      eventsHeader: '<span class="green">Organize</span> <span class="dark">your</span> <span class="red">moments</span>',
      contactTitle: 'Contact Us',
      address: 'Episkopi, Heraklion Crete',
      brandFooter: '© <span class="green">Ostrich</span> <span class="dark">ZooPark</span> & <span class="green">Tavern</span> <span class="red">"THEA"</span>'
    },
    el: {
      menuHome: 'Αρχική', menuFarm: 'Φάρμα', menuTavern: 'Ταβέρνα', menuActivities: 'Δραστηριότητες', menuEvents: 'Εκδηλώσεις', menuContact: 'Επικοινωνία',
  logoTitle: '<span class="green">Ostrich</span> <span class="dark">ZooPark</span> & <span class="no-break"><span class="green">Ταβέρνα</span> <span class="red thea-inline">"ΘΕΑ"</span></span>',
  catFarmTitle: 'Φάρμα', catFarmDesc: 'Ανακαλύψτε τη φάρμα',
      catTavernTitle: 'Ταβέρνα', catTavernDesc: 'Δοκιμάστε πιάτα μας',
      catActivitiesTitle: 'Δραστηριότητες', catActivitiesDesc: 'Πράγματα να κάνετε',
      catEventsTitle: 'Εκδηλώσεις', catEventsDesc: 'Οργανώστε στιγμές',
      aboutTitle: 'Ποιοι Είμαστε',
      about1: 'Πάρκο με στρουθοκαμήλους, ζώα και ταβέρνα στην Επισκοπή Ηρακλείου.',
      about2: 'Σε ειδικά διαμορφωμένο χώρο μπορείτε να θαυμάσετε τα μεγαλύτερα πτηνά στη γη και πολλά άλλα είδη ζώων και πτηνών.',
      about3: 'Η φάρμα μας βρίσκεται 15 χλμ από το Ηράκλειο Κρήτης σε φυσικό, πράσινο περιβάλλον.',
      about4: 'Προσφέρουμε στους επισκέπτες και ιδιαίτερα στα παιδιά την ευκαιρία να τα παρατηρήσουν και να γνωρίσουν αυτά τα τόσο περίεργα ζώα.',
      about5: 'Επισκεφθείτε το εστιατόριό μας “ΘΕΑ” με θέα τα βουνά Ψηλορείτη και Γιούχτα και δοκιμάστε μοναδικές συνταγές και παραδοσιακά εδέσματα σε προσιτές τιμές παραγωγού.',
      about6: 'Απολαύστε τον καφέ ή το παγωτό σας βλέποντας τα παιδιά σας να παίζουν με ασφάλεια στον χώρο.',
      about7: '<strong>Προσοχή: Η φάρμα μας δεν είναι ορατή από τον κεντρικό δρόμο που απέχει 150μ.</strong>',
      farmHeader: '<span class="green">Εξερευνήστε</span> <span class="dark">τη</span> <span class="red">Φάρμα</span>',
      tavernHeader: '<span class="green">Απολαύστε</span> <span class="dark">την</span> <span class="red">Ταβέρνα</span>',
      activitiesHeader: '<span class="green">Όσα</span> <span class="dark">μπορείτε</span> <span class="red">να κάνετε</span>',
      eventsHeader: '<span class="green">Οργανώστε</span> <span class="dark">τις</span> <span class="red">στιγμές</span>',
      contactTitle: 'Επικοινωνία',
      address: 'Επισκοπή Πεδιάδος, Ηράκλειο Κρήτης',
      brandFooter: '© <span class="green">Ostrich</span> <span class="dark">ZooPark</span> & <span class="green">Ταβέρνα</span> <span class="red">"ΘΕΑ"</span>'
    }
  };

  // Προσθήκη teaser λέξεων κατηγοριών (αγγλικά + ελληνικά)
  translations.en.catTeaser = '<span class="green">Explore</span> <span class="dark">Taste</span> <span class="red">Enjoy</span>';
  translations.el.catTeaser = '<span class="green">Εξερευνήστε</span> <span class="dark">Γευτείτε</span> <span class="red">Απολαύστε</span>';

  function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const type = el.getAttribute('data-i18n-type');
      if (dict[key] != null) {
        if (type === 'html') el.innerHTML = dict[key];
        else el.textContent = dict[key];
      }
    });
    document.documentElement.lang = lang;
  }

  // Overlay animation container creation (once)
  const langOverlay = document.createElement('div');
  langOverlay.id = 'lang-change-overlay';
  langOverlay.style.position = 'fixed';
  langOverlay.style.inset = '0';
  langOverlay.style.background = '#EDE8D0';
  langOverlay.style.display = 'none';
  langOverlay.style.zIndex = '9999';
  langOverlay.style.opacity = '0';
  langOverlay.style.transition = 'opacity .55s ease';
  document.body.appendChild(langOverlay);

  function animateLanguageChange(nextLang) {
    // show overlay fade in
    langOverlay.style.display = 'block';
    requestAnimationFrame(() => { langOverlay.style.opacity = '1'; });
    const animTargets = document.querySelectorAll('.lang-anim-target');
    animTargets.forEach(el => el.classList.add('lang-fading'));
    // after fade-in apply translations then fade-out
    setTimeout(() => {
      applyTranslations(nextLang);
      // small delay to allow DOM paint
      setTimeout(() => {
        langOverlay.style.opacity = '0';
        animTargets.forEach(el => el.classList.remove('lang-fading'));
        setTimeout(() => { langOverlay.style.display = 'none'; }, 650);
      }, 150); // δυναμική καθυστέρηση για να προλάβει το DOM
    }, 400);
  }
// === CSS για fade slider animation χωρίς scale ===
const style = document.createElement('style');
style.innerHTML = `
  .slide-fade-in {
    opacity: 1 !important;
    transition: opacity 2.2s cubic-bezier(.33,.66,.4,1);
  }
  .slide-fade-out {
    opacity: 0 !important;
    transition: opacity 1.2s cubic-bezier(.33,.66,.4,1);
  }
`;
document.head.appendChild(style);

  let currentLang = 'el'; // αρχική γλώσσα τώρα Ελληνικά
  applyTranslations(currentLang);
  // σηματοδότησε ότι οι μεταφράσεις φόρτωσαν ώστε να εμφανιστούν τα στοιχεία
  document.body.classList.add('i18n-ready');
  // ενεργοποίηση σωστού κουμπιού αν markup δεν συμβαδίζει
  langButtons.forEach(b => {
    if (b.getAttribute('data-lang') === currentLang) b.classList.add('active');
    else b.classList.remove('active');
  });

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang === currentLang) return;
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      animateLanguageChange(lang);
      currentLang = lang;
    });
  });
  
    // === BACK TO TOP BUTTON ===
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      backToTop.addEventListener("click", e => {
        e.preventDefault();
        animateScrollTo(0, SCROLL_DURATION);
      });
    }
});


