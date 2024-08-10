import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, useForm, Link} from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";



export default function Edit({auth, user, error}) {
  const {data, setData, post, errors, reset} = useForm({
    name: user.name || "",
    email: user.email || "",
    password: "",
    password_confirmation: "",
    _method: "PUT"
  });
  const onSubmit = (e) => {
    e.preventDefault();
    post(route("user.update", user.id));
  }
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit
            User {user.name}</h2>
        </div>
      }>
      <Head title="Create User"/>
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
                <InputLabel htmlFor="user_name" value="User Name"/>
                <TextInput id="user_name" className="my-2 block w-full" isFocused={true} type="text" name="name"
                           value={data.name}
                           onChange={(e) => setData("name", e.target.value)}/>
                <InputError message={errors.name}/>
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="user_email" value="User Email"/>
                <TextInput id="user_email" className="my-2 block w-full" type="text" name="email"
                           value={data.email}
                           onChange={(e) => setData("email", e.target.value)}/>
                <InputError message={errors.email}/>
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="user_password" value="Confirm Password"/>
                <TextInput id="user_password" className="my-2 block w-full" type="password" name="password"
                           onChange={(e) => setData("password", e.target.value)}/>
                <InputError message={errors.password}/>
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="user_password_confirmation" value="Password"/>
                <TextInput id="user_password_confirmation" className="my-2 block w-full" type="password"
                           name="password_confirmation"
                           onChange={(e) => setData("password_confirmation", e.target.value)}/>
                <InputError message={errors.password_confirmation}/>
              </div>
              <div className="mt-4 text-right">
                <Link href={route("user.index")}
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
