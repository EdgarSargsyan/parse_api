const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const pg = require("pg");
const promise = require("bluebird");
// const convert = require('object-array-converter');
// const toArray = require('object-values-to-array');
// const unixTime = require('unix-time');
const format = require("pg-format");

const options = {
  // Initialization Options
  promiseLib: promise
};
const pgp = require("pg-promise")(options);

// connect db
const connectionString =
  "postgres://postgres:172839@37.143.14.88:5432/marketCaps";
const getConnection = require("pg-connect")(connectionString);
const db = pgp(connectionString);

setInterval( ()=>{
  rp(
    "https://graphs2.coinmarketcap.com/global/marketcap-altcoin/1367096400000/1518954420000/"
  )
    .then(body => {
      let market = JSON.parse(body).market_cap_by_available_supply;
      let usd = JSON.parse(body).volume_usd;
      for (let i in market) {
          let values = [
            [market[i][0], market[i][1], usd[i][1]]
          ];
           let sql = format("insert into altcoin" + "(time, market_cap_by_available_supply, volume_usd)" +"values %L", values);
          db.query(sql, function(err, result) {
          if (err) throw err;
          console.log(result);
          console.log('okkk')
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
  
    rp(
      "https://graphs2.coinmarketcap.com/global/marketcap-total/1367096400000/1518954420000/"
    )
      .then(body => {
        let market = JSON.parse(body).market_cap_by_available_supply;
        let usd = JSON.parse(body).volume_usd;
        for (let i in market) {
            let values = [
              [market[i][0], market[i][1], usd[i][1]]
            ];
             let sql = format("insert into total" + "(time, market_cap_by_available_supply, volume_usd)" +"values %L", values);
            db.query(sql, function(err, result) {
            if (err) throw err;
            console.log(result);
            console.log('okkk')
            });
        }
      })
      .catch(err => {
        console.log(err);
      });  
  
  
      rp(
        "https://graphs2.coinmarketcap.com/global/dominance/1367096400000/1518954420000/"
      )
        .then(body => {
          let bitcoin = JSON.parse(body).bitcoin;
          let bitcoin_cash = JSON.parse(body)['bitcoin-cash'];
          let dash = JSON.parse(body).dash;
          let ethereum = JSON.parse(body).ethereum;
          let iota = JSON.parse(body).iota;
          let monero = JSON.parse(body).monero;
          let nem = JSON.parse(body).nem;
          let neo = JSON.parse(body).neo;
          let others = JSON.parse(body).others;
          let ripple = JSON.parse(body).ripple;
          let litecoin = JSON.parse(body).litecoin;
          console.log(bitcoin.length, bitcoin_cash.length,dash.length,iota.length,neo.length)
          for (let i in bitcoin) {
              let values = [
                [bitcoin[i][0], bitcoin[i][1], bitcoin_cash[i][1], dash[i][1], ethereum[i][1], iota[i][1], litecoin[i][1],  monero[i][1], nem[i][1], neo[i][1], others[i][1], ripple[i][1]]
              ];
               let sql = format('insert into dominance' + '(time, bitcoin, bitcoin_cash, dash, ethereum, iota, litecoin,' +
                          'monero, nem, neo, others, ripple )' + 'values %L', values);
               db.query(sql, function(err, result) {
              if (err) throw err;
              console.log(result);
              });
          }
        })
        .catch(err => {
          console.log(err);
        })
}, 86400000 );

  

module.exports = router;
