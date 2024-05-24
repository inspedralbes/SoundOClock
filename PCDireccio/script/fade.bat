@echo off
setlocal enabledelayedexpansion

rem Carpeta de origen
set "input_folder=C:\Users\SoundO'Clock\preSongs\"

rem Carpeta de destino
set "output_folder=C:\Users\SoundO'Clock\Songs\"

rem Bucle a través de todos los archivos mp3 en la carpeta de entrada
for %%A in ("%input_folder%*.mp3") do (
    set "filename=%%~nxA"
    
    rem Nombre del archivo de salida
    set "output_file=!output_folder!!filename!"
    
    rem Comando ffmpeg para aplicar el efecto de fade in y fade out
    "C:\ffmpeg\bin\ffmpeg.exe" -i "%%A" -af "afade=t=in:ss=0:d=3,afade=t=out:st=27:d=3" "!output_file!" -y

)
