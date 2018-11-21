const express = require("express");
      router  = express.Router();

      //@GET /api/users/test
      //@desc Tests users route 
      //@access Public  
      router.get('/test', (req,res)=>res.json({msg: "Users Works"}));

      module.exports = router;