module.exports = {

  database: 'mongodb://root:test123@ds147734.mlab.com:47734/educoin',
  port: 8080,
  secretKey: 'Arash1293123123',
  facebook: {
    clientID: '1805113583040280',
    clientSecret: 'b34eaba0c81e09187e8a240ac9a99c79',
    profileFields: ['emails', 'displayName'],
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    passReqToCallback: true,
  }

}
