

export const dateFormatter = (dateStr:string)=>{
const date: Date = new Date(dateStr);

const formattedDate: string = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
return formattedDate;
}

export const orderStatusBadge = (stat:string) => {
    switch (stat.toLowerCase()){
        case "delivered":
            return "badge-success"
        case "shipped":
            return "badge-info"
        case "pending":
            return "badge-warning"
        default:
            return "badge-ghost"
    }
};

export const getStockStatusBadge = (stock:number)=>{
    if(stock === 0) return {text:"Out of Stock", class: "badge-error"};
    if(stock < 20) return {text: "Low Stock", class:"badge-warning"};
    return {text: "In stock", class: "badge-success"};
}



