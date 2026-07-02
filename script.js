/* ==========================================================================
   NOVA — script.js
   Toda a interatividade do site: navbar, menu mobile, accordion de
   atualizações, scroll reveal, botão voltar ao topo.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------ */
  /* 1. NAVBAR — efeito de transparência ao rolar                        */
  /* ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 20);

    // Botão voltar ao topo aparece após rolar
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ------------------------------------------------------------------ */
  /* 2. MENU MOBILE                                                       */
  /* ------------------------------------------------------------------ */
  const navBurger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');

  navBurger.addEventListener('click', () => {
    const isOpen = navBurger.classList.toggle('is-open');
    navMobile.classList.toggle('is-open', isOpen);
    navBurger.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha o menu mobile ao clicar em um link
  document.querySelectorAll('.navbar__mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      navBurger.classList.remove('is-open');
      navMobile.classList.remove('is-open');
      navBurger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------ */
  /* 3. LINK ATIVO NA NAVBAR CONFORME A SEÇÃO VISÍVEL                     */
  /* ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  const activateLink = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', activateLink, { passive: true });
  activateLink();

  /* ------------------------------------------------------------------ */
  /* 4. ACCORDION — CARDS DE ATUALIZAÇÕES                                 */
  /*    Basta que cada card tenha um botão com [data-update-toggle].      */
  /*    Cards com o atributo "disabled" (placeholders) não abrem.         */
  /* ------------------------------------------------------------------ */
  const updateToggles = document.querySelectorAll('[data-update-toggle]');

  updateToggles.forEach((toggle) => {
    if (toggle.hasAttribute('disabled')) return;

    const card = toggle.closest('.update-card');
    const body = card.querySelector('.update-card__body');
    const bodyInner = card.querySelector('.update-card__body-inner');

    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        body.style.maxHeight = null;
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        body.style.maxHeight = bodyInner.offsetHeight + 'px';
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Abre o primeiro card (Update 1) automaticamente ao carregar a página
  const firstToggle = document.querySelector('[data-update-toggle]:not([disabled])');
  if (firstToggle) firstToggle.click();

  /* ------------------------------------------------------------------ */
  /* 5. SCROLL REVEAL — anima elementos ao entrarem na tela                */
  /* ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------ */
  /* 6. BOTÃO VOLTAR AO TOPO                                              */
  /* ------------------------------------------------------------------ */
  const backToTop = document.getElementById('backToTop');

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------ */
  /* 7. ANO DINÂMICO NO RODAPÉ                                            */
  /* ------------------------------------------------------------------ */
  document.getElementById('footerYear').textContent = new Date().getFullYear();

});
