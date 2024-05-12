<!DOCTYPE html>
<html lang="ca">
<head>
    <title>Nova temàtica</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">
</head>

<style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Roboto', sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
    }

    .card {
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        overflow: hidden;
    }

    .card>*:not(header){
        margin-left: 20px;
    }

    p {
        font-size: 16px;
        color: #333;
        margin-bottom: 20px;
    }

    h1{
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
    }

    h2{
        font-size: 20px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
    }

    header {
        margin-bottom: 20px;
        background-color: #333; 
    }

    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
    }

    .logo {
        display: flex;
        align-items: center;
    }

    .logo img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 10px;
    }

    .brand-name {
        font-size: 48px;
        font-weight: bold;
        color: #fff;
    }

    .brand-name span {
        color: #00adef;
    }


    .song-info {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .song-info img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 10px;
        margin-right: 20px;
    }

    .song-hour {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
    }

    .song-details {
        flex: 1;
        padding-left: 10px;
    }

    .song-name {
        font-size: 20px;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
    }

    .artists {
        display: flex;
        flex-wrap: wrap;
    }

    .artist-name {
        font-size: 16px;
        color: #666;
        margin-bottom: 5px;
        margin-right: 5px;
    }

    hr {
        border: none;
        border-top: 1px solid #ccc;
        margin: 20px 0;
    }

    .footer {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .vote-button {
        background-color: #00adef;
        color: #fff;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 5px;
        text-decoration: none;
        transition: background-color 0.3s ease;
    }

    .vote-button a{
        color: #fff;
        text-decoration: none;
    }
</style>

<body>
    <div class="card">
        <header>
            <div class="header-container">
                <div class="logo">
                    <img src="https://lh3.googleusercontent.com/drive-viewer/AKGpihaUIklAnlRSAyy1Z7wuVVdCWDVnwv3HMkPeNh0gmtlhpX_smBW7w3GJmO9X4XFCeg_Z6ISQGg_woxMFwp1kp3fw8eFk7AI0Fi0=s2560" />
                    <p class="brand-name">Sound<span>O'Clock</span></p>
                </div>
                <button class="vote-button"><a href="https://timbre.inspedralbes.cat">Vota aquí!</a></button>
            </div>
        </header>
        <section>
        <h1>Hola, {{$user->name}}</h1>
        <h2>S'ha escollit una nova temàtica: {{$theme}}!</h2>
        <p>T'animem a votar i a compartir les teves idees sobre aquest tant tema emocionant! No deixis passar aquesta oportunitat. La votació comença el dia {{ date('d/m/Y', strtotime($startingTime)) }} i acaba el proper dia {{ date('d/m/Y', strtotime($endingTime)) }}.</p>

        {{-- @php
        $selectedSongs='[{"_id":"6640a4243dbce3526dc79191","id":"7CSmXJNeArnwDfUmtP4Gve","bellId":1,"name":"8 AM","artists":[{"name":"Nicki Nicole"},{"name":"Young Miko"}],"img":"https://i.scdn.co/image/ab67616d00001e02e0be70cad39065d97afde883","preview_url":"https://p.scdn.co/mp3-preview/de8a2f96bbfc4ddc752928bef1922595c7f39dad?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.380Z","__v":0},{"_id":"6640a4243dbce3526dc79192","id":"0d28khcov6AiegSCpG5TuT","bellId":2,"name":"Feel Good Inc.","artists":[{"name":"Gorillaz"}],"img":"https://i.scdn.co/image/ab67616d00001e0219d85a472f328a6ed9b704cf","preview_url":"https://p.scdn.co/mp3-preview/b13a1bb2d8a04132982a49b6efee933cc9d67c7e?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.468Z","__v":0},{"_id":"6640a4243dbce3526dc79193","id":"0i8JFpqe9cKwnrcvoNgl1L","bellId":3,"name":"Feel Invincible","artists":[{"name":"Skillet"}],"img":"https://i.scdn.co/image/ab67616d00001e023387bacdfd59f32e14dbe17a","preview_url":"https://p.scdn.co/mp3-preview/405bd22441e5c13a677a5e0ac351aeffbc6b8255?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.469Z","__v":0},{"_id":"6640a4243dbce3526dc79194","id":"0k8LXt5uJ5O07BhSvnvjkY","bellId":4,"name":"Moskau","artists":[{"name":"Rammstein"}],"img":"https://i.scdn.co/image/ab67616d00001e02136f94926d47c4986e50c877","preview_url":"https://p.scdn.co/mp3-preview/1c3fff921976e381940fecaeb0479037f2c928b0","selectedDate":"2024-05-12T11:12:36.470Z","__v":0},{"_id":"6640a4243dbce3526dc79195","id":"2Wz2AERjiO6XKrLvOptvXa","bellId":5,"name":"The Wave","artists":[{"name":"Las Ninyas del Corro"}],"img":"https://i.scdn.co/image/ab67616d00001e021baa99267d22f9f6382a1017","preview_url":"https://p.scdn.co/mp3-preview/199810c127b1199930c9e814c1a709849b61db96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.475Z","__v":0},{"_id":"6640a4243dbce3526dc79198","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":8,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.478Z","__v":0},{"_id":"6640a4243dbce3526dc79199","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":9,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.482Z","__v":0},{"_id":"6640a4243dbce3526dc7919a","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":10,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.486Z","__v":0},{"_id":"6640a4243dbce3526dc7919b","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":11,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.487Z","__v":0},{"_id":"6640a4243dbce3526dc7919c","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":12,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.488Z","__v":0},{"_id":"6640a4243dbce3526dc7919d","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":13,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.489Z","__v":0},{"_id":"6640a4243dbce3526dc7919e","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":14,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.490Z","__v":0},{"_id":"6640a4243dbce3526dc7919f","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":15,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.491Z","__v":0},{"_id":"6640a4243dbce3526dc791a0","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":16,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.492Z","__v":0},{"_id":"6640a4243dbce3526dc791a1","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":17,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.494Z","__v":0},{"_id":"6640a4243dbce3526dc791a2","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":18,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.495Z","__v":0},{"_id":"6640a4243dbce3526dc79196","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":6,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.476Z","__v":0},{"_id":"6640a4243dbce3526dc79197","id":"5m5uvPjQT3Md5GKK3qyaXy","bellId":7,"name":"Pokémon Theme","artists":[{"name":"Pokémon"}],"img":"https://i.scdn.co/image/ab67616d00001e028ac4b43e4fa9484a8c3aca48","preview_url":"https://p.scdn.co/mp3-preview/c411b7f0b8970a68daf59702a7e9bfefc85e6f96?cid=b7f796f4ded84814a46be8b07ad4c4da","selectedDate":"2024-05-12T11:12:36.477Z","__v":0}]';
        $selectedSongs = json_decode($selectedSongs, true);

        $bells='[{"id":1,"hour":"08:00:00","created_at":null,"updated_at":null,"groups":[{"id":1,"name":"1er Educaci\u00f3 Secund\u00e0ria Obligat\u00f2ria","abbreviation":"1 ESO","is_public":1,"category_id":1,"created_at":null,"updated_at":null,"pivot":{"bell_id":1,"group_id":1}},{"id":2,"name":"2on Educaci\u00f3 Secund\u00e0ria Obligat\u00f2ria","abbreviation":"2 ESO","is_public":1,"category_id":1,"created_at":null,"updated_at":null,"pivot":{"bell_id":1,"group_id":2}},{"id":3,"name":"3er Educaci\u00f3 Secund\u00e0ria Obligat\u00f2ria","abbreviation":"3 ESO","is_public":1,"category_id":1,"created_at":null,"updated_at":null,"pivot":{"bell_id":1,"group_id":3}},{"id":4,"name":"4rt Educaci\u00f3 Secund\u00e0ria Obligat\u00f2ria","abbreviation":"4 ESO","is_public":1,"category_id":1,"created_at":null,"updated_at":null,"pivot":{"bell_id":1,"group_id":4}}]},{"id":2,"hour":"09:00:00","created_at":null,"updated_at":null,"groups":[{"id":1,"name":"1er Educaci\u00f3 Secund\u00e0ria Obligat\u00f2ria","abbreviation":"1 ESO","is_public":1,"category_id":1,"created_at":null,"updated_at":null,"pivot":{"bell_id":2,"group_id":1}},{"id":2,"name":"2on Educaci\u00f3 Secund\u00e0ria Obligat\u00f2ria","abbreviation":"2 ESO","is_public":1,"category_id":1,"created_at":null,"updated_at":null,"pivot":{"bell_id":2,"group_id":2}},{"id":3,"name":"3er Educaci\u00f3 Secund\u00e0ria Obligat\u00f2ria","abbreviation":"3 ESO","is_public":1,"category_id":1,"created_at":null,"updated_at":null,"pivot":{"bell_id":2,"group_id":3}}]},{"id":3,"hour":"10:00:00","created_at":null,"updated_at":null,"groups":[{"id":2,"name":"2on Educaci\u00f3 Secund\u00e0ria Obligat\u00f2ria","abbreviation":"2 ESO","is_public":1,"category_id":1,"created_at":null,"updated_at":null,"pivot":{"bell_id":3,"group_id":2}},{"id":4,"name":"4rt Educaci\u00f3 Secund\u00e0ria Obligat\u00f2ria","abbreviation":"4 ESO","is_public":1,"category_id":1,"created_at":null,"updated_at":null,"pivot":{"bell_id":3,"group_id":4}}]},{"id":4,"hour":"11:00:00","created_at":null,"updated_at":null,"groups":[{"id":5,"name":"1er Batxillerat","abbreviation":"1 BATX","is_public":1,"category_id":2,"created_at":null,"updated_at":null,"pivot":{"bell_id":4,"group_id":5}}]},{"id":5,"hour":"11:30:00","created_at":null,"updated_at":null,"groups":[{"id":6,"name":"2on Batxillerat","abbreviation":"2 BATX","is_public":1,"category_id":2,"created_at":null,"updated_at":null,"pivot":{"bell_id":5,"group_id":6}}]},{"id":6,"hour":"12:30:00","created_at":null,"updated_at":null,"groups":[]},{"id":7,"hour":"13:30:00","created_at":null,"updated_at":null,"groups":[]},{"id":8,"hour":"14:30:00","created_at":null,"updated_at":null,"groups":[]},{"id":9,"hour":"15:00:00","created_at":null,"updated_at":null,"groups":[]},{"id":10,"hour":"15:30:00","created_at":null,"updated_at":null,"groups":[]},{"id":11,"hour":"16:00:00","created_at":null,"updated_at":null,"groups":[]},{"id":12,"hour":"16:30:00","created_at":null,"updated_at":null,"groups":[]},{"id":13,"hour":"17:00:00","created_at":null,"updated_at":null,"groups":[]},{"id":14,"hour":"17:30:00","created_at":null,"updated_at":null,"groups":[]},{"id":15,"hour":"18:00:00","created_at":null,"updated_at":null,"groups":[]},{"id":16,"hour":"19:00:00","created_at":null,"updated_at":null,"groups":[]},{"id":17,"hour":"20:00:00","created_at":null,"updated_at":null,"groups":[]},{"id":18,"hour":"21:00:00","created_at":null,"updated_at":null,"groups":[]}]';
        $bells = json_decode($bells, true);
    @endphp --}}

            <p>Les cançons escollides per aquesta setmana són:</p>
            @foreach($selectedSongs as $index => $song)
                <div class="song-info">
                    <img src="{{ $song['img'] }}" alt="{{ $song['name'] }}" />
                    <div class="song-details">
                        <p class="song-hour">{{$bells[$index]['hour']}}</p>
                        <p class="song-name">{{ $song['name'] }}</p>
                        <div class="artists">
                            @foreach($song['artists'] as $index => $artist)
                                <p class="artist-name">{{ $artist['name'] }}</p>
                            @endforeach
                        </div>
                    </div>
                </div>
                <hr>
            @endforeach
            <p>Gràcies per ser part de la nostra comunitat!</p>
            <div class="footer">
                <button class="vote-button"><a href="https://timbre.inspedralbes.cat">Vota aquí!</a></button>
            </div>
        </section>
    </div>
</body>
</html>
