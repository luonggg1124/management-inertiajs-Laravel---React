<?php

namespace App\Http\Controllers;



use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();
        $sortField = request('sort_field',"created_at");
        $sortDirection = request('sort_direction',"desc");
        if(request("name")){
            $query->where("name","like","%".request("name")."%");
        }
        if(request("status")){
            $query->where("status",request("status"));
        }
        if(request("priority")){
            $query->where("priority",request("priority"));
        }
        $projects = $query->orderBy($sortField,$sortDirection)->paginate(10)->onEachSide(1);

        return inertia("Task/Index",[
            "tasks" => TaskResource::collection($projects),
            "queryParams" => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()->orderBy("name")->get();
        $users = User::all();

        return inertia("Task/Create",[
            "projects" => ProjectResource::collection($projects),
            "users" => UserResource::collection($users),
            "error" => session("error")
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $data = $request->validated();
                /** @var $image \Illuminate\Http\UploadedFile */
                $image = $data["image"] ?? null;
                $data["created_by"] = Auth::id();
                $data["updated_by"] = Auth::id();
                if ($image) {
                    $data["image_path"] = $image->store("task/" . (new Carbon())->now('Asia/Ho_Chi_Minh')->format("Y_m_d_His_") . Str::random(), "public");
                }

                Task::query()->create($data);
            });
            return to_route("task.index")->with("success", "Task Created Successfully");
        } catch (\Throwable $th) {
            return redirect()->back()->with("error", $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $query = $project->tasks();
        $sortField = request('sort_field', "created_at");
        $sortDirection = request('sort_direction', "desc");
        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }
        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return inertia("Task/Show", [
            "project" => new TaskResource($project),
            "tasks" => TaskResource::collection($tasks),
            "queryParams" => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        return inertia("Task/Edit", [
            "task" => new TaskResource($task),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        try {
            $name = $project->name ?? '*';
            DB::transaction(function () use ($request, $task) {
                $data = $request->validated();
                /** @var $image \Illuminate\Http\UploadedFile */
                $image = $data["image"] ?? null;
                $data["updated_by"] = Auth::id();
                if ($image) {
                    if ($project->image_path) {
                        Storage::disk("public")->deleteDirectory(dirname($project->image_path));
                    }
                    $data["image_path"] = $image->store("project/" . (new Carbon())->now('Asia/Ho_Chi_Minh')->format("Y_m_d_His_") . Str::random(16), "public");
                }

                $project->update($data);
            });
            return to_route("project.index")->with("success", "Project \" $name \" Was Updated Successfully");
        } catch (\Throwable $th) {
            return redirect()->back()->with("error", $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        try {
            $task->delete();
            return to_route("project.index")->with("success", "The Task Was Deleted.");
        } catch (\Throwable $throwable) {
            if ($throwable instanceof ModelNotFoundException) {
                Log::error(__CLASS__ . '@' . __FUNCTION__, [
                    "line" => $throwable->getLine(),
                    "file" => $throwable->getFile(),
                    "message" => $throwable->getMessage(),
                    "trace" => $throwable->getTraceAsString(),
                ]);
                return redirect()->back()->with("error", "Something went wrong!Please try again.");
            }
            return redirect()->back()->with("error", "Something went wrong!Please try again.");
        }
    }
}
