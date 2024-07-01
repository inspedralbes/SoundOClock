<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Obtener la fecha actual
        $startVoteDate = Carbon::now()->format('Y-m-d');
        // Calcular las fechas basadas en la fecha actual
        $endVoteDate = Carbon::now()->addYear()->format('Y-m-d');
        $startModerationDate = $endVoteDate;
        $endModerationDate = Carbon::now()->addYears(2)->format('Y-m-d');

        // Leer la plantilla del archivo SQL
        $sqlTemplate = file_get_contents(database_path('../sql/seeder.sql'));

        // Reemplazar las variables de la plantilla con las fechas calculadas
        $sql = str_replace(
            ['{{start_vote}}', '{{end_vote}}', '{{start_moderation}}', '{{end_moderation}}'],
            [$startVoteDate, $endVoteDate, $startModerationDate, $endModerationDate],
            $sqlTemplate
        );

        // Ejecutar el SQL generado
        DB::unprepared($sql);
    }
}
