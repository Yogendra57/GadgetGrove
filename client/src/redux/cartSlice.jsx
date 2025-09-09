import { createSlice } from "@reduxjs/toolkit";


const cartSlice=createSlice({
    name:'cart',
    initialState:{
        items:[]
    },
    reducers:{
        setCart:(state,action)=>{
            state.items=action.payload
        },
        clearCart:(state,action)=>{
            state.items=[];
        }
    }
});
export const{setCart,addItem,removeItem,clearCart}=cartSlice.actions;
export default cartSlice.reducer;