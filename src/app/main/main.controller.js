'use strict';

export class MainController {
  constructor (channel, $location, $scope) {
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1457971579693;

    channel.connect()
    .then(session => {
        console.log(session);
        channel.create(session)
            .then(channelId => {
                console.log('Create channel :', channelId);
                channel.setCreateChannelId(channelId);
                $location.path('/' + channelId);
                $scope.$apply();
            }, err => {
                console.log(err);
            });
    });


  }

  startChat() {
      console.log('starting new chat...');
  }
}
