<!DOCTYPE html>
<html lang="en">
<head>
    <title>Nova temàtica</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">
    <style>
        /* Add your custom styles here */
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0 !important;
            padding: 0 !important;
        }

        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background-color: #1C1B22;
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
            font-weight: bold;
            color: #fff;
        }

        .brand-name span {
            color: #00adef;
        }

        .vote-button {
            background-color: #00adef;
            color: #fff;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            text-decoration: none;
            cursor: pointer;
            margin-left: auto;
        }

        .vote-button a {
            color: #fff;
            text-decoration: none;
        }

        section {
            padding: 20px;
        }

        h1 {
            font-size: 28px;
            color: #333;
            margin-bottom: 10px;
        }

        h2 {
            font-size: 24px;
            color: #333;
            margin-bottom: 10px;
        }

        p {
            font-size: 16px;
            color: #666;
        }

        .song-info {
            display: flex;
            align-items: center;
        }

        .song-info img {
            width: 80px;
            height: 80px;
            margin-right: 10px;
        }

        .song-hour {
            font-size: 18px;
            color: #333;
            margin-right: 10px;
        }

        .song-details {
            flex-grow: 1;
        }

        .song-name {
            font-size: 20px;
            color: #333;
            display: inline-block;
        }

        .artists {
            display: flex;
            flex-wrap: wrap;
        }

        .artist-name {
            font-size: 16px;
            color: #666;
            margin-right: 5px;
        }

        @media (max-width: 768px) {
            .header-container {
                flex-direction: column;
                align-items: flex-start;
            }

            .logo {
                margin-bottom: 10px;
            }

            .vote-button {
                margin-top: 10px;
            }
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
                        <p class="song-name">{{ $song['name'] }}</p>
                        <div class="artists">
                            @foreach($song['artists'] as $index => $artist)
                            <p class="artist-name">{{ $artist['name'] }}@if($index != count($song['artists']) - 1),@endif</p>
                            @endforeach
                        </div>
                    </div>
                </div>
                <hr>
            @endforeach
        
        <p>Gràcies per ser part de la nostra comunitat!</p>

        <button class="vote-button"><a href="http://timbre.inspedralbes.cat">Vota aquí!</a></button>

    </section>
</body>
</html>