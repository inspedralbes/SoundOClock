<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class bannedSongEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $song;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $song)
    {
        $this->user = $user;
        $this->song = $song;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'La teva cançó ha sigut afegida a la llista negra.',
        );
    }

    public function build(){
        return $this->view('emails.bannedSong')->with(['user' => $this->user, 'song' => $this->song]);
    }

}
