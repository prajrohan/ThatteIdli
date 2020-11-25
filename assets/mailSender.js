var nodemailer = require('nodemailer');


async function sendMailToUser(toAddress,password){

    var transporter = nodemailer.createTransport({
        service :'gmail',
        auth : {
            user : 'talkiesjs@gmail.com',
            pass: 'jumpstartjs'
        }
    })
    var mailOptions = {
        from : 'talkiesjs@gmail.com',
        to : toAddress,
        subject : 'Thate Idli Account has been created Successfully',
        text : 'Now you can login using Username :'+toAddress+' Password :'+password
    }

    transporter.sendMail(mailOptions,function(err,info){

        if(!err){
            console.log('Email sent: '+info.response)
        }else{ 
            console.log('Error '+err);
        }
    });

}

module.exports = sendMailToUser;
