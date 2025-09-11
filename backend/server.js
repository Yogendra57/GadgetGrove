const dotenv=require('dotenv')
dotenv.config();
const cors=require('cors');
const express=require('express')
const app=express();
app.use(cors({
  origin: "https://gadgetgrove-ui.onrender.com", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
const {connectToDB}=require('./config/db')
const cookieParser=require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

connectToDB();
const authRoutes=require('./routes/authRoutes');
const userRoutes=require('./routes/userRoutes');
const orderRoutes=require('./routes/orderRoutes');
const productRoutes=require('./routes/productRoutes');
const cartRoutes=require('./routes/cartRoutes');
const addressRoutes=require('./routes/addressRoutes');
const wishlistRoutes=require('./routes/wishlistRoutes');
const paymentRoutes=require('./routes/paymentRoutes');
const profileRoutes=require('./routes/profileRoutes'); 
const reviewRoutes=require('./routes/reviewRoutes');
const adminRoutes=require('./routes/adminRoutes');
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.send("Backend is working");
});
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/addresses',addressRoutes)
app.use('/api/wishlist',wishlistRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
const PORT=process.env.PORT ||8000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});