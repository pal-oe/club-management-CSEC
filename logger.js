const EventEmitter = require('events')

class Logger extends EventEmitter{
    log(message){
    //send http request
        console.log(message);
        this.emit('messageLogged', {id: 1, url:'http://'})
    }
}

module.exports = Logger;