CREATE DATABASE hoodiehub;

USE hoodiehub;

CREATE TABLE products(
    id INT NOT NULL PRIMARY KEY,
    brand VARCHAR(255) NOT NULL,
    proddescription VARCHAR(255) NOT NULL,
    discprice INT NOT NUll,
    mrp INT NOT NULL,
    discpercentage INT NOT NULL
);

CREATE TABLE images(
    id INT NOT NULL PRIMARY KEY,
    prodid INT NOT NULL,
    imgurl VARCHAR(255) NOT NULL,
    CONSTRAINT img_FK FOREIGN KEY(prodid) REFERENCES products(id)
);

CREATE TABLE sizetable(
    id INT NOT NULL PRIMARY KEY,
    prodid INT NOT NULL,
    s TINYINT(1) NOT NULL,
    m TINYINT(1) NOT NULL,
    l TINYINT(1) NOT NULL,
    xl TINYINT(1) NOT NULL,
    CONSTRAINT size_FK FOREIGN KEY(prodid) REFERENCES products(id)
);