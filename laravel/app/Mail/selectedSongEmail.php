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
    public $startingTime;
    public $endingTime;
    public $theme;
    public $selectedSongs;
    public $bells;
    
    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $startingTime, $endingTime, $theme, $selectedSongs,$bells)
    {
        $this->user = $user;
        $this->startingTime = $startingTime;
        $this->endingTime = $endingTime;
        $this->theme = $theme;
        $this->selectedSongs = $selectedSongs;
        $this->bells = $bells;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'La teva cançó ha sigut seleccionada!',
        );
    }

    public function build(){
        return $this->view('emails.selectedSong')->with(['user' => $this->user,'startingTime'=>$this->startingTime, 'endingTime' => $this->endingTime,'theme' => $this->theme, 'selectedSongs' => $this->selectedSongs,'bells' => $this->bells]);
    }

}