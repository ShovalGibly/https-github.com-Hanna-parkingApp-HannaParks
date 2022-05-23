const {updateNavigation} = require('../../Services/navigation.service')
const {getUser} = require('../../Services/user.service')

async function navigationController(req,res) {
    try {
        const { userId , userToken , userType ,myLoc } = req.body;

        if (!(userId && userToken && userType && myLoc)) {
            return res.status(400).json({ message: "All fields must be provided!"})
        }

        console.log(" req.body", req.body);

    const curLoc_json = JSON.stringify(myLoc);

    let updatedObj;
        
    const user = await getUser({token: userToken});

    if(user==null || user.length == 0)
    {
        return res.status(500).json({ message:"user not found in DB"})
    }
    let userID = user[0]._id;

    
        if(userType=='SHARE'){
             updatedObj = await updateNavigation(
                {
                shareUserId: userId,
                },
                {
                    shareCurLoc: curLoc_json 
                }
            )
        }

        if(userType=='FIND'){
             updatedObj = await updateNavigation(
                {
                shareUserId: userId,
                },
                {   searcherUserId : userID ,
                    searcherCurLoc: curLoc_json 
    
                }
            )
        }

        if (!updatedObj) {
            return res.status(500).json({ message: "Error updating navigation obj !"});
        }

        return res.status(200).json({
            "message": "updating navigation obj successfully.",
            updatedObj
            
        });

    
    } catch (e) {
        console.log("Error in navigation controller", e);
    }
}

module.exports = navigationController;