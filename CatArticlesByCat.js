const summary = "Añadiendo o modificando [[Plantilla:Usoimagen|plantilla Usoimagen]]";
const bot = require('nodemw'), client = new bot('./config.json');
const tools = require("../tools.js"), currentLogs = "./registro.txt";
const userPages = require("./CreateUserPages.js");

/*
    Errores:
    * 
*/

userPages.CreateUserPages;

function set(content, regex, num) {
    var index = content.search(regex);
    index += num;

    var prop = "";
    for (index; index < content.length; index++) {
        if (content.charAt(index) != "}") {
            prop += content.charAt(index)
        } else if (content.charAt(index) == "}") {
            break;
        }
    }

    if (prop.includes("fallback") || prop.includes("usuario") || prop === "") {
        content = content.replace(regex, "{{Usoimagen}}");
    } else {
        content = content.replace(regex, "{{Usoimagen|" + prop + "}}");
    }

    return content;
}

var countErr = 0, countSuccess = 0;

client.logIn(function () {
    client.getPagesInCategory('Imágenes mal categorizadas', function (err, pages) {
        client.log('Pages in category: %d', pages.length);

        pages.forEach(function (page) {
            client.getArticle(page.title, function (err, content) {
                try {
                    if (content === null) {
                        countErr = countErr + 1;
                        tools.addLogs(currentLogs, "\n" + countErr + ". Error: " + "http://" + client.server + "/wiki/File:" + page.title);
                    } else if (content === "" || content === undefined) {
                        content = "{{Usoimagen}}";
                        client.edit(page.title, content, summary, function () {
                            page.title = page.title.replace(/\s/g, "_");
                            countSuccess = countSuccess + 1;
                            tools.addLogs(currentLogs, "\n" + countSuccess + ". Success: " + "http://" + client.server + "/wiki/File:" + page.title);
                        });
                    } else if (content.search(/{{Usoimagen(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi) === -1 && content.search(/{{Licencia(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi) === -1) {
                        content = "\n{{Usoimagen}}";
                        client.append(page.title, content, summary, function () {
                            page.title = page.title.replace(/\s/g, "_");
                            countSuccess = countSuccess + 1;
                            tools.addLogs(currentLogs, "\n" + countSuccess + ". Success: " + "http://" + client.server + "/wiki/File:" + page.title);
                        });
                    } else if (content.search(/{{Usoimagen(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi) !== -1) {
                        content = set(content, /{{Usoimagen(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi, 12);
                        client.edit(page.title, content, summary, function () {
                            page.title = page.title.replace(/\s/g, "_");
                            countSuccess = countSuccess + 1;
                            tools.addLogs(currentLogs, "\n" + countSuccess + ". Success: " + "http://" + client.server + "/wiki/File:" + page.title);
                        });
                    } else if (content.search(/{{Licencia(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi) !== -1) {
                        content = set(content, /{{Licencia(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi, 11);
                        client.edit(page.title, content, summary, function () {
                            page.title = page.title.replace(/\s/g, "_");
                            countSuccess = countSuccess + 1;
                            tools.addLogs(currentLogs, "\n" + countSuccess + ". Success: " + "http://" + client.server + "/wiki/File:" + page.title);
                        });
                    }
                } catch (err) {
                    tools.addLogs(currentLogs, "\nError: " + "http://" + client.server + "/wiki/File:" + page.title);
                }
            });
        });
    });
});