const express = require('express')
const app = express ()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const jwt = require('jsonwebtoken')


app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/UsersDatabase')


app.post('/api/register', async (req, res) => {
    try {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.json({status : 'ok'})
    } catch (err) {
        console.log(err)
        res.json({status : 'error', error: 'Duplicate email'})
    }
})


app.post('/api/login', async (req, res) => {
        const user = await User.findOne({ email: req.body.email, password: req.body.password })

        if (user) {
            const token = jwt.sign({
                name: user.name,
                email: user.email,
            }, 'secret123')
            return res.json({status : 'ok', user: token})
        } else {
            res.json({status : 'error', user: false})
        }

})


app.get('/api/populate', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await User.findOne({ email: email })
		return res.json({ status: 'ok', likes: user.likes, dislikes: user.dislikes, imgURL: user.imgURL})
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})


app.post('/api/like', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		await User.updateOne(
			{ email: email },
			{ $inc: { likes: 1 } }
		)

		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})


app.post('/api/dislike', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		await User.updateOne(
			{ email: email },
			{ $inc: { dislikes: 1 } }
		)

		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})



app.listen(1337, () => {
    console.log('sever started on prot 1337')
})
