// Requiere tools.js
const tools = require("../tools.js");
// Crear páginas de usuario
const userPages = require("./CreateUserPages.js");

// Asignar nombre de usuario, contraseña, servidor.
const currentUsername = "", currentPassword = "", currentServer = "";

// Habilitar editar desde el chat
var contentEdit = true;
// Habilitar registros
var logs = false;
// Archivo de registros, sino se asigna ningun valor el registro se llevara a cabo mediante la consola
var currentLogs = "./example.txt";
// Agrega los nombres de los usuarios que tienen permisos de administrador del bot
const sysops = [];
// Array con los usuarios que ya han ingresado al chat despues del bot.
var usersWelcome = [];

//Crear instancia del bot usando Gekkou
const chatBot = require("gekkou");
const chatClient = new chatBot(currentUsername, currentPassword);

//Crear instancia del bot usando Nodemw
const editBot = require("nodemw");
const editClient = new editBot({
    server: currentServer + ".wikia.com",
    username: currentUsername,
    password: currentPassword,
    debug: true,
});

//Crear páginas de usuario
userPages.CreateUserPages;

// Mensaje de acceso al chat
chatClient.on("ready", () => {
    console.log("Power-on");
});

// Ingreso de usuarios al chat y su respectivo saludo
chatClient.on("userJoin", (join) => {
    if (!usersWelcome.includes(join.id)) {
        usersWelcome.push(join.id);
        chatClient.createMessage(join.room.id, "¡Bienvenid@ al chat " + join.id + "!\n¡Espero que tu estancia sea la mejor!");
        if (logs) {
            if (currentLogs !== undefined) {
                tools.addLogs(currentLogs, "\n[" + tools.date(new Date()) + "]" + "UserJoin: " + tools.toURL(join.id, currentServer));
            } else {
                console.log("UserJoin: " + tools.toURL(join.id, currentServer));
            }
        }        
    }
});

// Cada vez que el usuario emite un mensaje
chatClient.on("messageCreate", (msg) => {
    // Verifica el mensaje como comando
    if (msg.author.id !== chatClient.username && msg.content.startsWith('/')) {
        const regex = /(\w+|".+?")/;
        let args = msg.content.slice(1).trim().split(regex);

        for (let index = 0; index < args.length; index++) {
            args[index] = args[index].trim();
            if (args[index] === "") {
                args.splice(index, 1)
            }
        }
        for (let index = 0; index < args.length; index++) {
            args[index] = args[index].replace(/\"/g, "");
        }

        const command = args.shift().toLowerCase();
        
        // Bienvenida
        if (command === "welcome") {
            chatClient.createMessage(msg.room.id, "¡Bienvenid@ al chat!\n¡Espero que tu estancia sea la mejor!");
            register(msg, command);
        // Saludar al bot
        } else if (command === "hello") {
            chatClient.createMessage(msg.room.id, "¡Hola " + msg.author.username + "!");
            register(msg, command);
        // Despedirse del bot
        } else if (command === "bye") {
            chatClient.createMessage(msg.room.id, "¡Adiós " + msg.author.username + "!");
            register(msg, command);
        // Obtener el tiempo UTC - no funcional
        } else if (command === "time") {
            chatClient.createMessage(msg.room.id, toString(tools.date(new Date())));
            register(msg, command);
        // Saludar a todos
        } else if (command === "greet" && sysops.includes(msg.author.username)) {
            chatClient.createMessage(msg.room.id, "¡Hola a todos!");
            register(msg, command);
        // Sacar al bot del chat
        } else if (command === "exit" && sysops.includes(msg.author.username)) {
            chatClient.createMessage(msg.room.id, "¡Adiós a todos!");
            register(msg, command);
            chatClient.disconnect();
        // Obtener ayuda del bot - modificar según sea necesario.
        } else if (command === "help") {
            chatClient.createMessage(msg.room.id, "¡Hola!, me llamo" + currentUsername + ".");
            register(msg, command);
        // Desactivar o activar la funcionalidad de edición, mover o borrar - Activada por defecto
        } else if (command === "edit" && sysops.includes(msg.author.username)) {
            if (contentEdit && args[0] === "on") {
                chatClient.createMessage(msg.room.id, "La función de edición ya estaba activa.");
                register(msg, command);
            } else if (contentEdit === false && args[0] === "on") {
                contentEdit = true;
                chatClient.createMessage(msg.room.id, "La función de edición se ha activado.");
                register(msg, command);
            } else if (contentEdit && args[0] === "off") {
                contentEdit = false;
                chatClient.createMessage(msg.room.id, "La función de edición se ha desactivado.");
                register(msg, command);
            } else if (contentEdit === false && args[0] === "off") {
                chatClient.createMessage(msg.room.id, "La función de edición ya estaba desactivada.");
                register(msg, command);
            } else {
                chatClient.createMessage(msg.room.id, "Funcionalidad: " + contentEdit);
                register(msg, command);
            }
        // Desactivar o activar la funcionalidad de registro - Desactivada por defecto
        } else if (command === "logs" && sysops.includes(msg.author.username)) {
            if (logs && args[0] === "on") {
                chatClient.createMessage(msg.room.id, "La función de registro ya estaba activa.");
                register(msg, command);
            } else if (logs === false && args[0] === "on") {
                logs = true;
                chatClient.createMessage(msg.room.id, "La función de registro se ha activado.");
                register(msg, command);
            } else if (logs && args[0] === "off") {
                logs = false;
                chatClient.createMessage(msg.room.id, "La función de registro se ha desactivado.");
                register(msg, command);
            } else if (logs === false && args[0] === "off") {
                chatClient.createMessage(msg.room.id, "La función de registro ya estaba desactivada.");
                register(msg, command);
            } else if (logs && currentLogs !== undefined && args[0] === "clean") {
                chatClient.createMessage(msg.room.id, "El registro se ha limpiado.");
                tools.deleteLogs(currentLogs)
            } else if (logs && currentLogs === undefined && args[0] === "clean") {
                chatClient.createMessage(msg.room.id, "No hay archivo de registro.");
                register(msg, command);
            } else {
                chatClient.createMessage(msg.room.id, "Funcionalidad: " + logs);
                register(msg, command);
            }
        // Editar
        } else if (contentEdit && command === 'fedit' && args.length === 3 && sysops.includes(msg.author.username)) {
            chatClient.createMessage(msg.room.id, "Editando...");
            editClient.logIn(function () {
                editClient.edit(args[0], args[1], args[2], function (userData) {
                    chatClient.createMessage(msg.room.id, "¡Finalizado");
                    register(msg, command);
                });
            });
        // Mover
        } else if (contentEdit && command === 'fmove' && args.length === 3 && sysops.includes(msg.author.username)) {
            chatClient.createMessage(msg.room.id, "Moviendo...");
            editClient.logIn(function () {
                editClient.move(args[0], args[1], args[2], function (userData) {
                    chatClient.createMessage(msg.room.id, "¡Finalizado!");
                    register(msg, command);
                });
            });
        // Borrar - no funcional
        } else if (contentEdit && command === 'fdelete' && args.length === 2 && sysops.includes(msg.author.username)) {
            chatClient.createMessage(msg.room.id, "Borrando...");
            editClient.logIn(function () {
                editClient.purge(args[0], args[1], function (err, data) {
                    chatClient.createMessage(msg.room.id, "¡Finalizado!");
                    register(msg, command);
                });
            });
        // Obtener información del wiki
        } else if (command === 'siteinfo' && sysops.includes(msg.author.username)) {
            editClient.getSiteInfo(['general', 'namespaces'], function (err, info) {
                chatClient.createMessage(msg.room.id, "URL: " + info.general.base + "\nSitename: " + info.general.sitename + "\nLang: " + info.general.lang + "\nServer: " + info.general.server + "\nMediaWiki Version: " + info.general.generator);
                register(msg, command);
            });
        // Obtener espacios MediaWiki principales de un wiki
        } else if (command === 'mediawiki' && sysops.includes(msg.author.username)) {
            editClient.getSiteInfo(['general'], function (err, info) {
                chatClient.createMessage(msg.room.id, "Common.css: " + info.general.server + "/MediaWiki:Common.css" + "\nCommon.js: " + info.general.server + "/MediaWiki:Common.js" + "\nWikia.css: " + info.general.server + "/MediaWiki:Wikia.css" + "\nWikia.js: " + info.general.server + "/MediaWiki:Wikia.js" + "\nPersonal.css: " + info.general.server + "/Special:mypage/wikia.css" + "\nPersonal.js: " + info.general.server + "/Special:mypage/wikia.js" + "\nImportJS: " + info.general.server + "/MediaWiki:ImportJS");
                register(msg, command);
            });
        // Obtener estadisticas
        } else if (command === 'sitestats' && sysops.includes(msg.author.username)) {
            editClient.getSiteStats(function (err, stats) {
                chatClient.createMessage(msg.room.id, "Pages: " + stats.pages + "\nArticles: " + stats.articles + "\nImages: " + stats.images + "\nAdmis: " + stats.admins);
                register(msg, command);
            });
        // Obtener avatar
        } else if (command === 'getavatar') {
            editClient.wikia.getUser(msg.author.id, function (err, userInfo) {
                chatClient.createMessage(msg.room.id, "Avatar de usuario: " + userInfo.avatar);
                register(msg, command);
            });
        // Mensaje de comando inexistente
        } else {
            chatClient.createMessage(msg.room.id, "Error, opción innexistente: " + command + ".");
            register(msg, command);
        }
    } else {
        // Mensaje no es un comando entonces se registra su contenido.
        register(msg);
    }
});

// Conectar al servidor de chat en la wiki especificada
chatClient.connect(currentServer);

// Función de registro ya sea en consola o un archivo en especifico - Inicia apagada
function register(msg, command) {
    if (logs) {
        if (command !== undefined && currentLogs !== undefined) {
            tools.addLogs(currentLogs,  "\n[" + tools.date(new Date()) + "] [" + command + "] [" + tools.toURL(msg.author.username, currentServer) + "] " + msg.content);
        } else if (command !== undefined && currentLogs === undefined) {
            console.log( "[" + tools.date(new Date()) + "] [" + command + "] [" + tools.toURL(msg.author.username, currentServer) + "] " + msg.content);
        } else if (currentLogs !== undefined) {
            tools.addLogs(currentLogs, "\n[" + tools.date(new Date()) + "] [nocommand] [" + tools.toURL(msg.author.username, currentServer) + "] " + msg.content);
        } else {
            console.log("[" + tools.date(new Date()) + "] [nocommand] [" + tools.toURL(msg.author.username, currentServer) + "] " + msg.content);
        }
    }
}
