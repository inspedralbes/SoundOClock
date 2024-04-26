<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    public $timestamps = false;
    

    protected $fillable = [
        'start_vote',
        'end_vote',
        'voteDuration',
        'start_moderation',
        'end_moderation',
        'moderationDuration',
        'showExplicit',
        'letProposeExplicit',
        'alertExplicit',
        'theme',
        'teacher_email_key',
        'student_email_key'
    ];
}
