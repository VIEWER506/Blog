import { text } from "express"
import PostModel from "../models/Post.js"
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

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

  PostModel.findOneAndUpdate(
  {
    _id: postId,
  },
  {
    $inc: { viewsCount: 1 },
  },
  {
    returnDocument: "after",
  }
).then((doc, err) => {
  if (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось вернуть статью",
    });
  }
  if (!doc) {
    return res.status(404).json({
      message: "Статья не нейдена",
    });
  }
  res.json(doc);
});
} catch (err) {
console.log(err);
res.status(500).json({
  message: "Ошибка",
  });
 }
};

export const  create = async(req, res) => {
    try {
        const doc = PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user:req.userId
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