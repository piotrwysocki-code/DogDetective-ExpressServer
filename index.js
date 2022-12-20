let express = require('express')
let cors = require('cors')
let axios = require('axios')
let PORT = process.env.PORT || 4000
let app = express()
let fs = require('fs')
let path = require('path');
let multer =  require('multer');
let { promisify } = require('util')
let unlinkAsync = promisify(fs.unlink)
let FormData = require('form-data')
let sharp = require('sharp')

let storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname, 'uploads'))
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}.jpg`)
    }
})

let upload = multer({ storage: storage }).single('file')

let breeds = -1;

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res)=> {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/breeds', (req, res)=> {
    res.sendFile(__dirname + '/public/breeds.html');
});

app.get('/getBreeds', async (req, res) =>{
    if(breeds === -1){
        try{
            let data = await axios.get("http://15.156.34.195/breeds").then((response)=>{
                console.log(response.data);
                breeds = {'breeds': [response.data]}
                res.json(breeds);
            }).catch((e)=>{
                console.log(e);
                res.send(e);
            }).finally(()=>{
                console.log('getBreeds complete');
            })
        }catch(e){
            console.log(e);
            res.json({'Status':'Error'});
        }
    }else{
        res.json(breeds);
    }
})

app.post('/upload', upload, async (req, res) =>{
    let form = new FormData()
    let filepath = req.file.path
    let name = req.file.filename
    let newPath = path.join(__dirname, `uploads/sm-${name}`)
    console.log(req.file);
    /*saving the photo sent in the request to disk
    * resizing the photo
    * renaming the photo
    * deleting the original sized photo
    */
    await sharp(filepath).resize({ height: 331, width: 331 }).toFile(newPath)
    .then((info) => {
        console.log(info)
        unlinkAsync(filepath, (e) => {
            if (e) {
                console.log(e);
            } else {
                console.log(`1 deleted ${filepath}`);
            }
        })
    })
    .catch((err) => {
        console.log("Error occured");
    })
    /*reading the resized photo from disk
    * append it to the form data
    * pass the original filename as a parameter  
    */
    try {
        let data = fs.readFileSync(path.resolve(__dirname, newPath));
        
        form.append('file', data, name)
        console.log(form);

    } catch (err) {
        console.error(err);
    }
    /*send a post request to the backend server
     * with the resized image
     * delete the image after
     */
    let response = axios.post("http://15.156.34.195/api/classify", form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {
        console.log(response.data)
        res.send(response.data)

    }).catch((error) => {
        console.log(error.message)
        res.send({"message" : 'Server error'})

    }).finally(()=>{
        unlinkAsync(newPath, (e) => {
            if (e) {
                console.log(e);
            } else {
                console.log(`2 deleted ${newPath}`);
            }
        })
    })
})

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})