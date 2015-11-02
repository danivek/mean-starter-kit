'use strict';

angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ui.router',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'appTemplates'
  ])
  .config(['$translateProvider', 'tmhDynamicLocaleProvider', '$stateProvider', '$urlRouterProvider', function($translateProvider, tmhDynamicLocaleProvider, $stateProvider, $urlRouterProvider) {

    // i18n angular-translate
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/app-locale_',
      suffix: '.json'
    });
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useLocalStorage();

    // i18n angular-dynamic-locale
    tmhDynamicLocaleProvider.localeLocationPattern('/i18n/angular/angular-locale_{{locale}}.js');

    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainCtrl'
    });

    $urlRouterProvider.otherwise('/');

  }])
  .run(['$window', '$translate', 'tmhDynamicLocale', function($window, $translate, tmhDynamicLocale) {

    // Get lang from browser
    var nav = $window.navigator;
    var lang = nav.language || nav.browserLanguage || nav.systemLanguage || nav.userLanguage;

    if (lang.length > 2) {
      lang = lang.substring(0, 2);
    }

    // Set lang to i18n modules
    $translate.use(angular.lowercase(lang));
    tmhDynamicLocale.set(angular.lowercase(lang));
  }]);
