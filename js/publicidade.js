document.addEventListener('DOMContentLoaded', function() {
  // Pop-up Central
  const popupCentral = document.getElementById('popup-central');
  const popupCentralClose = document.getElementById('popup-central-close');
  const popupCentralKey = 'emj_popup_central';

  // Banner Flutuante
  const bannerFlutuante = document.getElementById('banner-flutuante');
  const bannerFlutuanteClose = document.getElementById('banner-flutuante-close');
  const bannerFlutuanteKey = 'emj_banner_flutuante';

  // Mostra pop-up central após 6s, se não foi fechado nesta sessão
  if (!sessionStorage.getItem(popupCentralKey)) {
    setTimeout(() => {
      popupCentral.style.display = 'flex';
    }, 12000); // 12000 milissegundos = 12 segundos
  }
  popupCentralClose.addEventListener('click', function() {
    popupCentral.style.display = 'none';
    sessionStorage.setItem(popupCentralKey, 'closed');
  });

  // Mostra banner flutuante ao rolar 400px, se não foi fechado nesta sessão
  let bannerShown = false;
  window.addEventListener('scroll', function() {
    if (!bannerShown && !sessionStorage.getItem(bannerFlutuanteKey) && window.scrollY > 400) {
      bannerFlutuante.style.display = 'block';
      bannerShown = true;
    }
  });
  bannerFlutuanteClose.addEventListener('click', function() {
    bannerFlutuante.style.display = 'none';
    sessionStorage.setItem(bannerFlutuanteKey, 'closed');
  });



  // Banner Flutuante Esquerda
  const bannerEsq = document.getElementById('banner-flutuante-esq');
  const bannerEsqClose = document.getElementById('banner-flutuante-esq-close');
  const bannerEsqKey = 'emj_banner_flutuante_esq';
  let bannerEsqShown = false;

  window.addEventListener('scroll', function() {
    if (
      !bannerEsqShown &&
      !sessionStorage.getItem(bannerEsqKey) &&
      window.scrollY > 800 // aparece depois do banner da direita
    ) {
      bannerEsq.style.display = 'block';
      bannerEsqShown = true;
    }
  });
  bannerEsqClose.addEventListener('click', function() {
    bannerEsq.style.display = 'none';
    sessionStorage.setItem(bannerEsqKey, 'closed');
  });

  // Publicidade no Footer
  const footerPub = document.getElementById('footer-publicidade');
  const footerPubClose = document.getElementById('footer-publicidade-close');
  const footerPubKey = 'emj_footer_publicidade';
  let footerPubShown = false;

  window.addEventListener('scroll', function() {
    if (
      !footerPubShown &&
      !sessionStorage.getItem(footerPubKey)
    ) {
      const footer = document.querySelector('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          footerPub.style.display = 'flex';
          footerPubShown = true;
        }
      }
    }
  });
  footerPubClose.addEventListener('click', function() {
    footerPub.style.display = 'none';
    sessionStorage.setItem(footerPubKey, 'closed');
  });



  // Botão "Voltar ao Topo"
const btnTopo = document.getElementById('btn-topo');
const btnDescer = document.getElementById('btn-descer');
const footer = document.querySelector('footer');

let lastScrollY = window.scrollY || window.pageYOffset;

function atualizarBotoesFlutuantes() {
  const scrollY = window.scrollY || window.pageYOffset;
  const windowH = window.innerHeight;

  // No topo
  if (scrollY < 50) {
    btnDescer.style.display = 'flex';
    btnTopo.style.display = 'none';
  }
  // No footer
  else if (footer && (footer.getBoundingClientRect().top < windowH - 80)) {
    btnDescer.style.display = 'none';
    btnTopo.style.display = 'flex';
  }
  // Meio da página
  else {
    if (scrollY > lastScrollY) {
      // Descendo
      btnDescer.style.display = 'flex';
      btnTopo.style.display = 'none';
    } else {
      // Subindo
      btnDescer.style.display = 'none';
      btnTopo.style.display = 'flex';
    }
  }
  lastScrollY = scrollY;
}

window.addEventListener('scroll', atualizarBotoesFlutuantes);
window.addEventListener('resize', atualizarBotoesFlutuantes);
atualizarBotoesFlutuantes();

btnTopo.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

btnDescer.addEventListener('click', function() {
  if (footer) {
    const footerTop = footer.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: footerTop, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});
});


