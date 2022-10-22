const express = require('express')
let {posts,likes} = require('./db');
const {responser} = require('./helper');
const cors = require("cors");
const app = express()
app.use(express.json());
app.use(cors());
const port = 3001

app.get('/', (req, res) => {
    res.send('Hello there!')
})

app.get('/posts',(req,res)=>{
    return res.status(200).json(responser(1,null,{posts,likes}))
})

app.get('/search/post/autocomplete',(req,res)=>{
    const {value} = req.query;
    let postArr = posts.filter(obj=>obj.name.toLowerCase().startsWith(value.toLowerCase()));
    let likesArr = [];
    postArr.forEach(obj=>{
        likesArr = [...likesArr,...likes.filter(item=>item.post_id===obj.id)]
    })
    return res.status(200).json(responser(postArr.length?1:0,"Searching post",postArr.length?{posts:postArr,likes:likesArr}:"Nothing found"));
})

app.post('/posts/:post_id/:username/like',(req,res)=>{
    let {post_id,username} = req.params;
    post_id = parseInt(post_id);
    if(!posts.filter(obj=>obj.id===parseInt(post_id)).length) 
        return res.status(204).json(responser(0,"Invalid post id!"))
    likes = likes.map(obj=>{
        if(obj.post_id===parseInt(post_id)) obj.users = [...obj.users,username];
        return obj;
    })
    let postExist = posts.filter(obj=>obj.id===post_id).length?true:false;
    let userExist = likes.filter(obj=>obj.post_id===post_id).length?true:false;
    if(postExist && !userExist)
    {
        likes = [...likes,{id:likes[likes.length-1].id+1,post_id,users:[username]}]
    }
    return res.status(200).json(responser(1,"Successfully liked!",likes))
})

app.delete('/posts/:post_id/:username/like',(req,res)=>{
    const {post_id,username} = req.params;
    if(!likes.filter(obj=>obj.post_id===parseInt(post_id)).length) 
        return res.status(204).json(responser(0,"Invalid post id!"))
    likes = likes.map(obj=>{
        if(obj.post_id===parseInt(post_id)) obj.users = obj.users.filter(user=>user!==username);
        return obj;
    })
    
    return res.status(200).json(responser(1,'Successfull unliked!',likes))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})