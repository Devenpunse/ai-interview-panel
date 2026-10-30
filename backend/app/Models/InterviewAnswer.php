<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InterviewAnswer extends Model
{
    protected $fillable = [
        'interview_id',
        'question_number',
        'question_text',
        'answer_text',
    ];
}
