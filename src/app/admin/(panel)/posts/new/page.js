import PostForm from '../PostForm';
import { createPost } from '../actions';

export default function NewPost() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">New Post</h1>
          <p className="admin-page-sub">Add a post to Media.</p>
        </div>
      </div>
      <PostForm action={createPost} />
    </>
  );
}
