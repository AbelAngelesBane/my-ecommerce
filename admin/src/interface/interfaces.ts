export interface OrderModel{
    paymentResult:{
      id:string,
      status:string
    },
    _id:string,
    user:string,
    clerkId:string,
    orderItems: OrderItems[],    shippingAddress:Address,
    totalPrice: number,
    status: string,
    updatedAt:string


}
export interface Address {
    fullName:string,
    streetAddress:string,
    city:string,
    state:string,
    zipCode:string,
    phoneNumber:string,
    _id:string
  }
export interface OrderItems{
  product:{
    _id:string,
    name:string,
    description:string,
    price:number,
    stock:number,
    category:string,
    images: string[],    
    averageRating:number,
    totalReviews:number,
    createdAt:string,
    updatedAt:string,
  },name:string,
  price:number,
  quantity:number,
  image:string,
  _id:string,
}

export interface ProductParams {
    _id:string,
    name: string,
    description: string,
    price: number,
    stock: number,
    category: string,
    images:File[]
}