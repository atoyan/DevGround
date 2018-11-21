const express = require("express");
      router  = express.Router();

      //@GET /api/users/test
      //@desc Tests post route 
      //@access Public  
      router.get('/test', (req,res)=>res.json({msg: "Posts Works"}));

      module.exports = router;