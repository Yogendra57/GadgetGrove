const nodemailer=require('nodemailer');
const sendEmail=async(options)=>{
    try {
        const transporter=nodemailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port:465,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
});
const mailOptions={
    from:`"GadgetGrove Support Teams " <${process.env.EMAIL}>`,
    to:options.email,
    subject:options.subject,
    html:options.message
}
await transporter.sendMail(mailOptions);
console.log('Email sent successfully');
    } catch (error) {
        console.log(error.message);
        throw new Error('Email not send')
    }
};
module.exports=sendEmail