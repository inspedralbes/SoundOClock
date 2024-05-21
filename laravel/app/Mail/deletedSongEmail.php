<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Ban;

class deletedSongEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $song;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $theme, $song)
    {
        $this->user = $user;
        $this->theme = $theme;
        $this->song = $song;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'La teva cançó ha sigut eliminada de la llista de cançons proposades.',
        );
    }

    public function build(){
        return $this->view('emails.deletedSong')->with(['user' => $this->user, 'theme' =>  $this->theme, 'song' => $this->song]);
    }

}
