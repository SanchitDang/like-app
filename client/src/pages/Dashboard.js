import './dashboard.css'
import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'

const Dashboard = () => {

	const [like, setLike] = useState('')
	const [dislike, setDislike] = useState('')
	const [imgURL, setImgURL] = useState('')

	async function populateLikeDislike() {
		const req = await fetch('http://localhost:1337/api/populate', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
			setImgURL(data.imgURL)
			setLike(data.likes)
			setDislike(data.dislikes)
		} else {
			alert(data.error)
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('token')

		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				window.location.href = '/login'
			} else {
				populateLikeDislike()
			}
		}
	}, [])



	async function updateLike(event) {
		event.preventDefault()

		const req = await fetch('http://localhost:1337/api/like', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},

		})

		const data = await req.json()
		if (data.status === 'ok') {
			setLike(like+1)
		} else {
			alert(data.error)
		}
	}

	
	async function updateDislike(event) {
		event.preventDefault()

		const req = await fetch('http://localhost:1337/api/dislike', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},

		})

		const data = await req.json()
		if (data.status === 'ok') {
			setDislike(dislike+1)
		} else {
			alert(data.error)
		}
	}


	return (
		<>


		<div class="frame">


		<img src={imgURL} alt="img" />
		
		<div>
		  <h4> like: {like || "None"}  dislike: {dislike || "None"}</h4>
		  
		  <button class="btn" id="green"><i class="fa fa-thumbs-up fa-lg" aria-hidden="true"    
		  onClick={updateLike}
		  ></i></button>
	
		  <button class="btn" id="red"><i class="fa fa-thumbs-down fa-lg" aria-hidden="true" 
		  onClick={updateDislike}
		  ></i></button>
		</div>
  
	  	</div>

		  </>

	);
}


export default Dashboard;
