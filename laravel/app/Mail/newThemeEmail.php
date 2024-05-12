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
    public $startingTime;
    public $endingTime;
    public $theme;
    public $selectedSongs;
    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $startingTime, $endingTime, $theme, $selectedSongs)
    {
        $this->user = $user;
        $this->startingTime = $startingTime;
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
        return $this->view('emails.newTheme')->with(['user' => $this->user,'startingTime'=>$this->startingTime, 'endingTime' => $this->endingTime,'theme' => $this->theme, 'selectedSongs' => $this->selectedSongs]);
    }

}
