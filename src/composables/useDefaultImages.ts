import defaultProfileImage from '@/assets/defaultImages/defaultProfileImage.png';
import defaultProductFFImage from '@/assets/defaultImages/defaultProductFFImage.webp';
import defaultProductAPIImage from '@/assets/defaultImages/defaultProductAPIImage.webp';
import zydinLogoImage from '@/assets/defaultImages/zydinLogoImage.png';
import defaultCertificationImage from '@/assets/defaultImages/defaultCertificationImage.jpg'
import defaultMaleImage from '@/assets/defaultImages/defaultMaleImage.png'
import defaultFemaleImage from '@/assets/defaultImages/defaultFemaleImage.png'
import defaultSlideImage from '@/assets/defaultImages/defaultSlideImage.jpg'
// Create a readily accessible object with all the imported images
const defaultImages = {

    defaultProfileImage: defaultProfileImage,
    defaultProductFFImage: defaultProductFFImage,
    defaultProductAPIImage: defaultProductAPIImage,
    zydinLogoImage: zydinLogoImage,
    defaultCertificationImage: defaultCertificationImage,
    defaultMaleImage: defaultMaleImage,
    defaultFemaleImage: defaultFemaleImage,
    defaultSlideImage: defaultSlideImage,

};

// Export a "composable" function that simply returns the object
export function useDefaultImages() {
    return defaultImages;
}