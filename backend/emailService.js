import nodemailer from 'nodemailer';

export const sendMail = async(to,subject,htmlContent) =>{
    try{
        let transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'tiandvinh123@gmail.com',
                pass:'pnbd ljrm scxx gvxs'
            }
        });

        let info = await transporter.sendMail({
            from:'"Luan Van" <tiandvinh123@gmail.com>',
            to:to,
            subject,
            html:htmlContent
        });

        console.log("Email sent",info.messageId)
    }catch(err){
        console.log("failed to send email",err);
        throw err;
    }
};

