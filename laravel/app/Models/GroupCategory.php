<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Group;

class GroupCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'abbreviation',
        'is_public',
    ];

    public function groups() {
        return $this->hasMany(Group::class, 'category_id', 'id');
    }
}
