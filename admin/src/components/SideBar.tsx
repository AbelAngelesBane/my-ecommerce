import { useUser } from "@clerk/clerk-react";
import { ClipboardList, HomeIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { Link, useLocation } from "react-router"

//eslint-disable-next-line
export const NAVIGATION = [
    {name:"Dashboard", path:"/dashboard", icon: <HomeIcon className="size-5"/>},
    {name:"Products", path:"/products", icon: <ShoppingBagIcon className="size-5"/>},
    {name:"Orders", path:"/orders", icon: <ClipboardList className="size-5"/>},
    {name:"Customers", path:"/customers", icon: <UserIcon className="size-5"/>},
]


function SideBar() {

    const location = useLocation();
    const {user} = useUser();

  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex flex-col min-h-full items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            <div className="p-4 w-full">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                        <ShoppingBagIcon className="bg-primary size-6 text-primary-content rounded-sm"/>
                    </div>
                    <span className="text-xl font-bold is-drawer-close:hidden">Admin</span>
                </div>
            </div>

            <ul className="menu w-full grow flex flex-col gap-2">
                {NAVIGATION.map((item) =>{
                    const isActive = item.path.toLowerCase() === location.pathname.toLowerCase();
                    return (
                        <li key={item.path}>
                            <Link to={item.path} className={`is-drawer-close:tooltip-right ${isActive ? "bg-primary text-primary-content" : ""}`}>
                                {item.icon}
                                <span className="is-drawer-close:hidden">{item.name}</span>
                            </Link>
                        </li>
                    )
                } )}
            </ul>
            <div className="p-4 w-full">
                <div className="flex items-center gap-3">
                    <img src={user?.imageUrl} alt={user?.fullName ?? "User"} className="size-10 rounded-full"/>
+                    <div className="text-xs opacity-60 truncate is-drawer-close:hidden">{user?.emailAddresses?.[0]?.emailAddress ?? 'No email'}</div>
                </div>  
            </div>
        </div>
    </div>
  )
}

export default SideBar