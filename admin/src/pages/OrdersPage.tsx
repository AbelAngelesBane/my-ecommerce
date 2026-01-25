import { useQuery } from "@tanstack/react-query"
import { orderApi } from "../lib/api"
import PageLoader from "../components/PageLoader";
import { dateFormatter, orderStatusBadge } from "../lib/utils";
import type { OrderModel } from "../interface/order.interface";
import type { AxiosError } from "axios";
import ForbiddenPage from "../components/ForbiddenPage";

function OrdersPage() {
  const {data, isPending, error} = useQuery({
    queryKey:["orders"],
    queryFn:orderApi.getAll,

  })
const isForbidden = (error as AxiosError)?.response?.status === 403;
const orders = isPending || isForbidden || !data ? [] : data.orders;  
//orderid, customer, items, total, status, date  

  return (
    <div className="space-y-6 ">
      {isPending ? <PageLoader/> : isForbidden ? <ForbiddenPage/> : (
        <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">Order</p>
          <p className="text-base-content/70 mt-1">Manage Orders</p>
        </div>
      </div>
      <div className="grid grid-cols-1">
        <div className="overflow-x-auto">
          <table className="table">
          <thead>
            <tr>
              <th>{""}</th>
              <th>Order Id</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>     
            <tbody>
          {(orders.length ?? 0) === 0 ? 
                  <tr>
                    <td>
                      No orders
                    </td>                  
                  </tr>
            :  
              orders.map((item:OrderModel, index:number) => {
              return (
                  <tr key={item._id}> 
                    <td>{index+1}</td>
                    <td>{(item.user._id).slice(0,8)}</td>
                    <td>{item.user.name}</td>
                    <td>{(item.orderItems.length > 1 
                      ? `${item.orderItems[0].product.name}+${item.orderItems.length}`
                      : item.orderItems[0].product.name)}</td>
                    <td>{(item.totalPrice).toFixed(2)}</td>
                    <td>
                      <div>
                        <div className={`badge mt-2 ${orderStatusBadge(item.status)}`}>
                          {item.status.toUpperCase()}
                        </div>
                      </div>                  
                      </td>
                    <td>{dateFormatter(item.updatedAt)}</td>
                  </tr>
              );
              }
              )}             
            </tbody>      
          </table>
        </div>
      </div>        
        </>
      ) }

    </div>
  )
}

export default OrdersPage