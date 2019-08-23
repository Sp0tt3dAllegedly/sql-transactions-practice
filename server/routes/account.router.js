const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

router.get('/', (req, res) => {

  pool.query(`Select name, SUM(transaction.amount) from account
	join transaction on account.id = transaction.acct_id
  GROUP BY name;`)
  .then(result => {
    res.send(result.rows);
  })
  .catch( error=>{
    res.sendStatus(500);
    console.log('oops, error occured:', error);
    
  })
})

module.exports = router;
