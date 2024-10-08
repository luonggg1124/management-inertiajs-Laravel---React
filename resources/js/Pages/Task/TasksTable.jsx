import TableHeading from "@/Components/TableHeading.jsx";
import TextInput from "@/Components/TextInput.jsx";
import SelectedInput from "@/Components/SelectedInput.jsx";
import {
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP
} from "@/constants.jsx";
import {Link, router} from "@inertiajs/react";
import Pagination from "@/Components/Pagination.jsx";

export  default function TasksTable({tasks, queryParams = null,hideProjectColumn = false}){
  queryParams = queryParams || {};
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    router.get(route("task.index"), queryParams)
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
    router.get(route("task.index"), queryParams)
  }
  return (
    <>
      <div className="overflow-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead
            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
          <tr className="text-nowrap border-b-2 border-gray-500">
            <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-600 cursor-pointer" name="id"
                          sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}
                          sortChanged={sortChanged}>
              ID
            </TableHeading>
            <th className="px-3 py-3 ">
              <div className="flex items-center justify-between gap-1">
                Image
              </div>
            </th>
            {!hideProjectColumn && (<th className="px-3 py-3 ">
              <div className="flex items-center justify-between gap-1">
                Project Name
              </div>
            </th>)}
            <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-600 cursor-pointer" name="name"
                          sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}
                          sortChanged={sortChanged}>
              Name
            </TableHeading>
            <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-600 cursor-pointer" name="status"
                          sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}
                          sortChanged={sortChanged}>
              Status
            </TableHeading>
            <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-600 cursor-pointer" name="priority"
                          sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}
                          sortChanged={sortChanged}>
              Priority
            </TableHeading>
            <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-600 cursor-pointer" name="created_at"
                          sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction}
                          sortChanged={sortChanged}>
              Created Date
            </TableHeading>
            <TableHeading className="dark:hover:bg-slate-500 hover:bg-slate-600 cursor-pointer" name="due_date"
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

            {!hideProjectColumn && (<th className="px-3 py-2"></th>)}
            <th className="px-3 py-2">
              <TextInput className="w-full"
                         defaultValue={queryParams.name}
                         placeholder="Task Name"
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
            <th className="px-3 py-2">
              <SelectedInput className="w-full"
                             defaultValue={queryParams.priority}
                             onChange={(e) => searchFieldChanged('priority', e.target.value)}
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>

              </SelectedInput>
            </th>
            <th className="px-3 py-2"></th>
            <th className="px-3 py-2"></th>
            <th className="px-3 py-2"></th>
            <th className="px-3 py-2"></th>
          </tr>
          </thead>
          <tbody>
          {tasks.data.map(task => (
            <tr className="bg-white dark:hover:bg-slate-700 border-b dark:bg-gray-800 dark:border-gray-700"
                key={task.id}>
              <td className="px-3 py-2">{task.id}</td>
              <td className="px-3 py-2">
                <img src={task.image_path} style={{width: 60}} alt=""/>
              </td>
              {!hideProjectColumn && (<td className="px-3 py-2 ">
                <Link className="hover:underline" href={route("project.show", task.project.id)}>
                  {task.project.name}
                </Link>
              </td>)}
              <th className="px-3 py-2">{task.name}</th>
              <td className="px-3 py-2 ">
                      <span className={"px-2 py-1 rounded text-white " + TASK_STATUS_CLASS_MAP[task.status]}>
                        {TASK_STATUS_TEXT_MAP[task.status]}
                      </span>
              </td>
              <td className="px-3 py-2 ">
                      <span className={"px-2 py-1 rounded text-white " + TASK_PRIORITY_CLASS_MAP[task.priority]}>
                        {TASK_PRIORITY_TEXT_MAP[task.priority]}
                      </span>
              </td>
              <td className="px-3 py-2 text-nowrap">{task.created_at}</td>
              <td className="px-3 py-2 text-nowrap">{task.due_date}</td>
              <td className="px-3 py-2">{task.createdBy.name}</td>
              <td className="px-3 py-2">
                <Link href={route("task.edit", task.id)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                  Edit
                </Link>
                <Link href={route("task.destroy", task.id)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                  Delete
                </Link>
              </td>
            </tr>))}
          </tbody>
        </table>
      </div>
      <Pagination links={tasks.meta.links}/>
    </>
  )
}
