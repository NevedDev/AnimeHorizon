/* ==========================================================================
   ANIME HORIZON — script.js
   Toda a interatividade do site: navbar, menu mobile, accordion de
   atualizações, scroll reveal, botão voltar ao topo, colagem do hero.
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

  // Recalcula a altura do card aberto se a janela for redimensionada
  window.addEventListener('resize', () => {
    const openToggle = document.querySelector('.update-card__header[aria-expanded="true"]');
    if (!openToggle) return;
    const card = openToggle.closest('.update-card');
    const body = card.querySelector('.update-card__body');
    const bodyInner = card.querySelector('.update-card__body-inner');
    body.style.maxHeight = bodyInner.offsetHeight + 'px';
  });

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

  /* ------------------------------------------------------------------ */
  /* 8. COLAGEM DE FUNDO DO HERO                                          */
  /*    Gera os ladrilhos e tenta preencher cada um com uma imagem de     */
  /*    assets/collage/1.jpg, 2.jpg, 3.jpg... (até 12). Ladrilhos sem     */
  /*    imagem correspondente recebem um gradiente neutro como reserva.   */
  /* ------------------------------------------------------------------ */
  const collage = document.getElementById('heroCollage');

  if (collage) {
    const TILE_COUNT = 24; // quantidade de ladrilhos exibidos na colagem
    const MAX_IMAGES = 12; // quantidade máxima de imagens que o script procura
    const fallbackClasses = ['collage-tile--a', 'collage-tile--b', 'collage-tile--c'];
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];

    // Cria todos os ladrilhos já com uma classe de reserva (gradiente neutro)
    const tiles = [];
    for (let i = 0; i < TILE_COUNT; i++) {
      const tile = document.createElement('div');
      tile.className = `collage-tile ${fallbackClasses[i % fallbackClasses.length]}`;
      collage.appendChild(tile);
      tiles.push(tile);
    }

    // Tenta carregar assets/collage/N.<ext> para N de 1 até MAX_IMAGES.
    // Cada imagem encontrada substitui o fundo de um ou mais ladrilhos.
    const tryLoad = (n, extIndex) => {
      if (n > MAX_IMAGES) return;
      if (extIndex >= extensions.length) {
        tryLoad(n + 1, 0);
        return;
      }
      const path = `assets/collage/${n}.${extensions[extIndex]}`;
      const img = new Image();
      img.onload = () => {
        tiles.forEach((tile, i) => {
          if (i % MAX_IMAGES === (n - 1)) {
            tile.style.backgroundImage = `url('${path}')`;
          }
        });
        tryLoad(n + 1, 0);
      };
      img.onerror = () => tryLoad(n, extIndex + 1);
      img.src = path;
    };
    tryLoad(1, 0);
  }

});
