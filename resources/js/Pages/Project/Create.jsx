import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, useForm, Link} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import TextAreaInput from "@/Components/TextAreaInput.jsx";
import SelectInput from "@/Components/SelectInput.jsx";



export default function Create({auth,error}) {
  const {data, setData, post, errors, reset} = useForm({
    image: "",
    name: "",
    status: "",
    description: "",
    due_date: ""
  });
  const onSubmit = (e) => {
    e.preventDefault();
    post(route("project.store"));
  }
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create new Project</h2>
        </div>
      }>
      <Head title="Create Project"/>
      {error && (<div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </div>)}
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">

            <form onSubmit={onSubmit} action="" className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="mt-4">
                <InputLabel htmlFor="project_image_path" value="Project Image"/>
                <TextInput id="project_image_path" accept="image/*" className="my-2 block w-full" type="file" name="image"
                           onChange={(e) => setData("image", e.target.files[0])}/>
                <InputError message={errors.image}/>
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="project_name" value="Project Name"/>
                <TextInput id="project_name" className="my-2 block w-full" isFocused={true} type="text" name="name"
                           value={data.name}
                           onChange={(e) => setData("name", e.target.value)}/>
                <InputError message={errors.name}/>
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="project_description" value="Project Description"/>
                <TextAreaInput id="project_description" className="my-2 block w-full rounded" isFocused={true}
                               name="description"
                               value={data.description}
                               onChange={(e) => setData("description", e.target.value)}/>
                <InputError message={errors.description}/>
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="project_due_date" value="Project Deadline"/>
                <TextInput id="project_due_date" className="my-2 block w-full rounded" type="date"
                           name="due_date"
                           value={data.due_date}
                           onChange={(e) => setData("due_date", e.target.value)}/>
                <InputError message={errors.due_date}/>
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="project_status" value="Project Status"/>
                <SelectInput name="status" id="project_status" className="my-2 block w-full"
                             onChange={(e) => setData("status", e.target.value)}>
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </SelectInput>
                <InputError message={errors.status}/>
              </div>
              <div className="mt-4 text-right">
                <Link href={route("project.index")}
                      className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">
                  Cacel
                </Link>
                <button
                  className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 mr-2">
                  Submit
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
