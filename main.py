# Created on 27-Jan-2015-Tuesday
# Wireframe created

# V2.0 started on 13-Oct-2015-Tuesday

__author__ = 'Binu Jasim (bnjasim@gmail)'
__website__ = 'www.hummuse.com'

import webapp2
import os
import jinja2
from google.appengine.ext import ndb
from google.appengine.api import users
from google.appengine.api import memcache
from google.appengine.datastore.datastore_query import Cursor
import logging
import datetime
import urllib
import math
import json

import utils

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir), 
								autoescape = True)
# username is not Id because users might change their user name or email
# lateron add username and password for anonymous login
# Add OAuth - may need to store refresh token etc.
class Account(ndb.Model):
	nickname = ndb.StringProperty()
	email = ndb.StringProperty()
	userCreated = ndb.DateTimeProperty(auto_now_add = True)
	#accountType = ndb.IntegerProperty(default = 0)
	# account type -> 0:anonymous, 1:google-oauth 2:facebook etc.

	@classmethod
	@ndb.transactional
	def my_get_or_insert(cls, id, **kwds):
		key = ndb.Key(cls, id)
		ent = key.get()
		if ent is not None:
			return False  # False meaning "Already existing"
		ent = cls(**kwds)
		ent.key = key
		ent.put()
		return True  # True meaning "Newly created"

		

class Handler(webapp2.RequestHandler):
	def write(self, *a, **kw):
		self.response.out.write(*a, **kw)
	
	def render_str(self, template, **params):
		return (jinja_env.get_template(template)).render(params)
		
	def render(self, template, **html_add_ins):
		self.write(self.render_str(template, **html_add_ins))




# Registers new users in Account
class LoginHandler(webapp2.RequestHandler):
	"Redirected to here from the login page. So always user is not None"

	def get(self):
		user = users.get_current_user()
		if user is None: 
			self.redirect(users.create_login_url('/login'))
		
		else:
			user_id = user.user_id()
			nickname = utils.shorten_name(user.nickname())
			email = user.email()
			status = Account.my_get_or_insert(user_id, 
											  nickname = nickname, 
											  email = email)
			self.redirect('/?fresh_user=' + str(status))			
		

		

class HomeHandler(Handler):
	def get(self):
		user = users.get_current_user()
		if user is None: 
			self.redirect('/welcome')
			
		else:
			logout_url = users.create_logout_url('/')
			user_ent_key = ndb.Key(Account, user.user_id())
			# All the data rendering is now done by AjaxHomeHandler
			self.render('home.html',
						 user_name = utils.shorten_name(user.nickname()), 
						 logout_url = logout_url
						 )


class WelcomePageHandler(Handler):
	def get(self):
		self.render("welcome.html")




app = webapp2.WSGIApplication([
	('/', HomeHandler),
    ('/login', LoginHandler),
    ('/welcome', WelcomePageHandler)
   ], debug=True)

#@webapp_add_wsgi_middleware
#def main(app):


#if __name__ == "__main__":
#	main(app)
