import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, router} from "@inertiajs/react";
import Pagination from "@/Components/Pagination.jsx";
import {PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP} from "@/constants.jsx";
import TextInput from "@/Components/TextInput.jsx";
import SelectedInput from "@/Components/SelectedInput.jsx";
import TableHeading from "@/Components/TableHeading.jsx";

export default function Index({auth, projects, queryParams = null,success,error}) {
  queryParams = queryParams || {}
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    router.get(route("project.index"), queryParams)
  }
  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value)
  }
  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }
    router.get(route("project.index"), queryParams)
  }
  const deleteProject = (project) => {
    if(!window.confirm("Are you sure that you want to delete the project?"))
      return;
    else
      router.delete(route("project.destroy", project.id));

  }

  return (<AuthenticatedLayout
    user={auth.user}
    header={
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Projects</h2>
        <Link href={route("project.create")}
              className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">Add
          New</Link>
      </div>
    }
  >
    <Head title="Projects"/>
    {error && (<div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-red-500 p-2 text-white rounded">
          {error}
        </div>
      </div>
    </div>)}
    {success && (<div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-emerald-500 p-2 text-white rounded">
          {success}
        </div>
      </div>
    </div>)}

    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 text-gray-900 dark:text-gray-100">
            <div className="overflow-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead
                  className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                <tr className="text-nowrap border-b-2 border-gray-500">
                  <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-200 cursor-pointer" name="id"
                                sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}>
                    ID
                  </TableHeading>
                  <th className="px-3 py-3 ">
                    <div className="flex items-center justify-between gap-1">
                      Image
                    </div>
                  </th>
                  <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-200 cursor-pointer" name="name"
                                sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}>
                    Name
                  </TableHeading>
                  <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-200 cursor-pointer" name="status"
                                sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}>
                    Status
                  </TableHeading>

                  <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-200 cursor-pointer" name="created_at"
                                sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}>
                    Created Date
                  </TableHeading>
                  <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-200 cursor-pointer" name="due_date"
                                sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}>
                    Due Date
                  </TableHeading>

                  <th className="px-3 py-3">Created By</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
                <tr className="text-nowrap">
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2">
                    <TextInput className="w-full"
                               defaultValue={queryParams.name}
                               placeholder="Project Name"
                               onBlur={(e) => searchFieldChanged('name', e.target.value)}
                               onKeyPress={(e) => onKeyPress("name", e)}
                    />
                  </th>
                  <th className="px-3 py-2">
                    <SelectedInput className="w-full"
                                   defaultValue={queryParams.status}
                                   onChange={(e) => searchFieldChanged('status', e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>

                    </SelectedInput>
                  </th>
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2"></th>
                </tr>
                </thead>
                <tbody>
                {projects.data.map(project => (
                  <tr
                    className="bg-white dark:hover:bg-slate-700 hover:bg-slate-100 border-b dark:bg-gray-800 dark:border-gray-700"
                    key={project.id}>
                    <td className="px-3 py-2">{project.id}</td>
                    <td className="px-3 py-2">
                      <img src={project.image_path} style={{width: 60}} alt=""/>
                    </td>
                    <th className="px-3 py-2 dark:text-white text-nowrap">
                      <Link className="hover:underline" href={route("project.show", project.id)}>
                        {project.name}
                      </Link>
                    </th>
                    <td className="px-3 py-2 ">
                      <span className={"px-2 py-1 rounded text-white " + PROJECT_STATUS_CLASS_MAP[project.status]}>
                        {PROJECT_STATUS_TEXT_MAP[project.status]}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-nowrap">{project.created_at}</td>
                    <td className="px-3 py-2 text-nowrap">{project.due_date}</td>
                    <td className="px-3 py-2">{project.createdBy.name}</td>
                    <td className="px-3 py-2">
                      <Link href={route("project.edit", project.id)}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                        Edit
                      </Link>
                      <button onClick={(e) => deleteProject(project)}
                              className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                        Delete
                      </button>
                    </td>
                  </tr>))}
                </tbody>
              </table>
            </div>
            <Pagination links={projects.meta.links}/>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>)
}
