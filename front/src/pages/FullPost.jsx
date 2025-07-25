import  {useState, useEffect } from "react";
import {useParams} from "react-router-dom"
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";
import axios from "../axios";
export const FullPost = () => {
  const {id} = useParams()
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log(id)
  }, [id])
  useEffect(() => {
    if(!id){return}
    axios.get(`/posts/${id}`).then((res) => {setData(res.data);
      setIsLoading(false)
    }).catch((err) => {
      console.log(err)
      alert("Ошибка получения статьи")
    }) 
  }, [])
  
  if(isLoading){
    return <Post isLoading={isLoading}/>
  }
  
  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={0}
        user={data.user}
        tags={data.tags}
        isFullPost
        >
          <ReactMarkdown children={data.text} /> 
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
