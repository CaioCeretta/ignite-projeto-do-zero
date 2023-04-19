import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';

import styles from './list-link-post.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostsListProps {
  posts: Post[];
  nextPage: string;
  handleNextPage: () => Promise<void>;
}

export function PostsList({
  posts,
  nextPage,
  handleNextPage,
}: PostsListProps): JSX.Element {
  return (
    <div className={styles.posts}>
      {posts.map(post => (
        <Link key={post.uid} href={`/post/${post.uid}`}>
          <a className={styles.post}>
            <strong>{post.data.title}</strong>
            <p>{post.data.subtitle}</p>
            <ul>
              <li>
                <FiCalendar />
                {post.first_publication_date}
              </li>
              <li>
                <FiUser />
                {post.data.author}
              </li>
            </ul>
          </a>
        </Link>
      ))}

      {nextPage && (
        <button type="button" onClick={handleNextPage}>
          Carregar mais posts
        </button>
      )}
    </div>
  );
}
