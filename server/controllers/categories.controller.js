
import mongoose from "mongoose";
import Category from "../models/categories.model.js";
import Car from "../models/cars.model.js";

const CategoriesController = {
    //GET
    getAll:async(req,res)=>{
        try {
            const categories = await Category.find({ status: { $ne: 'inactive' } }, { __v: 0 }).lean();
             res.status(200).json(categories);
    }
    catch (err) {
        console.error("Server Error in getAll categories:", err); 
        res.status(500).json({ message: "שגיאה פנימית בשרת בטעינת קטגוריות הרכבים" });
    }
    },

    //GET
     getById: async (req, res) => {
        try {
            const {id}=req.params
            const category = await Category.findById(id).select('-__v');
            if (!category) 
                return res.status(404).json({ message: 'הקטגוריה המבוקשת לא נמצאה' });
                
            res.status(200).json(category);
        } 
        catch (err) {
            console.error("Server Error in getById category:", err); 
            res.status(500).json({ message: "שגיאה פנימית בשרת בשליפת פרטי הקטגוריה" }); 
        }
    },
    //POST
    add: async(req,res)=>{
        try{
            const {name} = req.body;
            if(!name || name.trim()==='')
                return res.status(400).json({message: "שם קטגוריה הוא שדה חובה"});

            const existingCategory = await Category.findOne({name: name});
            if (existingCategory && existingCategory.status == 'active') 
                return res.status(400).json({ message: "קטגוריה בשם זה כבר קיימת במערכת" });

            const newCategory = new Category({name:name});
            await newCategory.save();

            res.status(200).json(newCategory);
        }
        catch(err){
            console.error("Server Error in add category:", err); 
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך הוספת הקטגוריה" }); 
        }
    },
    //PUT
    update: async(req,res)=>{
        try{
            const {id} = req.params;
            const {name, status} = req.body;
            const category = await Category.findById(id);
            if(!category)
                return res.status(404).json({message:"הקטגוריה המבוקשת לא נמצאה"})
        
            if (name !== undefined) 
            {
                const trimmedName=name.trim(); 
                if(trimmedName==='')
                    return res.status(400).json({message: "שם קטגוריה הוא שדה חובה"});
                if(category.name!==trimmedName)
                {                              
                    const existingCategory = await Category.findOne({name: name});
                    if (existingCategory && existingCategory.status == 'active')
                        return res.status(400).json({message: "קטגוריה בשם זה כבר קיימת במערכת"});
                }                              
                category.name = trimmedName;
            }
            
            if(status!==undefined)
            {
                if(category.status === 'active' && status === 'inactive')
                {
                    const activeCarsCount = await Car.countDocuments({
                        categories: category._id, 
                        status: { $ne: 'inactive' }
                    });
                    if (activeCarsCount > 0) 
                        return res.status(409).json({message: "לא ניתן להשבית את הקטגוריה מאחר וישנם רכבים פעילים המשויכים אליה" });
                }
                category.status = status;
            }
            await category.save();
            res.status(200).json(category);
        }
        catch(err){
            console.error("Server Error in update category:", err); 
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך עדכון הקטגוריה" })
        }
    },
    //DELETE
    delete: async (req,res) => {
        try{
            const {id} = req.params;
            const category = await Category.findById(id);
            if (!category) 
                return res.status(404).json({ message: "הקטגוריה המבוקשת לא נמצאה" } );
        
            const activeCarsCount = await Car.countDocuments({
                categories: category._id,
                status: { $ne: 'inactive' } 
            });

            if (activeCarsCount > 0)
                return res.status(409).json({ message: "לא ניתן למחוק את הקטגוריה מאחר וישנם רכבים פעילים המשויכים אליה" });

            category.status = 'inactive';
            await category.save();
            res.status(200).json({id});
            }
        catch(err){
            console.error("Server Error in delete category:", err); 
            res.status(500).json({ message: "שגיאה פנימית בשרת במהלך מחיקת הקטגוריה" }); 
        }
    }
    
}

export default CategoriesController
