<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;


class newThemeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $endingTime;
    public $theme;
    public $selectedSongs;
    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $endingTime, $theme, $selectedSongs)
    {
        $this->user = $user;
        $this->endingTime = $endingTime;
        $this->theme = $theme;
        $this->selectedSongs = $selectedSongs;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'S\'ha escollit una nova temàtica: ' . $this->theme .'!',
        );
    }

    public function build(){
        return $this->view('emails.newTheme')->with(['user' => $this->user, 'endingTime' => $this->endingTime,'theme' => $this->theme, 'selectedSongs' => $this->selectedSongs]);
    }

}
