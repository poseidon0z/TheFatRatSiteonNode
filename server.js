if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const express = require('express');
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.get('/store', (req, res) => {
  fs.readFile('items.json', function (error, data) {
    if (error) {
      console.log(error);
      res.status(500).end();
    } else {
      res.render('store.ejs', {
        stripePublicKey: stripePublicKey,
        items: JSON.parse(data),
      });
    }
  });
});

app.post('/purchase', (req, res) => {
  fs.readFile('items.json', function (error, data) {
    if (error) {
      console.log(error);
      res.status(500).end();
    } else {
      var fullItemsJSON = JSON.parse(data);
      fullItemsJSON = fullItemsJSON.music.concat(fullItemsJSON.merch);
      const shopItemsJSON = req.body.items;
      total = 0;

      for (var item of shopItemsJSON) {
        var fullItemDetails = fullItemsJSON.find(function (x) {
          return x.id == item.id;
        });
        const itemPrice = fullItemDetails.price;
        total += itemPrice * item.quantity;
      }
      res.json({ message: 'Successfully paid $' + total / 100 });
    }
  });
});

app.listen(3000);
