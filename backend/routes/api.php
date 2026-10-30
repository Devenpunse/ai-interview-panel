<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\EvaluationController;

Route::post('/interviews', [InterviewController::class, 'store']);
Route::post(
    '/interviews/{interview}/answers',
    [InterviewController::class, 'storeAnswers']
);

Route::get('/interviews', [InterviewController::class, 'index']);

Route::get('/interviews/{interview}', [InterviewController::class, 'show']);

Route::post('/evaluate', [EvaluationController::class, 'evaluate']);