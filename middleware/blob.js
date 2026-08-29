const path = require('path');

// Upload a multer memoryStorage file to Vercel Blob and return its public URL.
// Requires BLOB_READ_WRITE_TOKEN in the environment.
async function uploadToBlob(file) {
    if (!file) return '';
    const { put } = await import('@vercel/blob');
    const safeName = path.basename(file.originalname || 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `skycargo/${Date.now()}-${safeName}`;
    const blob = await put(pathname, file.buffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.mimetype,
    });
    return blob.url;
}

// Resolve a stored image value to something renderable/servable.
// New uploads are absolute blob URLs; legacy values are bare filenames in public/uploads.
function resolveAsset(value) {
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    return path.join(process.cwd(), 'public', 'uploads', value);
}

module.exports = { uploadToBlob, resolveAsset };
