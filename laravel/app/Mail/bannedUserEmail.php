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

class bannedUserEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $ban;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, Ban $ban)
    {
        $this->user = $user;
        $this->ban = $ban;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Has sigut sancionat',
        );
    }

    public function build(){
        return $this->view('emails.bannedUser')->with(['user' => $this->user, 'ban' => $this->ban]);
    }

}
