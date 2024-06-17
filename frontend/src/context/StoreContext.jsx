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

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        //here we adding food item in to usercart
        if(token){
            await axios.post(url+'/api/cart/add',{itemId},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        //here we remove food item from usercart
        if(token){
            await axios.post(url+ '/api/cart/remove',{itemId},{headers:{token}});
        }
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
   
    //calling api for getting foodlist from backend
    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }
    
    //after refreshing browser our cartdata shouldnt be disappeared 
    const loadCartData= async (token) => {
        const response= await axios.post(url+'/api/cart/get',{},{headers:{token}})
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
       
        //calling the fetchFoodlist method
        async function loadData() {
            await fetchFoodList();
            //function for prevent user logout after refreshing the page
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
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