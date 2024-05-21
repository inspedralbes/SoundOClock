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

    .card>*:not(header){
        margin-left: 20px;
    }

    p {
        font-size: 16px;
        color: #333;
        margin-bottom: 20px;
        line-height: 1.5;
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
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        width: 100%;
        padding: 20px;
    }

    .header-container button{
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

    .ban-card {
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
    .ban-card div{
       color: white;
       margin: 0px;
       font-size: 20px;
       text-align: center;
    }

    .ban-card > div > span {
        font-weight: bold;
    }

    section {
        margin: 0 20px;
    }

    @media (max-width: 768px) {
        .brand-name {
            font-size: 24px;
        }

        .ban-card {
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
        $ban->banned_from = substr($ban->banned_from, 8, 2) . "-" . substr($ban->banned_from, 5, 2) . "-" . substr($ban->banned_from, 0, 4);
        $ban->banned_until = substr($ban->banned_until, 8, 2) . "-" . substr($ban->banned_until, 5, 2) . "-" . substr($ban->banned_until, 0, 4);
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
            <h1>Hola, {{$user->name}}</h1>
            <h2>T'informem que has sigut sancionat.</h2>
            <div class="ban-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                                        fill="rgb(239 68 68)"
                                        class="icon icon-tabler icons-tabler-filled icon-tabler-alert-circle">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                </svg>
                <div>
                    @if($ban->forVoting == 1)
                        No pots votar cançons des de <span>{{$ban->banned_from}}</span> fins <span>{{$ban->banned_until}}</span>
                    @else
                        No pots proposar cançons des de <span>{{$ban->banned_from}}</span> fins <span>{{$ban->banned_until}}</span>
                    @endif
                </div>
            </div>
            <p>Recorda que el mal ús reiterat de l'aplicació SoundO'Clock pot comportar el bloqueig permanent de l'aplicació així com rebre sancions per part del centre.</p>
            <p>Si no estàs d'acord amb la sanció rebuda pots posar-te en contacte amb l'equip d'administració a través d'aquesta direcció de correu electrònic.</p>
        </section>
    </div>
</body>
</html>
