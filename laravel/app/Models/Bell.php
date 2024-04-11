<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Group;

class Bell extends Model
{
    use HasFactory;

    protected $fillable = [
        'hour',
    ];

    public function groups() {
        return $this->belongsToMany(Group::class);
    }
}
