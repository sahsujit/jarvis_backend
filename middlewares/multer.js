// import multer from "multer";


// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cd(null, "./public")
//     },
//     filename:(req,file,cb)=>{
//         cb(null, file.originalname)
//     }
// })


// const upload = multer({storage})
// export default upload







import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public"); // <-- fixed here
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });
export default upload;
