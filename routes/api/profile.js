const express = require("express");
      router  = express.Router();
      mongoose= require('mongoose');
      passport= require('passport');
      
     //Load Validation
     validateProfileInput = require('./../../validation/profile');
     validateExperienceInput = require('./../../validation/experience');
     validateEducationInput = require('./../../validation/education');

     //Load Profile model
      Profile = require('./../../models/Profile');
     //Load User model
      User    = require('./../../models/User');

      mongoose.set('useFindAndModify', false);
      mongoose.set('useFindOneAndUpdate', true);

      //@GET /api/users/test
      //@desc Tests profile route 
      //@access Public  
      router.get('/test', (req,res)=>res.json({msg: "Profile Works"}));


      //@GET  GET /api/profile
      //@desc Get Current User Profile 
      //@access Private
        router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
            const errors = {};
                Profile.findOne({user: req.user.id})
                .populate('user', ['name', 'avatar'])
                .then(profile=>{
                    if(!profile){
                        errors.noprofile = 'There is no profile for this user'
                        return res.status(404).json(errors);
                    }
                    res.json(profile);
                })
                .catch(err=>res.status(404).json(err));
           })

        //@GET  GET /api/profile/all
        //@desc Get All Profiles
        //@access Public

        router.get('/all', (req,res)=>{
            const errors = {}
            Profile.find({})
            .populate('user', ['name','avatar'])
            .then(profiles=>{
                if(!profiles){
                    errrors.profiles = "There are no profles";
                    res.status(404).json(errors);
                }
                res.json(profiles)
            })
            .catch(err=>{
                res.status(404).json({profiles: "there are no profiles to show"});
            })
        })

        //@GET  GET /api/profile/handle/:handle
        //@desc Get Profile by Handle
        //@access Public

        router.get('/handle/:handle' , (req,res)=>{
            const errors = {};
                Profile.findOne({handle:req.params.handle})
                .populate('user', ['name','avatar'])
                .then(profile=>{
                    if(!profile){
                        errors.noprofile = 'There is no profile for this user';
                        res.status(404).json(errors);
                    }
                    res.json(profile)
                })
                .catch(err=>{
                    res.status(404).json(err);
                })
                
        })
        
        //@GET  GET /api/profile/user/:user_id
        //@desc Get Profile by ID
        //@access Public

        router.get('/user/:user_id' , (req,res)=>{
            const errors = {};
                Profile.findOne({user:req.params.user_id})
                .populate('user', ['name','avatar'])
                .then(profile=>{
                    if(!profile){
                        errors.noprofile = 'There is no profile for this user';
                        res.status(404).json(errors);
                    }
                    res.json(profile)
                })
                .catch(err=>{
                    res.status(404).json({profile: 'There is no profile for this user'});
                })
                
        })


        //@POST  POST /api/profile
        //@desc Create or Edit User Profile
        //@access Private

        router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
            //Get fields
                const {errors, isValid} = validateProfileInput(req.body);

                //Check Validation
                if(!isValid){
                    //Return any errors with 400
                        return res.status(400).json(errors);
                }
                
                //Get Fields
                const profileFields = {};
                profileFields.user  = req.user.id;
                if(req.body.handle)             profileFields.handle              = req.body.handle;
                if(req.body.status)             profileFields.status              = req.body.status;
                if(req.body.company)            profileFields.company             = req.body.company;
                if(req.body.website)            profileFields.website             = req.body.website;
                if(req.body.location)           profileFields.location            = req.body.location;
                if(req.body.bio)                profileFields.bio                 = req.body.bio;
                if(req.body.githubusername)     profileFields.githubusername      = req.body.githubusername;
              
                //Skills array
                if(typeof req.body.skills !== 'undefined') {
                    profileFields.skills = req.body.skills.split(',');
                }

                //Social
                profileFields.social = {};
                
                if(req.body.youtube)      profileFields.social.youtube     = req.body.youtube;
                if(req.body.linkedin)     profileFields.social.linkedin    = req.body.linkedin;
                if(req.body.twitter)      profileFields.social.twitter     = req.body.twitter;
                if(req.body.facebook)     profileFields.social.facebook    = req.body.facebook;
                if(req.body.instagram)    profileFields.social.instagram   = req.body.instagram;
                

                Profile.findOne({user: req.user.id})
                .then(profile => {
                    if(profile){
                        //IF Profile exists Update it
                        Profile.findOneAndUpdate(
                            { user : req.user.id },
                            { $set: profileFields },
                            { new : true }
                            )
                            .then(prfile => res.json(profile))
                            .catch(err=>res.json(err));
                            }else{
                       
                        //Check if handle exists
                        Profile.findOne({handle: profileFields.handle})
                        .then(profile=>{
                            if(profile){
                                errors.handle="handle already exists";
                                res.status(400).json(errors);
                            }
                        //Save Profile
                        new Profile(profileFields).save()
                        .then(profile=> {
                            res.json(profile);
                        })
                        .catch(err=>res.json(err));
                        
                        })
                    }
                })
           })

           
        //@POST  POST /api/profile/experience
        //@desc Add experience to Profile
        //@access Private

           router.post('/experience', passport.authenticate('jwt', {session: false}), (req,res)=>{
            
            //Get fields
            const {errors, isValid} = validateExperienceInput(req.body);

            //Check Validation
            if(!isValid){
                //Return any errors with 400
                    return res.status(400).json(errors);
            }

            
             Profile.findOne({user: req.user.id})
               .then(profile=>{
                   const errors = {};
                   if(!profile){
                       errors.profile = 'profile doesn\'t exist';
                       res.status(404).json(errors);
                   }
                   const newExp = {
                       title : req.body.title,
                       company : req.body.company,
                       location : req.body.location,
                       from : req.body.from,
                       to : req.body.to,
                       current : req.body.current,
                       description : req.body.description
                   }

                   //Add to experience Array
                    profile.experience.unshift(newExp);
                    profile.save().then(profile => res.json(profile));
               })

           })


        // @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
    '/education',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { errors, isValid } = validateEducationInput(req.body);
  
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }
  
      Profile.findOne({ user: req.user.id }).then(profile => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
  
        // Add to exp array
        profile.education.unshift(newEdu);
  
        profile.save().then(profile => res.json(profile));
      });
    }
  );
  
  // @route   DELETE api/profile/experience/:exp_id
  // @desc    Delete experience from profile
  // @access  Private
  router.delete(
    '/experience/:exp_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          // Get remove index
          const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
  
          // Splice out of array
          profile.experience.splice(removeIndex, 1);
  
          // Save
          profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
  );
  
  // @route   DELETE api/profile/education/:edu_id
  // @desc    Delete education from profile
  // @access  Private
  router.delete(
    '/education/:edu_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          // Get remove index
          const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
  
          // Splice out of array
          profile.education.splice(removeIndex, 1);
  
          // Save
          profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
  );
  
  // @route   DELETE api/profile
  // @desc    Delete user and profile
  // @access  Private
  router.delete(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      });
    }
  );
  

      module.exports = router;