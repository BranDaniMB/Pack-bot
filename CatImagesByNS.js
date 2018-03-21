/*
 * Categorizar imágenes por espacio de nombres en que son usadas
 * Ejemplo de categorización de imágenes de usuario por medio de la plantilla usoimagen
 ** Requiere Nodemw
*/

const summary = "";
const bot = require('nodemw'), client = new bot('./config.json');
const tools = require("../tools.js"), currentLogs = "./registro.txt";
const userPages = require("./CreateUserPages.js");

/*
    Errores:
    * Se agrega dos veces en páginas previamente editadas.
    * Crea páginas nuevas de imágenes inexistentes.
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
		content = content.replace(regex, "{{Usoimagen|usuario}}");
	} else {
		content = content.replace(regex, "{{Usoimagen|usuario|" + prop + "}}");
	}

	return content;
}

var countErr = 0, countSuccess = 0;

client.logIn(function () {
	client.getPagesInNamespace(2, function (err, pages) {
		pages.forEach(function (page) {
			client.getImagesFromArticle(page.title, function (err, images) {
				images.forEach(function (image) {
					client.getArticle(image.title, function (err, content) {
						try {
							if (content === null) {
								countErr = countErr + 1;
								tools.addLogs(currentLogs, "\n" + countErr + ". Error: " + "http://" + client.server + "/wiki/File:" + image.title);
							} else if (content === "" || content === undefined) {
								content = "{{Usoimagen|usuario}}";
								client.edit(image.title, content, summary, function () {
									image.title = image.title.replace(/\s/g, "_");
									countSuccess = countSuccess + 1;
									tools.addLogs(currentLogs, "\n" + countSuccess + ". Success: " + "http://" + client.server + "/wiki/File:" + image.title);
								});
							} else if (content.search(/{{Usoimagen(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi) === -1 && content.search(/{{Licencia(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi) === -1) {
								content = "\n{{Usoimagen|usuario}}";
								client.append(image.title, content, summary, function () {
									image.title = image.title.replace(/\s/g, "_");
									countSuccess = countSuccess + 1;
									tools.addLogs(currentLogs, "\n" + countSuccess + ". Success: " + "http://" + client.server + "/wiki/File:" + image.title);
								});
							} else if (content.search(/{{Usoimagen(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi) !== -1) {
								content = set(content, /{{Usoimagen(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi, 12);
								client.edit(image.title, content, summary, function () {
									image.title = image.title.replace(/\s/g, "_");
									countSuccess = countSuccess + 1;
									tools.addLogs(currentLogs, "\n" + countSuccess + ". Success: " + "http://" + client.server + "/wiki/File:" + image.title);
								});
							} else if (content.search(/{{Licencia(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi) !== -1) {
								content = set(content, /{{Licencia(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?(\|\w*)?}}/gi, 11);
								client.edit(image.title, content, summary, function () {
									image.title = image.title.replace(/\s/g, "_");
									countSuccess = countSuccess + 1;
									tools.addLogs(currentLogs, "\n" + countSuccess + ". Success: " + "http://" + client.server + "/wiki/File:" + image.title);
								});
							}
						} catch (err) {
							tools.addLogs(currentLogs, "\nError: " + "http://" + client.server + "/wiki/File:" + image.title);
						}
					});
				});
			});
		});
	});
});
