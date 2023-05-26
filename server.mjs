import express from "express";
import cors from "cors";
import {CORSORIGIN } from "./config.mjs";
import mysql from 'mysql2';

const connection = mysql.createConnection(`mysql://j02xsyd1lei819836g20:pscale_pw_IfDOOAtYiRBV2ksotAB9hpFHCWANdt2jTk4mhv8ERMz@aws.connect.psdb.cloud/hoodiehub?ssl={"rejectUnauthorized":true}`)

connection.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("connection successfull");
});

const app = express();
app.use(cors({
  origin: CORSORIGIN,
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
    addingImagesSizes(products,res);
  } catch (error) {
    console.error("Error in request", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const products = await new Promise((resolve, reject) => {
      connection.query(`select * from products where id = ${req.params.id}`, (err, result, feilds) => {
        if (err) {
          console.log("Error in fetching image ", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    addingImagesSizes(products,res)
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
    addingImagesSizes(products,res);
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

const addingImagesSizes = async (products,res)=>{
  let data = []
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
}

app.listen(3000, () => {
  console.log("server running....");
})


