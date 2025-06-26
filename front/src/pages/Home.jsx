import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/post';


export const Home = () => {
  const dispatch = useDispatch()
  const {posts, tags} = useSelector(state => state.posts)
  const userData = useSelector(state => state.auth.data)
  const isPostsLoading = posts.status === "loading"
  const isTagsLoading = tags.status === "loading"

useEffect(() => {
dispatch(fetchPosts())
dispatch(fetchTags())
}, [dispatch]);
  console.log(userData)
  
  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
        {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => {
  if (isPostsLoading) {
    return <Post isLoading={true} key={index} />;
  }
  return (
  <>
    {console.log("OBJ:", obj.user._id)}
    {console.log("userData:", userData.UseData._id)}
    {obj?.user?._id && (
      <Post
        key={index}
        id={obj._id}
        title={obj.title}
        imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""}
        user={obj.user}
        createdAt={obj.createdAt}
        viewsCount={obj.viewsCount}
        commentsCount={1000000}
        tags={obj.tags}
        isEditable={userData.UseData._id=== obj.user._id}
      />
    )}
  </>
);

})}
        </Grid>
        <Grid xs={4} item>
         <TagsBlock 
  items={isTagsLoading ? [] : tags.items} 
  isLoading={isTagsLoading}
/>
        
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
