<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('voteDuration')->nullable();
            $table->date('start_vote')->nullable();
            $table->date('end_vote')->nullable();
            $table->integer('moderationDuration')->nullable();
            $table->date('start_moderation')->nullable();
            $table->date('end_moderation')->nullable();
            $table->boolean('showExplicit')->default(false);
            $table->boolean('letProposeExplicit')->default(false);
            $table->boolean('alertExplicit')->default(true);
            $table->string('theme')->nullable();
            $table->string('themeDesc')->nullable();
            $table->string('teacher_email_key')->nullable();
            $table->string('student_email_key')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
