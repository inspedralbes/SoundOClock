<?php

namespace App\Http\Controllers;

use App\Models\classGroups;
use Illuminate\Http\Request;

class ClassGroupsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/classgroups",
     *     operationId="getClassGroups",
     *     tags={"Class Groups"},
     *     summary="Get all class groups",
     *     description="Retrieves all class groups from the database.",
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="ESO"),
     *                 @OA\Property(property="abbreviation", type="string", example="ES"),
     *                 @OA\Property(property="is_public", type="integer", example=1)
     *             )
     *         )
     *     )
     * )
     */

    
    public function index()
    {
        $classGroups = classGroups::all();
        return json_encode($classGroups);
    }

    /**
     * @OA\Post(
     *     path="/api/classGroups",
     *     operationId="createClassGroup",
     *     tags={"Class Groups"},
     *     summary="Create a new class group",
     *     description="Creates a new class group with provided data.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/x-www-form-urlencoded",
     *             @OA\Schema(
     *                 required={"name", "abbreviation", "is_public"},
     *                 @OA\Property(property="name", type="string", example="ESO"),
     *                 @OA\Property(property="abbreviation", type="string", example="ES"),
     *                 @OA\Property(property="is_public", type="integer", example=1)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Class group created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Class Group Created")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */

    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'is_public' => 'required|int',
        ]);

        classGroups::create([
            'name' => $fields['name'],
            'abbreviation' => $fields['abbreviation'],
            'is_public' => $fields['is_public'],
        ]);

        return response('Class Group Created', 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        //
        $fields = $request->validate([
            'id' => 'required|int',
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'is_public' => 'required|int',
        ]);

        $classGroup = classGroups::find($fields['id']);

        $classGroup->name = $fields['name'];
        $classGroup->abbreviation = $fields['abbreviation'];
        $classGroup->is_public = $fields['is_public'];
        $classGroup->save();

        return response('Class Group Updated', 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        //
        $fields = $request->validate([
            'id' => 'required|int',
        ]);

        $classGroup = classGroups::find($fields['id']);

        $classGroup->delete();

        return response('Class Group Deleted', 200);
    }
}
