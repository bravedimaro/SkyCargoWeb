const express = require('express');
const jwt = require('jsonwebtoken');
const {mySqlQury} = require('../middleware/db');

const access = async (user)=>{
    try {
    //    const {username, email, role} = user

        const general_settings_data = await mySqlQury(`SELECT * FROM tbl_general_settings`)
        
        const sms_data = await mySqlQury(`SELECT * FROM tbl_sms_settings`)
    
        return{data : general_settings_data[0] , sms_data : sms_data[0]}
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = access