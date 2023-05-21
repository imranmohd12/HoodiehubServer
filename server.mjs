import express from "express";
import { createConnection } from "mysql";
import cors from "cors";
import { error } from "console";
import { resolve } from "path";
import { rejects } from "assert";
const connection = createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "#HiHyderabad1234",
  database: "hoodiehub",
  port: 3306,
  insecureAuth: true,
});
connection.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("connection successfull");
});

const app = express();
app.use(cors({
  origin: 'http://localhost:1234',
  optionsSuccessStatus: 200,
}));


app.get('/products/:page/:perpage', async (req, res) => {
  try {
    const products = await new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM products LIMIT ${req.params.page},${req.params.perpage}`, (err, result, fields) => {
        if (err) {
          console.error("Error in main query", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const data = [];

    for (const product of products) {
      const images = await new Promise((resolve, reject) => {
        connection.query(`SELECT imgurl FROM images WHERE prodid=${product.id}`, (err, result, fields) => {
          if (err) {
            console.error(`Error in image query for product ID ${product.id}`, err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      const sizes = await new Promise((resolve, reject) => {
        connection.query(`SELECT s,l,m,xl FROM sizetable WHERE prodid=${product.id}`, (err, result, fields) => {
          if (err) {
            console.error(`Error in image query for product ID ${product.id}`, err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      product.img = JSON.parse(JSON.stringify(images));
      product.sizes = JSON.parse(JSON.stringify(sizes));
      data.push(product);
    }

    res.send(data);
  } catch (error) {
    console.error("Error in request", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const prod = await new Promise((resolve, reject) => {
      connection.query(`select * from products where id = ${req.params.id}`, (err, result, feilds) => {
        if (err) {
          console.log("Error in fetching image ", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const data = [];
    //const products = await prod; // Await the promise to resolve

    for (const p of prod) {
      const images = await new Promise((resolve, reject) => {
        connection.query(`SELECT imgurl FROM images WHERE prodid=${p.id}`, (err, result, fields) => {
          if (err) {
            console.error(`Error in image query for product ID ${p.id}`, err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      const sizes = await new Promise((resolve, reject) => {
        connection.query(`SELECT s,l,m,xl FROM sizetable WHERE prodid=${p.id}`, (err, result, fields) => {
          if (err) {
            console.error(`Error in image query for product ID ${p.id}`, err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      p.img = JSON.parse(JSON.stringify(images));
      p.sizes = JSON.parse(JSON.stringify(sizes));
      data.push(p);
    }
    res.send(data);
  }
  catch (error) {
    console.error("Error in request", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/similarproducts/:inputString/:start/:items', async (req, res) => {
  try {
    const products = await new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM products where UPPER(brand) LIKE '%${req.params.inputString.toUpperCase()}%' OR proddescription LIKE '%${req.params.inputString}%' LIMIT ${req.params.start},${req.params.items}`, (err, result, fields) => {
        if (err) {
          console.error("Error in main query", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    const data = [];

    for (const product of products) {
      const images = await new Promise((resolve, reject) => {
        connection.query(`SELECT imgurl FROM images WHERE prodid=${product.id}`, (err, result, fields) => {
          if (err) {
            console.error(`Error in image query for product ID ${product.id}`, err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      const sizes = await new Promise((resolve, reject) => {
        connection.query(`SELECT s,l,m,xl FROM sizetable WHERE prodid=${product.id}`, (err, result, fields) => {
          if (err) {
            console.error(`Error in image query for product ID ${product.id}`, err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      product.img = JSON.parse(JSON.stringify(images));
      product.sizes = JSON.parse(JSON.stringify(sizes));
      data.push(product);
    }

    res.send(data);
  } catch (error) {
    console.error("Error in request", error);
    res.status(500).send("Internal Server Error");
  }
})

app.get(`/seachItems/:searchText`,(req,res)=>{
    connection.query(`select id,brand,proddescription from products where UPPER(brand) LIKE '%${req.params.searchText.toUpperCase()}%' OR UPPER(proddescription) LIKE '%${req.params.searchText.toUpperCase()}%' LIMIT 7`,
    (err,result,feilds)=>{
      if(err){
        console.log("Error in searchitem query ",err);
        throw err;
      }
      else{
        res.send(result);
      }
    })
})
app.get(`/pagination/products/:page/:perpage`,async (req,res)=>{
  try{
    const rows = await new Promise((resolve,reject)=>{
      connection.query(`SELECT * FROM products LIMIT ${req.params.page},${req.params.perpage}`,
        (err,result,fields)=>{
          if(err){
            console.log("error in qerry",err);
            reject(err);
          }
          else{
            resolve(result);
          }
        }
      )
    })
    res.send(rows);
  }
  catch(err){
    console.log("Error access the path ",err);
  }
})
app.listen(3000, () => {
  console.log("server running....");
})


