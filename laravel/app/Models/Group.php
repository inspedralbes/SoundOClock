<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Bell;
use App\Models\User;
use App\Models\GroupCategory;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'abbreviation',
        'is_public',
        'category_id'
    ];

    public function users() {
        return $this->belongsToMany(User::class);
    }

    public function bells() {
        return $this->belongsToMany(Bell::class);
    }

    public function category() {
        return $this->belongsTo(GroupCategory::class, 'category_id', 'id');
    }
}
