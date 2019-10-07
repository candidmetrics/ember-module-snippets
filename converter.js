const axios = require('axios');

const fs = require('fs');

const fileName = "snippets/snippets.json";
axios.get("https://raw.githubusercontent.com/ember-cli/ember-rfc176-data/master/mappings.json").then(response => {
  console.log(response.data)
  const raw = response.data;
  var snips = {
      "Ember Super": {
        "prefix": "E:super",
        "body": "this._super(...arguments);"
      },
      "Class Constructor": {
        "prefix": "E:constructor",
        "body": `constructor() {
          super(...arguments);
        }`
      }
    };

  raw.forEach(mapping => {
    const { localName, export:exp, global, module, deprecated } = mapping;
    
    if (deprecated === false) {
      snips[global] = {};
      snips[global]["prefix"] = global.replace("Ember.", "E:").replace("._", ".");
      snips[global]["body"] = `import ${ localName ? localName : `{ ${exp} }`} from '${module}';`
    }
  });

  snips["Ember.inject.service"].body = "import { ${1|inject,inject as service|} } from '@ember/service';";

  const testHelperImports = ["setResolver", "getResolver", "getApplication", "setApplication", "setupContext", "getContext", "setContext", "unsetContext", "pauseTest", "resumeTest", "teardownContext", "setupRenderingContext", "render", "clearRender", "teardownRenderingContext", "setupApplicationContext", "visit", "currentRouteName", "currentURL", "teardownApplicationContext", "settled", "isSettled", "getSettledState", "waitUntil", "validateErrorHandler", "setupOnerror", "resetOnerror", "getDebugInfo", "registerDebugInfoHelper", "click", "doubleClick", "tap", "focus", "blur", "triggerEvent", "triggerKeyEvent", "fillIn", "waitFor", "getRootElement", "find", "findAll", "typeIn"]
  
  testHelperImports.forEach(h => {
  snips[`Ember.${h}`] = {
    prefix:`E:${h}`,
    body:`import { ${h} } from '@ember/test-helpers'`
    }
  });
  
  fs.writeFile(fileName, JSON.stringify(snips, null, 2), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
});


})