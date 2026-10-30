<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Interview extends Model
{
    protected $fillable = [
        'job_role',
        'difficulty',
        'total_questions',
        'status',
    ];

    public function answers(): HasMany
    {
        return $this->hasMany(InterviewAnswer::class);
    }
}
