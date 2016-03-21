'use strict';

export function routerConfig ($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/', {
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .when('/:channelId', {
        templateUrl: 'app/channel/channel.html',
        controller: 'ChannelController',
        controllerAs: 'channel'
    })
    .otherwise({
      redirectTo: '/'
    });
}
