const summary = "Creando página de usuario";
const bot = require('nodemw'), client = new bot('./config.json');

function createUserPages() {
    client.logIn(function () {
        client.getSiteInfo(['general'], function (err, info) {
            client.getArticle("User:BranDaniMB", function (err, content) {
                if (content === "" || content === undefined) {
                    if (info.general.lang === "es") {
                        content = "{{raw:w:BranDaniMB|es}}";
                        client.edit("User:BranDaniMB", content, summary, function () {
                            client.log("Página de BranDaniMB creada.")
                        });
                    } else if (info.general.lang === "en") {
                        content = "{{raw:w:BranDaniMB|en}}";
                        client.edit("User:BranDaniMB", content, summary, function () {
                            client.log("Página de BranDaniMB creada.")
                        });
                    } else {
                        content = "{{raw:w:BranDaniMB}}";
                        client.edit("User:BranDaniMB", content, summary, function () {
                            client.log("Página de BranDaniMB creada.")
                        });
                    }
                }
            });
            client.getArticle("User:Pack-bot", function (err, content) {
                if (content === "" || content === undefined) {
                    if (info.general.lang === "es") {
                        content = "{{raw:w:Pack-bot|es}}";
                        client.edit("User:Pack-bot", content, summary, function () {
                            client.log("Página de Pack-bot creada.")
                        });
                    } else if (info.general.lang === "en") {
                        content = "{{raw:w:Pack-bot|en}}";
                        client.edit("User:Pack-bot", content, summary, function () {
                            client.log("Página de Pack-bot creada.")
                        });
                    } else {
                        content = "{{raw:w:Pack-bot}}";
                        client.edit("User:Pack-bot", content, summary, function () {
                            client.log("Página de Pack-bot creada.")
                        });
                    }
                }
            });
        });
    });
}

exports.createUserPages = createUserPages();