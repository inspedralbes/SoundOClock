# Guia Desenvolupament

Aquesta és una guia per a desenvolupar el projecte i poder contribuir. El projecte està estructurat per a desenvolupar-se en **Docker**, aixi que és necessari tindre'l per a poder aixecar el projecte. 

### 1. Clonar el repositori en local

Executa les següents ordres en la terminal per a clonar el repositori en local:

```bash
git clone https://github.com/inspedralbes/tr3-soundoclock.git
cd tr3-soundoclock
```

### 2. Elegir la branca `develop`

```
git checkout develop
git pull
```

### 3. Configurar els fitxers `.env`

#### 3.1. Crear el fitxer `.env` a la carpeta `/laravel`

```bash
cd laravel
cp .env.example .env
```

#### 3.2. Emplenar els camps corresponents

```
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=db_name
DB_USERNAME=root
DB_PASSWORD=root
```

#### 3.3. Crear el fitxer `.env` a la carpeta `/node`

```
cd ../node
cp .env.example .env
```

#### 3.4. Emplenar els camps corresponents

```
NODE_ENV=development

DEVELOPMENT_API_URL=http://laravel:8000/api/
PRODUCTION_API_URL=http://productionUrl/laravel/public/api/

SPOTIFY_CLIENT_ID={SPOTIFY_ID}
SPOTIFY_CLIENT_SECRET={SPOTIFY_SECRET}

MONGO_USER=mongoadmin
MONGO_PASSWORD=mongopassword
```
_*Per a emplenar els camps de Spotify, es pot configurar des de aqui: https://developer.spotify.com/_

#### 3.5. Crear el fitxer `.env` a la carpeta `/nuxt`

```
cd ../nuxt
cp .env.example .env
```

#### 3.6. Emplenar els camps corresponents

```
VITE_APP_ENV=DEVELOPMENT
VITE_APP_SOCKET_URI=http://localhost:8080

GOOGLE_CLIENT_ID={GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET={GOOGLE_CLIENT_SECRET}
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback/google
```
_*Per a emplenar els camps de Google, es pot configurar des de aqui: https://developers.google.com/identity/protocols/oauth2_

### 4. Aixecar el Docker

Desde l'arrel del projecte, executa la següent ordre:

```
docker compose up
```

### 5. Ports

Ara ja pots modificar el codi a gust i els canvis es veuran relfexats en el contenidor. Les urls per accedir a la applicació son els següents:

| Servei | url |
|---|---|
| Frontend (nuxt)  | localhost:3000  |
| BBDD mySQL (phpMyAdmin)  | localhost:9090  |
| BBDD Mongo (mongo express)  | localhost:8081  |
