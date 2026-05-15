(function () {
  var l = (navigator.language || navigator.userLanguage || '').toLowerCase();
  document.documentElement.lang = l.startsWith('cs') || l.startsWith('sk') ? 'cs' : 'en';
})();
