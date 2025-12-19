import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    filename:(req, file, cb) => {
        const ext = path.extreme(file.originalname || "").toLowerCase();
        const safeExt = [".jpeg",".jpg",".png",".webp"].includes(ext) ? ext : "";
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}-${safeExt}`)
    }
})
    //fileFilter: jpeg, jpg, png,webp
const fileFilter = (req, file, cb)=>{
    //cb is Multer's version of next();

    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase()) //returns a bool, it's a test
    const mimeType = allowedTypes.test(file.mimeType) //returns a bool, it's a test

    if(extname && mimeType){
        cb(null,true)
    }else{
        cb(new Error("Only image files are allowed (jpeg,jpg,png,webp)"))
    }
}
export const upload = multer({
    storage,
    fileFilter,
    limits:{fileSize: 5 * 1024 * 1024} //5mb limit
})