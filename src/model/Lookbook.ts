import mongoose from 'mongoose';

const LookbookSchema = new mongoose.Schema({
    lookbookName : String ,
    lookbookImageUrls : String ,
},{timestamps : true});

const Lookbook = mongoose.models.Lookbooks || mongoose.model('Lookbooks', LookbookSchema);

export default Lookbook;