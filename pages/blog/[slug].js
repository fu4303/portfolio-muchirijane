import React from 'react';
import ReactMarkdown from 'react-markdown';
import { createClient } from 'contentful';

import Head from 'next/head';
import Image from 'next/image';

import Skeleton from '../../components/UI/Skeleton/Skeleton';
import Layout from '../../components/layout/Layout';
import { PostContainer, PostTags } from '../../styles/Post.styles';

const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

export const getStaticPaths = async () => {
	const res = await client.getEntries({ content_type: 'portfolio' });

	//	paths: [ { params: { slug } }, {} ]
	const paths = await res.items.map((item) => {
		return {
			params: { slug: item.fields.slug }
		};
	});

	return {
		paths,
		fallback: true
	};
};

export async function getStaticProps({ params }) {
	const res = await client.getEntries({
		content_type: 'portfolio',
		'fields.slug': params.slug
	});

	return {
		props: {
			blog: res.items[0]
		},
		revalidate: 2
	};
}

export default function BlogContent({ blog, index }) {
	console.log(blog);

	if (!blog) return <Skeleton />;

	const { featuredImage, title, tags, blogPost } = blog.fields;
	const tagList = tags.map((tag) => <span key={index}>#{tag}</span>);

	return (
		<Layout>
			<Head>
				<title>{title}</title>
			</Head>
			<PostContainer>
				<div>
					<Image
						src={`https:${featuredImage.fields.file.url}`}
						width={featuredImage.fields.file.details.image.width}
						height={featuredImage.fields.file.details.image.height}
						alt={featuredImage.fields.description}
					/>
				</div>
				<h1>{title}</h1>

				<PostTags>{tagList}</PostTags>
				<ReactMarkdown>{blogPost}</ReactMarkdown>
			</PostContainer>
		</Layout>
	);
}
