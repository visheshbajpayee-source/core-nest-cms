# Document Storage Guide

## Overview
All employee documents in the CMS are stored in **MongoDB database** as binary data within the Document collection.

## Storage Details

### Database
- **Database**: MongoDB (Atlas or local instance)
- **Collection**: `documents`
- **Storage Type**: Binary Buffer

### Document Model Schema
Documents are stored with the following structure:

```javascript
{
  _id: ObjectId,                    // Unique identifier
  employee: ObjectId,               // Reference to Employee
  documentName: String,             // User-friendly name (e.g., "Passport", "Resume")
  documentType: String,             // Enum: ["id_proof", "offer_letter", "certificate", "other"]
  fileName: String,                 // Original filename sanitized
  fileData: Buffer,                 // Binary file content (PDF, JPEG, PNG, DOCX)
  mimeType: String,                 // MIME type (e.g., "application/pdf", "image/jpeg")
  fileSize: Number,                 // File size in bytes
  uploadedBy: ObjectId,             // Reference to Employee who uploaded
  uploadDate: Date,                 // Upload timestamp
  createdAt: Date,                  // Creation timestamp
  updatedAt: Date                   // Last update timestamp
}
```

### File Upload Specifications
- **Max File Size**: 5 MB (5,242,880 bytes)
- **Allowed Formats**: 
  - PDF (`application/pdf`)
  - JPEG Images (`image/jpeg`)
  - PNG Images (`image/png`)
  - Word Documents (`.doc` - `application/msword`)
  - Word Documents (`.docx` - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)

### Indexes
The collection has the following indexes for performance:
- `{ employee: 1, uploadDate: -1 }` - For efficient filtering by employee and sorting by upload date
- `{ employee: 1 }` - For quick employee lookups
- `{ documentType: 1 }` - For document type filtering

## File Handling

### Upload Process
1. File is sent as form data from the frontend
2. Backend validates:
   - File size ≤ 5MB
   - MIME type is in allowed list
   - Employee exists
   - User has permission to upload
3. File is converted to Buffer and stored in MongoDB `fileData` field
4. Metadata is stored alongside the file

### Download/Retrieval Process
1. User requests document via API: `GET /api/v1/documents/{id}/download`
2. Backend retrieves document from MongoDB
3. File binary data is retrieved from `fileData` field
4. Original MIME type is used in response headers
5. File is sent to browser with `Content-Disposition: attachment` header

### Deletion
When a document is deleted:
1. Document record is soft deleted or permanently removed from MongoDB
2. Binary data in `fileData` field is automatically removed with the document
3. Space is reclaimed in MongoDB storage

## Access Control

### By Role:
- **Admin**: Can access all documents
- **Manager**: Can access documents for employees in their department only
- **Employee**: Can only access their own documents

### API Endpoints:
```
POST /api/v1/documents                    # Upload document
GET /api/v1/documents                     # List documents (filtered by role)
GET /api/v1/documents/:id                 # Get document metadata
GET /api/v1/documents/:id/download        # Download file
PUT /api/v1/documents/:id                 # Update document metadata
DELETE /api/v1/documents/:id              # Delete document
```

## Database Location

### Development
- **Local MongoDB**: `mongodb://localhost:27017/cms-db`
- **MongoDB Atlas**: Check `backend/.env` for `MONGODB_URI`

### Production
- Configured via environment variable `MONGODB_URI`
- Connection string: `mongodb+srv://[user]:[password]@[cluster].mongodb.net/[database]`

## Storage Capacity

### Current Usage
- Files stored as binary in MongoDB
- Each file takes space = original file size + MongoDB overhead (~100-200 bytes per document record)
- No separate file system or cloud storage is used

### Scaling Considerations
If storage needs to scale significantly (large number of large files), consider:
1. **Cloud Storage Migration**: Move files to AWS S3, Google Cloud Storage, or Azure Blob Storage
2. **GridFS**: Use MongoDB GridFS for files > 16MB (currently not implemented)
3. **CDN Integration**: For frequently accessed documents

## Backup & Recovery

### MongoDB Backups
Documents are backed up as part of MongoDB database backups:
- Local: Use `mongodump` / `mongorestore`
- Atlas: Automatic daily backups with point-in-time restore

### Recovery
Documents can be recovered from:
1. MongoDB backup snapshots
2. Point-in-time restore (if using MongoDB Atlas)

## Environment Configuration

Required environment variables:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
```

## Code References

### Backend
- **Model**: [documents.model.ts](backend/src/modules/documents/documents.model.ts)
- **Service**: [documents.service.ts](backend/src/modules/documents/documents.service.ts)
- **Controller**: [documents.controller.ts](backend/src/modules/documents/documents.controller.ts)
- **Routes**: [documents.routes.ts](backend/src/modules/documents/documents.routes.ts)

### Frontend
- **Service**: [client/src/app/services/documents.service.ts](client/src/app/services/documents.service.ts)
- **Admin Page**: [client/src/app/(protect)/Admin/documents/page.tsx](client/src/app/(protect)/Admin/documents/page.tsx)
- **Upload Form**: [client/src/app/(protect)/Admin/documents/components/DocumentUploadForm.tsx](client/src/app/(protect)/Admin/documents/components/DocumentUploadForm.tsx)

## Troubleshooting

### File Upload Fails
- Check file size (< 5MB)
- Verify MIME type is allowed
- Ensure MongoDB connection is active
- Check user permissions

### File Download Fails
- Verify document exists in MongoDB
- Check document `_id` is correct
- Ensure user has access permissions
- Verify MIME type is set correctly

### Storage Performance Issues
- Check MongoDB indexes are created
- Consider pagination for large result sets
- Monitor MongoDB connection pool
