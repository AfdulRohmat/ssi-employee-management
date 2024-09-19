import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const CloudinaryStorageConfig = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        return {
            folder: "sinar-sakti-international-employee-management",
            allowedFormats: ['jpg', 'png'],
            transformation: [{ width: 500, height: 500, crop: 'limit' }],
            public_id: file.originalname.split('.')[0] + '-' + Date.now()
        };
    },
});
