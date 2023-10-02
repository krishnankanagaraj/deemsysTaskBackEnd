import dbo from "./db.js";
import express from "express";
import cors from 'cors';
import {client} from './db.js'
const app=express();
const port =5500;
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors());
// Route to get all products
app.get('/products',(req,res)=>{
    dbo().then(async(db)=>{
        const collection= db.collection('products');
        const cursor= collection.find();
        const data=await cursor.toArray();
        res.send(data)
     }).catch(err=>console.log(err)).finally(async()=>{await client.close()});
})
// Route get all Users
app.get('/users',(req,res)=>{
    dbo().then(async(db)=>{
        const collection= db.collection('users');
        const cursor= collection.find();
        const users=await cursor.toArray();
        res.send(users)
     }).catch(err=>console.log(err)).finally(async()=>{await client.close()});
})
// Route to acess one user using email
app.get(`/users/:email`,(req,res)=>{
    const email=req.params.email
    dbo().then(async db=>{
        const collection=db.collection('users');
        const user=await collection.findOne({email:email})
        res.send(user)
    }).catch(err=>console.log(err)).finally(async()=>{
        await client.close();
    })
})

// Route to add a product to cart
app.post(`/addCart/:email`,(req,res)=>{
    const email=req.params.email
    const newItem=req.body
    dbo().then(async db=>{
        const collection=db.collection('users');
        const user=await collection.findOne({email:email});
        const cart=user.cartItems;
        const cartItem=[...cart,newItem]
        await collection.updateOne({email:email},{$set:{cartItems:cartItem}})
        res.send("done")
    }).catch(err=>console.log(err)).finally(async()=>{
        await client.close();
    })
})
//Route delete a item in cart
app.post('/deleteCartItem/:email',(req,res)=>{
    const email=req.params.email
    const newCart=req.body
    dbo().then(async db=>{
        const collection=db.collection('users');
        await collection.updateOne({email:email},{$set:{cartItems:newCart}})
        res.send('done')
    }).catch(err=>console.log(err)).finally(async()=>{
        await client.close();
    })
    }
)
// Route move products from cart to orders
app.post(`/addOrders/:email`,(req,res)=>{
    const email=req.params.email
    dbo().then(async db=>{
        const collection=db.collection('users');
        const user=await collection.findOne({email:email});
        const cart=user.cartItems
        const oldOrders=user.orders;
        const orders=[...oldOrders,...cart]
        await collection.updateOne({email:email},{$set:{cartItems:[]}})
        await collection.updateOne({email:email},{$set:{orders:orders}})
        res.send("done")
    }).catch(err=>console.log(err)).finally(async()=>{
        await client.close();
    })
})
// Route to get orders of a user
app.get('/getOrders/:email',(req,res)=>{
    const email=req.params.email
    dbo().then(async db=>{
        const collection=db.collection('users');
        const user=await collection.findOne({email:email});
        const orders=user.orders;
        res.send(orders);
    }).catch(err=>console.log(err)).finally(async()=>{
      await  client.close();
    })
})
// route to get cart items of a user
app.get('/getCart/:email',(req,res)=>{
    const email=req.params.email
    dbo().then(async db=>{
        const collection=db.collection('users');
        const user=await collection.findOne({email:email});
        const cart=user.cartItems;
        res.send(cart);
    }).catch(err=>console.log(err)).finally(async()=>{
      await  client.close();
    })
})
// to add a enquiry
app.post('/addEnquiry',(req,res)=>{
    dbo().then(async db=>{
        const newEnquiry=req.body
        console.log(newEnquiry)
        const collection=db.collection('enquiry')
        await collection.insertOne(newEnquiry)
        res.send('done')
    })
})
// Route to add new user
app.post('/addUser',async (req,res)=>{
    dbo().then(async(db)=>{
        const newUser=req.body
        console.log(newUser)
        const collection=db.collection('users')
        await collection.insertOne(newUser)
      res.send('done')
      console.log('sucessfully added a user')
    }).catch(err=>console.log(err)).finally(async()=>{
        await client.close();
    })
})

// to start server on a port
app.listen(port,()=>{
    console.log("server started at"+port);
})
