<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Interview;
use Illuminate\Support\Facades\DB;

class InterviewController extends Controller
{
    public function index()
    {
        $interviews = Interview::with('answers')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Interviews retrieved successfully!',
            'data' => $interviews,
        ]);
    }

    public function show(Interview $interview)
    {
        $interview->load('answers');

        return response()->json([
            'message' => 'Interview retrieved successfully!',
            'data' => $interview,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_role' => 'required|string|max:255',
            'difficulty' => 'required|in:Beginner,Intermediate,Advanced',
            'total_questions' => 'required|integer|min:1|max:20',
        ]);

        $interview = Interview::create([
            'job_role' => $validated['job_role'],
            'difficulty' => $validated['difficulty'],
            'total_questions' => $validated['total_questions'],
            'status' => 'in_progress',
        ]);

        return response()->json([
            'message' => 'Interview created successfully!',
            'data' => $interview,
        ], 201);
    }

    public function storeAnswers(Request $request, Interview $interview)
    {
        $validated = $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*.question_number' => 'required|integer|min:1',
            'answers.*.question_text' => 'required|string',
            'answers.*.answer_text' => 'nullable|string',
        ]);

        DB::transaction(function () use ($interview, $validated) {
            $interview->answers()->delete();

            foreach ($validated['answers'] as $answer) {
                $interview->answers()->create($answer);
            }

            $interview->update([
                'status' => 'completed',
            ]);
        });

        return response()->json([
            'message' => 'Interview answers saved successfully!',
            'data' => $interview->load('answers'),
        ]);
    }
}
