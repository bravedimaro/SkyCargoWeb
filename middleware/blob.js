const path = require('path');

// Upload a multer memoryStorage file to Vercel Blob and return its public URL.
// Requires BLOB_READ_WRITE_TOKEN in the environment.
async function uploadToBlob(file) {
    console.log('[blob] uploadToBlob called');

    if (!file) {
        console.log('[blob] ERROR: no file received (req.file is undefined)');
        return '';
    }

    console.log('[blob] file:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        hasBuffer: !!file.buffer,
        bufferLength: file.buffer ? file.buffer.length : 0,
    });

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.log('[blob] ERROR: BLOB_READ_WRITE_TOKEN is NOT set in the environment');
        throw new Error('BLOB_READ_WRITE_TOKEN is not set');
    }
    console.log('[blob] BLOB_READ_WRITE_TOKEN is present (length=' + process.env.BLOB_READ_WRITE_TOKEN.length + ')');

    try {
        const { put } = await import('@vercel/blob');
        console.log('[blob] @vercel/blob imported, put is', typeof put);

        const safeName = path.basename(file.originalname || 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
        const pathname = `skycargo/${Date.now()}-${safeName}`;
        console.log('[blob] uploading to pathname:', pathname);

        const blob = await put(pathname, file.buffer, {
            access: 'public',
            addRandomSuffix: true,
            contentType: file.mimetype,
        });

        console.log('[blob] SUCCESS, url =', blob.url);
        return blob.url;
    } catch (err) {
        console.log('[blob] UPLOAD FAILED:', err && err.message ? err.message : err);
        console.log('[blob] full error:', err);
        throw err;
    }
}

// Resolve a stored image value to something renderable/servable.
// New uploads are absolute blob URLs; legacy values are bare filenames in public/uploads.
function resolveAsset(value) {
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    return path.join(process.cwd(), 'public', 'uploads', value);
}

module.exports = { uploadToBlob, resolveAsset };
