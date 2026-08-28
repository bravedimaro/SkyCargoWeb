const express = require('express');
const jwt = require('jsonwebtoken');
const language = require("../public/language/languages.json");


const auth = async(req, res, next) => {
    try{
        const token = req.cookies.jwt
        
        if(!token){
            req.flash("errors", "You Are Not Authorized, Please Login First ...")
            return res.redirect("/")
        }

        const decode = await jwt.verify(token, process.env.TOKEN_KEY)
        req.user = decode

        
        const lang = req.cookies.lang

        const decode_lang = await jwt.verify(lang, process.env.TOKEN)
        req.lang = decode_lang
        

        if (decode_lang.lang == 'en') {
            let data = language.en
            req.language_data = data
        } else if (decode_lang.lang == 'de') {
            let data = language.de
            req.language_data = data
        } else if (decode_lang.lang == 'es') {
            let data = language.es
            req.language_data = data
        } else if (decode_lang.lang == 'fr') {
            let data = language.fr
            req.language_data = data
        } else if (decode_lang.lang == 'pt') {
            let data = language.pt
            req.language_data = data
        } else if (decode_lang.lang == 'cn') {
            let data = language.cn
            req.language_data = data
        } else if (decode_lang.lang == 'ae') {
            let data = language.ae
            req.language_data = data
        } else if (decode_lang.lang == 'in') {
            let data = language.in
            req.language_data = data
        }

    
        next();
    }catch(error){
        console.log(error);
        req.flash("errors", "You Are Not Authorized, Please Login First ...")
        return res.redirect("/")
    }
}

module.exports = auth