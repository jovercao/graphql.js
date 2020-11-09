
(async function() {
	var assert = require('assert')
	var graphql = require('../graphql.js')

	var client = graphql('http://localhost:7001/graphql',{
		method: 'POST',
		fragments: {
			user: 'on User {name}',
			auth: {
				user: 'on User {token, ...user}'
			}
		},
		debug: true,
		onRequestError(error, status) {
			console.log('这是一个request错误', error, status)
		},
		onGraphqlError(errors) {
			console.log('这是一个gql错误', errors)
		}
	})

	client.fragment({
		auth: {
			error: 'on Error {messages}'
		}
	})
	assert.equal(typeof client,'function')
	assert.equal(
		client.fragment('auth.error'),
		'fragment auth_error on Error {messages}'
	)
	assert.equal(client.getOptions().method,'POST')
	assert.equal(client.fragments().user,'\nfragment user on User {name}')
	assert.equal(
		client.fragments().auth_user,
		'\nfragment auth_user on User {token, ...user}'
	)
	assert.equal(
		client.fragments().auth_error,
		'\nfragment auth_error on Error {messages}'
	)

	var queryIn = `query (@autodeclare) {
	user(name: $name, bool: $bool, int: $int, id: $id) {
		...auth.user
		...auth.error
	}
	x {
		... auth.user
	}
}`

	var expectedQuery = `query ($name: String!, $bool: Boolean!, $int: Int!, $float: Float!, $id: ID!, $user_id: Int!, $postID: ID!, $custom_id: CustomType!, $customId: ID!, $target: [ID!]!) {
	user(name: $name, bool: $bool, int: $int, id: $id) {
		... auth_user
		... auth_error
	}
	x {
		... auth_user
	}
}

fragment user on User {name}

fragment auth_user on User {token, ...user}

fragment auth_error on Error {messages}`


	assert.equal(
		// @ts-ignore
		client.buildQuery(queryIn,{
			name: 'fatih',
			bool: true,
			int: 2,
			float: 2.3,
			id: 1,
			'user_id!': 2,
			'postID': '45af67cd',
			'custom_id!CustomType': '1',
			'customId': '1',
			'target![ID!]': ['Q29uZ3JhdHVsYXRpb25z']
		}),
		expectedQuery
	)

	assert.equal(
		typeof client.query(`($email: String!, $password: String!) {
		auth(email: $email, password: $password) {
			... on User {
				token
			}
		}
	}`),
		'function'
	)

	/**
	* URL UPDATE TESTING
	*/

	client.headers({ 'User-Agent': 'Awesome-Octocat-App' })
	var query = client.query(`{
		me {
			id
			name
		}
}`)

	console.log('什么鬼1')
	try {
		await query()
		console.log('什么鬼2')
	} catch(err) {
		console.log('什么鬼3')
		console.log(err)
	}
	console.log('什么鬼4')

	// Checking Old URL
	assert.equal(client.getUrl(),null)

	// Checking New URL
	var newUrl = 'https://api.github.com/graphql'
	client.setUrl(newUrl)
	assert.equal(client.getUrl(),newUrl)

})()
