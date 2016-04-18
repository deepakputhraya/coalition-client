/* global malarkey:false, moment:false, autobahn: false , paper: false*/

'use strict';

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { ChannelController } from './channel/channel.controller';
import { ChannelService } from './channel/channel.service';
import { ChatMessageDirective } from '../app/components/message/message.directive';
import { CanvasDirective } from '../app/components/canvas/canvas.directive';
import { page404Directive } from '../app/components/404/404.directive';

angular.module('web', ['ngResource', 'ngRoute'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .constant('autobahn', autobahn)
  .constant('paper', paper)
  .constant('routerIp', '54.191.195.184:8080')
  .constant('server', '54.191.195.184:5000')
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('channel', ChannelService)
  .controller('MainController', MainController)
  .controller('ChannelController', ChannelController)
  .directive('customCanvas', CanvasDirective)
  .directive('chatMessage', ChatMessageDirective)
  .directive('page404', page404Directive)
  .filter('sanitize', ['$sce', function($sce) {
      return function(htmlCode){
          return $sce.trustAsHtml(htmlCode);
      };
  }]);
