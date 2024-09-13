import ComponentMap from './Map';
import { Entry } from 'contentful';
import { NasaGalleryEntrySkeleton, PageFields } from '../../types';

interface PageProps {
    page: PageFields;
}

export default function Page({ page }: PageProps) {
    return (
        <>
            {page.components?.map((component: Entry<NasaGalleryEntrySkeleton>, index: number) => {
                const componentTypeId = component.sys.contentType.sys.id;

                const Component = ComponentMap.get(componentTypeId);

                if (Component) {
                    if (componentTypeId === 'nasaGallery') {
                        const nasaGalleryFields = component.fields;

                        return (
                            <Component
                                key={index}
                                {...nasaGalleryFields}
                                totalItems={nasaGalleryFields.totalItems || 0}
                                itemsPerPage={6}
                            />
                        );
                    }

                    return <Component key={index} {...component.fields} />;
                }

                return null;
            })}
        </>
    );
}
