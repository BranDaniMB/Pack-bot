// Exportamos todos los siguientes métodos
module.exports = {
    // Uso de Chat-bot.js - formatea a URL
    toURL: function toURL(username, server) {
        username = username.replace(/\s/g, "_");
        return "http://" + server + ".wikia.com/wiki/User:" + username;
    },
    // Uso de Chat-bot.js - Crea una fecha en huso UTC
    date: function getDate(today) {
        var dd = today.getUTCDate();
        var mm = today.getUTCMonth() + 1; //today es 0!
        var yyyy = today.getUTCFullYear();
        var hh = today.getUTCHours();
        var ss = today.getUTCSeconds();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (hh < 10) {
            hh = '0' + hh;
        }
        if (ss < 10) {
            ss = '0' + ss;
        }

        return hh + ":" + ss + " " + dd + '/' + mm + '/' + yyyy + " UTC";
    },
    // Añadir a el registro
    addLogs: function addLogs(file, content) {
        // https://gist.github.com/AngelMunoz/ffb0783e16054e210c869f85f241a408
        const fs = require('fs');
        
        fs.appendFile(file, content, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    },
    // Borrar todos los registros
    deleteLogs: function deleteLogs(file) {
        // https://gist.github.com/AngelMunoz/ffb0783e16054e210c869f85f241a408
        const fs = require('fs');
        
        fs.writeFile(file, "", function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
};
