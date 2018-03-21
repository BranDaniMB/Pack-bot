/*
 * Creador BranDaniMB
 * Este documento se usa para crear las páginas de usuario si el bot se usa en una wiki nueva.
 * Puedes llamar este metodo importandolo.
*/

// Resumen de edición
const summary = "Creando página de usuario";

// Crear instancia de bot
const bot = require('nodemw'), client = new bot('./config.json');

// Declarar función
function createUserPages() {
    //Iniciar sesión con el usuario asignado
    client.logIn(function () {
        //Obtener el lenguaje de la comunidad
        client.getSiteInfo(['general'], function (err, info) {
            //Obtener página de usuario que maneja el bot - Cambiar el nombre por el usuario que maneja el bot
            client.getArticle("User:BranDaniMB", function (err, content) {
                // Verifica la existencia del perfil, sino existe lo crea segun los idiomas y verificaciones siguientes
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
            // Obtener página de usuario del bot - Cambiar el nombre por el nombre de usuario del bot
            client.getArticle("User:Pack-bot", function (err, content) {
                // Verifica la existencia del perfil, sino existe lo crea segun los idiomas y verificaciones siguientes
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

// Exporta el método
exports.createUserPages = createUserPages();
