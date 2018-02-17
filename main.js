const tools = require("./tools.js");
const currentUsername = "user", currentPassword = "password.", currentServer = "community";
var contentEdit = true;

const chatBot = require("gekkou");
const chatClient = new chatBot(currentUsername,currentPassword);

const editBot = require("nodemw");
const editClient = new editBot({
    server: currentServer + ".wikia.com",
    username: currentUsername,
    password: currentPassword,
    debug: true,
});

chatClient.on("ready", () => {
    console.log("Power-on");
});

chatClient.on("messageCreate", (msg) => {
    var firstChar = (msg.content).charAt(0);

    if (firstChar === "-") {
        if (msg.content === "-welcome") {
            chatClient.createMessage(msg.room.id, "¡Bienvenid@ al chat!\n¡Espero que tu estancia sea la mejor!");
            console.log("Welcome; UserRequest: " + tools.toURL(msg.author.username));
        } else if (msg.content === "-hola") {
            chatClient.createMessage(msg.room.id, "¡Hola " + msg.author.username + "!");
            console.log("Greeting; UserRequest: " + tools.toURL(msg.author.username));
        } else if (msg.content === "-adios") {
            chatClient.createMessage(msg.room.id, "¡Adiós " + msg.author.username + "!");
            console.log("Goodbye; UserRequest: " + tools.toURL(msg.author.username));
        } else if (msg.content === "-saluda" && msg.author.username === "BranDaniMB") {
            chatClient.createMessage(msg.room.id, "¡Hola a todos!");
            console.log("Greeting everyone; UserRequest: " + tools.toURL(msg.author.username));        
        } else if (msg.content === "-exit" && msg.author.username === "BranDaniMB") {
            chatClient.createMessage(msg.room.id, "¡Adiós a todos!");
            chatClient.disconnect();
            console.log("Power-off; UserRequest: " + tools.toURL(msg.author.username));
        } else if (msg.content === "-edit") {
            chatClient.createMessage(msg.room.id, "" + contentEdit);
            console.log("Help-edit; UserRequest: " + tools.toURL(msg.author.username));      
        } else if (msg.content === "-help") {
            chatClient.createMessage(msg.room.id, "¡Hola!, me llamo" + currentUsername + ".");
            console.log("Help; UserRequest: " + tools.toURL(msg.author.username));
        } else if (msg.content === "-edit/on" && msg.author.username === "BranDaniMB") {
            if (contentEdit) {
                chatClient.createMessage(msg.room.id, "La función de edición ya estaba activa.");
                console.log("Edit-on; UserRequest: " + tools.toURL(msg.author.username));
            } else {
                contentEdit = true;
                chatClient.createMessage(msg.room.id, "La función de edición se ha activado.");
                console.log("Edit-on; UserRequest: " + tools.toURL(msg.author.username));
            }  
        } else if (msg.content === "-edit/off" && msg.author.username === "BranDaniMB") {
            if (contentEdit) {
                contentEdit = false;
                chatClient.createMessage(msg.room.id, "La función de edición se ha desactivado.");
                console.log("Edit-off; UserRequest: " + tools.toURL(msg.author.username));
            } else {
                chatClient.createMessage(msg.room.id, "La función de edición ya estaba desactivada.");
                console.log("Edit-off; UserRequest: " + tools.toURL(msg.author.username));
            }
        }
    } else if (firstChar === "$") {
        if (contentEdit) {
            var editParameters = tools.getParameters(msg.content);
            if (editParameters.command === '$edit' && editParameters.length >= 3 && msg.author.username === "BranDaniMB") {
                editParameters = tools.getParameters(msg.content, "edit");
                chatClient.createMessage(msg.room.id, "Editando...");
                editClient.logIn(function() {
                    editClient.edit(editParameters.title, editParameters.content, editParameters.summary, function(userData) {
                        chatClient.createMessage(msg.room.id, "¡Finalizado");
                        console.log("[$edit] " + tools.toURL(msg.author.username));
                    });
                });
            } else if (editParameters.command === '$move' && editParameters.length >= 3 && msg.author.username === "BranDaniMB") {
                editParameters = tools.getParameters(msg.content, "move");
                chatClient.createMessage(msg.room.id, "Moviendo...");
                editClient.logIn(function() {
                    editClient.move(editParameters.to, editParameters.from, editParameters.summary, function(userData) {
                        chatClient.createMessage(msg.room.id, "¡Finalizado!");
                        console.log("[$move] " + tools.toURL(msg.author.username));
                    });
                });
            } else if (editParameters.command === '$delete' && editParameters.length >= 2  && msg.author.username === "BranDaniMB") {
                editParameters = tools.getParameters(msg.content, "delete");
                chatClient.createMessage(msg.room.id, "Borrando...");
                editClient.logIn(function() {
                    editClient.purge(editParameters.title, editParameters.summary, function(err, data) {
                        chatClient.createMessage(msg.room.id, "¡Finalizado!");
                        console.log("[$delete] " + tools.toURL(msg.author.username));
                    });
                });
            } else if (editParameters.command === '$getSiteInfo' && msg.author.username === "BranDaniMB") {
                editClient.getSiteInfo(['general', 'namespaces'], function(err, info) {
                    chatClient.createMessage(msg.room.id, "URL: " + info.general.base + "\nSitename: " + info.general.sitename + "\nLang: " + info.general.lang + "\nServer: " + info.general.server + "\nMediaWiki Version: " + info.general.generator);
                    console.log("[$getSiteInfo] " + tools.toURL(msg.author.username));
                });
            } else if (editParameters.command === '$mediawiki' && msg.author.username === "BranDaniMB") {
                editClient.getSiteInfo(['general'], function(err, info) {
                    chatClient.createMessage(msg.room.id, "Common.css: " + info.general.server+"/MediaWiki:Common.css" + "\nCommon.js: " + info.general.server+"/MediaWiki:Common.js" + "\nWikia.css: " + info.general.server+"/MediaWiki:Wikia.css" + "\nWikia.js: " + info.general.server+"/MediaWiki:Wikia.js" + "\nPersonal.css: " + info.general.server + "/Special:mypage/wikia.css" + "\nPersonal.js: " + info.general.server + "/Special:mypage/wikia.js" + "\nImportJS: " + info.general.server + "/MediaWiki:ImportJS");
                    console.log("[$MediaWiki] " + tools.toURL(msg.author.username));
                });
            } else if (editParameters.command === '$getSiteStats' && msg.author.username === "BranDaniMB") {
                editClient.getSiteStats(function(err, stats) {
                    chatClient.createMessage(msg.room.id, "Pages: " + stats.pages + "\nArticles: " + stats.articles + "\nImages: " + stats.images + "\nAdmis: " + stats.admins);
                    console.log("[$getSiteStats] " + tools.toURL(msg.author.username));
                });
            } else if (editParameters.command === '$getAvatar' && msg.author.username === "BranDaniMB") {
                editClient.wikia.getUser(msg.author.id, function(err, userInfo) {
                    chatClient.createMessage(msg.room.id, "Avatar de usuario: " + userInfo.avatar);
                    console.log('[$getAvatar] ', tools.toURL(msg.author.username));
                });
            }
        } else {
            chatClient.createMessage(msg.room.id, 'La función de contenido esta desactivada: "-edit/on" para activar');
            console.log("Edition request; UserRequest: " + tools.toURL(msg.author.username));
        }
    } else {
        console.log("[Time: " + msg.timestamp + "] [" + tools.toURL(msg.author.username) + "] " + msg.content)
    }
});
 
chatClient.connect(currentServer);