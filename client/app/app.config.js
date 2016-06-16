(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  config.$inject = ['$translateProvider', 'tmhDynamicLocaleProvider', '$httpProvider', '$compileProvider'];

  function config($translateProvider, tmhDynamicLocaleProvider, $httpProvider, $compileProvider) {

    // Angular perfs best practices
    $httpProvider.useApplyAsync(true);
    $compileProvider.debugInfoEnabled(false);

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
