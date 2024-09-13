import { Document } from '@contentful/rich-text-types';
import { Entry, EntrySkeletonType, Asset } from 'contentful';

export interface LinkFields {
  text: string;
  url: string;
}

export interface LinkEntrySkeleton extends EntrySkeletonType {
  contentTypeId: 'link';
  fields: LinkFields;
}

export interface FooterFields {
  footerLinks?: Entry<LinkEntrySkeleton>[];
  contact?: Document;
  copyright?: string;
}

export interface FooterEntrySkeleton extends EntrySkeletonType {
  contentTypeId: 'footer';
  fields: FooterFields;
}

export interface NavigationFields {
  logo?: Asset;
  links?: Entry<LinkEntrySkeleton>[];
  cta?: Entry<LinkEntrySkeleton>;
}

export interface NavigationEntrySkeleton extends EntrySkeletonType {
  contentTypeId: 'navigation';
  fields: NavigationFields;
}

export interface NasaCardFields {
  title: string;
  imageUrl: string;
  tags: string[];
  description: Document;
  datePublished: string;
}

export interface NasaCardEntrySkeleton extends EntrySkeletonType {
  contentTypeId: 'nasaCard';
  fields: NasaCardFields;
}

export interface NasaGalleryFields {
  title: string;
  nasaCard: Entry<NasaCardEntrySkeleton>[];
  totalItems?: number;
}

export interface NasaGalleryEntrySkeleton extends EntrySkeletonType {
  contentTypeId: 'nasaGallery';
  fields: NasaGalleryFields;
}

export interface PageFields {
  title: string;
  slug: string;
  components: Entry<NasaGalleryEntrySkeleton>[];
}

export interface PageEntrySkeleton extends EntrySkeletonType {
  contentTypeId: 'page';
  fields: PageFields;
}
