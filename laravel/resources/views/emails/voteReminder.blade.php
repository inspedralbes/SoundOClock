<!DOCTYPE html>
<html lang="ca">

<head>
    <title>Sanció</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">
    {{-- <link rel="stylesheet" href="./resources/css/mail.css"> --}}

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

        .card>*:not(header) {
            margin-left: 20px;
        }

        p {
            font-size: 16px;
            color: #333;
            margin-bottom: 20px;
            line-height: 1.5;
        }

        h1 {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
        }

        h2 {
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
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            width: 100%;
            padding: 20px;
        }

        .header-container button {
            margin-left: auto;
        }

        .logo {
            display: flex;
            align-items: center;
            width: 90%;
        }

        .logo.pedralbes {
            justify-content: flex-end;
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
            padding-bottom: 0px;
        }

        .brand-name span {
            background-color: #00adef;
            background-image: linear-gradient(90deg, #00adef, #af4261);
            background-size: 100%;
            -webkit-background-clip: text;
            -moz-background-clip: text;
            -webkit-text-fill-color: transparent;
            -moz-text-fill-color: transparent;
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

        .alert-card {
            background-color: #333;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            padding: 8px 12px;
            overflow: hidden;

            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 2em;
        }

        .alert-card div {
            color: white;
            margin: 0px;
            font-size: 20px;
            text-align: center;
        }

        .alert-card>div>span {
            font-weight: bold;
        }

        section {
            margin: 0 20px;
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
        height: fit-content;
        margin-bottom: 15px;
        }

        .vote-button a{
            color: #fff;
            text-decoration: none;
        }

        @media (max-width: 768px) {
            .brand-name {
                font-size: 24px;
            }

            .alert-card {
                flex-direction: column;
                gap: 1.2em;
                padding: 20px 15px;
            }

            .logo img {
                width: 75px;
                height: 75px;
            }
        }
    </style>

</head>

<body>

    @php
        $settings->end_vote = substr($settings->end_vote, 8, 2) . "-" . substr($settings->end_vote, 5, 2) . "-" . substr($settings->end_vote, 0, 4);
    @endphp

    <div class="card">
        <header>
            <div class="header-container">
                <div class="logo">
                    <img src="https://lh3.googleusercontent.com/drive-viewer/AKGpihaUIklAnlRSAyy1Z7wuVVdCWDVnwv3HMkPeNh0gmtlhpX_smBW7w3GJmO9X4XFCeg_Z6ISQGg_woxMFwp1kp3fw8eFk7AI0Fi0=s2560" />
                    <div class="brand-name">sound<span>o'clock</span></div>
                </div>
                {{-- <div class="logo pedralbes">
                    <img src="https://campus.institutpedralbes.cat/pluginfile.php/1/core_admin/logocompact/300x300/1682674448/LogoPedralbes%20Mosca.png" alt="Logo Pedralbes">
                </div> --}}
            </div>
        </header>
        <section>
            <h1>Hola, {{ $user->name }}</h1>
            <h2>Queden 48 hores per votar!</h2>
            <p>Les votacions acaben el {{ $settings->end_vote }}. Encara pots proposar cançons que s'adeqüin a la temàtica {{ $settings->theme }} i votar les teves cançons preferides.</p>
            <button class="vote-button"><a href="https://timbre.inspedralbes.cat">Click aquí per votar!</a></button> 
        </section>
    </div>
</body>

</html>