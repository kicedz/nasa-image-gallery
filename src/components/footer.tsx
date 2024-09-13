import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Link from 'next/link';
import { FooterFields, LinkFields, LinkEntrySkeleton } from '../../types';
import { Entry } from 'contentful';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

interface FooterProps {
  footerData: FooterFields;
}

const Footer: React.FC<FooterProps> = ({ footerData }) => {
  const currentYear = new Date().getFullYear();

  if (!footerData) {
    return null;
  }

  const { footerLinks, contact, copyright } = footerData;


  const options = {
    renderNode: {
      [INLINES.HYPERLINK]: (node: any, children: any) => {
        const uri = node.data.uri;
        return (
          <a href={uri} className="text-primary hover:underline">
            {children}
          </a>
        );
      },
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
        return <p className="mb-2">{children}</p>;
      },

    },
  };

  return (
    <footer className="bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {footerLinks && footerLinks.length > 0 && (
          <nav className="flex flex-wrap justify-center mb-4">
            {footerLinks.map((linkEntry: Entry<LinkEntrySkeleton>, index) => {
              const linkFields = linkEntry.fields as LinkFields;
              const linkText: string = linkFields.text || 'Untitled';
              const linkUrl: string = linkFields.url || '#';

              return (
                <Link
                  key={index}
                  href={linkUrl}
                  className={`text-sm text-muted-foreground hover:text-primary transition-colors duration-200 ${index < footerLinks.length - 1 ? 'mr-4' : ''
                    }`}
                >
                  {linkText}
                </Link>
              );
            })}
          </nav>
        )}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          {contact && (
            <div className="mb-4">
              {documentToReactComponents(contact, options)}
            </div>
          )}
          <p>
            &copy;{' '}
            {copyright ??
              `Kice Djingov ${currentYear} All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
