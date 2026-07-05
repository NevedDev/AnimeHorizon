/* ==========================================================================
   ANIME HORIZON — script.js
   Toda a interatividade do site: navbar, menu mobile, accordion de
   atualizações, scroll reveal, botão voltar ao topo, colagem do hero.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------ */
  /* 0. REFERÊNCIAS DE ELEMENTOS USADAS EM VÁRIOS PONTOS DO SCRIPT        */
  /* ------------------------------------------------------------------ */
  const backToTop = document.getElementById('backToTop');

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
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------ */
  /* 7. ANO DINÂMICO NO RODAPÉ                                            */
  /* ------------------------------------------------------------------ */
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* 10. BANNER DO HERO                                                   */
  /*    A imagem do banner é definida direto no style.css                 */
  /*    (.hero__banner { background-image: url('assets/hero-banner.jpg')} */
  /*    Sem lógica extra aqui — só troque o arquivo em assets/.           */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* 12. CONTAGEM DE MEMBROS DO DISCORD                                   */
  /*    Busca a contagem aproximada de membros a partir do link de        */
  /*    convite do servidor (não precisa de bot nem de token). Se a       */
  /*    busca falhar (sem internet, CORS bloqueado, etc.), o número de    */
  /*    reserva definido em FALLBACK_MEMBER_COUNT é usado no lugar.       */
  /*                                                                      */
  /*    IMPORTANTE: troque INVITE_CODE se o link do Discord mudar.        */
  /*    OBS: não é possível puxar a FOTO DE PERFIL de uma pessoa           */
  /*    específica do Discord direto pelo navegador — isso exige um bot   */
  /*    rodando em um servidor por causa das regras de privacidade do     */
  /*    Discord. As fotos do Owner/Devs continuam sendo as imagens em     */
  /*    assets/ (troque o arquivo para atualizar a foto de cada um).      */
  /* ------------------------------------------------------------------ */
  const INVITE_CODE = 'MK4pqqtzCh';
  const FALLBACK_MEMBER_COUNT = 92684;

  const formatNumber = (n) => n.toLocaleString('pt-BR');

  const setMemberCount = (n) => {
    const formatted = formatNumber(n);
    const badge = document.getElementById('memberBadgeCount');
    const stat = document.getElementById('statMembers');
    if (badge) badge.textContent = formatted;
    if (stat) stat.textContent = formatted;
  };

  // Mostra o número de reserva imediatamente para nunca deixar "—" na tela
  setMemberCount(FALLBACK_MEMBER_COUNT);

  fetch(`https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true`)
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => {
      if (typeof data.approximate_member_count === 'number') {
        setMemberCount(data.approximate_member_count);
      }
    })
    .catch(() => {
      // Mantém o número de reserva silenciosamente — sem quebrar a página.
    });

});
