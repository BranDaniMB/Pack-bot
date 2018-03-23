# Pack-bot
## Requerimientos
### nodejs
- [NodeJS](https://nodejs.org/en/download/ "Latest version recommended.")

### nodemw
[MediaWiki API](http://www.mediawiki.org/wiki/API:Main_page) client written in node.js

[![NPM version](https://badge.fury.io/js/nodemw.png)](http://badge.fury.io/js/nodemw)
[![Build Status](https://api.travis-ci.org/macbre/nodemw.svg?branch=devel)](http://travis-ci.org/macbre/nodemw)

[![Download stats](https://nodei.co/npm/nodemw.png?downloads=true&downloadRank=true)](https://nodei.co/npm/nodemw/)

### Gekkou
Gekkou [![NPM version]](https://npmjs.com/package/gekkou)

## Bot-chat comandos
***Esta sección no ha sido actualizada***
### Normal comandos
```
-welcome
  output:
-hola
  output:
-adios
  output:
-saluda
  output:
-exit
  output:
-edit
  output:
-help
  output:
-edit/on
  output:
-edit/off
  output:
```

### Edición Wiki comandos
```
$edit;pagename;content;summary
$move;to;from;summary
```

## Crear config.json
Crear un archivo llamado **config** con extensión **.json** e incluir lo sigiente dentro:
```
{
    "server": "comunidad.wikia.com",
    "debug": true,
    "username": "Ejemplo",
    "password": "Ejemplo"
}
```

**La mayoria de los archivos aquí expuestos fueron hechos para su uso en [Comunidad Central](http://comunidad.wikia.com/).**
