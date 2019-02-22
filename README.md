# Angular 6+ Application Version Checking

**Note:** This was modified from code by Henrik Peinar.

https://blog.nodeswat.com/automagic-reload-for-clients-after-deploy-with-angular-4-8440c9fdd96c`

This contains the version-check service and post build script used for versioning my Angular 6+ applications.

To use this service, add the version-check.service.ts file to your application module, and inject it into your AppComponent.  

In your AppComponent's constructor, add the following line:

`versionCheckService.startVersionChecking('./version.json', 1800000)`

Where `'./version.json'` is the path to your version.json file (typically in the src folder), and the duration you want to use to check for updates to the application.

In your package.json file, you can add a script to make this easier when building the application.

```{
  ...
  "scripts": {
    ...
    "build-prod": "ng build --prod && npm run post-build",
    "post-build": "node ./build/post-build.js"
  },
  ...
}```

On your build server (if you're using one) or when you build your Angular project, run the script `npm run build-prod` to execute the `ng build` command along with the `post-build.js` script afterwards to set the current version.  You can make any changes you want/need for versioning, but this uses the date of the build in **year.month.day** format along with the hash of the compiled js files.
