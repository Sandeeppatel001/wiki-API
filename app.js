const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema ({
  title:String,
  content:String
});
const Article = mongoose.model("Article",articleSchema);


//////////////Request Targeting all articles////////
app.route("/articles")
.get((req,res)=>{
    Article.find({})
    .then((foundArticles)=>{
    // console.log(foundArticles);
    res.send(foundArticles);
  })
    .catch((err)=>{
    res.send(err);
  });
  })
.post((req,res)=>{
    const newArticle = new Article({
      title:req.body.title,
      content:req.body.content
    });
    newArticle.save()
    .then(()=>{
      console.log("Item added succesfulyy");
    })
    .catch(( )=>{
      console.log("error Occured");
    })
  })
.delete((req,res)=>{
    Article.deleteMany()
    .then(()=>{
      res.send("Succesfully deleted all articles");
    })
    .catch((error)=>{
      re.send("Error Occured while deletion");
    })
  });

///////////Request targeting Specific articles////////

app.route("/articles/:articleTitle")
.get((req,res)=>{
  Article.findOne({title:req.params.articleTitle})
    .then((foundArticle)=>{
      res.send(foundArticle);
    })
    .catch((err)=>{
      res.send("No articles matching that title was found");
  });
})
.put((req,res)=>{
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
  )
    .then(()=>{
      res.send("Succesfully updated the article");
    })
    .catch((err)=>{
      res.send("Updation failed");
    })
})

.patch((req,res)=>{
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {$set:req.body})
    .then(()=>{
      res.send("Succesfully updated using patch");
    })
    .catch((err)=>{
      res.send("Patch update cannot be executed");
    })
})

.delete((req,res)=>{
  Article.deleteOne(
    {title:req.params.articleTitle})
    .then(()=>{
      res.send("Succesfully Deleted")
    })
    .catch((err)=>{
      res.send("Error in deletion");
    })
});

app.listen(3000,()=>{
  console.log("Server started at port 3000");
})
