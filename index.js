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
    let data;

    try {
        data = fs.readFileSync(req.file.path);
        form.append('file', data, req.file.filename)
    } catch (err) {
        console.error(err);
    }

    let response = axios.post('http://3.98.28.136/api/classify', form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {
        console.log(response.data)
        res.send(response.data)
        fs.unlink(req.file.path, (e) => {
            if (e) {
                console.log(e);
            } else {
                console.log('deleted ' + req.file.path);
            }
        });
    }).catch((error) => {
        console.log(error.message)
        fs.unlink(req.file.path, (e) => {
            if (e) {
                console.log(e);
            } else {
                console.log('deleted ' + req.file.path);
            }
        });
        res.send({"message" : 'Server error'})
    })

})

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})