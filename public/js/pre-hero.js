(function () {
  var l = document.documentElement.lang;
  var h = document.getElementById('ph1');
  var p = document.getElementById('pp');
  if (!h || !p) return;
  if (l === 'cs') {
    h.textContent =
      'Rychle stavím funkční prototypy digitálních produktů pomocí AI nástrojů';
    p.textContent =
      'Pomůžu vám proměnit nápad v jednoduchou aplikaci, kterou si můžete reálně vyzkoušet, ukázat zákazníkům nebo týmu a ověřit, jestli má smysl ji dál rozvíjet.';
  } else {
    h.textContent =
      'I quickly build functional prototypes of digital products using AI tools';
    p.textContent =
      'I will help you turn an idea into a simple app you can try for real, show to clients or teammates, and see whether it makes sense to develop it further.';
  }
})();
