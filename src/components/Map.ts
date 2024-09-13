import HeroBanner from './HeroBanner';
import Gallery from './gallery';
import NASACard from './nasaCard';

const ComponentMap = new Map();

ComponentMap.set('heroBanner', HeroBanner);
ComponentMap.set('nasaGallery', Gallery);
ComponentMap.set('nasaCard', NASACard);

export default ComponentMap;
