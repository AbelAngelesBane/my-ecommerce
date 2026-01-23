import { useQuery } from "@tanstack/react-query"
import { customerApi } from "../lib/api"
import PageLoader from "../components/PageLoader"
import type { UserAdminModel } from "../interface/customer.interface"
import { dateFormatter } from "../lib/utils"

function CustomersPage() {

  const {data, isPending} = useQuery({
    queryKey:["customers"],
    queryFn:customerApi.getAll,
  })

  const customers = isPending || (!data) ? [] : data

  // customer email addresses wishlist joined date
  return (
    <div className="space-y-6">
      <div className="">
        <div>
          <p className="text-2xl font-bold">Customer</p>
          <p className="text-base-content/70 mt-1">{`${customers.length || 0} customers registered`}</p>
        </div>
      </div>
      {isPending 
        ? <PageLoader/> 
        : (
          <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <td>Customer</td>
                <td>Email</td>
                <td>Addresses</td>
                <td>Wishlist</td>
                <td>Joined Date</td>
              </tr>
            </thead>
            <tbody>
              {
                customers.length !== 0 && customers.map((item:UserAdminModel) => {
                 return <tr key={item._id}>
                    <td>
                      <div className="flex flex-row items-center space-x-2">
                        <div className="avatar">
                          <div className="ring-primary ring-offset-base-100 size-12 rounded-full">
                            <img src={item.imageUrl} alt={item.email}/>
                          </div>
                          </div>
                          <p>{item.name}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p>{item.email}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p>{item.addresses.length}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p>{item.wishlist.length}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p>{dateFormatter(item.createdAt)}</p>
                      </div>
                    </td>                                            
                  </tr>
                })   
              }
            </tbody>
          </table>
          </div>
        )}

    </div>
  )
}

export default CustomersPage
