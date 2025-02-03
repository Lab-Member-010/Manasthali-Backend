import { Admin } from "../model/Admin.model.js";

//Admin Login
export const AdminLogin= async (request, response, next)=>{
    try{
        const { username,token } = request.body;
        const admin = await Admin.findOne({ username });
        if(admin.token==token){
            return response.status(200).json({message: "Admin Login success."});
        }else{
            return response.status(401).json({error:"Token Invalid"});
        }
    }catch(err){
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error" });
    }
};