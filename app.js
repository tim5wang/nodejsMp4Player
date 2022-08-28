const http=require('http')
const fs=require('fs')
// const {stats}=require('fs').promises
const videoPath='./yinruchenyan.mp4'

http.createServer((req,res)=>{
    if (req.url == "/"){
        res.writeHead(200, {'Content-type':'text/html'})
        res.end(
            `
            <video src="/video" with="800" controls="controls" download="download"></video>
            `
        )
    }else if (req.url="/video") {
        let range = req.headers['range']
        if (range) {
            let stats=fs.statSync(videoPath)
            // let stats=await fs.stat(videoPath)
            let r=range.match(/=(\d+)-(\d+)?/)
            let start=parseInt(r[1],10)
            let end=r[2]?parseInt(r[2],10):start+1024*1024;
            if (end>stats.size-1) end=stats.size-1;

            let head={
                'Content-type':'video/mp4',
                'Content-Range':`bytes ${start}-${end}/${stats.size}`,
                'Content-Length': end-start+1,
                'Accept-Ranges':'bytes'
            }
            res.writeHead(206,head)
            let readStream = fs.createReadStream(videoPath,{start:start,end:end})
            readStream.on('open', function(){
                readStream.pipe(res)
            })
            readStream.on('error', function(err) {
                res.end(err);
            });
        }else{
            let head={
                'Content-type':'video/mp4'
            }
            res.writeHead(200,head)
            let readStream = fs.createReadStream(videoPath)
            readStream.on('open', function(){
                readStream.pipe(res)
            })
            readStream.on('error', function(err) {
                res.end(err);
              });
        }
    }
}).listen(3000, ()=>{
    console.log('listen 3000')
})
