const express=require('express')
const axios=require('axios')
const ejs=require('ejs')
const ejsMate=require('ejs-mate')
const mongoose=require('mongoose')
const methodOverride=require('method-override')
const path=require('path')
var bodyParser = require('body-parser')
const app=express()
const fileUpload = require('express-fileupload')

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true})); //add this command to let express know to parse the req.body in a POST request
app.use(methodOverride('_method')); //used to override the default GET/POST request sent by a form to a PATCH/PUT/DELETE/ any other type of request
app.use(express.static(path.join(__dirname, 'public')))//static assets, stylesheets etc
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(fileUpload());
app.use(express.json())


app.get('/home', (req, res)=>{
    res.render('home.ejs')
})

const f1=async function(image){
    try{
   const resp = await axios.post('http://192.168.43.206:5000/custom_predict', image);
   console.log("This is the response/n")
   console.log(resp.data.status)
   console.log(typeof(resp.data.status))
   console.log("End of response/n")
   return resp.data.status
    }
    catch(e)
    {
        console.log(e)
    }
    //   console.log(resp.data)
    //   return resp.data
}

function decodeBase64ToPng(base64Data) {
    // Extract the base64 data part (excluding the metadata)
    const binaryData = Buffer.from(base64Data, 'base64');
  
    // Create a unique filename for the PNG file
    const fileName = `image.png`;
    // ${Date.now()}
    const outputPath = path.join(__dirname, '/public/images', fileName); // Change 'output' to your desired folder path
  
    // Write the binary data to a PNG file
    require('fs').writeFileSync(outputPath, binaryData);
  }
  

app.post('/upload', async (req, res) => {
    const { image } = req.files;
    console.log(image) 
    if (!image) return console.log('No image sent')
    const result=await f1(image)
    decodeBase64ToPng(result)
    // console.log(result)
    // const im=Buffer.from(result, "base64")
    // require("fs").writeFileSync("outs.png", im)
    // result.mv(__dirname + '/public/images/' + result.name)
    
    res.render('result.ejs', {image, result});  
    // {result, image}
    });

    // [Object: null prototype] {
    //     image: {
    //       name: 'test.jpeg',
    //       data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff e2 0c 58 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 0c 48 4c 69 6e 6f 02 10 00 00 ... 1234567 more bytes>,
    //       size: 234732,
    //       encoding: '7bit',
    //       tempFilePath: '',
    //       truncated: false,
    //       mimetype: 'image/jpeg',
    //       md5: 'c76564e19a5e8cd647a2d60478ad94b3',
    //       mv: [Function: mv]
    //     }
    //   }
    
app.listen(3000, ()=>
{
    console.log('Serving on port 3000')
})