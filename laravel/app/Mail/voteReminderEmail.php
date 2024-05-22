<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class voteReminderEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $settings;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $settings)
    {
        $this->user = $user;
        $this->settings = $settings;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Queden 24 hores per votar!',
        );
    }

    public function build(){
        return $this->view('emails.voteReminder')->with(['user' => $this->user, 'settings' => $this->settings]);
    }

}