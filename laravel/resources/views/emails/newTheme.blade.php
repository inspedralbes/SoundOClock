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

        .branc-name>.clock {
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
    </style>
</head>
<body>
    <header>
      <div class="header-container">
        <img src="https://lh3.googleusercontent.com/drive-viewer/AKGpihaUIklAnlRSAyy1Z7wuVVdCWDVnwv3HMkPeNh0gmtlhpX_smBW7w3GJmO9X4XFCeg_Z6ISQGg_woxMFwp1kp3fw8eFk7AI0Fi0=s2560" />
        <p class="brand-name">Sound<span>O'</span><span>Clock</span></p>
      </div>
    </header>
    <section>
        <h1>Hola, {{$user->name}}</h1>
        <h2>S'ha escollit una nova temàtica: {{$theme}}!</h2>
        <p>T'animem a votar i a compartir les teves idees sobre aquest tema emocionant! No deixis passar aquesta oportunitat. La votació acaba el proper dia {{ date('d/m/Y', strtotime($endingTime)) }}.</p>

        <p>Gràcies per ser part de la nostra comunitat!</p>

    </section>
</body>
</html>