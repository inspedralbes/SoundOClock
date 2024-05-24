<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Mail;
use App\Mail\deletedSongEmail;
use App\Mail\voteReminderEmail;
use App\Models\User;
use App\Models\Setting;

use Illuminate\Http\Request;

class MailController extends Controller
{
    public function deletedSongEmail(Request $request)
    {
        
        $user = User::find($request->submittedBy);
        $settings = Setting::orderByDesc('start_vote')
        ->first();

        Mail::to($user->email)->send(new deletedSongEmail($user, $settings->theme, $request));

    }

    public function reminderMail(Request $request)
    {
        $users = User::whereNotIn('id', $request['usersVotedId'])->get();

        $settings = Setting::orderByDesc('start_vote')
        ->first();

        foreach ($users as $user) {
            Mail::to($user->email)->send(new voteReminderEmail($user, $settings));
        }
    }
}