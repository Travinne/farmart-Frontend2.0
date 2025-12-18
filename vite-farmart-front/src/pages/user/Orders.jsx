import { useEffect, useState } from "react";
import { ordersByUser } from "@/api/orders.api";


export default function Orders() {
const userId = JSON.parse(atob(localStorage.getItem("access_token").split(".")[1])).sub;
const [orders, setOrders] = useState([]);


useEffect(() => {
ordersByUser(userId).then((res) => setOrders(res.data));
}, [userId]);


return (
<div>
<h2>My Orders</h2>
{orders.map((o) => (
<div key={o.id}>Order #{o.id} — {o.status}</div>
))}
</div>
);
}