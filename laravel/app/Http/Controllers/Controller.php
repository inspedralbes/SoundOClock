<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *      title="Documentació dels endpoints",
 *      version="1.0.0",
 *      @OA\Contact(
 *          name="Equip de Spottunes",
 *          email="a20pedgarguz@inspedralbes.cat"
 *      ),
 *      @OA\License(
 *          name="Licencia API",
 *          url="http://www.example.com/licenses/api"
 *      )
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

}
