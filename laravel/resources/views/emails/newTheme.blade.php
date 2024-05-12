<!DOCTYPE html>
<html lang="en">
<head>
    <title>Nova temàtica</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">
    <style>
        /* Styles for the email */
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }

        .header-container {
            background-color: #333;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
        }

        .logo img {
            width: 50px;
            height: 50px;
            margin-right: 10px;
        }

        .brand-name {
            font-size: 24px;
            color: #fff;
            font-weight: bold;
        }

        .brand-name span {
            color: #00ADEF;
        }

        .vote-button {
            background-color: #00ADEF;
            color: #fff;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            text-decoration: none;
        }

        .vote-button a {
            color: #fff;
            text-decoration: none;
        }

        section {
            background-color: #fff;
            padding: 20px;
            margin-top: 20px;
        }

        h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }

        h2 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        p {
            font-size: 16px;
            margin-bottom: 10px;
        }

        .song-info {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .song-info img {
            width: 50px;
            height: 50px;
            margin-right: 10px;
        }

        .song-hour {
            font-size: 16px;
            margin-right: 10px;
            margin-left: 10px;
            padding-left: 10px;
            border-left: 2px solid #00ADEF;
            height: 50px; /* Add this line */
            display: flex; /* Add this line */
            align-items: center; /* Add this line */
        }
        
        .song-details {
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            padding-left: 10px;
            border-left: 2px solid #00ADEF;
            height: 50px; /* Add this line */
            display: flex; /* Add this line */
        }

        .song-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .artists {
            font-size: 12px;
        }

        .artist-name {
            display: inline;
            font-weight: normal;
            margin-right: 5px;
        }

        .vote-button {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <header>
        <div class="header-container">
            <div class="logo">
                <img src="https://lh3.googleusercontent.com/drive-viewer/AKGpihaUIklAnlRSAyy1Z7wuVVdCWDVnwv3HMkPeNh0gmtlhpX_smBW7w3GJmO9X4XFCeg_Z6ISQGg_woxMFwp1kp3fw8eFk7AI0Fi0=s2560" />
                <p class="brand-name">Sound<span>O'</span><span>Clock</span></p>
            </div>
            <button class="vote-button"><a href="http://timbre.inspedralbes.cat">Vota aquí!</a></button>
        </div>
    </header>
    <section>
        <h1>Hola, {{$user->name}}</h1>
        <h2>S'ha escollit una nova temàtica: {{$theme}}!</h2>
        <p>T'animem a votar i a compartir les teves idees sobre aquest tant tema emocionant! No deixis passar aquesta oportunitat. La votació comença el dia {{ date('d/m/Y', strtotime($startingTime)) }} i acaba el proper dia {{ date('d/m/Y', strtotime($endingTime)) }}.</p>

        <p>Les cançons escollides per aquesta setmana son:</p>
            @foreach($selectedSongs as $index => $song)
                <div class="song-info">
                    <img src="{{ $song['img'] }}" alt="{{ $song['name'] }}" />
                    <p class="song-hour">{{$bells[$index]['hour']}}</p>
                    <div class="song-details">
                        <div class="song-name">{{ $song['name'] }}</div>
                        <div class="artists">
                            @foreach($song['artists'] as $index => $artist)
                            <p class="artist-name">{{ $artist['name'] }}@if($index != count($song['artists']) - 1),@endif</p>
                            @endforeach
                        </div>
                    </div>
                </div>
            @endforeach
        
        <p>Gràcies per ser part de la nostra comunitat!</p>

        <button class="vote-button"><a href="http://timbre.inspedralbes.cat">Vota aquí!</a></button>

    </section>
</body>
</html>