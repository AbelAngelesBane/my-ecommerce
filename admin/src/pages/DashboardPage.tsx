import { useQuery } from "@tanstack/react-query"
import {orderApi, statsApi} from "../lib/api.ts"
import { DollarSignIcon, PackageIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
import {dateFormatter, orderStatusBadge} from "../lib/utils.ts";
import type { OrderModel } from "../interface/interfaces.ts";



const DashboardPage = () => {

  const {data:ordersData, isLoading:ordersLoading} = useQuery({
    queryKey:["orders"], 
    queryFn:orderApi.getAll,
  });

    const {data:statsData, isLoading:statsLoading} = useQuery({
    queryKey:["stats"], 
    queryFn:statsApi.getDashboard,
  });



  const recentOrders =  ordersLoading ? [] : ordersData.orders 
  const stats = [
    {
      name:"Total Revenue",
      value: statsLoading ? "..." : `${statsData.totalRevenue.toFixed(2) || 0}`,
      icon:<DollarSignIcon className="size-8"/>
    },
    {
      name:"Total Orders",
      value: statsLoading ? "..." : `${statsData.totalOrders || 0}`,
      icon:<ShoppingBagIcon className="size-8"/>
    },
    {
      name:"Total Products",
      value: statsLoading ? "..." : `${statsData.totalProducts || 0}`,
      icon:<PackageIcon className="size-8"/>
    },
        {
      name:"Total Customers",
      value: statsLoading ? "..." : `${statsData.totalCustomers || 0}`,
      icon:<UsersIcon className="size-8"/>
    },
  ]

  console.log("order data", recentOrders);
  console.log("order isLoading", ordersLoading)

  return (
    <div className="space-y-6">
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
        {
          stats.map((item) => (
          <div key={item.name} className="stat">
            <div className="stat-figure text-primary">{item.icon}</div>
            <div className="stat-title">{item.name}</div>
            <div className="stat-value">{item.value}</div>
          </div>))
        }
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>
          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"/>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order:OrderModel) => (
                    <tr key={order._id}>
                      <td>
                        <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                      </td>

                      <td>
                        <div>
                          <div className="font-medium">{order.shippingAddress.fullName}</div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <div className="font-medium">{order.orderItems.length > 1 ? 
                          `${order.orderItems[0].product.name} +${order.orderItems.length - 1} more` 
                          : order.orderItems[0].product.name }</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">{order.totalPrice.toFixed(2)}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className={`font-medium ${orderStatusBadge(order.status)}`} >{order.status}</div>
                        </div>
                      </td>       
                      <td>
                        <div>
                          <div className="font-medium">{dateFormatter(order.updatedAt)}</div>
                        </div>
                      </td>                     

                    </tr>

                  ))}
                </tbody>
              </table>
            </div>
          ) }
        </div>

      </div>
    </div>
  )
}

export default DashboardPage