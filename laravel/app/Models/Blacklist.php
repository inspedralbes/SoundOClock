<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blacklist extends Model
{
    use HasFactory;

    /**
     * The table name associated with the model.
     */
    protected $table = 'blacklist';

    protected $casts = [
        'artists' => 'array',
    ];
    
}