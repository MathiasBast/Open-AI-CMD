const superagent = require('superagent');
var fs = require('fs');
const { Console } = require('console');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

var userPrompt = ""

const API_TOKEN = fs.readFileSync('OPEN_API_KEY.txt', 'utf8')

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: API_TOKEN,
});
const openai = new OpenAIApi(configuration)

var completion = async function (prompt){
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    max_tokens: 6,
    temperature: 0,
  });
  console.log(response.data.choices)
  return
}

var Edit = async function (input, instructions){
  const response = await openai.createEdit("text-davinci-edit-001", {
    input: input,
    instruction: instructions,
  });
  console.log(response)
  return
}
var input = ""

const questioner = async function () {
  return new Promise(function(resolve, reject) {
    rl.setPrompt('What do you want to do?\n1. completion, 2. edit, or stop  : ')
    rl.prompt();
    rl.on('line', function(line) {
      input = line

      switch(line){
        case 'stop':
          rl.close()
          return
        break;
        case '1':
        case 'completion':
          rl.question("What is your prompt? ", function (prompt) {
            completion(prompt)
            return
          });
        break;
        case "2":
        case "edit":
          rl.question("What would you like to edit? ", function (edit){
            rl.question("how would you like to edit it? ", function(instructions){
              Edit(edit, instructions)
              return
            })
          })
        break;
        default:
          console.log(`Nothing for ${input}`)
        break;
      }
      rl.prompt()

    }).on('close',function(){
      console.log('bye')
      resolve(42)
    });
  })
}

async function run() {
  try {
    let replResult = await questioner()
    console.log('repl result:', replResult)

  } catch(e) {
    console.log('failed:', e)
  }
}

run()