const { query } = require("express");
const Category = require("../../models/categorySchema");
const { MongoCryptCreateDataKeyError } = require("mongodb");



const categoryInfo = async (req,res)=>{
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page-1)*limit;

        const categoryData = await Category.find({})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);

        const totalCategories = await Category.countDocuments();
        const totalPages = Math.ceil(totalCategories/limit);
        res.render("category",{
            cat:categoryData,
            currentPage:page,
            totalPages:totalPages,
            totalCategories:totalCategories
        });

    } catch (error) {
        
        console.error(error);
        res.redirect("pageError")
    }
};

const addCategory = async (req,res)=>{
    const {name,description} = req.body;
    try {
        
        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            return res.status(400).json({error:"Category already exists"})
        }
        const newCategory = new Category({
            name,
            description,
        })
        await newCategory.save();
        return res.json({message:"Category added successfully"})
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error"})
    }
};

const getEditCategory= async (req,res)=>{
    try {
        const id = req.query.id;
        const category= await Category.findOne({_id:id});
        res.render("editCategory",{category:category});

    } catch (error) {
        
        res.redirect("/pageError")
    }
};

const editCategory= async (req,res)=>{
    try {
        const id=req.params.id;
        const {categoryName,description} = req.body;
        const existingCategory = await Category.findOne({name:categoryName});

        if(existingCategory){
            return res.status(400).json({error:"Category exists, Please choose another name"})
        }

        const updateCategory = await Category.findByIdAndUpdate(id,{
            name:categoryName,
            description:description,
        },{new:true});

        if(updateCategory){
            res.redirect("/admin/category");
        }else{
            res.status(404).json({error:"Category not found"});
        }




    } catch (error) {
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports ={
    categoryInfo,
    addCategory,
    getEditCategory,
    editCategory,
}