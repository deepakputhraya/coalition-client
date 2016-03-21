'use strict';

export function ChatMessageDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
        message: '='
    },
    templateUrl: 'app/components/message/message.html',
    controller: MessageController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class MessageController {
  constructor () {
    'ngInject';
    console.log(this.message);
  }
}
