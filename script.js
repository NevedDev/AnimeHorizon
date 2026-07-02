/* ==========================================================================
   NOVA — script.js
   Toda a interatividade do site: navbar, menu mobile, accordion de
   atualizações, scroll reveal, botão voltar ao topo.
   ========================================================================== */

/* ==========================================================================
   BUSCA AUTOMÁTICA DA IMAGEM DO BANNER
   Roda fora do DOMContentLoaded pra começar a tentar carregar a imagem
   o mais cedo possível (assim que a tag <body>/.hero__banner existir).

   Por que isso existe: hospedagens como o GitHub diferenciam MAIÚSCULA de
   minúscula no nome do arquivo (diferente do Windows). Pra evitar dor de
   cabeça, o site testa uma lista de nomes/formatos comuns dentro da pasta
   assets/ e usa o primeiro que encontrar. Se a sua imagem tiver outro nome,
   é só adicionar ele na lista CANDIDATOS_BANNER abaixo.
   ========================================================================== */
(function carregarBannerAutomaticamente() {
  // Adicione aqui outros nomes/caminhos possíveis, se precisar:
  const CANDIDATOS_BANNER = [
    'assets/hero-banner.jpg',
    'assets/hero-banner.jpeg',
    'assets/hero-banner.png',
    'assets/hero-banner.webp',
    'assets/Hero-Banner.jpg',
    'assets/Hero-Banner.png',
    'assets/HERO-BANNER.JPG',
    'assets/banner.jpg',
    'assets/banner.png',
    'assets/Banner.jpg',
    'assets/Banner.png',
    'assets/Asta.png',
    'assets/asta.png',
    'hero-banner.jpg',
    'hero-banner.png',
    'banner.jpg',
    'banner.png'
  ];

  function aplicarImagem(caminho) {
    const banner = document.querySelector('.hero__banner');
    if (banner) banner.style.backgroundImage = `url('${caminho}')`;
  }

  function tentarProximo(indice) {
    if (indice >= CANDIDATOS_BANNER.length) {
      console.warn(
        '[Banner] Nenhuma imagem encontrada nos caminhos testados. ' +
        'Confirme se o arquivo está dentro da pasta "assets" e adicione ' +
        'o nome exato dele na lista CANDIDATOS_BANNER em script.js.'
      );
      return;
    }
    const caminho = CANDIDATOS_BANNER[indice];
    const teste = new Image();
    teste.onload = () => aplicarImagem(caminho);
    teste.onerror = () => tentarProximo(indice + 1);
    teste.src = caminho;
  }

  tentarProximo(0);
})();

/* ==========================================================================
   BUSCA AUTOMÁTICA DAS FOTOS DE PERFIL (Desenvolvedores / Donos)
   Funciona junto com o atributo data-photo-base="NomeDoArquivo" no <img>.
   Testa extensões e variações de maiúscula/minúscula automaticamente,
   assim não precisa acertar ".jpg", ".png" etc. na hora de subir a foto.
   ========================================================================== */
(function carregarFotosDePerfilAutomaticamente() {
  const EXTENSOES = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'PNG', 'JPEG'];

  function gerarCandidatos(nomeBase) {
    const candidatos = [];
    EXTENSOES.forEach((ext) => {
      candidatos.push(`assets/${nomeBase}.${ext}`);
    });
    return candidatos;
  }

  function tentarProximaFoto(img, candidatos, indice) {
    if (indice >= candidatos.length) {
      console.warn(
        `[Foto] Nenhuma imagem encontrada para "${img.dataset.photoBase}". ` +
        `Confirme se o arquivo está dentro da pasta "assets".`
      );
      return; // mantém a foto placeholder que já está no src
    }
    const caminho = candidatos[indice];
    const teste = new Image();
    teste.onload = () => { img.src = caminho; };
    teste.onerror = () => tentarProximaFoto(img, candidatos, indice + 1);
    teste.src = caminho;
  }

  document.querySelectorAll('img[data-photo-base]').forEach((img) => {
    const nomeBase = img.dataset.photoBase;
    const candidatos = gerarCandidatos(nomeBase);
    tentarProximaFoto(img, candidatos, 0);
  });
})();

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

});
