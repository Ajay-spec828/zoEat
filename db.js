const mongoose=require("mongoose");
const url='mongodb+srv://ajpandey2580:%40Ajay7744@zofoodmern.epwhj.mongodb.net/zofoodmern?retryWrites=true&w=majority&appName=zofoodmern';
const mongoDB = async()=>{
   try{
    await  mongoose.connect(url,{
        useNewUrlParser:true,
        useUnifiedTopology:true, 
       });
   console.log("MongoDB Connected");

   const fetched_data = await mongoose.connection.db.collection("food_items").find({}).toArray();
   const foodCategory = await mongoose.connection.db.collection("food_category").find({}).toArray();

   global.food_items=fetched_data;
   global.foodCategory=foodCategory;
   
  } catch (error){
    console.error("MongoDB error",error);
  }
}
module.exports=mongoDB;








