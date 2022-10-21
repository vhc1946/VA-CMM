/* VHC Application
    name: CMM
    authors: VOGCH | MURRY
*/
- INITIALIZE APP -
1) First we must setup up the applications root environment. Standard setup is to locate the department SharePoint folder the application is intended to service, this is the applications root. If there are other tools working in that department there should be a folder called "IMDB". In this folder will be a "store" and "assets". The folder should look as follows.
IMDB
 - store
 - assets
If this is the first application in the environment, the above folders must be created. The last folder to add is a folder specifically for this application. We can use the application "code" name. In that folder we copy a "settings.json" file for the application to use. Though settings.json is needed to initialize the app, it would be possible to store other types of settings files in this folder to be used for other reasons. A default settings.json is kept in the ./app/ folder and can be kept there as a copy for this.

2) Once we have our basic folders setup up, we can move to setup the paths.json file. This file can be found in ./app/ and is kept there (for now) for the life of the application. The file is laid out -to start- as follows. *example is setup to our dev/SharePoint/ test directory and for a test application*.
paths.json
{
  	"deproot":"/Vogel - IM/dev/SharePoint/Vogel - Service/",
  	"settings":"/IMDB/cmm/settings.json",
  	"store":{
   	 	"root":"/IMDB/store/"
  	},
  	"assets":{
    	"root":"/IMDB/assets/"
  	}
}

Deproot and settings are the only properties that NEED to be set to get the application going. Store and assets are there in the case the app needs to be customized to store / share data files with the department.
ADDING STORES - to add a store we simply add the store as a property of "store" (store.newstore), and then add the file name as a value of the new property (store.newstore = "newstore.db"). *it is important included the .db for file name as these stores are accessed using NEDB*. The file itself - named as in example - can be found at the root level of /IMDB/store. This means that if one wanted to create sub folders the property’s value needs to include the rest of the path, i.e., '/subfolder/newstore.db'. It could also be possible to have only a path to subfolder as property value. Subfolders in the STORE do not have to be declared as NEDB will create the folder path required for that store file. In saying this, best practice is to create the desired path.
3) With the application root environment created and declared we need to setup the applications settings file. This file was mentioned above in step one, step 3 is for setting it up. By default, the file looks like the following.
Settings.json
{
  	"name":”ElectronTemplate",
  	"dev":{
   		"on":false,
    		"page":"main.html"
  	},
  	"auth":"123",
  	"apicon":"http://localhost:8080/api/",
  	"users":{
    		"VOGCH":{"group":"DEV"},
    		"MURRY":{"group":"DEV"}
  	},
  	"groups":{
    		"DEV":{"main":"main.html"}
  	}
}
Starting at the top, we need to change the name. The name is important as it is used in various id and storage reasons that can be covered in steps to come. The name also needs to contain no spaces or characters. This fact needs to be remembered as its effects will not be caught until much further “down” stream.
With the application name decided we can move into users, groups, and dev defaults. Groups will, by default, have “DEV” included. The group name is the property name of groups. So groups.DEV is how we can access the DEV group settings. The only property in a “group” is the “landing page” declared as property “main”. Main is the landing page for that group. Groups can be added and could, if needed, have additional properties added to it to better describe users.
Users will likely have included the team members of IM department. If it does not, the appropriate members need to be added. Users are added by creating a property under “users” where the property name is the user’s username. Attached to the username, we need to setup a “group” property and possibly a “pswrd” property. IM users can be setup as group DEV, or if there is an “ADMIN” group they can be that.
Last is the dev property. This is a simple shortcut for developers to jump to a page to work on instead of having to navigate to desired page after each app restart. This settings feature can be used but may be glitchy if the desired page is dependent on a previous page.
