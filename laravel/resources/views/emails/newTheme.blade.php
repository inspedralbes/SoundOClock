<!DOCTYPE html>
<html lang="en">
<head>
    <title>Nova temàtica</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
        }

        header {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
        }

        .header-container {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .header-container p {
            color: #fff;
            font-size: 42px;
            font-weight: bold;
        }
        
        .brand-name > .o {
          color: cyan;
        }

        .brand-name > .clock {
          color: #af4261;
        }

        .header-container img {
            width: 100px;
            height: 100px;
            margin-right: 10px;
        }

        section {
            background-color: #fff;
            padding: 20px;
            margin: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
        }

        h2 {
            color: #333;
            font-size: 20px;
            margin-bottom: 10px;
        }

        p {
            color: #666;
            font-size: 16px;
            line-height: 1.5;
        }

        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        li {
            margin-bottom: 5px;
        }

        button {
            width: 50%;
            display: block;
            margin: 0 auto;
            background-color: #af4261;
            color: #fff;
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 18px;
        }

        button a {
            text-decoration: none;
            color: #fff;
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
        <button><a href="http://timbre.inspedralbes.cat">Vota aquí!</a></button>
      </div>
    </header>
    <section>
        <h1>Hola, {{$user->name}}</h1>
        <h2>S'ha escollit una nova temàtica: {{$theme}}!</h2>
        <p>T'animem a votar i a compartir les teves idees sobre aquest tema emocionant! No deixis passar aquesta oportunitat. La votació comença el dia {{ date('d/m/Y', strtotime($startingTime)) }} i acaba el proper dia {{ date('d/m/Y', strtotime($endingTime)) }}.</p>

        Les cançons escollides per aquesta setmana son:

        <ul>
            @foreach($songs as $song)
                <li>{{$song->title}} - {{$song->artist}}</li>
            @endforeach
        </ul>

        <p>Gràcies per ser part de la nostra comunitat!</p>

        <button><a href="http://timbre.inspedralbes.cat">Vota aquí!</a></button>

    </section>
</body>
</html>