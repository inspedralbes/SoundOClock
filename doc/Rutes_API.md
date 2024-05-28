# Rutes API

El frontend només truca a les rutes API del node, i aquest fa les crides necessàries a la BBDD de mongo o al servidor de Laravel. A continuació estan documentades totes les rutes API que implementa el servidor de Node:

## Rutes GET

#### 1. GET votacions de l'usuari

_Retorna l'historial de cançons propostes i votades per un usuari en el periode de votació actual._

```javascript
fetch(`${url}/votingRecords/${id}`)
```

#### 2. GET cançons reportades de l'usuari

_Retorna la llista de cançons reportades per un usuari en el periode de votació actual._

```javascript
fetch(`${url}/reportSongs/${id}`)
```

#### 3. GET cançons més votades per grup

_Retorna la llista de grups amb les cançons més votades per grup en el periode de votació actual._

```javascript
fetch(`${url}/sortedVotedSongs`)
```

#### 4. GET cançons proposades

_Retorna la llista completa de cançons proposades en el periode de votació actual._

```javascript
fetch(`${url}/songs`)
```

#### 5. GET cançons proposades amb els reports dels usuaris

_Retorna la llista completa de cançons proposades, juntament amb els reports creats pels usuaris, en el periode de votació actual._

```javascript
fetch(`${url}/adminSongs/${token}`)
```

#### 6. GET tots els usuaris

_Retorna la llista completa de usuaris registrats en l'aplicació._

```javascript
fetch(`${url}/users/${token}`)
```

#### 7. GET els grups públics

_Retorna la llista dels grups públics._

```javascript
fetch(`${url}/publicGroups`)
```

#### 8. GET les categories públiques

_Retorna la llista de les categories públiques._

```javascript
fetch(`${url}/publicCategories`)
```

#### 9. GET tots els grups i categories

_Retorna la llista completa de tots els grups i les categories (públic i privat)._

```javascript
fetch(`${url}/allGroupsAndCategories`)
```

#### 10. GET franjes horàries

_Retorna la llista de franjes horàries._

```javascript
fetch(`${url}/bells/${token}`)
```

#### 11. GET informació de l'usuari

_Retorna la informació completa d'un usuari basant-se en el token rebut._

```javascript
fetch(`${url}/userInfo/${token}`)
```

#### 12. GET tots els rols

_Retorna una llista de tots els rols d'usuaris._

```javascript
fetch(`${url}/roles/${token}`)
```

#### 13. GET grups d'un usuari

_Retorna una llista de tots grups d'un usuari, incloent els reports relacionats._

```javascript
fetch(`${url}/userGroups/${token}`)
```

#### 14. GET cançons seleccionades

_Retorna una llista de les cançons seleccionades per aquest periode._

```javascript
fetch(`${url}/getSelectedSongs`)
```

#### 15. GET plantilles d'administració

_Retorna les plantilles utilitzades per a relacionar franjes horàries amb grups en administració._

```javascript
fetch(`${url}/bellsGroupsTemplate`)
```

#### 16. GET comprovació modal de la temàtica

_Retorna si un usuari ha vist ja el modal de condicions que apareix quan una nova temàtica és seleccionada._

```javascript
fetch(`${url}/checkThemeModal/${theme}/${userId}`)
```

#### 17. GET descarregar cançons seleccionades

_Descarrega les cançons que han sigut seleccionades per al següent periode._

```javascript
fetch(`${url}/selectedSongs`)
```

## Rutes POST

#### 1. POST votants d'una cançó

_Retorna una llista dels usuaris que han votat per una cançó específica._

```javascript
  fetch(`${url}/usersVotes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      songId,
      token,
    }),
  });
```

#### 2. POST grups d'un usuari

_Afegeix els grups seleccionats a un usuari en concret._

```javascript
  fetch(`${url}/addGroupsToUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      userId,
      groups,
      token,
    }),
  });
```

#### 3. POST logout

_Tanca la sessió a un usuari en concret._

```javascript
  fetch(`${url}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  });
```

#### 4. POST guardar cançons seleccionades

_Guarda les cançons seleccionades per a que sonin el periode vinent._

```javascript
  fetch(`${url}/storeSelectedSongs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      token,
      songs,
    }),
  });
```

#### 5. POST crear una categoria de grups

_Crea una nova categoria que engloba una serie de grups._

```javascript
  fetch(`${url}/createGroupCategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      token,
      category,
    }),
  });
```

#### 6. POST crear un grup

_Crea un nou grup._

```javascript
  fetch(`${url}/createGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      token,
      group,
    }),
  });
```

#### 7. POST guardar una plantilla d'admistració

_Guarda una plantilla d'administració que s'utilitza per a relacionar grups amb franjes horàries._

```javascript
 fetch(`${url}/bellsGroupsTemplate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      template,
    }),
  });
```

#### 8. POST acceptar termes modal
_Accepta els termes quan una nova temàtica ha sigut seleccionada._

```javascript
fetch(`http://localhost:8080/acceptThemeTerms`, {
method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    theme,
    userId,
  }),
});
```


## Rutes DELETE

#### 1. DELETE plantilla d'administració


_Elimina una plantilla d'administració que s'utilitza per a relacionar grups amb franjes horàries._


```javascript
fetch(`http://localhost:8080/bellsGroupsTemplate`, {
  method: 'DELETE',
})
```
