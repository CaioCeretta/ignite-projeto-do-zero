import { GetStaticPaths, GetStaticProps } from 'next';

import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { Header } from '../../components/Header';
import { formatDate } from '../../utils/format_date';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  const totalWords = post.data.content.reduce((total, contentItem) => {
    const { heading } = contentItem;
    const headingTime = heading.split(/\s+/).length;
    const wordsTime = RichText.asText(contentItem.body).split(/\s+/).length;

    return total + headingTime + wordsTime;
  }, 0);

  const averageReadingTime = Math.ceil(totalWords / 200);

  const formattedDate = formatDate(post.first_publication_date);

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.data.title}</title>
      </Head>

      <Header />

      <img className={styles.banner} src={post.data.banner.url} alt="banner" />

      <strong className={styles.title}>{post.data.title}</strong>

      <div className={styles.postMisc}>
        <span>
          {' '}
          <FiCalendar /> {formattedDate}
        </span>

        <span>
          <FiUser />
          {post.data.author}
        </span>

        <span>
          <FiClock />
          {averageReadingTime} min
        </span>
      </div>

      <div>
        {post.data.content.map(content => {
          return (
            <article className={styles.post_content} key={content.heading}>
              <h2>{content.heading}</h2>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug));

  return {
    props: {
      post: response,
    },
    revalidate: 1200,
  };

  // TODO
};
