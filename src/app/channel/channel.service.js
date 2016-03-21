'use strict';

export class ChannelService{
    constructor($http, autobahn, routerIp) {
        'ngInject';
        this.http = $http;
        this.autobahn = autobahn;
        this.routerIp = routerIp;
        this.username = null;
        this.createChannelId = null;
        this.subscriptionId = null;
        this.people = [];
        this.peopleCount = 0;
        this.data = {
            username: null,
            peopleCount : 0
        };
        this.canvasEventHandler = null;
    }

    connect() {
        var _this =  this;
        console.log('connect!');
        return new Promise(function (resolve) {
            if (_this.session) {
                return resolve(_this.session);
            }
            _this.http.get('http://api-coalition.herokuapp.com/user/1')
                .then(function () {
                    var wsuri = 'ws://' + _this.routerIp +'/ws';
                    var connection = new _this.autobahn.Connection({
                        url: wsuri,
                        realm: 'realm1'
                    });
                    connection.onopen = function (session) {
                        console.log('connected');
                        _this.session = session;
                        resolve(session);
                    };

                    connection.open();
                    console.log(connection.isConnected);
                    connection.onclose = function() {
                        console.log('closed!');
                    };
                });
        });
    }

    create(session) {
        return new Promise(function (resolve, reject) {
            session.call('channel.create', [])
                .then(channelId => {
                    resolve(channelId);
                }, err => {
                    reject(err);
                });
        });
    }

    check(session, channelId) {
        return new Promise(function (resolve, reject) {
            session.call('channel.join', [], {
                'channelId': channelId
            })
            .then(res => {
                resolve(res);
            }, err => {
                reject(err);
            });
        });
    }

    subscribe(session, channelName, eventHandler) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            session.subscribe(channelName, function (args, message) {
                if (message.canvas) {
                    return _this.canvasEventHandler(message);
                }
                eventHandler(message);
            })
            .then(sub => {
                _this.topic = sub.topic;
                session.subscribe('wamp.subscription.on_unsubscribe', function (args) {
                    var sessionId = args[0];
                    var subscriptionId = args[1];
                    if(_this.subscriptionId === subscriptionId) {
                        var pos = -1;
                        _this.people.forEach(function (person, index) {
                            if (person.id === sessionId) {
                                pos = index;
                                _this.data.peopleCount = _this.data.peopleCount - 1;
                                eventHandler({
                                    leave: person.join
                                });
                            }
                        });
                        if(pos >= 0) {
                            _this.people.splice(pos, 1);
                            console.log(_this.people);
                        }
                    }
                });

                session.call(sub.topic + '.people', [])
                .then(function (people) {
                    console.log(people);
                    _this.people = _this.people.concat(people);
                    _this.data.peopleCount = _this.people.length;
                    resolve(sub);
                }, function (err) {
                    console.log(err);
                    resolve(sub);
                });

                session.register(sub.topic + '.people', function () {
                    return _this.people;
                }, { invoke: 'first' })
                .then(function (reg) {
                    console.log('registered ', reg.procedure);
                },
                function (err) {
                    console.log('failed to register procedure: ' + err);
                });

            }, err => {
                console.log(err);
                reject(err);
            });
        });
    }

    publish(message) {
        this.session.publish(this.topic, [], message);
    }

    publishCanvas(canvas) {
        canvas.canvas = canvas.canvas ? canvas.canvas: true;
        this.session.publish(this.topic, [], canvas);
    }

    setCreateChannelId(channelId) {
        this.createChannelId = channelId;
    }

    getCreatedChannelId() {
        return this.createChannelId;
    }

    setSubscriptionId(id) {
        this.subscriptionId = id;
    }

    addPerson(person) {
        this.people.push(person);
        this.data.peopleCount = this.data.peopleCount + 1;
    }

    getPeople() {
        return this.people;
    }

    setUsername(username) {
        this.data.username = username;
    }

    setCanvasEventHandler(handler) {
        this.canvasEventHandler = handler;
    }
}
