# Auth Microservice


### Responsability
Responsible for creating users or their sessions


### How it works
Passwords are hashed with randomly generated pepper and using bcrypt
Pepper is stored with a user object in database
After password reset all sessions will be deleted and new pepper would be generated


###### TODO:
- [ ] Password Reset
- [ ] Token Verify
- [ ] Write new Sessions to cache
