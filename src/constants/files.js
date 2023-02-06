export const MAX_FILES_COUNT = 3
export const IMAGE_FILE_EXTENSIONS = [
    'jpg',
    'png',
    'jpeg',
    'heic',
    'heif'
]
export const IMAGE_UPLOAD_ACCEPT = IMAGE_FILE_EXTENSIONS.map((extension) => (`.${extension}`)).join()

export const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 50000000;