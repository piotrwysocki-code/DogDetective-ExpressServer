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
      cb(null, 'uploads')
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}.jpg`)
    }
})

let upload = multer({ storage: storage }).single('file')

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=> {
    res.sendFile('index.html');
});

app.post('/upload', upload, async (req, res) =>{
    let form = new FormData()
    let filepath = req.file.path
    let name = req.file.filename
    let newPath = `uploads/sm-${name}`

    console.log(filepath)

    await sharp(filepath).resize({ height: 331, width: 331 }).toFile(newPath)
    .then((info) => {
        console.log(info)
        unlinkAsync(filepath, (e) => {
            if (e) {
                console.log(e);
            } else {
                console.log(`deleted ${filepath}`);
            }
        })
    })
    .catch((err) => {
        console.log("Error occured");
    })

    try {
        let data = fs.readFileSync(path.resolve(__dirname, newPath));
        
        form.append('file', data, name)

    } catch (err) {
        console.error(err);
    }

    let response = axios.post('http://3.96.75.82/api/classify', form, {
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
                console.log(`deleted ${newPath}`);
            }
        })

    })
})

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})