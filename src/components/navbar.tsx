import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { NavigationFields, LinkFields, LinkEntrySkeleton } from '../../types';
import { Entry } from 'contentful';

interface NavbarProps {
  navigationData: NavigationFields | null;
}

const Navbar: React.FC<NavbarProps> = ({ navigationData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (!navigationData) {
    return null;
  }

  const { logo, links } = navigationData;
  const logoUrl = logo?.fields?.file?.url ? `https:${logo.fields.file.url}` : null;

  const NavLink = ({
    name,
    path,
    mobile = false,
  }: {
    name: string;
    path: string;
    mobile?: boolean;
  }) => (
    <Link
      href={path}
      className={`${pathname === path
        ? 'text-primary font-bold'
        : 'text-muted-foreground hover:text-primary'
        } ${mobile ? 'block text-xl py-2' : ''} transition-colors duration-200`}
      onClick={() => setIsOpen(false)}
    >
      {name}
    </Link>
  );

  return (
    <nav className="bg-background shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {logoUrl && (
              <Link href="/" className="flex-shrink-0">
                <Image src={logoUrl} alt="Logo" width={64} height={64} unoptimized />
              </Link>
            )}
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {links?.map((linkEntry: Entry<LinkEntrySkeleton>, index) => {
                const linkFields = linkEntry.fields as LinkFields;
                const linkText: string = linkFields.text || 'Untitled';
                const linkUrl: string = linkFields.url || '#';

                return <NavLink key={index} name={linkText} path={linkUrl} />;
              })}
            </div>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Side Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        <div className="p-4">
          {links?.map((linkEntry: Entry<LinkEntrySkeleton>, index) => {
            const linkFields = linkEntry.fields as LinkFields;
            const linkText: string = linkFields.text || 'Untitled';
            const linkUrl: string = linkFields.url || '#';

            return <NavLink key={index} name={linkText} path={linkUrl} mobile />;
          })}
        </div>
      </div>

      {/* Background Overlay when the side menu is open */}
      {isOpen && (
        <button
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
