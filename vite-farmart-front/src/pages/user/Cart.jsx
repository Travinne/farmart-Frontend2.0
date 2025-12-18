import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Cart() {
const navigate = useNavigate();
const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));


const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);


const checkoutAll = () => {
localStorage.setItem("checkout_items", JSON.stringify(cart));
navigate("/checkout");
};


const checkoutOne = (item) => {
localStorage.setItem("checkout_items", JSON.stringify([item]));
navigate("/checkout");
};


return (
<div>
<div className="cart-header">
<h2>My Cart</h2>
<div>
<strong>Total: KES {total}</strong>
<button onClick={checkoutAll}>Purchase</button>
</div>
</div>


{cart.map((item) => (
<div key={item.id} className="cart-item">
<span>{item.name} (x{item.quantity})</span>
<span>KES {item.price * item.quantity}</span>
<button onClick={() => checkoutOne(item)}>Checkout Item</button>
</div>
))}
</div>
);
}