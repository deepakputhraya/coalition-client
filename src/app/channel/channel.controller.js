'use strict';

export class ChannelController {
    constructor($compile, $scope, $sce, $route, channel, moment) {
        'ngInject';

        var _this = this;
        this.scope = $scope;
        this.compile = $compile;
        this.sce = $sce;
        this.channel = channel;
        this.moment = moment;
        this.channelName = $route.current.params.channelId;
        this.existance = true;
        this.username = null;
        this.message = {};
        this.text = '';

        channel.connect()
        .then(session => {
            console.log(session);
            $scope.session = session;
            channel.check(session, this.channelName)
            .then(res => {
                //Check if the channel exists else throw err
                if (res.status || (_this.channelName === channel.getCreatedChannelId())) {
                    while(!_this.username) {
                        _this.username = window.prompt('Enter your name:');
                    }
                    channel.setUsername(_this.username);
                    return res;
                }
                _this.existance = false;
                throw {
                    message: 'The channel does not exists'
                };
            })
            .then(() => {
                return channel.subscribe(session, this.channelName, function (msg) {
                    _this.onMessageReceive(msg);
                });
            })
            .then((sub) => {
                console.log(sub.id);
                channel.previousMessages(sub.id)
                .then(messages => {
                    console.log(messages);
                    _this.messages = messages;
                    messages.forEach(function(msg) {
                        _this.onMessageReceive(msg);
                    });
                });

                channel.previousCanvas(sub.id)
                .then(canvas => {
                    console.log(canvas);
                    _this.canvas = canvas;
                    canvas.forEach(function(el) {
                        channel.canvasEventHandler(el);
                    });
                });
                return sub;
            })
            .then(sub => {
                console.log(sub.topic);
                console.log('Subscription Id:', sub.id);
                console.log('Session Id:', $scope.session._id);
                channel.setSubscriptionId(sub.id);
                _this.data = channel.data;
                this.channel.addPerson({
                    join: _this.username,
                    id: $scope.session._id
                });
                channel.publish({
                    join: _this.username,
                    id: $scope.session._id
                });
                $scope.$apply();
            })
            .catch(err => {
                $scope.$apply();
                console.log(err);
            });
        });
    }

    onMessageReceive(message) {
        if(message.join) {
            this.channel.addPerson(message);
        }

        var el = null,
            chatMessageElement = null;
        if (message.body) {
            message.time = message.time || this.moment().format('LLL');
            message.body = message.body.replace('\n', '</p><p>').replace(' ', '&nbsp;');
            message.body = ['<p>', message.body, '</p>'].join('');
        }
        chatMessageElement = angular.element('<chat-message message=\'' + JSON.stringify(message) + '\'></chat-message>');
        el = this.compile(chatMessageElement)(this.scope);
        angular.element(document.querySelector('.messages-container')).append(el);
    }

    sendMessage() {
        this.text = this.text.trim();
        var message = {
            username : this.username,
            body: this.text,
            time: this.moment().format('LLL')
        };
        this.channel.publish(message);
        message.body = message.body.split('\n')
                            .join('</p><p>')
                            .replace(' ', '&nbsp;');
        message.body = ['<p>', message.body, '</p>'].join('');
        var chatMessageElement = angular.element('<chat-message message=\'' + JSON.stringify(message) + '\'></chat-message>');
        var el = this.compile(chatMessageElement)(this.scope);
        angular.element(document.querySelector('.messages-container')).append(el);
        this.text = '';
    }

    keyup(event) {
        if (event.keyCode === 13 && !event.shiftKey && this.text.trim()) {
            this.sendMessage();
        }
    }
}
