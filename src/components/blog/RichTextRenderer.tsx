import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { Link } from '../Link';
import { RichImage } from './RichImage';

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className="bg-gray-100 rounded px-1">{text}</code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
      <p className="mb-6 leading-relaxed text-gray-700">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
      <h1 className="text-4xl font-bold mt-12 mb-6 font-rubik">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
      <h2 className="text-3xl font-bold mt-12 mb-6 font-rubik text-center">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
      <h3 className="text-2xl font-bold mt-10 mb-4 font-rubik">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
      <h4 className="text-xl font-bold mt-8 mb-4 font-rubik">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
      <h5 className="text-lg font-bold mt-6 mb-3 font-rubik">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
      <h6 className="text-base font-bold mt-6 mb-3 font-rubik">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
      <ul className="list-disc pl-6 mb-6 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
      <ol className="list-decimal pl-6 mb-6 space-y-1">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
      <li className="pl-2">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-primary pl-6 py-1 my-6 text-gray-700 italic">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-10 border-gray-200" />,
    [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
      const target = node?.data?.target;
      if (!target?.sys?.contentType?.sys?.id) {
        return null;
      }

      const contentType = target.sys.contentType.sys.id;
      
      if (contentType === 'componentRichImage') {
        return <RichImage image={target} />;
      }
      
      return null;
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
      <Link 
        href={node.data.uri} 
        className="text-primary hover:underline"
        target={node.data.uri.startsWith('http') ? '_blank' : undefined}
        rel={node.data.uri.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    ),
  },
};

interface RichTextRendererProps {
  content: any;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content) return null;
  return (
    <div className="prose max-w-none">
      {documentToReactComponents(content, options)}
    </div>
  );
}