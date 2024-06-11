import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = 'http://localhost:4000'
    const [token, setToken] = useState("")

    // getting foodlist from backend now. 
    const [food_list,setFoodList] = useState([]);

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let iteminfo = food_list.find((product) => product._id === item);
                totalAmount += iteminfo.price * cartItems[item];
            }

        }
        return totalAmount;
    }
   
    //calling api for getting foodlist
    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }

    useEffect(() => {
       
        //calling the fetchFoodlist method
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
            }
        }
        loadData();

    }, [])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;