import mongoose from 'mongoose';

const ArchiveSchema = new mongoose.Schema({
    archiveName : String,
    archiveImgUrls : String,
    archiveLookbookCreatedAt : Date ,
    archiveType : String ,
    archiveDescription : String ,
    archiveImage : String ,
    archiveSlug : String ,
    archiveDate : Date ,
},{timestamps : true});

const Archive = mongoose.models.Archives || mongoose.model('Archives', ArchiveSchema);

export default Archive;