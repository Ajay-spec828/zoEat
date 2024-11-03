const express = require("express");
const router = express.Router();
const Order = require("./Orders");
const cors = require("cors");

router.use(cors());

router.post("/orderData", async (req, res) => {
    // Ensure the required fields are present
    if (!req.body.email || !req.body.order_data || !req.body.order_date) {
        return res.status(400).send("Email, order data, and order date are required.");
    }

    // Add the order date to the order data
    let data = req.body.order_data;
    data.splice(0, 0, { Order_date: req.body.order_date });

    try {
        let eId = await Order.findOne({ email: req.body.email });
        console.log(eId);

        if (eId === null) {
            // Create new order
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
            return res.status(201).json({ success: true });
        } else {
            // Update existing order
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
            return res.json({ success: true });
        }
    } catch (error) {
        console.error(error.message);
        // Respond with a 500 status code for server errors
        return res.status(500).send("Server Error: " + error.message);
    }
});


router.post("/myorderData", async (req, res) => {
  try{
      let myData = await Order.findOne({"email": req.body.email })
      res.json({orderData: myData})
  }catch(error){
    res.send("Server Error", error.message)
  }

});

module.exports = router;

