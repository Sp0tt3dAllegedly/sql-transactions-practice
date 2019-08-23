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

router.post('/transfer', async(req, res) => {

  // NEED all queries to use same connection
    let connection = await pool.connect();

  try{
    // Start SQL TRANSACTION here - must all occur at the same time.
    // NEED all queries to use same connection

    await connection.query('BEGIN');
    // Take money out of 'from' account
    await connection.query(`INSERT INTO transaction (acct_id, amount)
    Values ($1, $2);`, [req.body.from, -req.body.amount]);
    // Put money into 'to' account
    await connection.query(`INSERT INTO transaction (acct_id, amount)
    Values ($1, $2);`, [req.body.to, req.body.amount]);
    // Finish transaction and commit changes
    await connection.query('COMMIT');
    res.sendStatus(201);
  }
  catch(error){
    // Yuck, bad things happened so we're going to ROLLBACK
    await connection.query('ROLLBACK');
    console.log('Issues Beautiful Oblivion error occured:', error);
    res.sendStatus(500);
  }
  finally{
    // Finish by closing the connection if good OR bad results - just close it down.
    connection.release();
  }
})

module.exports = router;
