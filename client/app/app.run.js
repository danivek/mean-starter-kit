(function() {
  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['$window', '$translate', 'tmhDynamicLocale'];

  function run($window, $translate, tmhDynamicLocale) {

    // Get lang from browser
    var nav = $window.navigator;
    var lang = nav.language || nav.browserLanguage || nav.systemLanguage || nav.userLanguage;

    if (lang.length > 2) {
      lang = lang.substring(0, 2);
    }

    // Set lang to i18n modules
    $translate.use(angular.lowercase(lang));
    tmhDynamicLocale.set(angular.lowercase(lang));
  }
})();
