<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EvaluationController extends Controller
{
    public function evaluate(Request $request)
    {
        // Validate the incoming data
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'expected_keywords' => 'required|array',
            'expected_keywords.*' => 'string',
        ]);

        // Send the answer to the Python service
        $response = Http::timeout(10)->post(
            'http://127.0.0.1:8001/evaluate',
            $validated
        );

        // Return an error if Python is unavailable
        if ($response->failed()) {
            return response()->json([
                'message' => 'Python evaluation service failed.',
            ], 502);
        }

        // Return Python's evaluation result
        return response()->json([
            'message' => 'Answer evaluated successfully!',
            'evaluation' => $response->json(),
        ]);
    }
}
