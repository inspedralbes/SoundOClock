@echo off
REM Iniciar Chrome
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "file:///C:/Users/SoundO'Clock/Desktop/script/ui.vision.html?direct=1&macro=Script"

REM Esperar fins que  l'archiu existeixi
:esperar_arxiu
set "FILE_PATH=C:\Users\SoundO'Clock\Desktop\logs\UIvisionLogs\uivision_log.txt"
if not exist "%FILE_PATH%" (
    echo El archivo %FILE_PATH% no existe. Esperando 5 segundos...
    timeout /t 5 >nul
    goto esperar_arxiu
)

REM Obtener la data i l'hora actual de manera confiable
for /f "tokens=2 delims==." %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "min=%dt:~10,2%"
set "sec=%dt:~12,2%"

REM Ruta de l'archiu de registre depurat
set "DEPURED_LOG=C:\Users\SoundO'Clock\Desktop\logs\DepuredLogs\%DD%_%MM%_%YYYY%-%HH%_%min%_%sec%-depured_log.txt"

echo Proceso completado. Las líneas de error y echo se han guardado en %DEPURED_LOG%

REM Carpeta par moure l'archiu de registre
set "LOGS_HISTORY_DIR=C:\Users\SoundO'Clock\Desktop\logs\UIvisionLogs\LogsHistory"

REM Iterar sobre cada linea de l'archiu de registre
(for /f "usebackq delims=" %%i in ("%FILE_PATH%") do (
    REM Verificar si la linea te la paraula "error" o "echo"
    echo %%i | findstr /C:"error" /C:"echo" >nul
    REM Si la línea te "error" o "echo", afegirla a l'archiu de registre depurat
    if not errorlevel 1 echo %%i
)) > "%DEPURED_LOG%"

REM Moure l'archiu uivision_log.txt a la carpeta LogsHistory i canviar el nom a la data y hora actual
move "%FILE_PATH%" "%LOGS_HISTORY_DIR%\%DD%_%MM%_%YYYY%-%HH%_%min%_%sec%-uivision_log.txt"
