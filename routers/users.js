const express = require("express");
const { mySqlQury } = require("../middleware/db");
const app = express();
const router = express.Router();
const auth = require("../middleware/auth");
const bcrypt = require('bcryptjs');
const { query } = require("express");
const access = require('../middleware/access');
const countryCodes = require('country-codes-list')


// ========= customers ============= //

router.get("/customers", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)
        
        const customers_data = await mySqlQury(`SELECT * FROM tbl_customers ORDER BY id DESC`)
        
        res.render("customers", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            customers_data : customers_data
        })
    } catch (error) {
        console.log(error);
    }
})


router.get("/add_customers", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)

        const Country_name = countryCodes.customList('countryCode', '{countryCode}')
        const nameCode = Object.values(Country_name)

        const myCountryCodesObject = countryCodes.customList('countryCode', '+{countryCallingCode}')
        const CountryCode = Object.values(myCountryCodesObject)
        
        res.render("add_customers", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            countries_data : countries_data, nameCode, CountryCode
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/customers/ajax", auth, async(req, res) => {
    try {
        
        const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)
        console.log(1, countries_data);
        res.status(200).json({ countries_data })
    } catch (error) {
        console.log(error);
    }
})

router.post("/add_customers", auth, async(req, res) => {
    try {
        
        const {first_name, last_name, email, password, country_code, mobile, country, state, city, zipcode, address, customer_active} = req.body
        console.log(country_code);
        const sing_up_data = await mySqlQury(`SELECT * FROM tbl_admin WHERE email = '${email}'`)
        if (sing_up_data != "") {
            req.flash('errors', `This Email Alredy Register!!!!`)
            return res.redirect("back")
        }

        const admin = await mySqlQury(`SELECT * FROM tbl_admin ORDER BY id DESC LIMIT 1`)
        const login_id = admin[0].id + 1
        
       let query = `INSERT INTO tbl_customers (first_name, last_name, email, country_code, mobile, customers_country, customers_state, customers_city, customers_zipcode, customers_address, customer_active, login_id) VALUE
        ('${first_name}', '${last_name}', '${email}', '${country_code}', '${mobile}', '${country}', '${state}', '${city}', '${zipcode}', '${address}', '${customer_active}', '${login_id}')`
       await mySqlQury(query)

       const hash = await bcrypt.hash(password, 10)

       let login_query = `INSERT INTO tbl_admin (first_name, last_name, email, country_code, phone_no, password, role) VALUE ('${first_name}', '${last_name}', '${email}', '${country_code}', '${mobile}', '${hash}', 2)`
       await mySqlQury(login_query)

        req.flash('success', `Added successfully`)
        res.redirect("/users/customers")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/edit_customers/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        if (role_data.role == '2') {
            
            let edit_customers_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE login_id = '${req.params.id}'`)

            const cuuntry = edit_customers_data[0].customers_country.split(',');
            const state = edit_customers_data[0].customers_state.split(',');
            const city = edit_customers_data[0].customers_city.split(',');
            const zipcode = edit_customers_data[0].customers_zipcode.split(',');
            const address = edit_customers_data[0].customers_address.split(',');
            
            const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)
            const state_data = await mySqlQury(`SELECT * FROM tbl_states`)
            const city_data = await mySqlQury(`SELECT * FROM tbl_city`)
            console.log(city_data);

            const Country_name = countryCodes.customList('countryCode', '{countryCode}')
            const nameCode = Object.values(Country_name)

            const myCountryCodesObject = countryCodes.customList('countryCode', '+{countryCallingCode}')
            const CountryCode = Object.values(myCountryCodesObject)
            
            res.render("edit_customers", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                edit_customers_data : edit_customers_data,
                cuuntry : cuuntry,
                state : state,
                city : city,
                zipcode : zipcode,
                address : address,
                countries_data : countries_data,
                state_data : state_data,
                city_data : city_data, nameCode, CountryCode
            })

        } else {
            
            let edit_customers_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${req.params.id}'`)

            const cuuntry = edit_customers_data[0].customers_country.split(',');
            const state = edit_customers_data[0].customers_state.split(',');
            const city = edit_customers_data[0].customers_city.split(',');
            const zipcode = edit_customers_data[0].customers_zipcode.split(',');
            const address = edit_customers_data[0].customers_address.split(',');
            
            const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)
            const state_data = await mySqlQury(`SELECT * FROM tbl_states`)
            const city_data = await mySqlQury(`SELECT * FROM tbl_city`)
            console.log(city_data);

            const Country_name = countryCodes.customList('countryCode', '{countryCode}')
            const nameCode = Object.values(Country_name)

            const myCountryCodesObject = countryCodes.customList('countryCode', '+{countryCallingCode}')
            const CountryCode = Object.values(myCountryCodesObject)
            
            res.render("edit_customers", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                edit_customers_data : edit_customers_data,
                cuuntry : cuuntry,
                state : state,
                city : city,
                zipcode : zipcode,
                address : address,
                countries_data : countries_data,
                state_data : state_data,
                city_data : city_data, nameCode, CountryCode
            })
        }
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/edit_customers/:id", auth, async(req, res) => {
    try {
        
        const role_data = req.user

        let old_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${req.params.id}'`)

        const {first_name, last_name, email, country_code, mobile, country, state, city, zipcode, address, customer_active} = req.body
        console.log(req.body);
        let query = `UPDATE tbl_customers SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', country_code = '${country_code}', mobile = '${mobile}', customers_country = '${country}', customers_state = '${state}', customers_city = '${city}', customers_zipcode = '${zipcode}', customers_address = '${address}', customer_active = '${customer_active}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        let admin_query = `UPDATE tbl_admin SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', country_code = '${country_code}', phone_no = '${mobile}' WHERE email = '${old_data[0].email}'`
        await mySqlQury(admin_query)

        req.flash('success', `Added successfully`)

        if (role_data.role == '2') {
            res.redirect("back")
        } else {
            res.redirect("/users/customers")
        }
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/customers/delete/:id", auth, async(req, res) => {
    try {
        
        let old_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${req.params.id}'`)

        let query = `DELETE FROM tbl_customers WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        let admin_query = `DELETE FROM tbl_admin WHERE email = '${old_data[0].email}'`
        await mySqlQury(admin_query)


        req.flash('success', `Deleted successfully`)
        res.redirect("/users/customers")
        
    } catch (error) {
        console.log(error);
    }
})


// ========= client ============= //

router.get("/client", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        if (role_data.id == '1') {

            let client_data = await mySqlQury(`SELECT * FROM tbl_client ORDER BY id DESC`)
            
            res.render("client", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                client_data : client_data
            })
        } else {
            
            const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE login_id = '${role_data.id}'`)
            console.log(customer_data);
            
            let client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE customer = '${customer_data[0].id}' ORDER BY id DESC`)
            console.log(client_data);

            res.render("client", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                client_data : client_data
            })
        }
        

        
    } catch (error) {
        console.log(error);
    }
})


router.get("/add_client", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)
        
        const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
        
        res.render("add_client", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            countries_data : countries_data,
            customer_data : customer_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/add_client", auth, async(req, res) => {
    try {
       
        const {customer, first_name, last_name, email, mobile, country, state, city, zipcode, address} = req.body

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE login_id = '${customer}'`)

        let query = `INSERT INTO tbl_client (customer, first_name, last_name, email, mobile, country, state, city, zipcode, address) VALUE 
                    ('${customer_data[0].id}', '${first_name}', '${last_name}', '${email}', '${mobile}', '${country}', '${state}', '${city}', '${zipcode}', '${address}')`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/users/client")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/edit_client/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${req.params.id}'`)
        console.log(client_data);

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)

        const cuuntry = client_data[0].country.split(',');
        const state = client_data[0].state.split(',');
        const city = client_data[0].city.split(',');
        const zipcode = client_data[0].zipcode.split(',');
        const address = client_data[0].address.split(',');
        
        const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)
        const state_data = await mySqlQury(`SELECT * FROM tbl_states`)
        const city_data = await mySqlQury(`SELECT * FROM tbl_city`)
        
        res.render("edit_client", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            client_data : client_data,
            customer_data : customer_data,
            countries_data : countries_data,
            state_data : state_data,
            city_data : city_data,
            cuuntry : cuuntry,
            state : state,
            city : city,
            zipcode : zipcode,
            address : address
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/edit_client/:id", auth, async(req, res) => {
    try {
         
        const {customer, first_name, last_name, email, mobile, cuuntry, state, city, zipcode, address} = req.body

        let query = `UPDATE tbl_client SET customer = '${customer}', first_name = '${first_name}', last_name = '${last_name}', email = '${email}', mobile = '${mobile}', cuuntry = '${cuuntry}', state = '${state}', city = '${city}', zipcode = '${zipcode}', address = '${address}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/users/client")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/client/delete/:id", auth, async(req, res) => {
    try {
         
        let query = `DELETE FROM tbl_client WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Deleted successfully`)
        res.redirect("/users/client")
        
    } catch (error) {
        console.log(error);
    }
})


// ========= Drivers ============= //

router.get("/drivers", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const drivers_data = await mySqlQury(`SELECT * FROM tbl_drivers ORDER BY id DESC`)
        
        res.render("drivers", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            drivers_data : drivers_data
        })
    } catch (error) {
        console.log(error);
    }
})


router.get("/add_drivers", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)
        
        res.render("add_drivers", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/add_drivers", auth, async(req, res) => {
    try {
        
        const {first_name, last_name, email, password, mobile, vehicle_plate, active} = req.body

        const sing_up_data = await mySqlQury(`SELECT * FROM tbl_admin WHERE email = '${email}'`)
        if (sing_up_data != "") {
            req.flash('errors', `This Email Alredy Register!!!!`)
            return res.redirect("back")
        }

        const admin = await mySqlQury(`SELECT * FROM tbl_admin ORDER BY id DESC LIMIT 1`)
        const login_id = admin[0].id + 1

        let query = `INSERT INTO tbl_drivers (first_name, last_name, email, mobile, vehicle_plate, active, login_id) VALUE 
        ('${first_name}', '${last_name}', '${email}', '${mobile}', '${vehicle_plate}', '${active}', '${login_id}')`
        await mySqlQury(query)

        const hash = await bcrypt.hash(password, 10)

        let login_query = `INSERT INTO tbl_admin (first_name, last_name, email, phone_no, password, role) VALUE ('${first_name}', '${last_name}', '${email}', '${mobile}', '${hash}', 3)`
        await mySqlQury(login_query)

        req.flash('success', `Added successfully`)
        res.redirect("/users/drivers")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/edit_drivers/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const edit_drivers_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${req.params.id}'`)
        console.log(edit_drivers_data);
        res.render("edit_drivers", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            edit_drivers_data : edit_drivers_data[0]
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/edit_drivers/:id", auth, async(req, res) => {
    try {
       
        const old_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${req.params.id}'`)

        const {first_name, last_name, email, mobile, vehicle_plate, active} = req.body

        let query = `UPDATE tbl_drivers SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', mobile = '${mobile}', vehicle_plate = '${vehicle_plate}', active = '${active}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        let login_query = `UPDATE tbl_admin SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', phone_no = '${mobile}' WHERE email = '${old_data[0].email}'`
        await mySqlQury(login_query)

        req.flash('success', `Added successfully`)
        res.redirect("/users/drivers")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/drivers/delete/:id", auth, async(req, res) => {
    try {
        
        const old_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${req.params.id}'`)

        let query = `DELETE FROM tbl_drivers WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        let login_query = `DELETE FROM tbl_admin WHERE email = '${old_data[0].email}'`
        await mySqlQury(login_query)

        req.flash('success', `Deleted successfully`)
        res.redirect("/users/drivers")
        
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;