import { useState } from "react";
import { initiatePayment } from "@/api/payments.api";


export default function Checkout() {
const items = JSON.parse(localStorage.getItem("checkout_items") || "[]");
const [method, setMethod] = useState("mpesa");


const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);


const handlePay = async () => {
await initiatePayment({ method, amount: total, items });
alert("Payment initiated");
localStorage.removeItem("checkout_items");
};


return (
<div>
<h2>Checkout</h2>
{items.map((item) => (
<div key={item.id}>{item.name} x{item.quantity}</div>
))}
<p>Total: KES {total}</p>


<select value={method} onChange={(e) => setMethod(e.target.value)}>
<option value="mpesa">M-Pesa</option>
<option value="airtel">Airtel Money</option>
</select>


<button onClick={handlePay}>Confirm Payment</button>
</div>
);
}