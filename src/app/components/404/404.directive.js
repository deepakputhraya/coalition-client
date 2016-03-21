'use strict';

export function page404Directive() {
  'ngInject';

  var directive = {
    restrict: 'AE',
    templateUrl: 'app/components/404/404.html',
    bindToController: true
  };

  return directive;
}
