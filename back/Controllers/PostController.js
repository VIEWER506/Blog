import { text } from "express"
import PostModel from "../models/Post.js"
import User from "../models/User.js"

export const getAll = async(req, res) => {
    const posts = await PostModel.find().populate("user").exec()
    try {

    res.json(posts)
} catch (err) {
    console.log(err)
    res.status(500).json({
        message: "Не удалось получить статьи"
    })
}
}
export const getLastTags = async(req, res) => {
  const posts = await PostModel.find().limit(5).exec()
  const tags = posts.map(obj => obj.tags).flat().slice(0,5)

    try {

    res.json(tags)
} catch (err) {
    console.log(err)
    res.status(500).json({
        message: "Не удалось получить статьи"
    })
}}
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    ).populate("user").exec(); 

    if (!doc) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось вернуть статью",
    });
  }
};
export const  create = async(req, res) => {
    try {
        const doc = new PostModel({
  title: req.body.title,
  text: req.body.text,
  imageUrl: req.body.imageUrl,
  tags: req.body.tags,
  user: req.userId, 
});

        const post = await doc.save()

        res.json(post)
    } catch (err) {
        console.log(err)
            res.status(500).json({
                message: "Не удалось создать статью"
            })
    }
    
}
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

  const doc = await PostModel.findOneAndDelete(
  {
    _id: postId,
  });
  if (!doc) {
    return res.status(404).json({
      message: "Статья не найдена",
    });
  }
  res.json({
    succes: true
  });
} catch (err) {
console.log(err);
res.status(500).json({
  message: "Не удалось удалить статью",
  });
 }
};
export const update = async(req, res) => {
  try {
    const postId = req.params.id

    await PostModel.updateOne({
      _id: postId
    },{
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user:req.userId
    });
    res.json({
      succes: true
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
                message: "Не удалось обновить статью"
            })
  }
} 
export const createComment = async (req, res) => {
  try {
    const { text, postId } = req.body;
    const authorId = req.userId; 
    console.log(req.body)

    const user = await User.findById(authorId)
     console.log(user)
    const newComment = {
      text,
      author: authorId,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      createdAt: new Date()
    };

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId, 
      { $push: { comments: newComment } },
      { new: true }
    ).populate('comments.author', 'firstName lastName avatarUrl');

    if (!updatedPost) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    const createdComment = updatedPost.comments.id(updatedPost.comments.length - 1);
    res.status(201).json(createdComment);

  } catch (err) {
    console.error("Ошибка создания комментария:", err);
    res.status(500).json({ 
      message: "Ошибка сервера",
      error: err.message 
    });
  }
};
export const likePost = async (req, res) => {
  try {
    const { id } = req.body;
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { $inc: { likesCount: 1 } },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Ошибка при лайке" });
  }
};