const express = require("express");
      router  = express.Router();

      //@GET /api/users/test
      //@desc Tests profile route 
      //@access Public  
      router.get('/test', (req,res)=>res.json({msg: "Profile Works"}));

      module.exports = router;