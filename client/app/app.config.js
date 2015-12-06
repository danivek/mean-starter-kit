(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  config.$inject = ['$translateProvider', 'tmhDynamicLocaleProvider'];

  function config($translateProvider, tmhDynamicLocaleProvider) {
    // i18n angular-translate
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/app-locale_',
      suffix: '.json'
    });
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useLocalStorage();

    // i18n angular-dynamic-locale
    tmhDynamicLocaleProvider.localeLocationPattern('/i18n/angular/angular-locale_{{locale}}.js');
  }
})();
