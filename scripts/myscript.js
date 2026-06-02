/* ===========================
   StepStore - myscript.js
   =========================== */

/* --- Sepet verisi (localStorage ile kalıcı) --- */
var sepet = JSON.parse(localStorage.getItem('stepstore-sepet')) || [];

/* Sepeti localStorage'a kaydet */
function sepetKaydet() {
  localStorage.setItem('stepstore-sepet', JSON.stringify(sepet));
}

/* Sepet sayacını navbar'da güncelle */
function sepetSayacGuncelle() {
  var sayaclar = document.querySelectorAll('.sepet-sayac');
  var toplam = 0;
  for (var i = 0; i < sepet.length; i++) {
    toplam += sepet[i].adet;
  }
  for (var j = 0; j < sayaclar.length; j++) {
    sayaclar[j].textContent = toplam > 0 ? '(' + toplam + ')' : '';
  }
}

/* Sepete ürün ekle */
function sepeteEkle(id, isim, fiyat, emoji, beden) {
  var bulunan = -1;
  for (var i = 0; i < sepet.length; i++) {
    if (sepet[i].id === id && sepet[i].beden === beden) {
      bulunan = i;
      break;
    }
  }
  if (bulunan >= 0) {
    sepet[bulunan].adet += 1;
  } else {
    sepet.push({ id: id, isim: isim, fiyat: fiyat, emoji: emoji, beden: beden, adet: 1 });
  }
  sepetKaydet();
  sepetSayacGuncelle();
  bildirimGoster(isim + ' sepete eklendi!');
}

/* Bildirim göster */
function bildirimGoster(mesaj) {
  var mevcut = document.getElementById('bildirim-kutusu');
  if (mevcut) {
    mevcut.remove();
  }
  var kutu = document.createElement('div');
  kutu.id = 'bildirim-kutusu';
  kutu.textContent = '✅ ' + mesaj;
  kutu.style.cssText = 'position:fixed;bottom:28px;right:28px;background:#0a2463;color:#fff;padding:14px 22px;border-radius:10px;font-family:DM Sans,sans-serif;font-weight:600;font-size:0.92rem;z-index:9999;box-shadow:0 4px 20px rgba(10,36,99,0.25);animation:bildirimAc 0.3s ease;';
  document.head.insertAdjacentHTML('beforeend', '<style>@keyframes bildirimAc{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}</style>');
  document.body.appendChild(kutu);
  setTimeout(function () {
    kutu.remove();
  }, 2800);
}

/* --- Hamburger menü --- */
function hamburgerBaslat() {
  var hamburger = document.querySelector('.navbar__hamburger');
  var menu = document.querySelector('.navbar__menu');
  if (!hamburger || !menu) return;
  hamburger.addEventListener('click', function () {
    menu.classList.toggle('acik');
  });
}

/* --- Beden seçimi --- */
function bedenSecimBaslat() {
  var bedenBtnler = document.querySelectorAll('.beden__btn');
  bedenBtnler.forEach(function (btn) {
    btn.addEventListener('click', function () {
      bedenBtnler.forEach(function (b) { b.classList.remove('secili'); });
      btn.classList.add('secili');
    });
  });
}

/* --- Filtre butonları (ürünler sayfası) --- */
function filtreBaslat() {
  var filtreBtnler = document.querySelectorAll('.filtre__btn');
  var urunKartlar = document.querySelectorAll('.urun__kart');

  filtreBtnler.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filtreBtnler.forEach(function (b) { b.classList.remove('aktif'); });
      btn.classList.add('aktif');

      var kategori = btn.getAttribute('data-kategori');
      urunKartlar.forEach(function (kart) {
        if (kategori === 'hepsi') {
          kart.style.display = 'flex';
        } else if (kart.getAttribute('data-kategori') === kategori) {
          kart.style.display = 'flex';
        } else {
          kart.style.display = 'none';
        }
      });
    });
  });
}

/* --- Sepet sayfası --- */
function sepetSayfasiBaslat() {
  var sepetListe = document.getElementById('sepet-liste');
  var sepetBos = document.getElementById('sepet-bos');
  var araToplamEl = document.getElementById('ara-toplam');
  var kargoEl = document.getElementById('kargo-ucret');
  var genelToplamEl = document.getElementById('genel-toplam');

  if (!sepetListe) return;

  function sepetGuncelle() {
    sepetListe.innerHTML = '';
    if (sepet.length === 0) {
      sepetListe.style.display = 'none';
      if (sepetBos) sepetBos.style.display = 'block';
      if (araToplamEl) araToplamEl.textContent = '0 ₺';
      if (kargoEl) kargoEl.textContent = '0 ₺';
      if (genelToplamEl) genelToplamEl.textContent = '0 ₺';
      return;
    }
    sepetListe.style.display = 'block';
    if (sepetBos) sepetBos.style.display = 'none';

    var araToplam = 0;
    sepet.forEach(function (urun, index) {
      araToplam += urun.fiyat * urun.adet;

      var div = document.createElement('div');
      div.className = 'sepet__urun';
      div.innerHTML =
        '<div class="sepet__urun-resim">' + urun.emoji + '</div>' +
        '<div class="sepet__urun-bilgi">' +
          '<div class="sepet__urun-isim">' + urun.isim + '</div>' +
          '<div class="sepet__urun-beden">Beden: ' + urun.beden + '</div>' +
        '</div>' +
        '<div class="sepet__adet">' +
          '<button class="adet__btn" onclick="adetDegistir(' + index + ', -1)">−</button>' +
          '<span class="adet__sayi">' + urun.adet + '</span>' +
          '<button class="adet__btn" onclick="adetDegistir(' + index + ', 1)">+</button>' +
        '</div>' +
        '<div class="sepet__fiyat">' + (urun.fiyat * urun.adet).toLocaleString('tr-TR') + ' ₺</div>' +
        '<button class="sil__btn" onclick="urunSil(' + index + ')" title="Kaldır">✕</button>';
      sepetListe.appendChild(div);
    });

    var kargo = araToplam >= 1500 ? 0 : 99;
    var genel = araToplam + kargo;

    if (araToplamEl) araToplamEl.textContent = araToplam.toLocaleString('tr-TR') + ' ₺';
    if (kargoEl) kargoEl.textContent = kargo === 0 ? 'Ücretsiz' : kargo + ' ₺';
    if (genelToplamEl) genelToplamEl.textContent = genel.toLocaleString('tr-TR') + ' ₺';
  }

  window.adetDegistir = function (index, miktar) {
    sepet[index].adet += miktar;
    if (sepet[index].adet <= 0) {
      sepet.splice(index, 1);
    }
    sepetKaydet();
    sepetSayacGuncelle();
    sepetGuncelle();
  };

  window.urunSil = function (index) {
    sepet.splice(index, 1);
    sepetKaydet();
    sepetSayacGuncelle();
    sepetGuncelle();
  };

  sepetGuncelle();
}

/* --- İletişim formu --- */
function iletisimFormuBaslat() {
  var form = document.getElementById('iletisim-formu');
  var basari = document.getElementById('form-basari');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (basari) {
      basari.style.display = 'block';
    }
    form.reset();
    setTimeout(function () {
      if (basari) basari.style.display = 'none';
    }, 4000);
  });
}

/* --- Detay sayfası sepete ekle butonu --- */
function detaySepeteEkleBaslat() {
  var ekleBtn = document.getElementById('detay-sepete-ekle');
  if (!ekleBtn) return;

  ekleBtn.addEventListener('click', function () {
    var seciliBeden = document.querySelector('.beden__btn.secili');
    if (!seciliBeden) {
      bildirimGoster('Lütfen önce beden seçin!');
      return;
    }
    var isim = ekleBtn.getAttribute('data-isim');
    var fiyat = parseInt(ekleBtn.getAttribute('data-fiyat'));
    var emoji = ekleBtn.getAttribute('data-emoji');
    var id = ekleBtn.getAttribute('data-id');
    var beden = seciliBeden.textContent;
    sepeteEkle(id, isim, fiyat, emoji, beden);
  });
}

/* --- Sayfa yüklenince tüm modülleri başlat --- */
document.addEventListener('DOMContentLoaded', function () {
  hamburgerBaslat();
  bedenSecimBaslat();
  filtreBaslat();
  sepetSayfasiBaslat();
  iletisimFormuBaslat();
  detaySepeteEkleBaslat();
  sepetSayacGuncelle();
});
